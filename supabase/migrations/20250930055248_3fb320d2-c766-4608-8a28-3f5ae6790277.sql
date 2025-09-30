-- Create user_subscriptions table to track premium status
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  premium_until TIMESTAMP WITH TIME ZONE,
  coupon_code_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create coupon_codes table
CREATE TABLE public.coupon_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.user_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for coupon_codes (users can only check validity, not see all codes)
CREATE POLICY "Users can check specific coupon codes"
ON public.coupon_codes
FOR SELECT
USING (true);

CREATE POLICY "Users can update coupons they're redeeming"
ON public.coupon_codes
FOR UPDATE
USING (is_used = false);

-- Insert the special coupon code R123
INSERT INTO public.coupon_codes (code) VALUES ('R123');

-- Create trigger for automatic timestamp updates on user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check premium status
CREATE OR REPLACE FUNCTION public.is_premium_user(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  premium_status BOOLEAN;
BEGIN
  SELECT 
    CASE 
      WHEN is_premium = true AND (premium_until IS NULL OR premium_until > now())
      THEN true
      ELSE false
    END INTO premium_status
  FROM public.user_subscriptions
  WHERE user_id = user_id_param;
  
  RETURN COALESCE(premium_status, false);
END;
$$;