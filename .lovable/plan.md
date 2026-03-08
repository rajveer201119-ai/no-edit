

# Advanced Features Plan: Sitemap Editor + SEO

## 1. Sitemap Editor — Advanced Features

### A. Auto-Layout / Smart Arrange
Add a one-click "Auto Layout" button to the toolbar that automatically arranges nodes in a tree hierarchy (top-down or left-right). Uses BFS from the Home node to determine levels, then spaces nodes evenly. Solves the pain of manually positioning 20+ nodes.

### B. Duplicate Node
Add a "Duplicate" action to both the desktop sidebar and mobile bottom sheet. Duplicates the selected node with all its sections, metadata, and tags — placed offset by 20px.

### C. Multi-Select & Bulk Delete
Hold Shift+Click (desktop) or long-press (mobile) to select multiple nodes. Show a floating action bar with "Delete Selected" and "Connect All" options.

### D. Page Notes / Annotations
Add a "Notes" textarea to each node (visible in sidebar/sheet). Useful for developers and designers to leave implementation notes per page. Exported in JSON.

### E. Connection Labels on Canvas
Show connection labels directly on the Bezier curves on the canvas (not just in metadata). Small pill badges at the midpoint of each connection.

### F. Zoom Controls
Add +/- zoom buttons and pinch-to-zoom support. Use CSS `transform: scale()` on the canvas container with a zoom state variable.

## 2. SEO — Advanced Features

### A. Related Tools Cross-Links (Smarter)
The current "Explore More Tools" section shows ALL tools. Make it smarter: define a `relatedTools` map per tool page showing only 4 most relevant tools instead of all 17.

### B. Breadcrumb Schema on All Pages
Add `BreadcrumbList` JSON-LD schema to Blog, Pillar, Alternative, and Tool pages. Currently only visual breadcrumbs exist — add the structured data equivalent.

### C. Internal Link Widget on Blog Posts
Add a "Related Articles" section at the bottom of each blog post showing 3 related articles from the same category. Improves dwell time and internal linking.

### D. FAQ Schema on Alternative Pages
Add FAQ JSON-LD to the alternative comparison pages (they already have FAQ content but no schema markup).

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/NavigationMaker.tsx` | Auto-layout, duplicate node, multi-select, page notes, connection labels on canvas, zoom controls |
| `src/pages/ToolLanding.tsx` | Smart related tools (4 per page instead of all) |
| `src/pages/BlogPost.tsx` | Related articles section |
| `src/pages/AlternativePage.tsx` | FAQ JSON-LD schema |
| `src/components/UXScorePanel.tsx` | Score annotations for new features |

## Implementation Order

1. Sitemap Editor: Auto-layout + Zoom controls (biggest UX impact)
2. Sitemap Editor: Duplicate node + Page notes
3. Sitemap Editor: Connection labels on canvas + Multi-select
4. SEO: Smart related tools + Related articles on blog
5. SEO: FAQ schema on alternatives + Breadcrumb schema

