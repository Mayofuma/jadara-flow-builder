-- Create wallet records for existing users with initial balance
INSERT INTO public.wallet (user_id, balance, currency)
SELECT 
  id,
  1000.00 as balance,
  'NGN' as currency
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.wallet WHERE wallet.user_id = auth.users.id
);

-- Create a trigger to automatically create wallet for new users
CREATE OR REPLACE FUNCTION public.create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallet (user_id, balance, currency)
  VALUES (NEW.id, 1000.00, 'NGN');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created_create_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_create_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_wallet_for_new_user();