-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON user_subscriptions;

-- Create new policies that allow admins to manage any subscription
CREATE POLICY "Users can insert their own subscription or admins can insert any"
ON user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own subscription or admins can update any"
ON user_subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));