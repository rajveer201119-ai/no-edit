-- Update the check_daily_limit function to reflect new limits (25 for premium, 2 for free)
CREATE OR REPLACE FUNCTION public.check_daily_limit(user_id_param uuid)
 RETURNS TABLE(can_generate boolean, remaining_prompts integer, is_premium boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Set daily limit based on premium status (25 for premium, 2 for free)
  IF premium_status THEN
    daily_limit := 25;
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
$function$