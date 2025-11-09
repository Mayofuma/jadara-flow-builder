import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { key_name, expires_in_days } = await req.json();

    if (!key_name || key_name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Key name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a secure random API key
    const apiKey = generateSecureApiKey();

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expires_in_days && expires_in_days > 0) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expires_in_days);
      expiresAt = expirationDate.toISOString();
    }

    console.log('Creating API key for user:', user.id, 'with name:', key_name);

    // Insert the API key into the database
    const { data, error } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_name: key_name.trim(),
        api_key: apiKey,
        is_active: true,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create API key', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('API key created successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        message: 'API key created successfully', 
        data: {
          id: data.id,
          key_name: data.key_name,
          api_key: apiKey, // Return the full key only once during creation
          expires_at: data.expires_at,
          created_at: data.created_at,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSecureApiKey(): string {
  const prefix = 'jl_'; // Jadara Labs prefix
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const randomString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}${randomString}`;
}
