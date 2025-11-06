import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, ArrowLeft } from 'lucide-react';

interface SmsLog {
  id: string;
  recipient: string;
  message: string;
  status: string;
  sender_id: string | null;
  created_at: string;
}

export default function BulkSmsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [senderId, setSenderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipients.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter at least one recipient number',
        variant: 'destructive',
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          recipients,
          message,
          senderId: senderId || undefined,
        },
      });

      if (error) throw error;

      const successCount = data.results.filter((r: any) => r.status === 'sent').length;
      const failCount = data.results.filter((r: any) => r.status === 'failed').length;

      toast({
        title: 'SMS Sent',
        description: `Successfully sent ${successCount} message(s). ${failCount > 0 ? `${failCount} failed.` : ''}`,
      });

      // Clear form and refresh logs
      setRecipients('');
      setMessage('');
      await fetchLogs();
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send SMS',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const numbers = text
        .split(/[\n,]/)
        .map((n) => n.trim())
        .filter(Boolean);
      setRecipients(numbers.join(', '));
    };
    reader.readAsText(file);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Bulk SMS</CardTitle>
              <CardDescription>
                Send SMS messages to multiple recipients using Termii API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendSms} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Textarea
                    id="recipients"
                    placeholder="Enter phone numbers separated by commas (e.g., 2348012345678, 2348123456789)"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="csv-upload" className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      Or upload CSV file
                    </Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleCsvUpload}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    {message.length} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderId">Sender ID (Optional)</Label>
                  <Input
                    id="senderId"
                    placeholder="e.g., YourBrand (default: NotifyMe)"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send SMS
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sent Messages</CardTitle>
              <CardDescription>Recent SMS delivery logs</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages sent yet
                </p>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Sender ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">
                            {log.recipient}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {log.message}
                          </TableCell>
                          <TableCell>{log.sender_id || 'N/A'}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                log.status === 'sent'
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                  : log.status === 'failed'
                                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                  : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}
                            >
                              {log.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
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
      </div>
    </div>
  );
}
