import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ArrowLeft, CreditCard } from 'lucide-react';

const TopUpPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingBalance, setFetchingBalance] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBalance();
  }, [user, navigate]);

  const fetchBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch wallet balance',
        variant: 'destructive',
      });
    } finally {
      setFetchingBalance(false);
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const topUpAmount = parseFloat(amount);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (topUpAmount < 100) {
      toast({
        title: 'Minimum Amount',
        description: 'Minimum top-up amount is ₦100',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Get current balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (walletError) throw walletError;

      const currentBalance = parseFloat(walletData.balance.toString());
      const newBalance = currentBalance + topUpAmount;

      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ balance: newBalance })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      // Log transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'credit',
          amount: topUpAmount,
          balance_before: currentBalance,
          balance_after: newBalance,
          description: 'Wallet top-up',
          reference: `TOPUP-${Date.now()}`,
        });

      if (transactionError) throw transactionError;

      toast({
        title: 'Success',
        description: `Successfully added ₦${topUpAmount.toFixed(2)} to your wallet`,
      });

      setBalance(newBalance);
      setAmount('');
    } catch (error) {
      console.error('Error processing top-up:', error);
      toast({
        title: 'Error',
        description: 'Failed to process top-up. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <CardTitle>Top Up Wallet</CardTitle>
            </div>
            <CardDescription>
              Add credits to your wallet to continue sending SMS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Balance */}
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              {fetchingBalance ? (
                <p className="text-3xl font-bold">Loading...</p>
              ) : (
                <p className="text-4xl font-bold text-primary">
                  ₦{balance.toFixed(2)}
                </p>
              )}
            </div>

            {/* Top-up Form */}
            <form onSubmit={handleTopUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Enter Amount (NGN)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  step="0.01"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Minimum top-up amount: ₦100
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="w-full"
                    >
                      ₦{quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !amount}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {loading ? 'Processing...' : 'Top Up Wallet'}
              </Button>
            </form>

            {/* Payment Notice */}
            <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Payment Integration</p>
              <p>
                This is a demo version. In production, this would integrate with a payment
                gateway like Stripe or Paystack to process real payments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopUpPage;
