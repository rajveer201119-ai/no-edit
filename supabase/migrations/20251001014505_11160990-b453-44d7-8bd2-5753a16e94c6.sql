-- Add RH123 coupon code
INSERT INTO public.coupon_codes (code, is_used) VALUES ('RH123', false);

-- Create table to track daily prompt usage
CREATE TABLE public.prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prompt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, usage_date)
);

-- Enable RLS
ALTER TABLE public.prompt_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own usage"
  ON public.prompt_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.prompt_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.prompt_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to check and update daily limit
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
  -- Check if user is premium
  SELECT COALESCE(us.is_premium, false) INTO premium_status
  FROM user_subscriptions us
  WHERE us.user_id = user_id_param;

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

  -- Return result
  RETURN QUERY SELECT 
    (today_usage < daily_limit) AS can_generate,
    (daily_limit - today_usage) AS remaining_prompts,
    premium_status AS is_premium;
END;
$$;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_prompt_usage(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO prompt_usage (user_id, usage_date, prompt_count)
  VALUES (user_id_param, CURRENT_DATE, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET 
    prompt_count = prompt_usage.prompt_count + 1,
    updated_at = now();
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_prompt_usage_updated_at
  BEFORE UPDATE ON public.prompt_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();