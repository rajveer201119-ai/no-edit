// Single source of truth for the canonical production host.
// Every canonical URL, og:url, JSON-LD @id and sitemap entry must derive from this.
export const SITE_URL = "https://epic-builder.vercel.app";

export const SITE_NAME = "EPIC";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
