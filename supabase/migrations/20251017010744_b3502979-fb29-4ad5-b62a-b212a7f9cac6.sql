-- Create admin function to set premium status
CREATE OR REPLACE FUNCTION public.admin_set_premium(
  target_user uuid,
  is_premium boolean,
  premium_until timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can set premium status';
  END IF;

  -- Insert or update the user subscription
  INSERT INTO public.user_subscriptions (user_id, is_premium, premium_until)
  VALUES (target_user, is_premium, premium_until)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_premium = EXCLUDED.is_premium,
    premium_until = EXCLUDED.premium_until,
    updated_at = now();
END;
$$;