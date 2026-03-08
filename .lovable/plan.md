

# EPIC Platform — Full-Stack Audit Report

## Goal: 10K Daily Traffic, Best UX, All Functions Working

---

## A. SEO & Traffic Growth (Highest Impact for 10K Target)

### Critical Issues

1. **No server-side rendering / prerendering** — The entire site is a client-side React SPA. Googlebot can render JS, but most social crawlers (Facebook, Twitter, LinkedIn, WhatsApp) see an empty HTML shell. Shared links show generic metadata. This kills social virality, which is essential for 10K traffic.
   - **Fix**: Add a prerendering service (e.g., Prerender.io or a Cloudflare Worker) that serves static HTML to bots. This is the single highest-impact SEO improvement.

2. **Only ~20 blog articles** — To hit 10K daily, you need 100-200+ long-tail content pages. Current 20 articles are not enough to capture diverse search queries.
   - **Fix**: Add 30-50 more blog articles targeting long-tail keywords (e.g., "how to plan a restaurant website structure", "SaaS onboarding flow examples 2026", "website architecture for e-commerce").

3. **No blog pagination or category index pages** — All blogs render on a single `/blog` page. Google prefers paginated, category-specific index pages for crawl efficiency.
   - **Fix**: Add proper `/blog/page/2`, `/blog/page/3` pagination and ensure category pages (`/blog/category/*`) have unique meta descriptions.

4. **Missing Open Graph images per page** — Most pages fall back to a single default OG image. Each tool, blog post, and pillar page should have a unique social preview image.
   - **Fix**: Generate or assign unique OG images for top 20 pages.

5. **No Google Search Console verification meta tag** — No evidence of GSC integration in `index.html`.
   - **Fix**: Add verification meta tag and submit sitemap.

### Improvements

6. **Add BreadcrumbList JSON-LD** to all pages using the Breadcrumbs component — enables rich snippets in search results.

7. **Internal linking is weak in blog content** — Blog posts reference `relatedArticles` by slug but these are just strings, not rendered links. Users and crawlers can't follow them.
   - **Fix**: Render related articles as clickable links at the bottom of each blog post.

8. **Add `<meta name="author">` and article publish dates** visibly on blog posts for E-E-A-T signals.

---

## B. UX & Frontend Issues

### Critical

9. **Homepage is 600 lines and does everything** — `Index.tsx` (646 lines) manages auth, navigation, canvas state, export, history, and modals. This makes it fragile and hard to maintain.
   - **Fix**: Extract workspace logic into a dedicated `/create` route/page.

10. **No loading states on initial page load** — The homepage loads a heavy WebGL shader, 5 partner logos, framer-motion animations, and Three.js. First Contentful Paint is likely slow.
    - **Fix**: Lazy-load the WebGL shader and below-fold sections. Add a skeleton loader for the hero.

11. **No 404 handling for invalid blog slugs** — Visiting `/blog/nonexistent-slug` likely renders a broken page instead of a proper 404.
    - **Fix**: Add slug validation in `BlogPost.tsx` and redirect to NotFound.

12. **No error boundaries** — If the canvas workspace crashes, the entire app goes white.
    - **Fix**: Add React Error Boundaries around the workspace and key sections.

13. **Mobile workspace UX** — The create workspace uses `pt-[10.5rem]` top offset and a fixed left toolbar that may overlap on smaller screens. The toolbar should scroll or collapse.

### Improvements

14. **No skeleton/loading states on Library tab** — Templates load from a static file, but design history loads from localStorage which can be slow with 20 items containing base64 thumbnails.

15. **No search on the blog page** — Users can't search articles. Add a simple client-side search filter.

16. **Footer is extremely long** (120+ lines, 5 columns, 40+ links) — On mobile this creates an overwhelming scroll. Consider collapsible sections.

17. **No "Back to Top" button** on long pages (blog posts, pillar pages).

18. **No keyboard navigation indicators** — Focus styles are missing on many interactive elements.

---

## C. Backend & Auth Issues

### Critical

