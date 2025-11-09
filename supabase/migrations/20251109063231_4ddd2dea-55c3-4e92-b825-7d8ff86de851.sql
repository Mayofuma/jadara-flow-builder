-- Add expires_at column to api_keys table
ALTER TABLE public.api_keys 
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster expiration queries
CREATE INDEX idx_api_keys_expires_at ON public.api_keys(expires_at) 
WHERE expires_at IS NOT NULL;

-- Create function to check if API key is valid (not revoked and not expired)
CREATE OR REPLACE FUNCTION public.is_api_key_valid(key_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  key_record RECORD;
BEGIN
  SELECT is_active, revoked_at, expires_at 
  INTO key_record
  FROM public.api_keys 
  WHERE id = key_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if key is active, not revoked, and not expired
  RETURN key_record.is_active 
    AND key_record.revoked_at IS NULL 
    AND (key_record.expires_at IS NULL OR key_record.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;