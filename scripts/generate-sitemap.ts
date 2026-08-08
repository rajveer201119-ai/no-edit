/**
 * Generates public/sitemap.xml from the app's real routes and content data.
 * Runs automatically before `vite dev` and `vite build` (predev / prebuild).
 *
 * lastmod policy: only emitted where the content itself carries an authoritative,
 * page-specific date (blog publish/update dates, template update dates). Routes
 * without such a date deliberately omit <lastmod> rather than using build time.
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL } from "../src/lib/site";
import { pillarPages } from "../src/data/pillarPages";
import { blogPosts } from "../src/data/blogPosts";
import { alternativePages } from "../src/data/alternativePages";
import { sitemapTemplates } from "../src/data/sitemapTemplates";
import { seedSitemaps } from "../src/data/seedSitemaps";
import { comparisonPages } from "../src/data/comparisonPages";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/navigation-maker", changefreq: "weekly", priority: "0.9" },
  { path: "/sitemap-templates", changefreq: "weekly", priority: "0.9" },
  { path: "/sitemaps", changefreq: "weekly", priority: "0.8" },
  { path: "/analyzer", changefreq: "weekly", priority: "0.8" },
  { path: "/examples", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/pricing-india", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing-international", changefreq: "monthly", priority: "0.7" },
  { path: "/changelog", changefreq: "weekly", priority: "0.5" },
  { path: "/roadmap", changefreq: "monthly", priority: "0.5" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

const toolSlugs = [
  "website-navigation-maker", "poster-maker", "logo-maker", "resume-builder",
  "youtube-thumbnail-maker", "instagram-post-maker", "certificate-maker", "flyer-maker",
  "business-card-maker", "presentation-maker", "invitation-maker", "banner-maker",
  "meme-maker", "infographic-maker", "menu-maker", "brochure-maker",
  "album-cover-maker", "ebook-cover-maker",
];

// Only the category slugs the /blog/category/:category route actually renders.
const blogCategorySlugs = [
  "ux-design", "web-planning", "saas-design", "design-tips", "web-development",
  "ui-design", "seo", "product-design", "marketing", "app-design",
  "entrepreneurship", "student-resources",
];
const categorySlug = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const blogCategories = [...new Set(Object.values(blogPosts).map((p) => categorySlug(p.category)))]
  .filter((slug) => blogCategorySlugs.includes(slug));

const entries: SitemapEntry[] = [
  ...staticEntries,
  ...toolSlugs.map((s) => ({ path: `/tools/${s}`, changefreq: "monthly" as const, priority: "0.7" })),
  ...Object.keys(pillarPages).map((s) => ({ path: `/${s}`, changefreq: "weekly" as const, priority: "0.8" })),
  ...Object.values(sitemapTemplates).map((t) => ({
    path: `/sitemap-templates/${t.slug}`,
    lastmod: t.updated,
    changefreq: "monthly" as const,
    priority: "0.8",
  })),
  ...Object.values(blogPosts).map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.lastModified || p.publishDate,
    changefreq: "monthly" as const,
    priority: "0.6",
  })),
  ...blogCategories.map((c) => ({ path: `/blog/category/${c}`, changefreq: "weekly" as const, priority: "0.5" })),
  ...Object.keys(alternativePages).map((s) => ({ path: `/alternatives/${s}`, changefreq: "monthly" as const, priority: "0.6" })),
  ...Object.values(comparisonPages).map((c) => ({
    path: `/compare/${c.slug}`,
    lastmod: c.checkedDate,
    changefreq: "monthly" as const,
    priority: "0.6",
  })),
  ...seedSitemaps.map((s) => ({ path: `/sitemap/${s.slug}`, changefreq: "monthly" as const, priority: "0.5" })),
];

const xmlEscape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const urls = entries.map((e) =>
  [
    "  <url>",
    `    <loc>${xmlEscape(SITE_URL + e.path)}</loc>`,
    e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    "  </url>",
  ].filter(Boolean).join("\n"),
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
