
# Plan: SEO Static HTML Injection for Crawlability

## Overview

This update will inject static, semantic HTML content inside the `<div id="root">` element so search engines and social bots can index EPIC's content before JavaScript executes. The React app will hydrate over this content seamlessly, with no visual changes for users.

## What Will Change

### 1. Update Meta Tags in `<head>`

Replace existing meta tags with the new SEO-optimized versions:

| Current | New |
|---------|-----|
| Title: "EPIC - Design Generator for Non-Designers..." | Title: "EPIC — Generate AI Images Instantly" |
| og:url: epic-ai-generator.lovable.app | og:url: no-edit.lovable.app |
| Canonical: epic-ai-generator.lovable.app | Canonical: no-edit.lovable.app |

Updated meta tags:
- `<title>EPIC — Generate AI Images Instantly</title>`
- New description focusing on "zero-edit AI image generator"
- Updated og:image to `/og.png` (local asset)
- Twitter card meta tags updated to match

### 2. Inject Static HTML Inside `<div id="root">`

Add crawlable content that search bots can index:

```html
<div id="root">
  <main class="seo-fallback">
    <h1>EPIC — Zero-Edit AI Image Generator</h1>
    <p>EPIC lets you generate high-quality AI images instantly...</p>
    <section>
      <h2>Why EPIC?</h2>
      <ul>...</ul>
    </section>
    <section>
      <h2>How It Works</h2>
      <p>...</p>
    </section>
    <section>
      <h2>Pricing</h2>
      <p>...</p>
    </section>
  </main>
</div>
```

### 3. Add CSS to Prevent Flash of Content

Add inline style in `<head>` to hide the static content for JavaScript-enabled browsers:

```html
<style>
  .seo-fallback { display: none; }
</style>
<noscript>
  <style>.seo-fallback { display: block; }</style>
</noscript>
```

This ensures:
- Users with JavaScript see no flash (content is hidden immediately)
- Users without JavaScript (and bots) see the static content
- React replaces the entire content when it mounts

## Technical Details

### File to Modify
- `index.html` — Single file change

### Changes Summary

1. **Lines 13-18**: Update title, description, and canonical URL
2. **Lines 25-31**: Update Open Graph meta tags with new title/description/url/image
3. **Lines 33-40**: Update Twitter card meta tags
4. **Lines 114-117**: Remove duplicate meta tags (cleanup)
5. **Line 121**: Replace empty `<div id="root">` with static HTML content
6. **Add**: Inline CSS in head to hide `.seo-fallback` for JS users

### React Hydration Behavior

Since `src/main.tsx` uses `createRoot().render()`:
```typescript
createRoot(document.getElementById("root")!).render(<App />);
```

React will **completely replace** all content inside `#root` when it mounts. The static HTML is only visible to:
- Search engine crawlers (Googlebot, Bingbot)
- Social preview fetchers (Discord, Twitter, WhatsApp)
- Users with JavaScript disabled (rare edge case)

## What Will NOT Change

- App routing and navigation
- UI appearance and behavior
- Editor functionality
- Authentication flow
- Any React component logic

## Expected Results

| Before | After |
|--------|-------|
| Page source shows empty `<div id="root"></div>` | Page source shows full semantic HTML |
| Bots see no content to index | Bots can index h1, h2, paragraphs, lists |
| Social previews may be incomplete | Full og:title, og:description, og:image |
| Users see normal app | Users see normal app (no change) |
