# EPIC Upgrade Plan

Strict rule respected: no new top-level pages, no nav restructuring, no new tabs. All changes extend existing components/pages.

---

## Part 1 — UI Polish (visual + interactive only)

Files: `src/index.css`, `tailwind.config.ts`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/pages/NavigationMaker.tsx` (canvas only), existing page wrappers.

- Add reusable utility classes in `index.css`:
  - `.glass-card` (backdrop-blur + soft border + shadow)
  - `.elevated` (layered shadow with hover lift)
  - `.btn-glow` (subtle primary-tinted glow on hover/focus)
  - `.fade-up`, `.scale-in`, `.shimmer-loading`
- Extend Tailwind keyframes: `float`, `pulse-glow`, `connection-flow` (for animated dashed lines).
- Update `Button` variants to add hover lift (`hover:-translate-y-[1px]`), active scale already exists, plus optional `glow` prop.
- Apply `.glass-card`/`.elevated` to existing Cards on Pricing, Blog, Sitemap Library, Admin, Homepage sections — no structural changes, only className updates.
- Typography pass: tighten heading line-heights, normalize body to `text-[15px] leading-7`, consistent section spacing (`py-16 md:py-24`).
- Builder canvas (in `NavigationMaker.tsx`):
  - Replace flat background with subtle dot-grid (CSS radial-gradient, theme-aware).
  - Connection lines: animate `stroke-dashoffset` for "flowing" effect.
  - Node drag: add spring easing via framer-motion (`layout` + `transition`), light shadow on drag.
  - Smooth zoom/pan: wheel zoom around cursor, momentum on pan-end.
  - Loading states use shimmer skeletons instead of spinners where applicable.

No nav, no routes, no page additions.

---

## Part 2 — User Flow Builder (inside existing builder)

Single page: `src/pages/NavigationMaker.tsx`. No new route.

- Add a **Mode switch** in the existing top toolbar (segmented control): `Sitemap` | `User Flow`. Persisted in URL `?mode=flow` and localStorage per project.
- New node kinds (only visible in Flow mode): `Page`, `User Action`, `Decision`, `API/Backend`, `Success`, `Error`. Each with distinct icon + color token.
- Decision node renders a diamond shape with two outgoing handles (Yes/No).
- Connections become **directional arrows** (arrowhead marker on SVG path) and animate in flow mode.
- Page Library sidebar gets a second tab "Flow Steps" listing the 6 node types (re-uses the existing sidebar UI; not a new page).
- Storage: extend the existing `sitemap_projects.nodes` JSON — each node already free-form; add `kind: 'page' | 'action' | 'decision' | 'api' | 'success' | 'error'` and `mode: 'sitemap' | 'flow'` at project level. Backwards compatible (defaults to `sitemap`).
- Export (PDF/PNG/JSON) reuses existing pipeline; no gating changes.

---

## Part 3 — UPI Payment (mobile + desktop) with UTR

Files: `src/components/ProPaywall.tsx`, `src/pages/PricingIndia.tsx`, `src/pages/PricingInternational.tsx`. No new pages.

- Detect device: `navigator.userAgent` mobile check + `matchMedia('(pointer: coarse)')`.
- **Mobile flow**:
  1. "Pay with UPI" deep-links `upi://pay?...` (existing).
  2. Show optional QR code (generated client-side via `qrcode` lib) as fallback.
  3. After redirect-back, show "Enter your 12-digit UTR" form.
- **Desktop flow**:
  1. Show large QR code prominently with UPI ID + amount + plan.
  2. Show **"I have paid"** button → reveals UTR entry form.
- UTR form: single 12-digit numeric field (zod: `/^\d{12}$/`), submit button.
- On submit, insert into `payment_submissions` table (see Part 4) with status `pending`. Show confirmation message:
  > "Your payment has been submitted for verification. Our team will review it and activate your plan shortly."
- **No automatic plan upgrade.** Plan stays free until admin approves.
- Add `qrcode` package (`bun add qrcode @types/qrcode`).

---

## Part 4 — Admin Verification Queue

DB migration (one new table, plus extend existing `payment_leads` is kept as-is for backward compat):

```sql
create table public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_name text,
  user_email text not null,
  plan_selected text not null check (plan_selected in ('monthly','lifetime')),
  amount integer not null,
  utr text not null check (utr ~ '^[0-9]{12}$'),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.payment_submissions enable row level security;

-- anyone (incl. anon) can submit; admins can read/update
create policy "anyone can submit" on public.payment_submissions
  for insert to anon, authenticated with check (true);
create policy "admins can view" on public.payment_submissions
  for select to authenticated using (has_role(auth.uid(),'admin'));
create policy "admins can update" on public.payment_submissions
  for update to authenticated using (has_role(auth.uid(),'admin'));
create policy "users can view own" on public.payment_submissions
  for select to authenticated using (auth.uid() = user_id);
```

