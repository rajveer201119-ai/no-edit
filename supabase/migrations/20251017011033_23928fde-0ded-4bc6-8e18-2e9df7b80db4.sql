-- This is a helper query to show how to assign admin role
-- First, let's create a function to easily assign admin role to a user by email

CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user ID from auth.users based on email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert or update the admin role for this user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role assigned to user %', user_email;
END;
$$;

-- Now assign admin role to your current user
-- Replace 'rajveer201119@gmail.com' with your actual email if different
SELECT public.assign_admin_role_by_email('rajveer201119@gmail.com');