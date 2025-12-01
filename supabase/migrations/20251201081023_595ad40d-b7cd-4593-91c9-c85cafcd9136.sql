-- Create announcements table for admin notifications/ads/alerts
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'alert')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active announcements
CREATE POLICY "Active announcements are viewable by everyone"
ON public.announcements
FOR SELECT
USING (is_active = true);

-- Policy: Only admins can insert announcements
CREATE POLICY "Only admins can create announcements"
ON public.announcements
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can update announcements
CREATE POLICY "Only admins can update announcements"
ON public.announcements
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete announcements
CREATE POLICY "Only admins can delete announcements"
ON public.announcements
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();