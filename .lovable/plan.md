

# SEO Expansion Plan: More Traffic Through Content, Schema, and Technical Improvements

## Current State

You already have a solid foundation:
- 20+ blog articles, 8 pillar pages, 5 alternative pages, 18 tool landing pages, 30 public sitemaps
- 130+ URLs in sitemap, breadcrumbs, FAQ/HowTo/Article schema, hreflang on pricing
- Complete footer link mesh with all tools, alternatives, and blog categories

## What's Left to Do (Ranked by Traffic Impact)

### 1. Add 10 New Long-Tail Blog Articles

Target untapped, high-intent keywords with 1200+ word articles. Each includes FAQ schema, pillar links, and related articles.

New articles to add to `src/data/blogPosts.ts`:

| Slug | Target Keyword | Category |
|------|---------------|----------|
| `how-to-plan-a-restaurant-website` | restaurant website planning | Web Planning |
| `ecommerce-website-structure-guide` | ecommerce site architecture | Web Planning |
| `portfolio-website-flow-design` | portfolio website user flow | UX Design |
| `saas-pricing-page-design-tips` | SaaS pricing page best practices | SaaS Design |
| `website-redesign-checklist-2026` | website redesign checklist | Design Tips |
| `information-architecture-for-beginners` | information architecture guide | UX Design |
| `mobile-app-onboarding-ux-patterns` | app onboarding patterns | UX Design |
| `freelancer-portfolio-website-tips` | freelancer portfolio tips | Design Tips |
| `startup-landing-page-examples-2026` | startup landing page examples | SaaS Design |
| `website-footer-design-best-practices` | website footer design guide | Design Tips |

### 2. Add 3 More "Alternative To" Pages

Expand the competitor comparison engine in `src/data/alternativePages.ts`:

| Slug | Target Keyword |
|------|---------------|
| `visme-alternative` | free Visme alternative |
| `crello-alternative` | Crello/VistaCreate alternative |
| `piktochart-alternative` | Piktochart alternative free |

### 3. Add `VideoObject` Schema to Homepage

Google prioritizes pages with video schema. Add a VideoObject JSON-LD to the homepage pointing to a demo/explainer (even a YouTube embed placeholder). This enables video rich results.

### 4. Add `SameAs` and `siteLinksSearchBox` Schema Enhancements

- Add `SiteNavigationElement` schema to the main navigation for sitelinks eligibility
- Enhance Organization schema with `contactPoint` for Knowledge Panel

### 5. Add "Related Tools" Cross-Links on Tool Landing Pages

Each tool landing page (`src/pages/ToolLanding.tsx`) should show 3-4 related tools at the bottom. This creates a dense internal link mesh between tool pages, improving PageRank flow to all 18 tools.

### 6. Add `student-resources` Blog Category to Sitemap

The sitemap has `student-tools` but the Blog page links to `student-resources`. Fix the mismatch in `sitemap.xml`.

### 7. Add Author Schema to Blog Articles

Google values E-E-A-T. Add `author` with `Person` type to the Article schema in `BlogPost.tsx` (name: "EPIC Design Team" or the founder's name).

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/data/blogPosts.ts` | Add 10 new articles (full 1200+ word content each) |
| `src/data/alternativePages.ts` | Add 3 new comparison pages |
| `public/sitemap.xml` | Add 13 new URLs + fix student-resources category slug |
| `src/pages/BlogPost.tsx` | Add author Person schema to Article JSON-LD |
| `src/pages/ToolLanding.tsx` | Add "Related Tools" section at bottom |
| `src/components/Footer.tsx` | Add links to 3 new alternative pages |
| `src/components/SEO.tsx` | Add contactPoint to Organization schema |

## Expected Impact

- 10 new blog articles = 10 new long-tail entry points (each targeting 500-5K monthly search volume keywords)
- 3 new alternative pages = capture comparison-intent traffic for 3 additional competitors
- Related tools cross-links = stronger internal linking, better crawl depth for all 18 tool pages
- Author schema = improved E-E-A-T signals for all blog content
- Category slug fix = proper indexing of student resources category

