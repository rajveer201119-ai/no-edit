
# EPIC — Full App Audit & Fix Plan

A prioritized list of issues found across UI/UX, SEO (India focus), structure, performance, accessibility, and feature gaps — and what to fix in each. Items are grouped P0 (blockers / quick wins) → P2 (polish).

---

## 1. SEO — India Targeting & Discoverability

### P0 — Critical SEO fixes

1. **Wrong canonical domain** — `index.html`, `SEO.tsx`, `sitemap.xml` all hard-code `https://no-edit.lovable.app`. Every canonical, OG URL, sitemap loc and structured-data `@id` should point to your real production domain. Even if you stay on `no-edit.lovable.app` for now, this needs to be a single env-driven constant so we can flip it once.
2. **`robots.txt` missing host + crawl hints** — add `Host:`, explicit `Disallow:` for `/admin`, `/auth`, `/reset-password`, `/my-projects`, `/shared/*`, and reference any future split sitemaps.
3. **Duplicate meta tags** — `index.html` has both an early `<title>` and later `og:title` overriding the React Helmet output. We need `index.html` to ship the *default* India-flavored meta and let `<SEO>` override per route. Right now Helmet often loses to the static tag during initial crawl.
4. **Geo signals incomplete for India** — currently only `geo.region=IN`. Add `geo.placename=India`, `og:locale=en_IN` as default (it's en_US in `index.html`), and `<html lang="en-IN">` on the homepage variant. Pricing should advertise INR in structured data on `/pricing-india` (currently only on Product schema).
5. **Sitemap drift** — `sitemap.xml` lists routes (`/website-flow-generator`, `/sitemap/notion-so`, etc.) that must each render real, indexable content. Audit which are 404s today and either build them or remove from sitemap.
6. **Missing image sitemap & no `image:` entries** — for a design tool, image search is a major India traffic source. Add `<image:image>` blocks to template/tool pages.

### P0 — India-specific growth SEO

7. **India landing pages** — create programmatic, indexable pages for high-intent India queries:
   - `/sitemap-builder-india`, `/free-sitemap-tool-india`
   - `/website-planner-for-students-india`
   - `/canva-alternative-india`, `/figma-alternative-india` (variants of existing alt pages with INR pricing, UPI, India testimonials)
   - City-level: `/sitemap-tool-bangalore`, `/...-mumbai`, `/...-delhi`, `/...-hyderabad`, `/...-pune` (lightweight templates, unique copy per city — no doorway-page boilerplate).
8. **Rupee + UPI in copy and schema** — add INR price snippets, "Pay with UPI / GPay / PhonePe / Paytm" badges in hero and pricing for Indian visitors (geo-detected client-side fallback to `/pricing-india`).
9. **Hindi/Hinglish surface** — add a single Hindi meta description variant + `hreflang="hi-IN"` for the home and pricing-india pages (translated headings only, not full translation yet).
10. **Local backlink hooks** — add JSON-LD `Organization.address` with an Indian `addressCountry: IN`, plus `sameAs` links to Indian discovery surfaces (Product Hunt India, IndieHackers India, LinkedIn India page).
11. **Auto-redirect to `/pricing-india`** when `Intl.DateTimeFormat().resolvedOptions().timeZone` starts with `Asia/Kolkata` — but keep both URLs crawlable for SEO.

### P1 — Structured data improvements

12. **HowTo schema** for "How to plan a website" article and the sitemap-builder onboarding.
13. **VideoObject schema** if there's a hero/demo video.
14. **Product schema** on each `/tools/*` page (currently just generic).
15. **Review/Aggregate ratings** — only render if you actually have reviews; current "4.8 / 280" is unverified and a Google policy risk. Either gate behind real review data or remove.

---

## 2. UI / UX Issues

### P0 — Visible problems

1. **Hero readability** — large white text on the WebGL shader background loses contrast in light mode and on smaller phones. Add a stronger gradient scrim and an `outline` or text-shadow at `< 768px`.
2. **Mobile tap targets** — Hero badges and footer links are below the 44px iOS guideline; padding needs `py-2.5` minimum and a wider hit zone on inline links.
3. **No skeleton states** — `Suspense` fallback is a single spinner for the *entire* app. Add per-section skeletons for `Feed`, `SitemapLibrary`, `Blog`, and the `NavigationMaker` canvas so navigation feels instant.
4. **Theme toggle inconsistency** — `defaultTheme="light"` with `enableSystem={false}` ignores user OS preference. Switch to `enableSystem` with `light` as fallback, and persist via `localStorage`.
5. **NavigationMaker mobile** — empty-state overlay can sit behind the floating toolbar on 360px viewports. Use `safe-area-inset-bottom` and `z-index` audit.
6. **Sheet/Dialog focus traps** — verify `aria-describedby` links to a `SheetDescription` everywhere (a few callsites still warn in console).
7. **Loading flash on auth-gated routes** — `RequireAuth` shows the login screen briefly before redirect. Add an `isLoading` guard.
8. **Footer is content-heavy on mobile** — collapse into accordion sections under `md`.

### P1 — UX flow

9. **First-run guidance** — `OnboardingOverlay` is bypassable but doesn't return on demand. Add a "?" help button bottom-right that re-opens it.
10. **Empty states** in `MyProjects`, `SitemapLibrary`, `Examples` need illustrations + a single primary CTA (currently text-only).
11. **Keyboard shortcuts cheatsheet** — `useKeyboardShortcuts` exists, but no `?` modal exposes them.
12. **Toast deduplication** — multiple identical errors stack; throttle by message id.
13. **Image editor** — undo/redo states should be visible on a fixed mini-toolbar at top of canvas, not buried.

### P1 — Visual polish

14. **Inconsistent radius scale** — buttons `rounded-2xl`, cards `rounded-2xl`, inputs sometimes `rounded-md`. Standardize on `--radius` token.
15. **Shadow tokens** — define `--shadow-soft`, `--shadow-elevated`, `--shadow-glow` in `index.css` and replace all inline `shadow-[...]` strings.
16. **Icon weight inconsistency** — mix of `lucide` default 2px + 1.5px strokes. Pick one and pass `strokeWidth` globally.

---

## 3. Structural / Architecture

1. **`Index.tsx` not lazy-loaded** — every other route is, but the home bundle is loaded eagerly. Confirm this is intentional for LCP; if not, code-split below the fold.
2. **`PillarPage` catch-all at `/:slug`** swallows typos — any unknown URL renders pillar UI then likely a "not found" inside it instead of going to `NotFound`. Whitelist known slugs from `pillarPages.ts` or render `<NotFound />` when slug is unknown.
3. **No `/sitemap` index in the actual XML chain** — split into `sitemap-tools.xml`, `sitemap-blog.xml`, `sitemap-pillars.xml`, `sitemap-public-sitemaps.xml` and reference from a `sitemap-index.xml`. Easier to manage and faster for Google.
4. **Duplicate pricing logic** — `PricingIndia` and `PricingInternational` reimplement the same UI. Extract a `<PricingTable currency="INR|USD" />` component.
5. **Editor folder duplication** — both `src/components/editor/*` and `src/components/platform/editor/*` exist. Consolidate; right now changes to one don't propagate.
6. **`templates.ts` monolith** — split by category (poster, logo, social, etc.) for tree-shaking.
7. **Type safety** — `src/integrations/supabase/types.ts` is auto-generated; ensure it's regenerated after every migration (CI check).

---

## 4. Performance

1. **WebGL shader on hero** runs even when the tab is backgrounded → battery + INP cost on mobile. Pause via `IntersectionObserver` + `document.visibilityState`.
2. **Logo preload** is a 256px PNG; ship a 128/96 webp variant for mobile and use `<picture>`.
3. **Two preloads + dns-prefetch** to `storage.googleapis.com` — verify the favicon doesn't block render; consider self-hosting it from `/public`.
4. **Fonts** — Google Fonts preconnected but no actual `<link rel="preload">` for the WOFF2 file; first text paint shifts.
5. **React Query** has no `staleTime` defaults — every navigation refetches. Set sensible defaults (5 min).
6. **Bundle audit** — run `vite build --mode=analyze`; suspect heavy dependencies in `web-gl-shader`, image editor (fabric/canvas), and `recharts` if unused.
7. **Image LCP** — convert hero PNGs to AVIF + webp fallback.

---

## 5. Accessibility

1. **Color contrast** — primary indigo on white meets AA, but accent variants used in muted text often fall below 4.5:1. Audit with axe.
2. **Focus visible** — buttons/cards have `hover:` states but no `focus-visible:` ring on several custom components. Add a consistent ring token.
3. **Form labels** — several `Input`/`Textarea` instances rely on placeholders only. Pair every input with a `<Label>` (visually hidden if needed).
4. **Landmark roles** — wrap each page's main section in `<main id="main-content">`; the skip link points to it but several pages don't render it.
5. **Alt text** — generated/template images frequently get empty `alt`. Default to template name.
6. **Reduced motion** — respect `prefers-reduced-motion` for the floating-shape and shader animations added recently.

---

## 6. Security & Reliability

1. **Admin route only RequireAuth** — needs role check (admin) on the client + RLS on the server. Verify `has_role()` is invoked in every admin query.
2. **Public sitemap pages** scrape via Firecrawl — rate limit per IP in the edge function.
3. **Error boundary** is single, top-level. Add per-route boundaries so a broken pillar page doesn't blank the whole app.
4. **PWA install prompt** — currently always mounted; defer until `load` to free LCP.
5. **GA tag** loads before consent — add a minimal cookie-consent banner (required for India DPDP Act and EU users).

---

## 7. New Features Worth Adding

Ranked by India-traffic + retention impact:

1. **AI Sitemap Generator (text → sitemap)** — paste a one-line idea ("food delivery app for Mumbai colleges") → returns a starter sitemap. Major SEO + viral hook for India.
2. **UPI one-tap payments** — already partially built; finish the flow with QR + deep links (GPay/PhonePe/Paytm intents).
3. **Sitemap → Code export** — JSON, plus React Router config snippet, Next.js `app/` scaffold, and Lovable prompt. Highly shareable.
4. **Public profile / portfolio pages** — `/u/<handle>` listing their published sitemaps; great for backlinks.
5. **"Submit your startup's sitemap"** community wall — UGC SEO juice + India founder community angle.
6. **Hindi UI toggle** for hero, CTAs, and pricing-india.
7. **Comparison table generator** — "EPIC vs FlowMapp", "EPIC vs Octopus" auto-generated pages from a config.
8. **Browser extension** — "Capture sitemap of any website" → hooks back to the app.
9. **WhatsApp share button** on every export — huge for India distribution.
10. **Email + push notifications** for project comments, exports ready, plan limits — currently no retention loop.

---

## Suggested Execution Order

1. **Sprint 1 (SEO + India, 1–2 days):** items 1.1–1.11, plus 7.6 and 7.9.
2. **Sprint 2 (UX + a11y polish):** items 2.1–2.8, 5.1–5.6.
3. **Sprint 3 (Performance + Structural):** items 3.1–3.7, 4.1–4.7.
4. **Sprint 4 (Features):** items 7.1, 7.3, 7.7, 7.10.

---

## Clarifying questions before I start building

- Do you want me to keep `no-edit.lovable.app` as the canonical domain, or are you moving to a custom domain soon? (Affects every SEO fix.)
- Any India-specific brand assets (Hindi tagline, INR pricing photo, founder testimonials) you want me to incorporate now, or should I use placeholders?
- Should the AI Sitemap Generator and other new features go behind the existing Pro paywall or stay free for India users to drive adoption?
