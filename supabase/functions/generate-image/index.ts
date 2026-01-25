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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the design template based on type
    const template = designTemplates[designType] || designTemplates.default;
    
    // Build size hint
    const sizeHint =
      size === "portrait" ? "portrait orientation, 4:5 aspect ratio" :
      size === "landscape" ? "landscape orientation, 16:9 aspect ratio" :
      "square orientation, 1:1 aspect ratio";

    // Build optimized design prompt with explicit text accuracy instructions
    const styledPrompt = [
      `Create this design with PERFECT spelling and text accuracy: ${prompt}`,
      template,
      style ? `${style} style aesthetic` : null,
      "CRITICAL: All text, names, words, numbers must be spelled EXACTLY as specified with NO spelling errors",
      "ultra high quality, professional, detailed, sharp text rendering",
      sizeHint,
    ].filter(Boolean).join(". ");

    console.log("Design generation request:", { designType, style, size, prompt: styledPrompt.slice(0, 200) });

    // Use Lovable AI Gateway with Gemini image model for better text rendering
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: styledPrompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate design");
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image from the response
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image returned from AI");
    }

    console.log("Design generated successfully via Lovable AI");
    return new Response(JSON.stringify({ imageUrl: generatedImageUrl, prompt: styledPrompt }), {
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
