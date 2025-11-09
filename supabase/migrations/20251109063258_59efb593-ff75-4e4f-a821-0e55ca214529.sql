-- Fix search_path for is_api_key_valid function
CREATE OR REPLACE FUNCTION public.is_api_key_valid(key_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;