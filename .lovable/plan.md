# AI Sitemap Builder — Implementation Plan

Goal: let a user describe a website, generate a validated hierarchical sitemap via Lovable AI, and drop it into EPIC's existing `NavigationMaker` canvas as fully editable nodes/connections — without breaking the current manual builder, User Flow mode, autosave, undo/redo, or auth.

Everything reuses EPIC's current `CanvasNode` / `Connection` shape and history stack. No new page routes, no new nav tabs, no second editor.

---

## 1. Secure edge function: `generate-sitemap`

New Supabase edge function `supabase/functions/generate-sitemap/index.ts` (`verify_jwt = false`, CORS enabled, same pattern as `generate-image`).

- Uses `LOVABLE_API_KEY` via the AI Gateway (`https://ai.gateway.lovable.dev/v1`, `@ai-sdk/openai-compatible`).
- Model: `google/gemini-2.5-flash` (fast, cheap, strong JSON).
- Input body: `{ description, websiteType?, audience?, size: "small"|"medium"|"large", includeUtility?, includeSeoLanding?, language? }`.
- Server-side:
  - Zod-validate request; reject empty (<10 chars) or >2000-char descriptions.
  - Enhance short descriptions by injecting the selected options into the system prompt.
  - Ask model for **strict JSON** (schema in system prompt). Use AI SDK `generateText` + `Output.object` with a *flat, constraint-free* Zod schema per `ai-sdk-lovable-gateway` rules (no min/max/enum bounds; limits stated in the prompt instead).
  - Handle 429/402 explicitly and forward as clean JSON errors.
- Returns `{ sitemap: SitemapJSON }` or `{ error: "friendly message" }`.
- Registered in `supabase/config.toml`.

## 2. Sitemap schema + validation/repair (`src/lib/sitemap/schema.ts`)

Zod schema matching the spec (`projectName`, `websiteType`, `description`, `pages[]` recursive with `id, name, slug, pageType, description, parentId, order, children[]`).

Validation/repair utility `validateAndRepair(raw)`:
- Parse JSON safely (also strips code fences if model wraps it).
- Ensure a Home page exists (create one wrapping other roots if missing).
- Normalize slugs: Home = `/`; else lowercase, hyphenate, strip unsupported chars, prefix `/`; dedupe by appending `-2`, `-3`, ….
- Regenerate any missing/duplicate IDs with `crypto.randomUUID()`; reassign `parentId` accordingly.
- Detect and break circular parent chains.
- Enforce max depth = 4 (flatten excess into parent).
- Enforce page-count caps per size (5-12 / 12-25 / 25-50); trim leaf-first if over.
- Drop pages with empty names.
- Returns `{ ok, sitemap, issues[] }`.

## 3. JSON → editor converter + auto layout (`src/lib/sitemap/toCanvas.ts`)

