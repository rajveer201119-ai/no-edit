-- Create project_versions table to store edit history
CREATE TABLE public.project_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Users can view their own versions
CREATE POLICY "Users can view their own versions"
ON public.project_versions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own versions
CREATE POLICY "Users can create their own versions"
ON public.project_versions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own versions
CREATE POLICY "Users can delete their own versions"
ON public.project_versions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_project_versions_user_id ON public.project_versions(user_id);