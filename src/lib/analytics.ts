// Lightweight, non-blocking analytics wrapper around the existing gtag install.
// No-ops safely when gtag is absent (dev, blocked scripts, SSR).

export type EpicEvent =
  | "seo_landing_view"
  | "ai_prompt_started"
  | "ai_sitemap_generated"
  | "template_opened"
  | "template_used"
  | "example_opened"
  | "blog_cta_clicked"
  | "signup_started"
  | "signup_completed";

type Params = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: EpicEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  try {
    gtag?.("event", event, params);
  } catch {
    /* analytics must never break the page */
  }
}
