import { supabase } from "@/integrations/supabase/client";
import { validateAndRepair } from "./validateAndRepair";
import type { AiSitemap } from "./schema";

export interface GenerateInput {
  description: string;
  websiteType?: string;
  audience?: string;
  size?: "small" | "medium" | "large";
  includeUtility?: boolean;
  includeSeoLanding?: boolean;
  language?: string;
}

export interface GenerateResult {
  ok: boolean;
  sitemap?: AiSitemap;
  issues?: string[];
  message?: string;
}

const MAX_ATTEMPTS = 3;

async function callFunction(input: GenerateInput, signal?: AbortSignal): Promise<{ sitemap?: unknown; error?: string; status?: number }> {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
    const anon = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
    const url = projectId
      ? `https://${projectId}.supabase.co/functions/v1/generate-sitemap`
      : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(anon ? { Authorization: `Bearer ${anon}`, apikey: anon } : {}),
      },
      body: JSON.stringify(input),
      signal,
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) return { error: data?.error || "Request failed", status: resp.status };
    return { sitemap: data?.sitemap };
  } catch (e: unknown) {
    if ((e as { name?: string })?.name === "AbortError") throw e;
    return { error: "Network error. Check your connection and try again." };
  }
}

export async function generateSitemap(
  input: GenerateInput,
  opts: { signal?: AbortSignal } = {},
): Promise<GenerateResult> {
  let lastMessage = "We couldn't generate a valid sitemap this time. Please try again.";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { sitemap, error, status } = await callFunction(input, opts.signal);
    if (error) {
      lastMessage = error;
      // Do not retry client-side validation / billing errors.
      if (status === 400 || status === 402) return { ok: false, message: error };
      continue;
    }
    const repaired = validateAndRepair(sitemap, { size: input.size });
    if (repaired.ok && repaired.sitemap) {
      return { ok: true, sitemap: repaired.sitemap, issues: repaired.issues };
    }
    lastMessage = repaired.error || lastMessage;
  }
  return { ok: false, message: lastMessage };
}