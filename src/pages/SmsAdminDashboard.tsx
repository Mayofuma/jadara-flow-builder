import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  LogOut, 
  Send, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  MessageSquare,
  TrendingUp,
  Wallet as WalletIcon,
  Key,
  History,
  Plus,
  BookOpen
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, subDays, startOfDay } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { ApiUsageAnalytics } from "@/components/ApiUsageAnalytics";

interface SmsStats {
  totalSent: number;
  successCount: number;
  failedCount: number;
  totalCost: number;
}

interface DailyStats {
  date: string;
  sent: number;
  success: number;
  failed: number;
}

const SmsAdminDashboard = () => {
  const [stats, setStats] = useState<SmsStats>({ totalSent: 0, successCount: 0, failedCount: 0, totalCost: 0 });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const SMS_COST = 5; // Cost per SMS in NGN

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load SMS logs and calculate stats
      const { data: logs, error: logsError } = await supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      const totalSent = logs?.length || 0;
      const successCount = logs?.filter(log => log.status === 'sent').length || 0;
      const failedCount = logs?.filter(log => log.status === 'failed').length || 0;
      const totalCost = totalSent * SMS_COST;

      setStats({ totalSent, successCount, failedCount, totalCost });
      setRecentLogs(logs?.slice(0, 5) || []);

      // Calculate daily stats for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = startOfDay(subDays(new Date(), 6 - i));
        return {
          date: format(date, 'MMM dd'),
          sent: 0,
          success: 0,
          failed: 0,
        };
      });

      logs?.forEach((log) => {
        const logDate = format(startOfDay(new Date(log.created_at)), 'MMM dd');
        const dayStats = last7Days.find(d => d.date === logDate);
        if (dayStats) {
          dayStats.sent += 1;
          if (log.status === 'sent') dayStats.success += 1;
          if (log.status === 'failed') dayStats.failed += 1;
        }
      });

      setDailyStats(last7Days);

      // Load wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('*')
        .single();

      if (walletError && walletError.code !== 'PGRST116') throw walletError;
      setWallet(walletData);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const successRate = stats.totalSent > 0 ? ((stats.successCount / stats.totalSent) * 100).toFixed(1) : 0;

  const deliveryChartData = [
    { name: 'Successful', value: stats.successCount, fill: 'hsl(var(--chart-1))' },
    { name: 'Failed', value: stats.failedCount, fill: 'hsl(var(--chart-2))' },
  ];

  const chartConfig = {
    sent: {
      label: "Total Sent",
      color: "hsl(var(--chart-3))",
    },
    success: {
      label: "Successful",
      color: "hsl(var(--chart-1))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-gradient-hero text-white py-12 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/dashboard" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-smooth">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold">Jadara Labs</span>
            </Link>
            <h1 className="text-3xl font-bold">SMS Admin Dashboard</h1>
            <p className="text-xl text-blue-100 mt-2">
              Manage your SMS campaigns and analytics
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-primary" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalSent}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-3xl font-bold mt-2">{successRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {stats.successCount} sent
                  <XCircle className="h-4 w-4 text-red-600 ml-2" />
                  {stats.failedCount} failed
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                    <p className="text-3xl font-bold mt-2">₦{stats.totalCost.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                    <p className="text-3xl font-bold mt-2">
                      ₦{wallet ? wallet.balance.toLocaleString('en-NG', { minimumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <WalletIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Link to="/top-up">
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Top Up
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Rate Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Delivery Rate</CardTitle>
                <CardDescription>Success vs Failed Messages</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalSent === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No data available</p>
                    </div>
                  </div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={deliveryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {deliveryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Usage Trends Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Last 7 days activity</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyStats.every(d => d.sent === 0) ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No data available</p>
                    </div>
                  </div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <AreaChart data={dailyStats}>
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
                      <Area
                        type="monotone"
                        dataKey="success"
                        stackId="1"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="failed"
                        stackId="1"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/bulk-sms">
              <Card className="shadow-soft hover:shadow-lg transition-smooth cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Send SMS</h3>
                    <p className="text-sm text-muted-foreground">Bulk SMS messaging</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transactions">
              <Card className="shadow-soft hover:shadow-lg transition-smooth cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <History className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Transactions</h3>
                    <p className="text-sm text-muted-foreground">View payment history</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="shadow-soft hover:shadow-lg transition-smooth cursor-pointer h-full" onClick={() => document.getElementById('api-keys-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Key className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">API Keys</h3>
                  <p className="text-sm text-muted-foreground">Manage API access</p>
                </div>
              </CardContent>
            </Card>

            <Link to="/api-docs">
              <Card className="shadow-soft hover:shadow-lg transition-smooth cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">API Docs</h3>
                    <p className="text-sm text-muted-foreground">Integration guide</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent SMS Logs */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent SMS Activity</CardTitle>
                  <CardDescription>Latest 5 sent messages</CardDescription>
                </div>
                <Link to="/bulk-sms">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No SMS sent yet</p>
                  <p className="text-sm mt-2">Start sending messages to see activity here</p>
                  <Link to="/bulk-sms">
                    <Button className="mt-4">
                      <Send className="h-4 w-4 mr-2" />
                      Send Your First SMS
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.recipient}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                          <TableCell>
                            {log.status === 'sent' ? (
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Sent
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="text-right font-medium">₦{SMS_COST}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Usage Analytics Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">API Usage Analytics</h2>
              <p className="text-muted-foreground">Track API performance and usage patterns</p>
            </div>
            <ApiUsageAnalytics />
          </div>

          {/* API Keys Management */}
          <div id="api-keys-section">
            <ApiKeyManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsAdminDashboard;
