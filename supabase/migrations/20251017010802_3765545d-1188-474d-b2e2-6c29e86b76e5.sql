-- Add RLS policies to Admin panel table
-- Only admins should be able to access the Admin panel table

CREATE POLICY "Only admins can view admin panel"
ON public."Admin panel"
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert into admin panel"
ON public."Admin panel"
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update admin panel"
ON public."Admin panel"
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete from admin panel"
ON public."Admin panel"
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));