import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Design-specific prompt templates for different design types
const designTemplates: Record<string, string> = {
  logo: "Professional logo design, clean vector style, minimal and modern, scalable icon, brand identity, white or transparent background, centered composition",
  social: "Social media graphic, eye-catching design, vibrant colors, modern layout, Instagram/Facebook ready, engaging visual",
  banner: "Web banner design, wide format, professional marketing material, clean typography space, call-to-action ready, hero image style",
  poster: "Poster design, high impact visual, print-ready quality, bold typography space, event promotional style, professional layout",
  default: "Professional graphic design, clean and modern, high quality, visually appealing",
};

// Size mapping for Pollinations API
const sizeMap: Record<string, { width: number; height: number }> = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 832, height: 1216 },
  landscape: { width: 1216, height: 832 },
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
    
    // Get dimensions based on size
    const dimensions = sizeMap[size] || sizeMap.square;

    // Build optimized design prompt with explicit text accuracy instructions
    // Flux handles text better with cleaner, more direct prompts
    const styledPrompt = [
      prompt,
      template,
      style ? `${style} style aesthetic` : null,
      "IMPORTANT: Render all text exactly as specified with perfect spelling",
      "ultra high quality, professional, detailed, sharp text rendering",
    ].filter(Boolean).join(". ");

    console.log("Design generation request:", { 
      designType, 
      style, 
      size, 
      dimensions,
      prompt: styledPrompt.slice(0, 200) 
    });

    // Build Pollinations AI URL with parameters
    // Using Flux model for best text rendering
    const encodedPrompt = encodeURIComponent(styledPrompt);
    const pollinationsUrl = new URL(`https://image.pollinations.ai/prompt/${encodedPrompt}`);
    
    // Add query parameters for quality and model
    pollinationsUrl.searchParams.set("model", "flux");
    pollinationsUrl.searchParams.set("width", dimensions.width.toString());
    pollinationsUrl.searchParams.set("height", dimensions.height.toString());
    pollinationsUrl.searchParams.set("nologo", "true");
    pollinationsUrl.searchParams.set("enhance", "true");
    pollinationsUrl.searchParams.set("seed", Math.floor(Math.random() * 1000000).toString());

    console.log("Pollinations URL:", pollinationsUrl.toString().slice(0, 200));

    // Fetch the image from Pollinations to verify it works
    const response = await fetch(pollinationsUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "image/*",
      },
    });

    if (!response.ok) {
      console.error("Pollinations error:", response.status, await response.text());
      throw new Error("Failed to generate design. Please try again.");
    }

    // Pollinations returns the image directly, but we need to return the URL
    // The URL itself is the image (it's a GET endpoint that returns the image)
    const imageUrl = pollinationsUrl.toString();

    console.log("Design generated successfully via Pollinations AI (Flux)");
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
