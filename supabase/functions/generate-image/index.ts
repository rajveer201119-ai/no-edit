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
      return new Response(
        JSON.stringify({ error: "Please enter a description for your image." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

    // Map sizes to robust, model-friendly dimensions (multiples of 64)
    const dims = size === "portrait"
      ? { width: 896, height: 1152 }
      : size === "landscape"
      ? { width: 1152, height: 896 }
      : { width: 1024, height: 1024 };

    const sizeStr = `${dims.width}x${dims.height}`;

    // Helper to build Pollinations URL with options
    const buildUrl = (opts: { size: string; model?: string; enhance?: boolean }) => {
      const u = new URL(`https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}`);
      u.searchParams.set("size", opts.size);
      if (opts.model) u.searchParams.set("model", opts.model);
      if (opts.enhance !== undefined) u.searchParams.set("enhance", String(opts.enhance));
      u.searchParams.set("nologo", "true");
      return u;
    };

    // Try primary request (FLUX, requested size)
    let url = buildUrl({ size: sizeStr, model: "flux", enhance: true });
    console.log("Generating image via Pollinations:", { style, size, dims, prompt: styledPrompt, url: url.toString() });

    let imageResp = await fetch(url.toString(), { method: "GET", headers: { Accept: "image/*" } });

    // Fallback 1: If not OK or divisible error, try square 1024 with FLUX
    if (!imageResp.ok) {
      const text = await imageResp.text().catch(() => "");
      console.error("Pollinations error (primary):", imageResp.status, text.slice(0, 300));
      const mentionsDiv = /divisible/i.test(text);
      if (imageResp.status !== 200 || mentionsDiv) {
        url = buildUrl({ size: "1024x1024", model: "flux", enhance: false });
        console.log("Retrying Pollinations (fallback 1):", url.toString());
        imageResp = await fetch(url.toString(), { method: "GET", headers: { Accept: "image/*" } });
      }
    }

    // If still not OK, return friendly error but keep 200 so client can show message
    if (!imageResp.ok) {
      const text = await imageResp.text().catch(() => "");
      const status = imageResp.status;
      console.error("Pollinations error (final):", status, text.slice(0, 300));
      const humanMsg = status === 429
        ? "Rate limit exceeded. Please wait a minute and try again."
        : "Image provider is busy. Please try again in a moment.";
      return new Response(
        JSON.stringify({ error: humanMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await imageResp.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const contentType = imageResp.headers.get("content-type") ?? "image/png";
    const imageUrl = `data:${contentType};base64,${base64}`;

    return new Response(JSON.stringify({ imageUrl, prompt: styledPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-image function:", error);

    // Always return 200 with an error message so client can show a toast
    const msg = error instanceof Error ? error.message : String(error ?? "Unknown error");
    return new Response(
      JSON.stringify({ error: msg || "Unexpected error. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