- Flatten tree into `CanvasNode[]` reusing existing shape (map `pageType` → EPIC's page color palette, reuse `getDefaultSections` for known page ids).
- Build `Connection[]` from parent → child links.
- Tidy-tree layout: Home centered at top, siblings evenly spaced horizontally (200px gap), 180px vertical per level, subtree-width aware so nothing overlaps.
- Returns `{ nodes, connections, bounds }` so caller can fit-to-viewport (reuse existing zoom/pan setters).

## 4. Client generation pipeline (`src/lib/sitemap/generate.ts`)

- `generateSitemap(input, { signal })` calls the edge function, then runs `validateAndRepair`.
- Retry up to 3 times on: invalid JSON, schema failure that repair can't fix, network error.
- Supports `AbortController` for cancel.
- Never mutates current sitemap on failure — resolves with `{ ok:false, message }`.

## 5. UI: `AISitemapModal` (`src/components/AISitemapModal.tsx`)

Reuses shadcn `Dialog`, EPIC's Liquid Glass tokens.

- Large textarea with the SaaS example placeholder from the brief.
- Optional controls: Website Type (input), Target Audience (input), Size (Small/Medium/Large segmented), toggles for Utility pages & SEO landing pages, Language (select, default English).
- Primary "Generate Sitemap" button, disabled while running.
- Loading state cycles the four progress messages ("Understanding your website" → "Preparing the visual sitemap") every ~1.5s.
- Cancel button wired to `AbortController`.
- Error state: friendly copy, "Try Again", "Use Suggested Description" (prefills the SaaS example).
- Accessible: labeled inputs, focus trap via Dialog, `aria-live="polite"` for progress + result, visible focus rings.

## 6. Editor integration (`src/pages/NavigationMaker.tsx`)

- Add a prominent "Generate with AI" button (`Sparkles` icon) in the existing top toolbar next to Undo/Redo — no new nav.
- Hidden when `builderMode === "flow"` (sitemap-only for v1).
- On success:
  - Push current state to history first (single undo step reverts the entire AI generation).
  - Replace `nodes` + `connections` with converted output.
  - Trigger existing autosave path and fit-to-viewport.
  - Toast "AI sitemap ready — every page is editable."
- Add small "AI Generated" pill in the top bar for AI-originated projects (stored in project metadata / localStorage flag).

## 7. AI Actions menu (post-generation)

Dropdown near the AI button, visible only when current sitemap has ≥1 node:
- Add missing pages · Simplify · Expand · Improve SEO structure · Add conversion pages · Add legal pages · Add blog structure · Regenerate selected branch · Describe changes (free-text).

All routed through the same edge function with an `action` field + current sitemap JSON. Server returns a **diff** (`add[]`, `remove[]`, `rename[]`, `reparent[]`). Client shows a preview dialog listing the changes; user confirms → single history entry applied.

"Regenerate selected branch" only sends the subtree rooted at the currently selected node.

## 8. Usage tracking (non-blocking)

New table `ai_sitemap_generations` (id, user_id nullable, session_id, size, succeeded, page_count, retries, created_at) with GRANTs + RLS (owner or anon-insert-only). Edge function inserts one row per attempt. No hard limits enforced yet — hooks in place for later.

## 9. Tests (`src/lib/sitemap/__tests__/`)

Vitest unit tests for `validateAndRepair` and `toCanvas`:
- valid JSON, malformed JSON, missing Home, duplicate ids, duplicate slugs, invalid parentId, circular parents, over-deep nesting, oversize count, empty names, slug normalization.
- Converter: parent→child edges, no overlapping nodes, Home at top.
- Retry logic: succeeds after N failures within cap, gives up after 3 (mocked fetch).
- Cancellation via AbortController.

(Playwright E2E for the 10 industry descriptions listed in the brief is documented in a follow-up — v1 ships with the pipeline tests above; live prompt tests are non-deterministic and belong in a manual QA checklist.)

## 10. Security & hygiene

- `LOVABLE_API_KEY` stays server-side (already stored). Client never touches it.
- Body size limit (server): 4KB. Reject descriptions <10 or >2000 chars.
- Basic per-IP rate limit: 10 requests / 5 min via in-memory map in the edge function (best-effort; upgrade later).
- All user-facing errors are generic ("We couldn't generate a valid sitemap this time…"). Technical details logged server-side only.
- Never render raw JSON, provider names, or stack traces in the UI.

---

## Technical notes / file map

New:
- `supabase/functions/generate-sitemap/index.ts`
- `supabase/functions/_shared/ai-gateway.ts` (helper per `ai-sdk-lovable-gateway`)
- `src/lib/sitemap/schema.ts`
- `src/lib/sitemap/validateAndRepair.ts`
- `src/lib/sitemap/toCanvas.ts`
- `src/lib/sitemap/generate.ts`
- `src/lib/sitemap/__tests__/*.test.ts`
- `src/components/AISitemapModal.tsx`
- `src/components/AIActionsMenu.tsx`
- migration: `ai_sitemap_generations` table + GRANTs + RLS

Edited:
- `src/pages/NavigationMaker.tsx` — add AI button, actions menu, apply-generated-sitemap flow (respects existing history / autosave).
- `supabase/config.toml` — register new function.

Out of scope (explicitly not touched):
- Home tab / landing page (immutable).
- User Flow mode canvas.
- Auth, pricing, existing editor tools.
