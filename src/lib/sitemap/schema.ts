// Shape of the JSON returned by the AI (post-repair).
export type AiPageType =
  | "landing"
  | "marketing"
  | "content"
  | "product"
  | "blog"
  | "auth"
  | "dashboard"
  | "utility"
  | "legal"
  | "support";

export interface AiSitemapPage {
  id: string;
  name: string;
  slug: string;
  pageType: AiPageType;
  description: string;
  parentId: string | null;
  order: number;
  children?: AiSitemapPage[];
}

export interface AiSitemap {
  projectName: string;
  websiteType: string;
  description: string;
  pages: AiSitemapPage[];
}

export const AI_PAGE_TYPES: AiPageType[] = [
  "landing",
  "marketing",
  "content",
  "product",
  "blog",
  "auth",
  "dashboard",
  "utility",
  "legal",
  "support",
];

export const MAX_DEPTH = 4;

export const SIZE_CAPS: Record<"small" | "medium" | "large", number> = {
  small: 12,
  medium: 25,
  large: 50,
};