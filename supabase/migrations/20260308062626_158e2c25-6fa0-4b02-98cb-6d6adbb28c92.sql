CREATE TABLE public.shared_sitemaps (
  id text PRIMARY KEY,
  title text NOT NULL DEFAULT 'Untitled Sitemap',
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  connections jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  view_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.shared_sitemaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shared sitemaps are viewable by everyone"
  ON public.shared_sitemaps FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create shared sitemaps"
  ON public.shared_sitemaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own shared sitemaps"
  ON public.shared_sitemaps FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);