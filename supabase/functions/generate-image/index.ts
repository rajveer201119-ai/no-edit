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

// Generate with Pollinations AI (free, no API key)
async function generateWithPollinations(styledPrompt: string, dimensions: { width: number; height: number }): Promise<string> {
  const encodedPrompt = encodeURIComponent(styledPrompt);
  const pollinationsUrl = new URL(`https://image.pollinations.ai/prompt/${encodedPrompt}`);
  
  pollinationsUrl.searchParams.set("model", "flux");
  pollinationsUrl.searchParams.set("width", dimensions.width.toString());
  pollinationsUrl.searchParams.set("height", dimensions.height.toString());
  pollinationsUrl.searchParams.set("nologo", "true");
  pollinationsUrl.searchParams.set("enhance", "true");
  pollinationsUrl.searchParams.set("seed", Math.floor(Math.random() * 1000000).toString());

  console.log("Trying Pollinations AI...");
  
  const response = await fetch(pollinationsUrl.toString(), {
    method: "GET",
    headers: { "Accept": "image/*" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Pollinations error:", response.status, errorText);
    throw new Error(`Pollinations failed: ${response.status}`);
  }

  return pollinationsUrl.toString();
}

// Fallback to Lovable AI (Gemini) if Pollinations fails
async function generateWithLovableAI(styledPrompt: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY not configured for fallback");
  }

  console.log("Falling back to Lovable AI (Gemini)...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [{ role: "user", content: styledPrompt }],
      modalities: ["image", "text"]
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait and try again.");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted. Please try again later.");
    }
    const errorText = await response.text();
    console.error("Lovable AI error:", response.status, errorText);
    throw new Error("Fallback AI also failed");
  }

  const data = await response.json();
  const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  if (!generatedImageUrl) {
    console.error("No image in Lovable AI response:", JSON.stringify(data));
    throw new Error("No image returned from fallback AI");
  }

  return generatedImageUrl;
}

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

    let imageUrl: string;

    // Try Pollinations first (free), fallback to Lovable AI
    try {
      imageUrl = await generateWithPollinations(styledPrompt, dimensions);
      console.log("Design generated successfully via Pollinations AI (Flux)");
    } catch (pollinationsError) {
      console.warn("Pollinations failed, trying Lovable AI fallback:", pollinationsError);
      
      try {
        imageUrl = await generateWithLovableAI(styledPrompt);
        console.log("Design generated successfully via Lovable AI (Gemini) fallback");
      } catch (lovableError: any) {
        // If it's a rate limit or credits error, pass it through
        if (lovableError.message.includes("Rate limit") || lovableError.message.includes("credits")) {
          return new Response(
            JSON.stringify({ error: lovableError.message }),
            { status: lovableError.message.includes("Rate limit") ? 429 : 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error("Both AI services failed. Please try again.");
      }
    }

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
