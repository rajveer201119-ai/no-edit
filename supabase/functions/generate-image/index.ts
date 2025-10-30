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

    // Map sizes to smaller, faster dimensions (multiples of 64)
    const dims = size === "portrait"
      ? { width: 512, height: 768 }
      : size === "landscape"
      ? { width: 768, height: 512 }
      : { width: 640, height: 640 };

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

    // Try primary request (FLUX, requested size) with 25 second timeout
    let url = buildUrl({ size: sizeStr, model: "flux", enhance: true });
    console.log("Generating image via Pollinations:", { style, size, dims, prompt: styledPrompt, url: url.toString() });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    
    let imageResp: Response;
    try {
      imageResp = await fetch(url.toString(), { 
        method: "GET", 
        headers: { Accept: "image/*" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: "Request timed out. Please try again with a simpler prompt." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    // Fallback 1: If not OK or divisible error, try square 1024 with FLUX
    if (!imageResp.ok) {
      const text = await imageResp.text().catch(() => "");
      console.error("Pollinations error (primary):", imageResp.status, text.slice(0, 300));
      const mentionsDiv = /divisible/i.test(text);
      if (imageResp.status !== 200 || mentionsDiv) {
        url = buildUrl({ size: "640x640", model: "flux", enhance: false });
        console.log("Retrying Pollinations (fallback 1):", url.toString());
        
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 20000);
        try {
          imageResp = await fetch(url.toString(), { 
            method: "GET", 
            headers: { Accept: "image/*" },
            signal: fallbackController.signal
          });
          clearTimeout(fallbackTimeout);
        } catch (error: any) {
          clearTimeout(fallbackTimeout);
          if (error.name === 'AbortError') {
            return new Response(
              JSON.stringify({ error: "Request timed out. Please try a different prompt." }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          throw error;
        }
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
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 safely (chunk by chunk to avoid call stack overflow)
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64 = btoa(binary);
    
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
