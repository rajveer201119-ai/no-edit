import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, size } = await req.json();
    const HUGGING_FACE_ACCESS_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    
    if (!HUGGING_FACE_ACCESS_TOKEN) {
      throw new Error("HUGGING_FACE_ACCESS_TOKEN is not configured");
    }

    console.log("Generating image with:", { prompt, style, size });

    // Enhance prompt with style
    const styledPrompt = `${prompt}, ${style} style, high quality, professional, detailed`;

    const hf = new HfInference(HUGGING_FACE_ACCESS_TOKEN);

    const image = await hf.textToImage({
      inputs: styledPrompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    });

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    return new Response(JSON.stringify({ 
      imageUrl,
      prompt: styledPrompt 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
