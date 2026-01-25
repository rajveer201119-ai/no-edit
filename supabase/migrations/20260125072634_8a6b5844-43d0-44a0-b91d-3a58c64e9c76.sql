-- Add action_type column to prompt_usage to differentiate between generate and edit
ALTER TABLE public.prompt_usage ADD COLUMN IF NOT EXISTS action_type text NOT NULL DEFAULT 'generate';

-- Drop the unique constraint and recreate with action_type
ALTER TABLE public.prompt_usage DROP CONSTRAINT IF EXISTS prompt_usage_user_id_usage_date_key;
ALTER TABLE public.prompt_usage ADD CONSTRAINT prompt_usage_user_id_usage_date_action_key UNIQUE (user_id, usage_date, action_type);

-- Create function to check generation limit (25 for premium, 2 for free)
CREATE OR REPLACE FUNCTION public.check_generation_limit(user_id_param uuid)
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
  SELECT COALESCE(us.is_premium, false) INTO premium_status
  FROM user_subscriptions us
  WHERE us.user_id = user_id_param;

  IF NOT FOUND THEN
    INSERT INTO user_subscriptions (user_id, is_premium)
    VALUES (user_id_param, false)
    ON CONFLICT (user_id) DO NOTHING;
    premium_status := false;
  END IF;

  -- 25 for premium, 2 for free
  IF premium_status THEN
    daily_limit := 25;
  ELSE
    daily_limit := 2;
  END IF;

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
    premium_status AS is_premium;
END;
$function$;

-- Create function to check edit limit (10 for premium, 1 for free)
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

  -- 10 for premium, 1 for free
  IF premium_status THEN
    daily_limit := 10;
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
$function$;

-- Create function to increment generation usage
CREATE OR REPLACE FUNCTION public.increment_generation_usage(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO prompt_usage (user_id, usage_date, prompt_count, action_type)
  VALUES (user_id_param, CURRENT_DATE, 1, 'generate')
  ON CONFLICT (user_id, usage_date, action_type)
  DO UPDATE SET 
    prompt_count = prompt_usage.prompt_count + 1,
    updated_at = now();
END;
$function$;

-- Create function to increment edit usage
CREATE OR REPLACE FUNCTION public.increment_edit_usage(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO prompt_usage (user_id, usage_date, prompt_count, action_type)
  VALUES (user_id_param, CURRENT_DATE, 1, 'edit')
  ON CONFLICT (user_id, usage_date, action_type)
  DO UPDATE SET 
    prompt_count = prompt_usage.prompt_count + 1,
    updated_at = now();
END;
$function$;