RPC for approval that also flips `user_subscriptions`:

```sql
create or replace function public.admin_review_payment(submission_id uuid, action text)
returns void language plpgsql security definer set search_path=public as $$
declare s record;
begin
  if not has_role(auth.uid(),'admin') then raise exception 'forbidden'; end if;
  if action not in ('approve','reject') then raise exception 'bad action'; end if;
  select * into s from payment_submissions where id = submission_id for update;
  if not found then raise exception 'not found'; end if;

  update payment_submissions
    set status = case when action='approve' then 'approved' else 'rejected' end,
        reviewed_by = auth.uid(), reviewed_at = now()
    where id = submission_id;

  if action='approve' and s.user_id is not null then
    perform admin_set_plan(
      s.user_id,
      'pro',
      case when s.plan_selected='monthly' then now()+interval '30 days' else null end
    );
  end if;
end$$;
```

Admin UI (extend existing `src/pages/Admin.tsx` — no new page, just a new section card):
- "Payment Verification Queue" section above existing "Payment Leads".
- Table: name, email, plan, amount, UTR, submitted at, status badge, [Approve] [Reject] buttons.
- Uses `admin_review_payment` RPC. Refreshes list after action; toast feedback.

---

## Part 5 — India-focused SEO

Files: `src/components/SEO.tsx`, `index.html`, `public/sitemap.xml`, page-level `<SEO />` props on `Index.tsx`, `NavigationMaker.tsx`, `PricingIndia.tsx`, `Blog.tsx`, `WebsiteAnalyzer.tsx`.

- Add India-targeted keywords to default + per-page meta: *visual sitemap builder India, website structure planner, startup planning tool India, user flow builder, product planning tool, indie hacker tools India*.
- Add `<meta name="geo.region" content="IN">`, `og:locale="en_IN"`, `hreflang="en-IN"`.
- Add JSON-LD `SoftwareApplication` with `offers.priceCurrency: INR` and Indian audience.
- Refresh `lastmod` in `sitemap.xml`; ensure Pricing India page is prioritized.
- No structural page changes.

---

## Part 6 — Workspace / Collaboration (within existing builder)

No new page. Surfaces appear inside `NavigationMaker.tsx` (a "Share" dropdown already exists) and `MyProjects.tsx`.

DB migration:

```sql
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz default now()
);
create table public.workspace_members (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner','editor','viewer')) default 'editor',
  invited_email text,
  joined_at timestamptz default now(),
  primary key (workspace_id, user_id)
);
create table public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'editor',
  token text unique not null,
  invited_by uuid not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);
create table public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references sitemap_projects(id) on delete cascade,
  node_id text,
  author_id uuid not null,
  body text not null,
  created_at timestamptz default now()
);
alter table sitemap_projects add column workspace_id uuid references workspaces(id);
```

Security-definer helper `is_workspace_member(uuid, uuid)` to avoid recursive RLS, then RLS:
- workspaces/members readable by members, writable by owner.
- `sitemap_projects` SELECT/UPDATE policy extended: `auth.uid() = user_id OR is_workspace_member(workspace_id, auth.uid())`.
- `project_comments`: visible to project members; insert by members.

Realtime: enable `replica identity full` + add `sitemap_projects` and `project_comments` to `supabase_realtime` publication. Client subscribes inside builder so edits & comments stream live.

UI surfaces (no new pages):
- In existing Share dropdown of the builder: "Invite to workspace" → modal with email + role.
- Existing `MyProjects` page: small workspace switcher dropdown at top.
- Right-click / select node in builder → existing detail panel gets a new **Comments** tab.
- Presence avatars in toolbar (Supabase Realtime presence).

Edge function `send-workspace-invite` (uses Resend if available, else returns shareable accept URL `/auth?invite=<token>` — `Auth.tsx` reads token and calls `accept_workspace_invite` RPC). No new route; reuses `/auth`.

---

## Implementation order

1. DB migrations (payment_submissions + workspace tables + RPCs) — single migration.
2. UPI flow + UTR + admin queue (revenue critical).
3. UI polish pass (tokens, buttons, cards, canvas grid, animated connectors).
4. User Flow mode in builder.
5. SEO meta updates.
6. Collaboration (workspaces, comments, realtime, invite function).

## Notes / risks

- All existing routes, navigation, and the current sitemap builder behavior remain unchanged.
- `payment_leads` table is kept for backward compatibility; new submissions also recorded in `payment_submissions`.
- Realtime adds bandwidth; gated to opened project only.
- `qrcode` is a tiny client lib (~15kb gzipped).
