import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Edit image using Cloudflare Workers AI (FREE - 10,000 neurons/day)
async function editWithCloudflareAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Cloudflare Workers AI (free)...");
  
  const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
  const CF_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
  
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }

  // Download the source image
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to download source image");
  }
  const imageBlob = await imageResponse.blob();
  const imageArrayBuffer = await imageBlob.arrayBuffer();
  const imageBytes = [...new Uint8Array(imageArrayBuffer)];

  // Cloudflare Workers AI img2img endpoint
  const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`;

  // Enhanced prompt for better preservation of original image
  const enhancedPrompt = `${prompt}, preserve original composition, maintain original style, subtle edit, high quality, detailed`;
  
  // Negative prompt to avoid drastic changes
  const negativePrompt = "distorted, blurry, low quality, completely different, major changes, text, watermark, signature";

  const response = await fetch(cfEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      negative_prompt: negativePrompt,
      image: imageBytes,
      strength: 0.35, // Low strength to preserve more of the original image
      guidance: 8.5,  // Higher guidance for better prompt adherence
      num_steps: 20,  // Max allowed by Cloudflare
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudflare AI error:", response.status, errorText);

    if (response.status === 429) {
      const error = new Error("Cloudflare rate limit exceeded");
      (error as any).status = 429;
      throw error;
    }
    if (response.status === 401 || response.status === 403) {
      const error = new Error("Cloudflare authentication failed");
      (error as any).status = response.status;
      throw error;
    }

    const error = new Error(`Cloudflare AI failed: ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  // Cloudflare returns the image directly as binary PNG
  const editedImageBlob = await response.blob();
  const editedBase64 = await blobToBase64(editedImageBlob);

  console.log("Cloudflare Workers AI edit successful");
  return `data:image/png;base64,${editedBase64}`;
}

// Fallback: Edit image using Lovable AI Gateway (Gemini) - uses credits
async function editWithLovableAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Lovable AI (Gemini - fallback, uses credits)...");
  
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
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "system",
          content: "You are an image editor. ALWAYS output a modified version of the input image. Never ask questions or respond with text only. Apply the user's edit request directly to the image and return the edited image. Preserve the original composition, style, and elements unless the user specifically asks to change them. IMPORTANT: Do NOT add, modify, or generate any text, letters, words, numbers, or typography on the image. If the user asks for text-related edits, apply only visual/style changes and ignore text requests. Keep the image text-free."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `GENERATE AN EDITED IMAGE: Apply this edit to the image: "${prompt}". Output the modified image directly without asking questions. Keep the original image's composition and style, only applying the specific changes requested.`
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
    const { imageUrl, prompt, projectId, isGuest } = await req.json();

    if (!imageUrl || !prompt) {
      return new Response(
        JSON.stringify({ error: "Image URL and prompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let supabaseClient: any = null;

    // Handle authenticated users
    if (authHeader?.startsWith('Bearer ')) {
      supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );

      const token = authHeader.replace('Bearer ', '');
      const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
      
      if (!claimsError && claimsData?.claims?.sub) {
        userId = claimsData.claims.sub;

        // Check edit rate limits for authenticated users
        const { data: limitData, error: limitError } = await supabaseClient.rpc('check_edit_limit', {
          user_id_param: userId
        });

        if (limitError || !limitData?.[0]?.can_edit) {
          return new Response(
            JSON.stringify({ error: "Daily edit limit reached. Upgrade to Pro for more edits." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // For guest users (isGuest=true and no valid userId), allow one edit
    if (!userId && !isGuest) {
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation - limit prompt length
    const sanitizedPrompt = prompt.trim().slice(0, 1000);

    console.log("Editing image:", { userId: userId ? userId.substring(0, 8) + '...' : 'guest' });

    let editedImageData: string;
    let usedService: string;

    // Try Cloudflare Workers AI first (FREE - 10k neurons/day), fallback to Lovable AI (uses credits)
    try {
      editedImageData = await editWithCloudflareAI(imageUrl, sanitizedPrompt);
      usedService = "Cloudflare Workers AI (free)";
    } catch (cfError: any) {
      console.warn("Cloudflare AI failed, falling back to Lovable AI:", cfError.message);

      try {
        editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
        usedService = "Lovable AI Gemini (credits)";
      } catch (lovableError: any) {
        // Pass through rate limit and credit errors with proper status codes
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

    console.log(`Image edit completed via ${usedService}`);

    // Track edit usage after successful edit (only for authenticated users)
    if (userId && supabaseClient) {
      await supabaseClient.rpc('increment_edit_usage', {
        user_id_param: userId
      });
    }

    // Upload the edited image to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert edited image (data URL OR remote URL) into bytes for Storage upload.
    let imageBytes: Uint8Array;
    let contentType = "image/png";
    let fileExt = "png";

    if (editedImageData.startsWith("data:image/")) {
      const match = editedImageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      if (match?.[1]) {
        contentType = match[1];
        fileExt = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : contentType.split("/")[1] || "png";
      }

      const base64Data = editedImageData.replace(/^data:image\/\w+[a-zA-Z0-9.+-]*;base64,/, "");
      imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    } else if (editedImageData.startsWith("http://") || editedImageData.startsWith("https://")) {
      const remoteResp = await fetch(editedImageData);
      if (!remoteResp.ok) {
        throw new Error("Failed to download edited image");
      }
      const remoteBlob = await remoteResp.blob();
      contentType = remoteBlob.type || remoteResp.headers.get("content-type") || contentType;
      fileExt = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : contentType.split("/")[1] || "png";
      imageBytes = new Uint8Array(await remoteBlob.arrayBuffer());
    } else {
      throw new Error("Unsupported edited image format");
    }
    
    const fileName = `${userId || 'guest'}/${Date.now()}-edited.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageBytes, {
        contentType,
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

    console.log("Image edited and uploaded successfully:", publicUrl);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    // Generate error ID for support correlation
    const errorId = crypto.randomUUID().substring(0, 8);
    
    // Safe server-side logging
    console.error(`[${errorId}] Edit error:`, {
      timestamp: new Date().toISOString(),
      errorType: error?.constructor?.name || 'Unknown',
      message: error?.message || 'Unknown error'
    });

    // Map to safe user-facing messages
    let clientMessage = "Failed to edit image. Please try again.";
    let statusCode = 500;

    if (error?.message?.includes("Rate limit") || error?.status === 429) {
      clientMessage = "Too many requests. Please try again in a moment.";
      statusCode = 429;
    } else if (error?.message?.includes("credits") || error?.status === 402) {
      clientMessage = "Service temporarily unavailable. Please try again later.";
      statusCode = 503;
    } else if (error?.message?.includes("Model is loading")) {
      clientMessage = "AI model is warming up. Please try again in 30 seconds.";
      statusCode = 503;
    }

    return new Response(
      JSON.stringify({ error: clientMessage, errorId }),
      { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
