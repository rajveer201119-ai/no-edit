
CREATE TABLE public.published_sitemaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  total_pages INTEGER NOT NULL DEFAULT 0,
  max_depth INTEGER NOT NULL DEFAULT 0,
  top_level_sections INTEGER NOT NULL DEFAULT 0,
  largest_cluster TEXT,
  largest_cluster_size INTEGER DEFAULT 0,
  orphan_pages INTEGER DEFAULT 0,
  sitemap_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_seed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.published_sitemaps ENABLE ROW LEVEL SECURITY;

-- Anyone can view published sitemaps
CREATE POLICY "Published sitemaps are viewable by everyone"
ON public.published_sitemaps FOR SELECT
USING (true);

-- Authenticated users can publish sitemaps
CREATE POLICY "Authenticated users can publish sitemaps"
ON public.published_sitemaps FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = published_by);

-- Users can update their own sitemaps
CREATE POLICY "Users can update their own sitemaps"
ON public.published_sitemaps FOR UPDATE
TO authenticated
USING (auth.uid() = published_by);

-- Users can delete their own sitemaps, admins can delete any
CREATE POLICY "Users or admins can delete sitemaps"
ON public.published_sitemaps FOR DELETE
TO authenticated
USING (auth.uid() = published_by OR public.has_role(auth.uid(), 'admin'::app_role));
