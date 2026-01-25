import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Design-specific prompt templates for different design types
const designTemplates: Record<string, string> = {
  logo: "Professional logo design, clean vector style, minimal and modern, scalable icon, brand identity, white or transparent background, centered composition",
  social: "Social media graphic, eye-catching design, vibrant colors, modern layout, Instagram/Facebook ready, 1:1 aspect ratio, engaging visual",
  banner: "Web banner design, wide format, professional marketing material, clean typography space, call-to-action ready, hero image style",
  poster: "Poster design, high impact visual, print-ready quality, bold typography space, event promotional style, professional layout",
  default: "Professional graphic design, clean and modern, high quality, visually appealing",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, size, designType } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Please enter a description for your design." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the design template based on type
    const template = designTemplates[designType] || designTemplates.default;
    
    // Build size hint
    const sizeHint =
      size === "portrait" ? "portrait orientation, 4:5 aspect ratio" :
      size === "landscape" ? "landscape orientation, 16:9 aspect ratio" :
      "square orientation, 1:1 aspect ratio";

    // Build optimized design prompt
    const styledPrompt = [
      prompt,
      template,
      style ? `${style} style aesthetic` : null,
      "ultra high quality, professional, detailed, 8K resolution",
      sizeHint,
    ].filter(Boolean).join(", ");

    console.log("Design generation request:", { designType, style, size, prompt: styledPrompt.slice(0, 200) });

    // Map sizes to dimensions (multiples of 64)
    const dims = size === "portrait"
      ? { width: 512, height: 768 }
      : size === "landscape"
      ? { width: 768, height: 512 }
      : { width: 640, height: 640 };

    const sizeStr = `${dims.width}x${dims.height}`;

    // Use Pollinations.ai directly for image generation (faster and more reliable)
    const buildUrl = (opts: { size: string; model?: string; enhance?: boolean }) => {
      const u = new URL(`https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}`);
      u.searchParams.set("size", opts.size);
      if (opts.model) u.searchParams.set("model", opts.model);
      if (opts.enhance !== undefined) u.searchParams.set("enhance", String(opts.enhance));
      u.searchParams.set("nologo", "true");
      return u;
    };

    let url = buildUrl({ size: sizeStr, model: "flux", enhance: true });
    console.log("Generating design via Pollinations:", url.toString().slice(0, 200));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
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
          JSON.stringify({ error: "Request timed out. Please try again with a simpler description." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    // Fallback if primary fails
    if (!imageResp.ok) {
      const text = await imageResp.text().catch(() => "");
      console.error("Pollinations error (primary):", imageResp.status, text.slice(0, 300));
      
      url = buildUrl({ size: "640x640", model: "flux", enhance: false });
      console.log("Retrying Pollinations (fallback):", url.toString().slice(0, 200));
      
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 25000);
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
            JSON.stringify({ error: "Request timed out. Please try a simpler prompt." }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw error;
      }
    }

    if (!imageResp.ok) {
      const text = await imageResp.text().catch(() => "");
      const status = imageResp.status;
      console.error("Pollinations error (final):", status, text.slice(0, 300));
      const humanMsg = status === 429
        ? "Rate limit exceeded. Please wait a minute and try again."
        : "Design service is busy. Please try again in a moment.";
      return new Response(
        JSON.stringify({ error: humanMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await imageResp.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 safely in chunks
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64 = btoa(binary);
    
    const contentType = imageResp.headers.get("content-type") ?? "image/png";
    const imageUrl = `data:${contentType};base64,${base64}`;

    console.log("Design generated successfully via Pollinations");
    return new Response(JSON.stringify({ imageUrl, prompt: styledPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-image function:", error);
    const msg = error instanceof Error ? error.message : String(error ?? "Unknown error");
    return new Response(
      JSON.stringify({ error: msg || "Unexpected error. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
