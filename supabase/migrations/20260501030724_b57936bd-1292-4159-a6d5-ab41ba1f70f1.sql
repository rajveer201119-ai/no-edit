-- ============ Payment Submissions (manual UPI verification) ============
CREATE TABLE public.payment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text,
  user_email text NOT NULL,
  plan_selected text NOT NULL CHECK (plan_selected IN ('monthly','lifetime')),
  amount integer NOT NULL,
  utr text NOT NULL CHECK (utr ~ '^[0-9]{12}$'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit payments"
  ON public.payment_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all payment submissions"
  ON public.payment_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own payment submissions"
  ON public.payment_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update payment submissions"
  ON public.payment_submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_payment_submissions_status ON public.payment_submissions(status, created_at DESC);

-- ============ Admin review RPC ============
CREATE OR REPLACE FUNCTION public.admin_review_payment(submission_id uuid, action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s record;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can review payments';
  END IF;
  IF action NOT IN ('approve','reject') THEN
    RAISE EXCEPTION 'Invalid action: %', action;
  END IF;

  SELECT * INTO s FROM public.payment_submissions WHERE id = submission_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  UPDATE public.payment_submissions
    SET status = CASE WHEN action = 'approve' THEN 'approved' ELSE 'rejected' END,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = submission_id;

  IF action = 'approve' AND s.user_id IS NOT NULL THEN
    PERFORM public.admin_set_plan(
      s.user_id,
      'pro',
      CASE WHEN s.plan_selected = 'monthly' THEN now() + interval '30 days' ELSE NULL END
    );
  END IF;
END;
$$;

-- ============ Workspaces ============
CREATE TABLE public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.workspace_members (
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('owner','editor','viewer')),
  invited_email text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE public.workspace_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('editor','viewer')),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  invited_by uuid NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helper to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.is_workspace_member(_workspace_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = _workspace_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_owner(_workspace_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = _workspace_id AND owner_id = _user_id
  );
$$;

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;

-- workspaces policies
CREATE POLICY "Members can view workspace"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(id, auth.uid()));

CREATE POLICY "Authenticated users can create workspaces"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update workspace"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete workspace"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Trigger: when workspace created, add owner as member
CREATE OR REPLACE FUNCTION public.add_workspace_owner_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_add_workspace_owner_as_member
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.add_workspace_owner_as_member();

-- workspace_members policies
CREATE POLICY "Members can view membership rows"
  ON public.workspace_members FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Owners can add members"
  ON public.workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_owner(workspace_id, auth.uid()));

CREATE POLICY "Owners can remove members"
  ON public.workspace_members FOR DELETE
  TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Owners can update member roles"
  ON public.workspace_members FOR UPDATE
  TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()));

-- workspace_invites policies
CREATE POLICY "Members can view workspace invites"
  ON public.workspace_invites FOR SELECT
  TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Owners can create invites"
  ON public.workspace_invites FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_owner(workspace_id, auth.uid()) AND auth.uid() = invited_by);

CREATE POLICY "Owners can delete invites"
  ON public.workspace_invites FOR DELETE
  TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()));

-- Accept invite RPC
CREATE OR REPLACE FUNCTION public.accept_workspace_invite(invite_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO inv FROM public.workspace_invites
   WHERE token = invite_token AND accepted_at IS NULL
   LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invite';
  END IF;

  INSERT INTO public.workspace_members (workspace_id, user_id, role, invited_email)
  VALUES (inv.workspace_id, auth.uid(), inv.role, inv.email)
  ON CONFLICT DO NOTHING;

  UPDATE public.workspace_invites
     SET accepted_at = now()
   WHERE id = inv.id;

  RETURN inv.workspace_id;
END;
$$;

-- ============ sitemap_projects: workspace_id column ============
ALTER TABLE public.sitemap_projects
  ADD COLUMN workspace_id uuid REFERENCES public.workspaces(id) ON DELETE SET NULL;

CREATE INDEX idx_sitemap_projects_workspace ON public.sitemap_projects(workspace_id);

-- Extend RLS on sitemap_projects to include workspace members
DROP POLICY IF EXISTS "Users can view their own sitemap projects" ON public.sitemap_projects;
DROP POLICY IF EXISTS "Users can update their own sitemap projects" ON public.sitemap_projects;
DROP POLICY IF EXISTS "Users can delete their own sitemap projects" ON public.sitemap_projects;
DROP POLICY IF EXISTS "Users can create their own sitemap projects" ON public.sitemap_projects;

CREATE POLICY "View own or workspace sitemap projects"
  ON public.sitemap_projects FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
  );

CREATE POLICY "Update own or workspace sitemap projects"
  ON public.sitemap_projects FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
  );

CREATE POLICY "Create sitemap projects in own workspace"
  ON public.sitemap_projects FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (workspace_id IS NULL OR public.is_workspace_member(workspace_id, auth.uid()))
  );

CREATE POLICY "Delete own sitemap projects"
  ON public.sitemap_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ Project comments ============
CREATE TABLE public.project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.sitemap_projects(id) ON DELETE CASCADE,
  node_id text,
  author_id uuid NOT NULL,
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_project_comments_project ON public.project_comments(project_id, created_at);

-- Helper to check project access
CREATE OR REPLACE FUNCTION public.can_access_project(_project_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sitemap_projects sp
    WHERE sp.id = _project_id
      AND (sp.user_id = _user_id
           OR (sp.workspace_id IS NOT NULL AND public.is_workspace_member(sp.workspace_id, _user_id)))
  );
$$;

CREATE POLICY "View comments if can access project"
  ON public.project_comments FOR SELECT
  TO authenticated
  USING (public.can_access_project(project_id, auth.uid()));

CREATE POLICY "Insert comments if can access project"
  ON public.project_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id AND public.can_access_project(project_id, auth.uid()));

CREATE POLICY "Update own comments"
  ON public.project_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Delete own comments"
  ON public.project_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Realtime: ensure full row data for replication
ALTER TABLE public.sitemap_projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_comments REPLICA IDENTITY FULL;
ALTER TABLE public.payment_submissions REPLICA IDENTITY FULL;

-- Add to realtime publication (idempotent)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sitemap_projects;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_comments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_submissions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- updated_at triggers
CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_project_comments_updated_at
  BEFORE UPDATE ON public.project_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();