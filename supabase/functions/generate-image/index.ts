import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, size } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build a concise, high-quality prompt with style + size hints
    const sizeHint =
      size === "portrait" ? "portrait orientation, 4:5 aspect ratio" :
      size === "landscape" ? "landscape orientation, 16:9 aspect ratio" :
      "square orientation, 1:1 aspect ratio";

    const styledPrompt = [
      prompt,
      style ? `${style} style` : null,
      "high quality, professional, detailed",
      sizeHint,
    ].filter(Boolean).join(", ");

    // Map sizes to width/height
    const dims = size === "portrait"
      ? { width: 768, height: 1024 }
      : size === "landscape"
      ? { width: 1024, height: 768 }
      : { width: 1024, height: 1024 };

    const url = new URL(`https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}`);
    url.searchParams.set("width", String(dims.width));
    url.searchParams.set("height", String(dims.height));
    url.searchParams.set("enhance", "true");

    console.log("Generating image via Pollinations:", { style, size, dims, prompt: styledPrompt, url: url.toString() });

    const imageResp = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "image/png" },
    });

    if (!imageResp.ok) {
      const text = await imageResp.text().catch(() => "");
      const status = imageResp.status;
      console.error("Pollinations error:", status, text.slice(0, 300));
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `Upstream error (${status}). Please retry.` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await imageResp.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    return new Response(JSON.stringify({ imageUrl, prompt: styledPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-image function:", error);

    const msg = String(error?.message ?? "").toLowerCase();
    if (msg.includes("exceeded") && msg.includes("credits")) {
      return new Response(
        JSON.stringify({ error: "Image provider credits exhausted. Please try again later." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
