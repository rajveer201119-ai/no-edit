-- Create a secure admin RPC to manage subscriptions
CREATE OR REPLACE FUNCTION public.admin_set_premium(target_user uuid, is_premium boolean, premium_until timestamptz)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO user_subscriptions (user_id, is_premium, premium_until)
  VALUES (target_user, is_premium, premium_until)
  ON CONFLICT (user_id) DO UPDATE
  SET is_premium = EXCLUDED.is_premium,
      premium_until = EXCLUDED.premium_until,
      updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_premium(uuid, boolean, timestamptz) TO authenticated;

-- Update SELECT policy so admins can view all subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription" ON user_subscriptions;
CREATE POLICY "Users can view their own subscription or admins can view any"
ON user_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));