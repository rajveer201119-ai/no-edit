import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Edit image using Pollinations AI (FREE - no API key required)
async function editWithPollinations(imageUrl: string, prompt: string): Promise<string> {
  console.log("Attempting edit with Pollinations AI (FREE)...");
  
  // Construct an edit prompt that references the source image
  const editPrompt = `Edit the following image according to this instruction: "${prompt}". 
Apply the edit to this exact image: ${imageUrl}
Make sure to preserve the original composition and only apply the requested changes.`;

  const encodedPrompt = encodeURIComponent(editPrompt);
  const seed = Math.floor(Math.random() * 1000000);
  
  // Use Pollinations image-to-image with flux model
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&seed=${seed}&nologo=true&enhance=true`;
  
  console.log("Pollinations edit URL constructed");
  
  const response = await fetch(pollinationsUrl, {
    method: "GET",
    headers: {
      "Accept": "image/*"
    }
  });

  if (!response.ok) {
    throw new Error(`Pollinations API error: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new Error("Pollinations did not return an image");
  }

  // Convert the image to base64 using Deno's standard library (avoids stack overflow)
  const arrayBuffer = await response.arrayBuffer();
  const base64 = base64Encode(arrayBuffer);
  
  console.log("Pollinations edit successful");
  return `data:${contentType};base64,${base64}`;
}

// Edit image using Lovable AI Gateway (uses credits)
async function editWithLovableAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Attempting edit with Lovable AI (fallback, uses credits)...");
  
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

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
          role: "system",
          content: "You are an image editor. ALWAYS output a modified version of the input image. Never ask questions or respond with text only. Apply the user's edit request directly to the image and return the edited image."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `GENERATE AN EDITED IMAGE: Apply this edit to the image: "${prompt}". Output the modified image directly without asking questions. If the instruction is unclear, make your best interpretation and apply it.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      modalities: ["image", "text"]
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      const error = new Error("Rate limit exceeded. Please try again in a moment.");
      (error as any).status = 429;
      throw error;
    }
    if (response.status === 402) {
      const error = new Error("AI credits exhausted. Please add funds to continue.");
      (error as any).status = 402;
      throw error;
    }
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    throw new Error("Failed to edit image with AI");
  }

  const data = await response.json();
  const editedImageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  if (!editedImageData) {
    console.error("No image in response:", JSON.stringify(data));
    throw new Error("No edited image returned from AI");
  }

  console.log("Lovable AI edit successful");
  return editedImageData;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, prompt, projectId, userId } = await req.json();

    if (!imageUrl || !prompt) {
      return new Response(
        JSON.stringify({ error: "Image URL and prompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required for storage access" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Editing image with prompt:", prompt);

    let editedImageData: string;
    let serviceUsed: string;

    // Try Pollinations AI first (FREE), fallback to Lovable AI
    try {
      editedImageData = await editWithPollinations(imageUrl, prompt);
      serviceUsed = "Pollinations AI (FREE)";
    } catch (pollinationsError) {
      console.warn("Pollinations AI failed, falling back to Lovable AI:", pollinationsError);
      
      try {
        editedImageData = await editWithLovableAI(imageUrl, prompt);
        serviceUsed = "Lovable AI (fallback)";
      } catch (lovableError: any) {
        // Pass through rate limit and credit errors
        if (lovableError.status === 429) {
          return new Response(
            JSON.stringify({ error: lovableError.message }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (lovableError.status === 402) {
          return new Response(
            JSON.stringify({ error: lovableError.message }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw lovableError;
      }
    }

    console.log(`Image edited successfully using: ${serviceUsed}`);

    // Upload the edited image to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert base64 to blob
    const base64Data = editedImageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `${userId}/${Date.now()}-edited.png`;
    
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageBytes, {
        contentType: "image/png",
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to save edited image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    // Update project if projectId provided
    if (projectId) {
      await supabase
        .from("projects")
        .update({ 
          image_url: publicUrl, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", projectId);
    }

    console.log("Image edited and uploaded successfully:", publicUrl, "| Service:", serviceUsed);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, serviceUsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edit image error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
