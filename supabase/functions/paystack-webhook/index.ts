import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
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
    console.log('Webhook received from Paystack');

    // Verify webhook signature
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    if (!signature) {
      console.error('Missing Paystack signature');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify signature
    const hash = createHmac('sha512', PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const event = JSON.parse(body);
    console.log('Webhook event type:', event.event);

    // Only process successful charge events
    if (event.event !== 'charge.success') {
      console.log('Ignoring non-success event:', event.event);
      return new Response(
        JSON.stringify({ message: 'Event ignored' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const paymentData = event.data;
    const reference = paymentData.reference;
    const userId = paymentData.metadata?.user_id;

    if (!userId) {
      console.error('No user_id in payment metadata');
      throw new Error('Missing user_id in payment metadata');
    }

    console.log(`Processing payment for user ${userId}, reference: ${reference}`);

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if transaction already exists (prevent duplicate processing)
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('reference', reference)
      .single();

    if (existingTransaction) {
      console.log('Transaction already processed:', reference);
      return new Response(
        JSON.stringify({ message: 'Transaction already processed' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get amount in NGN (convert from kobo)
    const amountPaid = paymentData.amount / 100;

    console.log(`Payment verified: ${amountPaid} NGN for user ${userId}`);

    // Get current wallet balance
    const { data: walletData, error: walletError } = await supabase
      .from('wallet')
      .select('balance')
      .eq('user_id', userId)
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
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating wallet:', updateError);
      throw new Error('Failed to update wallet');
    }

    // Log transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'credit',
        amount: amountPaid,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: 'Wallet top-up via Paystack (Webhook)',
        reference: reference,
        metadata: {
          payment_gateway: 'paystack',
          payment_reference: reference,
          payment_status: paymentData.status,
          webhook_event: event.event,
          customer_email: paymentData.customer?.email,
          paid_at: paymentData.paid_at,
        },
      });

    if (transactionError) {
      console.error('Error logging transaction:', transactionError);
      throw new Error('Failed to log transaction');
    }

    console.log(`Wallet updated successfully via webhook. New balance: ${newBalance} NGN`);

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Payment processed successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in paystack-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
