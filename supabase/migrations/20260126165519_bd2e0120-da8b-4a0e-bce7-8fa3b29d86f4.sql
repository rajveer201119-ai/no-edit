CREATE OR REPLACE FUNCTION public.check_edit_limit(user_id_param uuid)
 RETURNS TABLE(can_edit boolean, remaining_edits integer, is_premium boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  premium_status BOOLEAN;
  today_usage INTEGER;
  daily_limit INTEGER;
BEGIN
  SELECT COALESCE(us.is_premium, false) INTO premium_status
  FROM user_subscriptions us
  WHERE us.user_id = user_id_param;

  IF NOT FOUND THEN
    INSERT INTO user_subscriptions (user_id, is_premium)
    VALUES (user_id_param, false)
    ON CONFLICT (user_id) DO NOTHING;
    premium_status := false;
  END IF;

  -- 50 for premium (updated from 10), 1 for free
  IF premium_status THEN
    daily_limit := 50;
  ELSE
    daily_limit := 1;
  END IF;

  SELECT COALESCE(pu.prompt_count, 0) INTO today_usage
  FROM prompt_usage pu
  WHERE pu.user_id = user_id_param
    AND pu.usage_date = CURRENT_DATE
    AND pu.action_type = 'edit';

  IF NOT FOUND THEN
    today_usage := 0;
  END IF;

  RETURN QUERY SELECT 
    (today_usage < daily_limit) AS can_edit,
    (daily_limit - today_usage) AS remaining_edits,
    premium_status AS is_premium;
END;
$function$