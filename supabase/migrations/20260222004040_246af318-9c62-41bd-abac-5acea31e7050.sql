
-- Add plan_type column to user_subscriptions for 3-tier pricing
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS plan_type text NOT NULL DEFAULT 'free' 
CHECK (plan_type IN ('free', 'student', 'pro'));

-- Update existing premium users to 'student' plan (they were on ₹10 plan before)
UPDATE public.user_subscriptions SET plan_type = 'student' WHERE is_premium = true;

-- Create/replace admin function to support plan_type
CREATE OR REPLACE FUNCTION public.admin_set_plan(
  target_user uuid, 
  new_plan_type text, 
  premium_until timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can set plan type';
  END IF;

  -- Validate plan_type
  IF new_plan_type NOT IN ('free', 'student', 'pro') THEN
    RAISE EXCEPTION 'Invalid plan type: %', new_plan_type;
  END IF;

  -- Insert or update the user subscription
  INSERT INTO public.user_subscriptions (user_id, is_premium, plan_type, premium_until)
  VALUES (
    target_user, 
    new_plan_type != 'free', 
    new_plan_type, 
    premium_until
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_premium = new_plan_type != 'free',
    plan_type = new_plan_type,
    premium_until = EXCLUDED.premium_until,
    updated_at = now();
END;
$$;

-- Update check_generation_limit to support 3 tiers
CREATE OR REPLACE FUNCTION public.check_generation_limit(user_id_param uuid)
RETURNS TABLE(can_generate boolean, remaining_prompts integer, is_premium boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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

  -- Free: 2, Student: 10, Pro: unlimited (100)
  CASE plan
    WHEN 'pro' THEN daily_limit := 100;
    WHEN 'student' THEN daily_limit := 10;
    ELSE daily_limit := 2;
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
$$;

-- Update check_edit_limit to support 3 tiers
CREATE OR REPLACE FUNCTION public.check_edit_limit(user_id_param uuid)
RETURNS TABLE(can_edit boolean, remaining_edits integer, is_premium boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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

  -- Free: 1, Student: 10, Pro: unlimited (100)
  CASE plan
    WHEN 'pro' THEN daily_limit := 100;
    WHEN 'student' THEN daily_limit := 10;
    ELSE daily_limit := 1;
  END CASE;

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
    (plan != 'free') AS is_premium;
END;
$$;

-- Function to get user plan type
CREATE OR REPLACE FUNCTION public.get_user_plan(user_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  plan text;
BEGIN
  SELECT COALESCE(us.plan_type, 'free') INTO plan
  FROM user_subscriptions us
  WHERE us.user_id = user_id_param
    AND (us.plan_type = 'free' OR us.premium_until IS NULL OR us.premium_until > now());
  
  RETURN COALESCE(plan, 'free');
END;
$$;
