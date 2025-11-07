import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, amount, reference, email } = await req.json();

    // Initialize payment
    if (action === 'initialize') {
      console.log(`Initializing payment for user ${user.id}: ${amount} NGN`);

      // Get user profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const userEmail = email || user.email || profile?.first_name + '@example.com';

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
          currency: 'NGN',
          metadata: {
            user_id: user.id,
            purpose: 'wallet_topup',
          },
        }),
      });

      const data = await response.json();
      
      if (!data.status) {
        console.error('Paystack initialization error:', data);
        throw new Error(data.message || 'Failed to initialize payment');
      }

      console.log('Payment initialized successfully:', data.data.reference);

      return new Response(
        JSON.stringify({
          status: 'success',
          data: data.data,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify payment
    if (action === 'verify') {
      console.log(`Verifying payment with reference: ${reference}`);

      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const data = await response.json();
      
      if (!data.status) {
        console.error('Paystack verification error:', data);
        throw new Error(data.message || 'Failed to verify payment');
      }

      const paymentData = data.data;

      // Check if payment was successful
      if (paymentData.status !== 'success') {
        throw new Error('Payment was not successful');
      }

      // Get amount in NGN (convert from kobo)
      const amountPaid = paymentData.amount / 100;

      console.log(`Payment verified: ${amountPaid} NGN for user ${user.id}`);

      // Get current wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (walletError) {
        console.error('Error fetching wallet:', walletError);
        throw new Error('Failed to fetch wallet');
      }

      const currentBalance = parseFloat(walletData.balance.toString());
      const newBalance = currentBalance + amountPaid;

      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        throw new Error('Failed to update wallet');
      }

      // Log transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'credit',
          amount: amountPaid,
          balance_before: currentBalance,
          balance_after: newBalance,
          description: 'Wallet top-up via Paystack',
          reference: reference,
          metadata: {
            payment_gateway: 'paystack',
            payment_reference: reference,
            payment_status: paymentData.status,
          },
        });

      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
      }

      console.log(`Wallet updated successfully. New balance: ${newBalance} NGN`);

      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Payment verified and wallet updated',
          balance: newBalance,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Invalid action');

  } catch (error: any) {
    console.error('Error in paystack-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
