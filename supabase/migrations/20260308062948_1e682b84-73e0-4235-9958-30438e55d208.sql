CREATE TABLE public.sitemap_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Untitled Project',
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  connections jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sitemap_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sitemap projects"
  ON public.sitemap_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sitemap projects"
  ON public.sitemap_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sitemap projects"
  ON public.sitemap_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sitemap projects"
  ON public.sitemap_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_sitemap_projects_updated_at
  BEFORE UPDATE ON public.sitemap_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();