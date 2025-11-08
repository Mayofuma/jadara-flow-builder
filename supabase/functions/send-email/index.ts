import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  email: string;
  amount: number;
  reference: string;
  newBalance: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, amount, reference, newBalance }: PaymentEmailRequest = await req.json();

    console.log(`Sending payment confirmation to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Wallet Notifications <onboarding@resend.dev>",
      to: [email],
      subject: "Wallet Top-Up Successful",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Payment Successful!</h1>
          <p>Your wallet has been credited successfully.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Transaction Details</h2>
            <p><strong>Amount:</strong> ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>New Balance:</strong> ₦${newBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <p>Thank you for your payment!</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you did not make this transaction, please contact support immediately.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
