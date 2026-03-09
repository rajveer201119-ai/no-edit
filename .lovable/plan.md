

# SEO Audit: Remaining Improvements

## Issues Found

### 1. Auth page in sitemap should be removed
`/auth` is in `sitemap.xml` with priority 0.4 — auth/login pages should NOT be indexed. It's also not blocked in `robots.txt`. The NotFound page correctly uses `noIndex` but auth does not.

### 2. Missing pages from sitemap
- `/my-projects` — not in sitemap (though it's behind auth, so arguably fine)
- `/shared/:id` — dynamic, can't be in static sitemap (fine)

### 3. No `SiteNavigationElement` schema
Main navigation lacks structured data for Google sitelinks eligibility. Adding this to `index.html` or the homepage helps Google understand your nav structure.

### 4. Tool landing pages lack Breadcrumb schema
Tool pages have no `BreadcrumbList` JSON-LD. Blog, Pillar, and Alternative pages use the `<Breadcrumbs>` component which adds schema, but `ToolLanding.tsx` doesn't use it at all.

### 5. No `VideoObject` schema on homepage
This was in the previous plan but not implemented. Video schema enables video rich results in SERPs.

### 6. `lastmod` dates are all identical
Every URL in `sitemap.xml` uses `2026-03-08`. Google devalues lastmod when every page has the same date. At minimum, differentiate dates (newer content = today's date, older = staggered).

### 7. Missing `og:image` dimensions
Open Graph images lack `og:image:width` and `og:image:height` meta tags. Facebook/LinkedIn render previews faster when dimensions are specified.

### 8. No `lang` attribute in SEO component
The `<html lang="en">` is set in `index.html` but Helmet doesn't reinforce it on route changes for SPA crawlers.

## Plan

### Files to modify:

| File | Change |
|------|--------|
| `public/sitemap.xml` | Remove `/auth`, stagger `lastmod` dates across pages |
| `public/robots.txt` | Add `Disallow: /auth` and `Disallow: /my-projects` |
| `src/pages/ToolLanding.tsx` | Add `<Breadcrumbs>` component with schema |
| `src/components/SEO.tsx` | Add `og:image:width`/`og:image:height` meta tags |
| `index.html` | Add `SiteNavigationElement` schema in head |
| `src/pages/Auth.tsx` | Add `noIndex: true` to SEO component |

### Implementation details:

1. **Remove auth from sitemap** — delete the `/auth` line from `sitemap.xml`
2. **robots.txt** — add `Disallow: /auth` and `Disallow: /my-projects` under `User-agent: *`
3. **Stagger lastmod** — use `2026-03-09` for homepage/blog/tools, `2026-03-07` for older static pages, `2026-03-05` for public sitemaps
4. **Tool breadcrumbs** — add `<Breadcrumbs items={[{ label: "Tools" }, { label: page.title }]} />` to ToolLanding
5. **OG image dimensions** — add `<meta property="og:image:width" content="1200" />` and `height="630"` in SEO component
6. **SiteNavigationElement** — add JSON-LD in `index.html` listing main nav items (Home, Tools, Blog, Alternatives, Pricing)
7. **Auth noIndex** — pass `noIndex={true}` to `<SEO>` in Auth.tsx

