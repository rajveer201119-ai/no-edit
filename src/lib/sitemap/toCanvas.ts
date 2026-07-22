import type { AiSitemap, AiSitemapPage, AiPageType } from "./schema";

// Mirror of NavigationMaker's CanvasNode / Connection (kept local to avoid
// a circular import; the page-level file remains the source of truth).
export interface CanvasNodeLite {
  id: string;
  pageId: string;
  label: string;
  x: number;
  y: number;
  color: string;
  pageType?: string;
  slug?: string;
  description?: string;
  tags?: string[];
  colorTag?: string;
  sections?: { id: string; label: string; color: string }[];
  notes?: string;
}

export interface ConnectionLite {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

const PAGE_TYPE_MAP: Record<AiPageType, string> = {
  landing: "Landing",
  marketing: "Marketing",
  content: "Content",
  product: "Product",
  blog: "Blog",
  auth: "Auth",
  dashboard: "Dashboard",
  utility: "Utility",
  legal: "Content",
  support: "Content",
};

// Guess a stockPage-style pageId from the AI page — falls back to type.
function guessPageId(page: AiSitemapPage): string {
  const slug = page.slug.replace(/^\//, "").split("/")[0];
  const known = new Set([
    "home","login","signup","forgot-password","reset-password","profile","settings",
    "notifications","products","product-detail","cart","checkout","order-history",
    "wishlist","payment-success","payment-failed","blog","blog-post","about","contact",
    "faq","terms","privacy","careers","press","testimonials","dashboard","analytics",
    "reports","admin","user-management","database","gallery","video-player","portfolio",
    "editor","upload","camera","music-player","video-library","chat","inbox","call",
    "forum","feedback","search","bookmarks","calendar","map","file-manager","pricing",
    "landing","features","comparison","demo","referral","newsletter","404","500",
    "maintenance","loading","onboarding",
  ]);
  if (known.has(slug)) return slug;
  // Common aliases
  if (slug === "" || page.parentId === null) return "home";
  if (slug.includes("product")) return "products";
  if (slug.includes("blog")) return "blog";
  if (slug.includes("pricing")) return "pricing";
  if (slug.includes("feature")) return "features";
  if (slug.includes("contact")) return "contact";
  return slug || page.pageType;
}

interface LaidOutNode {
  page: AiSitemapPage;
  x: number;
  y: number;
  subtreeWidth: number;
}

const NODE_W = 220;
const H_GAP = 60;
const V_GAP = 180;

function measure(node: AiSitemapPage): number {
  const kids = node.children ?? [];
  if (kids.length === 0) return NODE_W;
  const childrenWidth = kids.reduce((acc, c, i) => acc + measure(c) + (i > 0 ? H_GAP : 0), 0);
  return Math.max(NODE_W, childrenWidth);
}

function layout(node: AiSitemapPage, x: number, y: number, out: LaidOutNode[]) {
  const width = measure(node);
  const centerX = x + width / 2;
  out.push({ page: node, x: centerX - NODE_W / 2, y, subtreeWidth: width });
  const kids = node.children ?? [];
  if (kids.length === 0) return;
  let cursor = x;
  kids.forEach((child, i) => {
    const w = measure(child);
    if (i > 0) cursor += H_GAP;
    layout(child, cursor, y + V_GAP, out);
    cursor += w;
  });
}

export interface CanvasConversion {
  nodes: CanvasNodeLite[];
  connections: ConnectionLite[];
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

export function sitemapToCanvas(sitemap: AiSitemap): CanvasConversion {
  if (sitemap.pages.length === 0) {
    return { nodes: [], connections: [], bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 } };
  }
  const root = sitemap.pages[0];
  const laid: LaidOutNode[] = [];
  layout(root, 0, 0, laid);

  const OFFSET_X = 160;
  const OFFSET_Y = 120;

  const nodes: CanvasNodeLite[] = laid.map(({ page, x, y }) => ({
    id: page.id,
    pageId: guessPageId(page),
    label: page.name,
    x: x + OFFSET_X,
    y: y + OFFSET_Y,
    color: "hsl(var(--foreground))",
    pageType: PAGE_TYPE_MAP[page.pageType] ?? "Content",
    slug: page.slug,
    description: page.description,
    colorTag: "none",
    sections: [],
  }));

  const connections: ConnectionLite[] = [];
  const walk = (p: AiSitemapPage) => {
    (p.children ?? []).forEach((c) => {
      connections.push({
        id: `conn-${p.id}-${c.id}`,
        fromId: p.id,
        toId: c.id,
        label: "",
      });
      walk(c);
    });
  };
  walk(root);

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const bounds = {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs) + NODE_W,
    maxY: Math.max(...ys) + 120,
  };
  return { nodes, connections, bounds };
}