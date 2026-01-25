-- Fix coupon_codes public exposure: Replace permissive SELECT policy with admin-only access
-- and create secure validation/redemption functions

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can check specific coupon codes" ON coupon_codes;

-- Add restrictive policy for admin viewing only
CREATE POLICY "Only admins can view coupons"
ON coupon_codes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a SECURITY DEFINER function to validate coupon codes securely
CREATE OR REPLACE FUNCTION validate_coupon(code_input text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  coupon_record RECORD;
BEGIN
  -- Input validation
  IF code_input IS NULL OR length(trim(code_input)) < 3 THEN
    RETURN json_build_object('valid', false, 'message', 'Invalid code format');
  END IF;
  
  SELECT id INTO coupon_record
  FROM coupon_codes 
  WHERE code = trim(code_input) AND is_used = false;
  
  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'message', 'Invalid or already used code');
  END IF;
  
  RETURN json_build_object(
    'valid', true,
    'id', coupon_record.id,
    'message', 'Valid coupon code'
  );
END;
$$;

-- Create a SECURITY DEFINER function to redeem coupon codes securely
CREATE OR REPLACE FUNCTION redeem_coupon(code_input text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  coupon_id uuid;
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication required');
  END IF;
  
  -- Input validation
  IF code_input IS NULL OR length(trim(code_input)) < 3 THEN
    RETURN json_build_object('success', false, 'message', 'Invalid code format');
  END IF;
  
  -- Attempt to redeem the code
  UPDATE coupon_codes
  SET is_used = true,
      used_by_user_id = auth.uid(),
      used_at = now()
  WHERE code = trim(code_input) AND is_used = false
  RETURNING id INTO coupon_id;
  
  IF coupon_id IS NOT NULL THEN
    RETURN json_build_object('success', true, 'message', 'Coupon redeemed successfully');
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid or already used code');
  END IF;
END;
$$;