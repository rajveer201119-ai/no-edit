import {
  type AiPageType,
  type AiSitemap,
  type AiSitemapPage,
  AI_PAGE_TYPES,
  MAX_DEPTH,
  SIZE_CAPS,
} from "./schema";

export interface RepairResult {
  ok: boolean;
  sitemap?: AiSitemap;
  issues: string[];
  error?: string;
}

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

function normalizeSlug(input: string, isHome: boolean): string {
  if (isHome) return "/";
  const s = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/+/, "")
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s ? `/${s}` : "";
}

function coercePageType(value: unknown): AiPageType {
  if (typeof value === "string" && (AI_PAGE_TYPES as string[]).includes(value)) {
    return value as AiPageType;
  }
  return "content";
}

function truncate(s: unknown, max: number): string {
  const v = typeof s === "string" ? s : "";
  return v.length > max ? v.slice(0, max - 1).trim() + "…" : v;
}

interface FlatPage extends Omit<AiSitemapPage, "children"> {
  depth: number;
}

function flatten(pages: unknown, parentId: string | null, depth: number, out: FlatPage[], issues: string[]) {
  if (!Array.isArray(pages)) return;
  pages.forEach((raw, idx) => {
    if (!raw || typeof raw !== "object") return;
    const p = raw as Record<string, unknown>;
    const name = truncate(p.name, 40).trim();
    if (!name) {
      issues.push("Dropped a page with empty name.");
      return;
    }
    const id = typeof p.id === "string" && p.id.trim() ? p.id.trim() : uid();
    const isHome = parentId === null && idx === 0 && depth === 0;
    const slug = normalizeSlug(typeof p.slug === "string" ? p.slug : name, isHome);
    const pageType = coercePageType(p.pageType);
    const description = truncate(p.description, 140);
    const order = typeof p.order === "number" && Number.isFinite(p.order) ? p.order : idx;

    out.push({
      id,
      name,
      slug,
      pageType,
      description,
      parentId,
      order,
      depth,
    });

    if (Array.isArray(p.children) && depth + 1 < MAX_DEPTH) {
      flatten(p.children, id, depth + 1, out, issues);
    } else if (Array.isArray(p.children) && depth + 1 >= MAX_DEPTH) {
      issues.push(`Flattened children of "${name}" — max depth reached.`);
      // Attach grandchildren to current page's parent level (skip)
      flatten(p.children, id, depth + 1, out, issues); // still record but they'll be at MAX_DEPTH; we'll trim later
    }
  });
}

function dedupeIds(flat: FlatPage[], issues: string[]) {
  const seen = new Map<string, string>(); // oldId -> newId
  const usedIds = new Set<string>();
  flat.forEach((p) => {
    let id = p.id;
    if (usedIds.has(id)) {
      const nid = uid();
      issues.push(`Duplicate id "${id}" → regenerated.`);
      seen.set(p.id, nid);
      id = nid;
    } else {
      seen.set(p.id, id);
    }
    p.id = id;
    usedIds.add(id);
  });
  // Remap parentIds via seen (last write wins — good enough for our use)
  flat.forEach((p) => {
    if (p.parentId && seen.has(p.parentId)) p.parentId = seen.get(p.parentId)!;
  });
}

function dedupeSlugs(flat: FlatPage[]) {
  const used = new Set<string>();
  flat.forEach((p) => {
    let s = p.slug || `/page-${p.id.slice(0, 6)}`;
    if (!used.has(s)) {
      used.add(s);
      p.slug = s;
      return;
    }
    let i = 2;
    while (used.has(`${s}-${i}`)) i++;
    const next = `${s}-${i}`;
    used.add(next);
    p.slug = next;
  });
}

