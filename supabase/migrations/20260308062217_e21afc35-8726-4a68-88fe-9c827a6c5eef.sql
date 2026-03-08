CREATE OR REPLACE FUNCTION public.check_generation_limit(user_id_param uuid)
 RETURNS TABLE(can_generate boolean, remaining_prompts integer, is_premium boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  plan text;
  today_usage INTEGER;
  daily_limit INTEGER;
BEGIN
  SELECT COALESCE(us.plan_type, 'free') INTO plan
  FROM user_subscriptions us
  WHERE us.user_id = user_id_param;

  IF NOT FOUND THEN
    INSERT INTO user_subscriptions (user_id, is_premium, plan_type)
    VALUES (user_id_param, false, 'free')
    ON CONFLICT (user_id) DO NOTHING;
    plan := 'free';
  END IF;

  CASE plan
    WHEN 'pro' THEN daily_limit := 100;
    WHEN 'student' THEN daily_limit := 10;
    ELSE daily_limit := 3;
  END CASE;

  SELECT COALESCE(pu.prompt_count, 0) INTO today_usage
  FROM prompt_usage pu
  WHERE pu.user_id = user_id_param
    AND pu.usage_date = CURRENT_DATE
    AND pu.action_type = 'generate';

  IF NOT FOUND THEN
    today_usage := 0;
  END IF;

  RETURN QUERY SELECT 
    (today_usage < daily_limit) AS can_generate,
    (daily_limit - today_usage) AS remaining_prompts,
    (plan != 'free') AS is_premium;
END;
$function$