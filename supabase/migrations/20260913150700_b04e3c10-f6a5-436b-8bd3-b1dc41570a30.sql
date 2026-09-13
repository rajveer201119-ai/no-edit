-- EPIC is retired and free for lifetime: payments and coupons are no longer accepted.
DROP POLICY IF EXISTS "Anyone can submit payments" ON public.payment_submissions;
DROP POLICY IF EXISTS "Users can insert their own payment submissions" ON public.payment_submissions;
REVOKE INSERT, UPDATE, DELETE ON public.payment_submissions FROM anon, authenticated;

DROP POLICY IF EXISTS "Anyone can redeem unused coupons" ON public.coupon_codes;
DROP POLICY IF EXISTS "Users can update unused coupons" ON public.coupon_codes;
DROP POLICY IF EXISTS "Authenticated users can redeem coupons" ON public.coupon_codes;
REVOKE INSERT, UPDATE, DELETE ON public.coupon_codes FROM anon, authenticated;