function breakCycles(flat: FlatPage[], issues: string[]) {
  const byId = new Map(flat.map((p) => [p.id, p]));
  flat.forEach((p) => {
    if (!p.parentId) return;
    const visited = new Set<string>([p.id]);
    let cur: FlatPage | undefined = byId.get(p.parentId);
    while (cur) {
      if (visited.has(cur.id)) {
        issues.push(`Broke cycle at "${p.name}".`);
        p.parentId = null;
        break;
      }
      visited.add(cur.id);
      cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
  });
  // Any parentId that doesn't exist → orphan → attach to home
  const ids = new Set(flat.map((p) => p.id));
  flat.forEach((p) => {
    if (p.parentId && !ids.has(p.parentId)) {
      issues.push(`Reattached orphan "${p.name}" to Home.`);
      p.parentId = null;
    }
  });
}

function ensureSingleHome(flat: FlatPage[], projectName: string, issues: string[]): FlatPage[] {
  const roots = flat.filter((p) => !p.parentId);
  if (roots.length === 1 && /^home$/i.test(roots[0].name)) {
    roots[0].slug = "/";
    roots[0].pageType = roots[0].pageType || "landing";
    return flat;
  }
  if (roots.length === 0) {
    issues.push("No root found — created Home.");
    const home: FlatPage = {
      id: uid(),
      name: "Home",
      slug: "/",
      pageType: "landing",
      description: projectName || "Homepage",
      parentId: null,
      order: 0,
      depth: 0,
    };
    flat.forEach((p) => {
      if (!p.parentId) p.parentId = home.id;
    });
    return [home, ...flat];
  }
  // Multiple roots — pick one named Home, else create.
  let home = roots.find((p) => /^home$/i.test(p.name));
  if (!home) {
    issues.push("Multiple roots — inserted Home as canonical root.");
    home = {
      id: uid(),
      name: "Home",
      slug: "/",
      pageType: "landing",
      description: projectName || "Homepage",
      parentId: null,
      order: 0,
      depth: 0,
    };
    flat = [home, ...flat];
  }
  home.slug = "/";
  home.parentId = null;
  flat.forEach((p) => {
    if (p !== home && !p.parentId) {
      p.parentId = home!.id;
      p.depth = Math.max(1, p.depth);
      issues.push(`Reparented "${p.name}" under Home.`);
    }
  });
  return flat;
}

function trimByCap(flat: FlatPage[], cap: number, issues: string[]): FlatPage[] {
  if (flat.length <= cap) return flat;
  const childCountByParent = new Map<string, number>();
  flat.forEach((p) => {
    if (p.parentId) childCountByParent.set(p.parentId, (childCountByParent.get(p.parentId) || 0) + 1);
  });
  // Sort candidates for removal: leaves first, deepest first, keep home always.
  const removable = flat
    .filter((p) => p.parentId !== null && (childCountByParent.get(p.id) || 0) === 0)
    .sort((a, b) => b.depth - a.depth);
  const toRemove = new Set<string>();
  const excess = flat.length - cap;
  for (let i = 0; i < excess && i < removable.length; i++) toRemove.add(removable[i].id);
  if (toRemove.size > 0) issues.push(`Trimmed ${toRemove.size} leaf pages to respect size cap.`);
  return flat.filter((p) => !toRemove.has(p.id));
}

function toTree(flat: FlatPage[]): AiSitemapPage[] {
  const byId = new Map<string, AiSitemapPage>();
  flat.forEach((p) => {
    byId.set(p.id, {
      id: p.id,
      name: p.name,
      slug: p.slug,
      pageType: p.pageType,
      description: p.description,
      parentId: p.parentId,
      order: p.order,
      children: [],
    });
  });
  const roots: AiSitemapPage[] = [];
  byId.forEach((node) => {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortRec = (list: AiSitemapPage[]) => {
    list.sort((a, b) => a.order - b.order);
    list.forEach((n) => n.children && sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

export function validateAndRepair(
  raw: unknown,
  opts: { size?: "small" | "medium" | "large" } = {},
): RepairResult {
  const issues: string[] = [];
  if (!raw || typeof raw !== "object") {
    return { ok: false, issues, error: "Response is not an object." };
  }
  const obj = raw as Record<string, unknown>;
  const projectName = typeof obj.projectName === "string" ? obj.projectName : "Untitled Site";
  const websiteType = typeof obj.websiteType === "string" ? obj.websiteType : "website";
  const description = typeof obj.description === "string" ? obj.description : "";
  const pages = Array.isArray(obj.pages) ? obj.pages : null;
  if (!pages || pages.length === 0) {
    return { ok: false, issues, error: "No pages returned." };
  }

  let flat: FlatPage[] = [];
  flatten(pages, null, 0, flat, issues);
  if (flat.length === 0) {
    return { ok: false, issues, error: "All pages were invalid." };
  }

  dedupeIds(flat, issues);
  breakCycles(flat, issues);
  flat = ensureSingleHome(flat, projectName, issues);

  // Depth trim: drop any node deeper than MAX_DEPTH-1
  const kept = flat.filter((p) => p.depth < MAX_DEPTH);
  if (kept.length !== flat.length) issues.push("Dropped pages beyond max depth.");
  flat = kept;

  const cap = SIZE_CAPS[opts.size || "medium"];
  flat = trimByCap(flat, cap, issues);

  dedupeSlugs(flat);

  const sitemap: AiSitemap = {
    projectName,
    websiteType,
    description,
    pages: toTree(flat),
  };
  return { ok: true, sitemap, issues };
}