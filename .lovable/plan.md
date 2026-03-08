

# SEO Audit Report: Critical Gaps and Fixes

## What's Already Done Well
- SEO component with canonical URLs, OG tags, Twitter cards
- Structured data (JSON-LD) on homepage, contact, blog, pillar pages
- robots.txt properly configured
- Sitemap.xml with 70+ URLs
- Breadcrumbs with BreadcrumbList schema
- FAQ, HowTo, Article schemas on content pages
- noIndex on auth page
- Google Search Console verified

---

## Critical SEO Gaps (Not Implemented)

### 1. Sitemap.xml Missing New Pages
The sitemap is missing all recently added pages:
- `/analyzer` -- Website Analyzer
- `/sitemaps` -- Sitemap Library
- All 30 `/sitemap/*` public sitemap pages
- `/blog/category/*` category pages (5 categories)

**Impact**: Google won't discover these pages efficiently.

### 2. No `hreflang` Tags for Regional Pricing
Two pricing pages exist (`/pricing-india`, `/pricing-international`) but zero `hreflang` tags anywhere in the codebase. Google can't determine regional targeting.

**Fix**: Add `hreflang` tags to both pricing pages in the SEO component.

### 3. 404 Page Has No SEO Component
`NotFound.tsx` has no `<SEO>` component, no `noIndex` tag, no proper title. If Google indexes a 404 page, it wastes crawl budget.

**Fix**: Add `<SEO noIndex title="Page Not Found" />` and return proper HTTP-equivalent meta.

### 4. Social Media Links Are Generic Placeholders
Footer links point to `https://twitter.com`, `https://instagram.com`, etc. -- not actual brand profiles. This hurts E-E-A-T signals and looks spammy to Google if crawled.

**Fix**: Either link to real profiles or remove them.

### 5. No `Organization` Schema with `sameAs` on Every Page
The homepage has an Organization schema but `sameAs` is an empty array. This should list real social profiles for knowledge panel eligibility.

### 6. Missing `lastmod` Freshness on Sitemap
All URLs use the same `lastmod: 2026-03-02`. Google devalues sitemaps where every URL has identical dates -- it signals the dates aren't real.

**Fix**: Use distinct, accurate dates per page.

### 7. No Image Alt Text Audit / OG Image Fallbacks
Many pages use the default OG image. Tool landing pages, blog categories, and analyzer pages would benefit from unique OG images per page for better social sharing CTR.

### 8. Changelog, Roadmap, Examples Pages Missing Breadcrumbs
These pages have custom headers but no Breadcrumb component or BreadcrumbList schema, unlike pillar/blog pages.

### 9. No `rel="noopener noreferrer"` + `aria-label` Consistency Check
Footer social links have it, but need to verify all external links across the site follow this pattern.

### 10. Analyzer & Sitemaps Pages Missing from Footer
The footer has no links to `/analyzer` or `/sitemaps`, creating orphaned pages with reduced PageRank flow.

---

## Implementation Plan

### A. Update `sitemap.xml`
Add all missing URLs: `/analyzer`, `/sitemaps`, 30 `/sitemap/*` pages, 5 `/blog/category/*` pages. Use varied `lastmod` dates.

### B. Add `hreflang` to Pricing Pages
Add `hreflang` support to the SEO component and use it on both pricing pages:
- `en-IN` for `/pricing-india`
- `en` (default) for `/pricing-international`

### C. Fix NotFound.tsx
Add `<SEO noIndex title="Page Not Found" />` with HelmetProvider.

### D. Add Breadcrumbs to Changelog, Roadmap, Examples
Import and render the Breadcrumbs component on these 3 pages.

### E. Update Footer with Analyzer & Sitemaps Links
Add "Website Tools" section with Analyzer and Sitemap Library links.

### F. Fix Social Links / Organization Schema
Either update to real social URLs or remove placeholder links. Populate `sameAs` in Organization schema.

### G. Vary Sitemap `lastmod` Dates
Assign realistic, distinct dates to each URL group in sitemap.xml.

---

## Files to Modify
- `public/sitemap.xml` -- add ~40 missing URLs with varied dates
- `src/components/SEO.tsx` -- add optional `hreflang` prop
- `src/pages/NotFound.tsx` -- add SEO component with noIndex
- `src/pages/Changelog.tsx` -- add Breadcrumbs
- `src/pages/Roadmap.tsx` -- add Breadcrumbs
- `src/pages/Examples.tsx` -- add Breadcrumbs
- `src/pages/PricingIndia.tsx` -- add hreflang
- `src/pages/PricingInternational.tsx` -- add hreflang
- `src/components/Footer.tsx` -- add Analyzer/Sitemaps links, fix social URLs
- `src/components/SEO.tsx` (homePageSchema) -- populate sameAs array or remove

