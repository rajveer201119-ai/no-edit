import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Very simple in-memory rate limit (per-IP, best-effort)
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 15;
const ipHits: Map<string, number[]> = new Map();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length <= RATE_LIMIT_MAX;
}

interface GenerateRequest {
  description?: string;
  websiteType?: string;
  audience?: string;
  size?: "small" | "medium" | "large";
  includeUtility?: boolean;
  includeSeoLanding?: boolean;
  language?: string;
}

const SIZE_HINTS: Record<string, string> = {
  small: "5 to 12 pages total. Keep only the essential structure.",
  medium: "12 to 25 pages total. Standard SaaS/business structure.",
  large: "25 to 50 pages total. Full structure with sub-sections and SEO pages.",
};

const PAGE_TYPES = [
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

function buildSystemPrompt(input: Required<Pick<GenerateRequest, "size">> & GenerateRequest): string {
  return `You are an expert information architect that designs website sitemaps.

You will be given a description of a website. Return a hierarchical sitemap as STRICT VALID JSON only — no prose, no markdown fences, no explanations.

JSON shape (all fields required except children which can be omitted for leaves):
{
  "projectName": string,
  "websiteType": string,
  "description": string,
  "pages": [
    {
      "id": string (unique short slug-safe id),
      "name": string (human page name, Title Case, max 40 chars),
      "slug": string (URL slug beginning with "/". Home MUST be "/"),
      "pageType": one of ${PAGE_TYPES.map((p) => `"${p}"`).join(", ")},
      "description": string (1 short sentence, max 140 chars),
      "parentId": string | null (null only for Home),
      "order": number (0-based within siblings),
      "children": [ ...recursive same shape ]
    }
  ]
}

Rules:
- Exactly ONE root page named "Home" with slug "/" and parentId null.
- ${SIZE_HINTS[input.size]}
- Max depth: 4 (Home is depth 0).
- Every id is unique. Every slug is unique and starts with "/".
- Use logical grouping (e.g. Products > Product Detail, Blog > Category > Post).
- ${input.includeUtility === false ? "Do NOT include legal/utility pages." : "Include essential legal/utility pages (Privacy, Terms, 404) when appropriate."}
- ${input.includeSeoLanding ? "Add 2-4 SEO landing pages targeting the audience and website type." : "Do not add speculative SEO landing pages."}
- Language of names/descriptions: ${input.language || "English"}.
- Return ONLY the JSON object. No commentary. No code fences.`;
}

function buildUserPrompt(input: GenerateRequest): string {
  const parts: string[] = [];
  if (input.websiteType) parts.push(`Website type: ${input.websiteType}`);
  if (input.audience) parts.push(`Target audience: ${input.audience}`);
  parts.push(`Description: ${input.description}`);
  return parts.join("\n");
}

function extractJson(text: string): string {
  // Strip common code fences.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  // Try to slice from first { to last }.
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) return text.slice(first, last + 1);
  return text.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!rateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const description = (body.description || "").trim();
  if (description.length < 10) {
    return new Response(
      JSON.stringify({ error: "Please describe your website in at least 10 characters." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  if (description.length > 2000) {
    return new Response(
      JSON.stringify({ error: "Description is too long (max 2000 characters)." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const size = (body.size === "small" || body.size === "medium" || body.size === "large")
    ? body.size
    : "medium";

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI service is not configured. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const systemPrompt = buildSystemPrompt({ ...body, description, size });
  const userPrompt = buildUserPrompt({ ...body, description, size });

  try {
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(
        JSON.stringify({ error: "AI is busy right now. Please try again in a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiResp.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please contact the site owner." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("Gateway error", aiResp.status, errText);
      return new Response(
        JSON.stringify({ error: "AI request failed. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiResp.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    if (!text) {
      return new Response(
        JSON.stringify({ error: "AI returned an empty response. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let sitemap: unknown;
    try {
      sitemap = JSON.parse(extractJson(text));
    } catch (e) {
      console.error("JSON parse failed", e, text.slice(0, 300));
      return new Response(
        JSON.stringify({ error: "AI returned invalid JSON. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ sitemap }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-sitemap error", e);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});