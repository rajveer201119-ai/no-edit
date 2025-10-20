import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.8.1";

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

    const HF_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    if (!HF_TOKEN) {
      throw new Error("HUGGING_FACE_ACCESS_TOKEN is not configured");
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

    console.log("Generating image via Hugging Face:", { style, size, sizeHint, prompt: styledPrompt });

    const hf = new HfInference(HF_TOKEN);

    // Use FLUX.1-schnell - fast and high quality
    const image = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: styledPrompt,
    });

    // Convert blob to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    return new Response(JSON.stringify({ imageUrl, prompt: styledPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-image function:", error);
    
    // Handle specific Hugging Face errors
    if (error.message?.includes("Model") && error.message?.includes("is currently loading")) {
      return new Response(
        JSON.stringify({ error: "Model is loading. Please wait 10-20 seconds and try again." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (error.message?.includes("Rate limit")) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a few minutes." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
