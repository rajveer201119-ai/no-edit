
-- Remove the insecure INSERT and UPDATE policies on user_subscriptions
-- that allow any authenticated user to set their own premium status

DROP POLICY IF EXISTS "Users can insert their own subscription or admins can insert an" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription or admins can update an" ON public.user_subscriptions;

-- Re-create INSERT policy: only admins can insert
CREATE POLICY "Only admins can insert subscriptions"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Re-create UPDATE policy: only admins can update
CREATE POLICY "Only admins can update subscriptions"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
