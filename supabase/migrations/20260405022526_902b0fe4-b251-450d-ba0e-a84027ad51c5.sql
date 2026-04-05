
CREATE TABLE public.payment_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  plan_selected TEXT NOT NULL DEFAULT 'lifetime',
  amount INTEGER NOT NULL DEFAULT 1500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert payment leads"
ON public.payment_leads
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Only admins can view payment leads"
ON public.payment_leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
