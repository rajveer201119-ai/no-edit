
# EPIC Refocus + Conversion Plan

Two tracks, executed together: **(A) narrow the product** to sitemap + user-flow builder so it stops feeling like AI slop, and **(B) rebuild the free tier and paywall timing** so more free users become paid users.

No changes to URLs, redirects, or existing SEO content. No business-logic changes outside plan/paywall/onboarding surfaces.

---

## Track A — Refocus on sitemap + user-flow only

### 1. Reposition the app shell
- Make `NavigationMaker` (sitemap + user-flow) the primary in-app surface.
- Hide/retire the design-editor entry points from navigation: `WorkspaceToolbar`, `CanvasWorkspace`, `ImageEditor`, `InpaintingPanel`, `MaskCanvas`, `SketchTool`, `ExportSizePack`, `BlankCanvasModal`, `DesignTypeModal`, `NichePresets`, `TemplatePreview`.
- Keep the files (don't delete yet — safe rollback), but remove them from routing, `MainNavigation`, and `NewHomepage` CTAs.
- Update `MainNavigation` tabs to: **Builder · My Projects · Templates · Analyzer · Library**.

### 2. Delete the AI-slop overlays from the sitemap experience
Remove imports and UI mounts of: `DesignScore`, `PromptAnalyzer`, `DesignIntentSelector`, `ZeroEditMode`, `AIReasoningOverlay`, `RemixLineage`, `DesignMistakeDetector`, `AIModeModal`, `CommunityPrompts`.
Keep files on disk; just stop rendering them.

### 3. Sitemap builder UX polish (small, high-leverage)
- Consolidate the top bar into: **Project name · Save status · Undo/Redo · Share · Export · Upgrade (if free)**.
- Add a first-run empty state with 3 clear CTAs: **Start from URL** · **Start from template** · **Start blank**.
- Wire "Start from URL" to existing `firecrawl-map` → auto-generate nodes (already available, just needs a proper entry point).
- Add Presentation mode (full-screen, arrow-key node walk) — small addition, high perceived value for client review.

### 4. Copy + naming pass
- Global find/replace of slop names in visible UI:
  - "AI Reasoning" → remove
  - "Design Score" → remove
  - "Zero Edit Mode" → remove
  - "Design Mistake Detector" → remove
- One tagline across landing, pricing, meta: **"The visual sitemap & user-flow builder for product teams."**

---

## Track B — Free tier + paywall timing rework

### 5. New plan limits (edit `useUserPlan.ts` only — no schema changes)
| Capability | Free (today) | Free (new) | Pro |
|---|---|---|---|
| Projects | 1 | **3** | ∞ |
| Pages per project | 10 | **25** | ∞ |
| PNG export | ❌ | **✅ with small "Made with EPIC" badge** | ✅ clean |
| PDF export | ❌ | ❌ | ✅ |
| JSON export | ✅ | ✅ | ✅ |
| Share link | basic | basic | password + view/edit perms |
| Analyzer / UX Tester / Library | ❌ | ❌ | ✅ |

Rationale: 1-project free is why word-of-mouth is dead. 3 projects + watermarked PNG = viral loop + real utility, still gives strong reasons to upgrade.

### 6. Paywall timing — "let them taste it"
- On **project #1**, all Pro features are unlocked in a soft-trial state (labeled "Pro preview"). Clean PNG export, PDF export, unlimited pages — all work once.
- On the **first Pro action in project #2**, the unified upgrade dialog appears.
- Kill duplicate paywall components: merge `ProPaywall`, `CreatorModePaywall`, `ProPlanDialog` into a single `UpgradeDialog` with contextual copy ("Unlock unlimited projects", "Export clean PNG", etc.) driven by a `reason` prop.

### 7. Pricing page updates
- Add **annual toggle** with 30% off (visual only if backend billing already supports it; otherwise annual = "contact us" for now).
- Add a **Team plan** row (2–10 seats, per-seat pricing) — even as "Coming soon / Join waitlist" it signals ACV and captures leads.
- Tighten the feature matrix: 6 rows max, benefit-led ("Unlimited sitemaps", "Client-ready PDF exports", "Presentation mode", "Password-protected share links", "Priority support", "Early access to new features").
- Move testimonials / logos above the pricing table (populate `LandingCredibility` with real quotes if available; otherwise use anonymized role-based quotes).

### 8. Landing page conversion pass (Home is unlocked per your answer)
- Replace hero copy with the new tagline + one demo GIF/video of URL → sitemap flow.
- Primary CTA: **"Generate my sitemap free"** → routes to `/navigation-maker` with the URL prompt open.
- Secondary CTA: **"See pricing"**.
- Add a "Loved by product teams at…" logo strip (placeholder logos if none yet — mark for user to swap).
- Add 3 use-case tiles: SaaS · E-commerce · Agencies. Each links to the matching existing pillar/alternative page (preserves SEO).

### 9. Onboarding
- First login → single modal: **"Paste your website URL to generate a starter sitemap"** (skippable).
- Retire `OnboardingGuide`, `OnboardingOverlay`, `DesignWizard` from mount points; keep files.

---

## Technical details

**Files to edit (Track A):**
- `src/App.tsx` — remove unused routes if any; keep for now.
- `src/components/platform/MainNavigation.tsx` — new tab set.
- `src/components/platform/NewHomepage.tsx` — new hero + CTAs.
- `src/components/Hero.tsx` — new copy.
- `src/pages/NavigationMaker.tsx` — empty state, URL-import CTA, presentation mode.
- `src/components/platform/index.ts`, `src/components/platform/editor/index.ts` — stop re-exporting slop modules (or leave; just don't mount).

**Files to edit (Track B):**
- `src/hooks/useUserPlan.ts` — new limits.
- `src/components/ProPaywall.tsx` → become the unified `UpgradeDialog`; `CreatorModePaywall.tsx` + `ProPlanDialog.tsx` re-export the same component with preset `reason` props (no import breakage).
- `src/pages/PricingIndia.tsx`, `src/pages/PricingInternational.tsx` — annual toggle, team row, tightened matrix.
- `src/components/platform/LandingCredibility.tsx` — social proof block.
- New: `src/components/UpgradeDialog.tsx` (contextual paywall).
- New: `src/components/PresentationMode.tsx`.

**Do NOT touch:**
- URLs / redirects / `sitemap.xml` / `robots.txt`.
- Blog content, pillar pages, alternative pages, structured data.
- Supabase schema, RLS, edge functions.
- `user_subscriptions` write paths (admin-write-only per memory).

**Verification after build:**
- `/` renders new hero and CTAs.
- `/navigation-maker` shows empty-state with URL/Template/Blank.
- Free user with 0 projects can create + export PNG (with badge).
- Free user creating project #2 hits `UpgradeDialog`.
- Pricing page shows annual toggle and Team row.
- No console errors; no removed-module import errors.

---

## What this plan explicitly does NOT do

- Does not add real-time collaboration (bigger project — flagged for next round).
- Does not delete files (safe rollback path).
- Does not touch image-editor code beyond hiding entry points.
- Does not change payment provider or add new SKUs beyond a Team waitlist row.
- Does not modify existing SEO content.
