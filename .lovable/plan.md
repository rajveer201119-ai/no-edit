# EPIC — UI Polish, Light-First Theme, and User Flow Mode

Three focused upgrades. No new pages, no new nav items, no structural changes.

## 1. Default to Light Mode (with persistent Dark option)

Current state: `App.tsx` sets `defaultTheme="dark"`. First-time visitors land in dark mode.

Change:
- Set `defaultTheme="light"` and remove `enableSystem` so first visit is always Light.
- `next-themes` already persists the user's manual choice in `localStorage` — switching to Dark sticks across sessions.
- Audit `ThemeToggle` placement: it already exists; ensure it is visible in the existing header (no new nav item, just verify it renders in light mode with proper contrast).
- Light-mode QA pass on key surfaces that currently look washed out:
  - `Footer`, `LandingCredibility`, `NewHomepage` hero — replace any hard-coded dark hex/rgba with semantic tokens (`bg-background`, `text-foreground`, `border-border`, `bg-card`).
  - `liquid-glass` and `glass-card` utilities — already have `.dark` variants in `index.css`; verify text inside uses `text-foreground` not white.
  - Builder canvas: `.canvas-dot-grid` already theme-aware — confirm node cards, sidebar, and connection lines read well on a light canvas.

## 2. UI Redesign Pass (Flowmapp / Miro polish, no structural change)

Touch only existing components. Goal: replace the "static webpage" feel with a tactile SaaS feel.

### Global tokens & utilities (`src/index.css`, `tailwind.config.ts`)
- Tighten the light palette: slightly cooler off-white background (`--background: 220 20% 98%`), softer borders, deeper primary indigo for contrast.
- Add 2 new utility classes:
  - `.surface-soft` — rounded-2xl, subtle border, very soft shadow, hover lift (for cards/panels).
  - `.btn-press` — adds `active:scale-[0.97]` + 120ms transition (apply to primary CTAs).
- Strengthen existing `.elevated` hover (slightly larger lift, primary-tinted shadow on hover, already partially there).
- Add a smooth `.ring-focus` for inputs: `focus-visible:ring-2 focus-visible:ring-primary/40`.

### Components to polish (no API changes, just className/markup tweaks)
- `components/ui/button.tsx` — apply `btn-press` + smoother hover transition to default and primary variants.
- `components/ui/input.tsx`, `textarea.tsx` — rounded-xl, soft border, focus ring, light bg in light mode.
- `components/ui/card.tsx` — apply `surface-soft` look as default (rounded-2xl, gentler shadow).
- `components/ui/dialog.tsx` — backdrop blur + scale-in animation on content (already has scale-in; tighten timing).
- `Hero.tsx` / `platform/NewHomepage.tsx` — bigger headline tracking, subtle floating gradient blob behind hero (using existing `.animate-float`), CTA gets `.btn-glow .btn-press`.
- `GlassSidebar.tsx`, `platform/MainNavigation.tsx` — apply `liquid-glass` class properly in both themes; ensure active item has primary tint.
- `NavigationMaker.tsx` builder nodes — rounded-2xl cards, soft shadow, hover lift, primary ring on selected, animated connection points (small dot scales on hover).

No new components, no layout reorganisation.

## 3. User Flow Builder Mode (inside existing builder)

The user-flow node types (`flow-page`, `flow-action`, `flow-decision`, `flow-api`, `flow-success`, `flow-error`) already exist in `stockPages` inside `NavigationMaker.tsx`. Today they're mixed in the same sidebar list with sitemap pages — discoverability is poor.

Changes (all inside `NavigationMaker.tsx`, no new route):
- Add a small **mode pill toggle** at the top of the existing left panel: `[ Sitemap | User Flow ]`. Stored in component state + persisted per-project in the existing project JSON (`mode: 'sitemap' | 'flow'`, default `'sitemap'`).
- The toggle filters the existing `stockPages` list:
  - Sitemap mode → hides the `User Flow` category.
  - User Flow mode → shows only the `User Flow` category, plus a small "decision/action/api/success/error" quick-add row.
- Connection rendering: in flow mode, force directional arrow markers on every connection (already implemented via `markerEnd="url(#arrow-end)"`); in sitemap mode keep the current style.
- Canvas hint: in flow mode, replace the empty-state copy with "Drag steps onto the canvas to map a user journey" and pre-populate with a Start node when the canvas is empty and the user clicks "Add first step".
- Same drag, same connect, same canvas — just a filtered palette and a directional rendering bias.

No new tables. The `mode` flag piggybacks on the existing `sitemap_projects.data` JSON column.

## Out of scope
- No new navigation tabs, routes, or pages.
- No changes to auth, payments, admin, or RLS.
- No redesign of the Home/landing route content (immutable per project memory) — only the shared UI primitives it uses (Button, Card, etc.) get polished, which improves it indirectly.

## Files touched
- `src/App.tsx` — default theme to light.
- `src/index.css`, `tailwind.config.ts` — light palette tweak, new utility classes.
- `src/components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `card.tsx`, `dialog.tsx` — polish only.
- `src/components/Hero.tsx`, `src/components/Footer.tsx`, `src/components/GlassSidebar.tsx`, `src/components/platform/MainNavigation.tsx`, `src/components/platform/NewHomepage.tsx`, `src/components/platform/LandingCredibility.tsx` — light-mode contrast + interaction polish.
- `src/pages/NavigationMaker.tsx` — add mode toggle, filter palette, flow-mode empty state, persist `mode` in project data.

## Acceptance checks
- First visit on a clean browser loads in Light mode; toggling to Dark persists across reload.
- All text on the homepage, builder, pricing, contact, and admin pages is fully legible in both themes (no white-on-white, no dark-on-dark).
- Hovering any primary button shows a soft lift + glow; clicking shows a small press.
- Builder shows a Sitemap/User Flow toggle; switching filters the sidebar and the canvas keeps existing nodes.
- No new nav items appear anywhere.
