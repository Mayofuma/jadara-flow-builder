import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ApiKeyStats {
  api_key_id: string;
  key_name: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  error_rate: number;
  last_used: string | null;
}

interface DailyUsage {
  date: string;
  requests: number;
  successful: number;
  failed: number;
}

interface EndpointStats {
  endpoint: string;
  count: number;
  fill: string;
}

export function ApiUsageAnalytics() {
  const [apiKeyStats, setApiKeyStats] = useState<ApiKeyStats[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [endpointStats, setEndpointStats] = useState<EndpointStats[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [selectedKeyId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Calculate date range
      const daysAgo = parseInt(dateRange);
      const startDate = subDays(new Date(), daysAgo);

      // Fetch API keys first
      const { data: apiKeys, error: keysError } = await supabase
        .from('api_keys')
        .select('id, key_name');

      if (keysError) throw keysError;

      // Fetch SMS logs with date filter
      let query = supabase
        .from('sms_logs')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (selectedKeyId !== "all") {
        query = query.eq('api_key_id', selectedKeyId);
      }

      const { data: logs, error: logsError } = await query;

      if (logsError) throw logsError;

      // Calculate stats per API key
      const keyStatsMap = new Map<string, ApiKeyStats>();
      
      // Initialize with all API keys
      apiKeys?.forEach(key => {
        keyStatsMap.set(key.id, {
          api_key_id: key.id,
          key_name: key.key_name,
          total_requests: 0,
          successful_requests: 0,
          failed_requests: 0,
          error_rate: 0,
          last_used: null,
        });
      });

      // Process logs
      logs?.forEach(log => {
        if (log.api_key_id) {
          const stats = keyStatsMap.get(log.api_key_id);
          if (stats) {
            stats.total_requests++;
            if (log.status === 'sent') {
              stats.successful_requests++;
            } else if (log.status === 'failed') {
              stats.failed_requests++;
            }
            if (!stats.last_used || new Date(log.created_at) > new Date(stats.last_used)) {
              stats.last_used = log.created_at;
            }
          }
        }
      });

      // Calculate error rates
      keyStatsMap.forEach(stats => {
        if (stats.total_requests > 0) {
          stats.error_rate = (stats.failed_requests / stats.total_requests) * 100;
        }
      });

      const statsArray = Array.from(keyStatsMap.values())
        .filter(stat => stat.total_requests > 0)
        .sort((a, b) => b.total_requests - a.total_requests);

      setApiKeyStats(statsArray);

      // Calculate daily usage
      const dailyMap = new Map<string, DailyUsage>();
      
      // Initialize all days in range
      for (let i = 0; i < daysAgo; i++) {
        const date = startOfDay(subDays(new Date(), daysAgo - 1 - i));
        const dateKey = format(date, 'MMM dd');
        dailyMap.set(dateKey, {
          date: dateKey,
          requests: 0,
          successful: 0,
          failed: 0,
        });
      }

      // Fill in actual data
      logs?.forEach(log => {
        const dateKey = format(startOfDay(new Date(log.created_at)), 'MMM dd');
        const daily = dailyMap.get(dateKey);
        if (daily) {
          daily.requests++;
          if (log.status === 'sent') daily.successful++;
          if (log.status === 'failed') daily.failed++;
        }
      });

      setDailyUsage(Array.from(dailyMap.values()));

      // Calculate endpoint stats (for SMS it's mainly send-sms, but we can break it down by status)
      const endpoints = [
        { 
          endpoint: 'send-sms (success)', 
          count: logs?.filter(l => l.status === 'sent').length || 0,
          fill: 'hsl(var(--chart-1))'
        },
        { 
          endpoint: 'send-sms (failed)', 
          count: logs?.filter(l => l.status === 'failed').length || 0,
          fill: 'hsl(var(--chart-2))'
        },
        { 
          endpoint: 'send-sms (pending)', 
          count: logs?.filter(l => l.status === 'pending').length || 0,
          fill: 'hsl(var(--chart-3))'
        },
      ].filter(e => e.count > 0);

      setEndpointStats(endpoints);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    requests: {
      label: "Total Requests",
      color: "hsl(var(--chart-3))",
    },
    successful: {
      label: "Successful",
      color: "hsl(var(--chart-1))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-2))",
    },
  };

  const totalRequests = apiKeyStats.reduce((sum, stat) => sum + stat.total_requests, 0);
  const avgErrorRate = apiKeyStats.length > 0 
    ? apiKeyStats.reduce((sum, stat) => sum + stat.error_rate, 0) / apiKeyStats.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total API Requests</p>
                <p className="text-3xl font-bold mt-2">{totalRequests.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active API Keys</p>
                <p className="text-3xl font-bold mt-2">{apiKeyStats.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Error Rate</p>
                <p className="text-3xl font-bold mt-2">{avgErrorRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold mt-2">
                  {totalRequests > 0 
                    ? ((apiKeyStats.reduce((sum, stat) => sum + stat.successful_requests, 0) / totalRequests) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by API Key</label>
              <Select value={selectedKeyId} onValueChange={setSelectedKeyId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All API Keys</SelectItem>
                  {apiKeyStats.map(stat => (
                    <SelectItem key={stat.api_key_id} value={stat.api_key_id}>
                      {stat.key_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Daily API Usage</CardTitle>
            <CardDescription>Request trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : dailyUsage.every(d => d.requests === 0) ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No data for selected period</p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="successful"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Endpoint Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : endpointStats.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No data for selected period</p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={endpointStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ endpoint, percent }) => `${endpoint.split(' ')[1]}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="count"
                  >
                    {endpointStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-Key Statistics Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>API Key Performance</CardTitle>
          <CardDescription>Detailed statistics per API key</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : apiKeyStats.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No API activity in the selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>API Key Name</TableHead>
                    <TableHead className="text-right">Total Requests</TableHead>
                    <TableHead className="text-right">Successful</TableHead>
                    <TableHead className="text-right">Failed</TableHead>
                    <TableHead className="text-right">Error Rate</TableHead>
                    <TableHead>Last Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeyStats.map((stat) => (
                    <TableRow key={stat.api_key_id}>
                      <TableCell className="font-medium">{stat.key_name}</TableCell>
                      <TableCell className="text-right">{stat.total_requests.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {stat.successful_requests.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {stat.failed_requests.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={stat.error_rate > 10 ? 'text-red-600 font-semibold' : ''}>
                          {stat.error_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {stat.last_used ? format(new Date(stat.last_used), 'MMM dd, yyyy HH:mm') : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
