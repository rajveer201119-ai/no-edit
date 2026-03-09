

# Final Improvements: Performance, Accessibility & SEO Polish

After auditing the full codebase, here are the remaining improvements across three areas:

---

## 1. Performance: Route-Level Code Splitting

**Problem:** All 20+ page components are eagerly imported in `App.tsx`. This means the entire app (NavigationMaker alone is 1800 lines) loads upfront, hurting First Contentful Paint.

**Fix:** Use `React.lazy()` + `Suspense` for all routes except `Index`. This splits each page into its own JS chunk, loaded on demand.

**File:** `src/App.tsx`
- Convert all page imports (except Index) to `React.lazy(() => import(...))`
- Wrap `<Routes>` in `<Suspense fallback={<LoadingSpinner />}>`
- Add a simple loading spinner component inline

---

## 2. Accessibility Improvements

**Problem:** Most pages lack proper `aria-label` on nav elements, `<main>` landmark tags, and skip-to-content links. Only 3 pages use `aria-label` at all.

**Fix across key pages:**
- **`Index.tsx`**: Wrap content in `<main>` tag
- **`BlogPost.tsx`**, **`PillarPage.tsx`**, **`AlternativePage.tsx`**, **`ToolLanding.tsx`**: Add `<main>` wrapper, ensure `<article>` tag on content body
- **`App.tsx`**: Add a global "Skip to main content" link at the top of the app (hidden until focused)

---

## 3. SEO: Missing Meta on Dynamic Pages

**Problem:** `SitemapLibrary.tsx` and `PublicSitemap.tsx` have manual breadcrumbs but don't use the `<Breadcrumbs>` component (missing JSON-LD schema). Also, `Blog.tsx` category page lacks `<Breadcrumbs>`.

**Fix:**
- **`SitemapLibrary.tsx`**: Replace manual breadcrumb nav with `<Breadcrumbs>` component
- **`PublicSitemap.tsx`**: Same — replace with `<Breadcrumbs>` component
- **`BlogCategory.tsx`**: Add `<Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: categoryName }]} />`

---

## 4. Open Graph: Missing `og:image` Dimensions in `index.html`

**Problem:** The static `index.html` OG image tag (line 31) lacks width/height attributes. The SEO component adds them dynamically, but crawlers that only read the static HTML (like Facebook's crawler) won't see dimensions.

**Fix:** Add `og:image:width` and `og:image:height` meta tags after line 31 in `index.html`.

---

## 5. Performance: Image Optimization

**Problem:** Several imported images (`epic-logo.png`, `logo-chatgpt.png`, etc.) are PNG files with no `loading="lazy"` or `width`/`height` attributes, causing layout shift and blocking load.

**Fix:** Add `loading="lazy"`, `width`, `height`, and `decoding="async"` attributes to all `<img>` tags across pages that use imported assets.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Lazy imports, Suspense wrapper, skip-to-content link |
| `src/pages/Index.tsx` | Add `<main>` landmark |
| `src/pages/BlogPost.tsx` | Add `<main>` + `<article>` wrappers |
| `src/pages/PillarPage.tsx` | Add `<main>` + `<article>` wrappers |
| `src/pages/AlternativePage.tsx` | Add `<main>` + `<article>` wrappers |
| `src/pages/ToolLanding.tsx` | Add `<main>` wrapper |
| `src/pages/SitemapLibrary.tsx` | Replace manual breadcrumbs with `<Breadcrumbs>` component |
| `src/pages/PublicSitemap.tsx` | Replace manual breadcrumbs with `<Breadcrumbs>` component |
| `src/pages/BlogCategory.tsx` | Add `<Breadcrumbs>` component |
| `index.html` | Add `og:image:width` and `og:image:height` |

## Implementation Order

1. Route-level code splitting (biggest performance win)
2. Accessibility landmarks and skip link
3. Breadcrumb schema on remaining pages
4. OG image dimensions in index.html
5. Image lazy loading attributes

