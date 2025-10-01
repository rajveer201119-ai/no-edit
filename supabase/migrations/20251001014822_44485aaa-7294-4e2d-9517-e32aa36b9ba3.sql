-- Fix coupon update policy - need WITH CHECK clause
DROP POLICY IF EXISTS "Users can update coupons they're redeeming" ON public.coupon_codes;

CREATE POLICY "Users can update coupons they're redeeming"
  ON public.coupon_codes
  FOR UPDATE
  USING (is_used = false)
  WITH CHECK (is_used = true AND used_by_user_id = auth.uid());

-- Fix check_daily_limit function to handle missing subscription
DROP FUNCTION IF EXISTS public.check_daily_limit(uuid);

CREATE OR REPLACE FUNCTION public.check_daily_limit(user_id_param UUID)
RETURNS TABLE(can_generate BOOLEAN, remaining_prompts INTEGER, is_premium BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  premium_status BOOLEAN;
  today_usage INTEGER;
  daily_limit INTEGER;
BEGIN
  -- Check if user is premium, default to false if no record
  SELECT COALESCE(us.is_premium, false) INTO premium_status
  FROM user_subscriptions us
  WHERE us.user_id = user_id_param;

  -- If no subscription record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_subscriptions (user_id, is_premium)
    VALUES (user_id_param, false)
    ON CONFLICT (user_id) DO NOTHING;
    premium_status := false;
  END IF;

  -- Set daily limit based on premium status
  IF premium_status THEN
    daily_limit := 50;
  ELSE
    daily_limit := 2;
  END IF;

  -- Get today's usage
  SELECT COALESCE(pu.prompt_count, 0) INTO today_usage
  FROM prompt_usage pu
  WHERE pu.user_id = user_id_param
    AND pu.usage_date = CURRENT_DATE;

  -- If no usage record, default to 0
  IF NOT FOUND THEN
    today_usage := 0;
  END IF;

  -- Return result
  RETURN QUERY SELECT 
    (today_usage < daily_limit) AS can_generate,
    (daily_limit - today_usage) AS remaining_prompts,
    premium_status AS is_premium;
END;
$$;