19. **No password reset flow** — The Auth page has sign-in and sign-up but no "Forgot Password" link or `/reset-password` page. Users who forget their password are locked out.
    - **Fix**: Add forgot password button and create `/reset-password` route.

20. **Export credits use `check_generation_limit` which has different limits than documented** — The DB function gives free users 2 generates/day, but the homepage says "3 exports per day". Inconsistency.
    - **Fix**: Align the DB function limit with the UI copy, or vice versa.

21. **No email verification enforcement** — After signup, users get a "check your email" toast but can immediately use the app without verifying. Consider gating premium features behind verified email.

22. **Design history stored only in localStorage** — Users lose all their work if they clear browser data or switch devices. No cloud sync.
    - **Fix**: For authenticated users, save design history to Supabase (a `design_history` table).

### Improvements

23. **No rate limiting on the auth form** — Users can spam the sign-in button. Add a client-side debounce and rely on Supabase's built-in rate limiting.

24. **Admin page has no server-side route protection** — It checks admin role client-side. While RLS protects data, the admin UI itself is accessible to anyone at `/admin`.
    - **Fix**: Show a redirect or blank page immediately if not admin, before rendering the admin UI.

---

## D. Performance

25. **Large bundle size risk** — Three.js (`three` package) is imported for the WebGL shader on the homepage. This adds ~500KB to the bundle even if users never see the homepage animation.
    - **Fix**: Dynamic import Three.js only when the homepage renders.

26. **No image optimization** — Partner logos and the EPIC logo are served as raw PNG imports without size optimization or WebP conversion.
    - **Fix**: Convert to WebP, add explicit `width`/`height` attributes to prevent CLS.

27. **Service worker caches everything up to 5MB** — This is aggressive. Consider more selective caching for better mobile performance.

---

## E. Functional Gaps (Features That Would Drive Traffic)

28. **No social sharing buttons on blog posts** — Users can't easily share articles to Twitter/LinkedIn/WhatsApp. This is free traffic.

29. **No newsletter/email capture** — There's no way to collect emails for re-engagement. A simple email signup in the footer or blog sidebar would help retain visitors.

30. **No user-generated public sitemaps feed** — The sitemap library has 30 seed entries but no way for users to discover recently published community sitemaps. A "Recently Published" section would add fresh content for crawlers.

31. **Examples page is static** — The 6 examples are hardcoded cards with no actual visual previews or interactive demos. They don't link to real navigation maker presets.
    - **Fix**: Create actual pre-built navigation flows for each example that users can open in the Navigation Maker.

32. **No analytics/tracking** — No Google Analytics, Plausible, or similar. You can't optimize for 10K traffic without knowing current numbers.

---

## Priority Roadmap (Ordered by Traffic Impact)

| Priority | Task | Impact |
|----------|------|--------|
| P0 | Add prerendering for social crawlers | Unlocks social sharing traffic |
| P0 | Add password reset flow | Users locked out = churn |
| P0 | Add 30+ more blog articles | Long-tail organic traffic |
| P1 | Add analytics (Plausible/GA4) | Measure & optimize |
| P1 | Add social sharing buttons to blogs | Free viral distribution |
| P1 | Add email capture / newsletter | Retain visitors |
| P1 | Fix export limit inconsistency (2 vs 3) | Trust & clarity |
| P1 | Lazy-load Three.js / WebGL shader | Page speed = ranking factor |
| P2 | Add error boundaries | Prevent white screens |
| P2 | Blog search & pagination | Better content discovery |
| P2 | Related articles as clickable links | Internal linking for SEO |
| P2 | Cloud-sync design history | User retention |
| P3 | Interactive examples with presets | Engagement & time on site |
| P3 | Mobile footer collapsible sections | Mobile UX |
| P3 | BreadcrumbList JSON-LD on all pages | Rich snippets |

---

This audit covers 32 findings across SEO, UX, backend, performance, and feature gaps. The top 3 actions for reaching 10K daily traffic are: **(1) prerendering for social/bot crawlers**, **(2) scaling content to 50+ blog articles**, and **(3) adding analytics to measure and iterate**.

