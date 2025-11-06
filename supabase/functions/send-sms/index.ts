import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const termiiApiKey = Deno.env.get('TERMII_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!termiiApiKey) {
      throw new Error('TERMII_API_KEY is not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { recipients, message, senderId } = await req.json();

    if (!recipients || !message) {
      throw new Error('Recipients and message are required');
    }

    // Parse recipients (comma-separated string)
    const recipientList = recipients.split(',').map((r: string) => r.trim()).filter(Boolean);

    if (recipientList.length === 0) {
      throw new Error('No valid recipients provided');
    }

    // Define SMS cost per message
    const SMS_COST = 5; // 5 NGN per SMS
    const totalCost = recipientList.length * SMS_COST;

    // Check wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      throw new Error('Wallet not found. Please contact support.');
    }

    if (wallet.balance < totalCost) {
      throw new Error(`Insufficient balance. You need ${totalCost} ${wallet.currency} but have ${wallet.balance} ${wallet.currency}. Please top up your wallet.`);
    }

    const results = [];
    
    let successCount = 0;
    let totalCreditsUsed = 0;

    for (const recipient of recipientList) {
      try {
        // Send SMS via Termii API
        const termiiResponse = await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipient,
            from: senderId || 'NotifyMe',
            sms: message,
            type: 'plain',
            api_key: termiiApiKey,
            channel: 'generic',
          }),
        });

        const termiiData = await termiiResponse.json();
        console.log('Termii response:', termiiData);

        const status = termiiResponse.ok ? 'sent' : 'failed';
        const creditsUsed = termiiResponse.ok ? SMS_COST : 0;

        if (termiiResponse.ok) {
          successCount++;
          totalCreditsUsed += creditsUsed;
        }

        // Log to database
        const { error: logError } = await supabase
          .from('sms_logs')
          .insert({
            user_id: user.id,
            recipient: recipient,
            message: message,
            sender_id: senderId || 'NotifyMe',
            status: status,
            credits_used: creditsUsed,
            provider_response: termiiData,
          });

        if (logError) {
          console.error('Error logging SMS:', logError);
        }

        results.push({
          recipient,
          status,
          message: termiiData.message || 'SMS sent successfully',
        });
      } catch (error) {
        console.error(`Error sending SMS to ${recipient}:`, error);
        
        // Log failed attempt
        await supabase
          .from('sms_logs')
          .insert({
            user_id: user.id,
            recipient: recipient,
            message: message,
            sender_id: senderId || 'NotifyMe',
            status: 'failed',
            credits_used: 0,
            provider_response: { error: error.message },
          });

        results.push({
          recipient,
          status: 'failed',
          message: error.message,
        });
      }
    }

    // Deduct credits from wallet
    if (totalCreditsUsed > 0) {
      const newBalance = wallet.balance - totalCreditsUsed;

      const { error: updateError } = await supabase
        .from('wallet')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        throw new Error('Failed to update wallet balance');
      }

      // Log transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'debit',
          amount: totalCreditsUsed,
          balance_before: wallet.balance,
          balance_after: newBalance,
          description: `SMS sent to ${successCount} recipient(s)`,
          reference: `SMS-${Date.now()}`,
          metadata: {
            recipients_count: successCount,
            total_recipients: recipientList.length,
          },
        });

      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-sms function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
