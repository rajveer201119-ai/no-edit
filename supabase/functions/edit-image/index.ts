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

// PRIMARY: Edit image using Pollinations AI Kontext model (FREE - true img2img)
// This is a completely free service that supports image-to-image editing
async function editWithPollinationsKontext(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Pollinations AI Kontext (FREE img2img)...");
  
  // Pollinations Kontext endpoint for img2img
  // Format: https://image.pollinations.ai/prompt/{prompt}?model=kontext&image={imageUrl}
  const encodedPrompt = encodeURIComponent(prompt.trim());
  const encodedImageUrl = encodeURIComponent(imageUrl);
  
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=kontext&image=${encodedImageUrl}&width=1024&height=1024&nologo=true`;
  
  console.log("Pollinations Kontext URL created");
  console.log("Prompt:", prompt.trim());
  
  // Fetch the edited image from Pollinations
  const response = await fetch(pollinationsUrl, {
    method: "GET",
    headers: {
      "Accept": "image/*",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Pollinations Kontext error:", response.status, errorText);

    if (response.status === 429) {
      const error = new Error("Rate limit exceeded. Please try again in a moment.");
      (error as any).status = 429;
      throw error;
    }
    
    if (response.status === 503 || response.status === 500) {
      const error = new Error("Image editing service temporarily unavailable. Please try again.");
      (error as any).status = 503;
      throw error;
    }

    const error = new Error(`Pollinations Kontext failed: ${response.status} - ${errorText}`);
    (error as any).status = response.status;
    throw error;
  }

  // Get the image blob and convert to base64
  const editedBlob = await response.blob();
  
  // Validate we got an actual image
  if (!editedBlob.type.startsWith("image/")) {
    console.error("Pollinations returned non-image content type:", editedBlob.type);
    throw new Error("Pollinations returned invalid content");
  }
  
  const editedBase64 = await blobToBase64(editedBlob);

  console.log("Pollinations Kontext edit successful - source image was actually modified!");
  return `data:image/png;base64,${editedBase64}`;
}

// Fallback: Edit image using Lovable AI Gateway (Gemini) - uses credits
// This is only used if useLovableAI is explicitly true
async function editWithLovableAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Lovable AI (Gemini - uses credits)...");
  
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
    const { imageUrl, prompt, projectId, isGuest, useLovableAI } = await req.json();

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

    // If useLovableAI is explicitly true, use Lovable AI directly (for users who want to use credits)
    if (useLovableAI === true) {
      editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
      usedService = "Lovable AI Gemini (credits)";
    } else {
      // Use Pollinations AI Kontext (FREE) - NO FALLBACK TO LOVABLE AI
      try {
        editedImageData = await editWithPollinationsKontext(imageUrl, sanitizedPrompt);
        usedService = "Pollinations AI Kontext (free, true img2img)";
      } catch (pollinationsError: any) {
        console.error("Pollinations AI failed:", pollinationsError.message);

        // Return the error - NO FALLBACK TO LOVABLE AI
        return new Response(
          JSON.stringify({ 
            error: pollinationsError.message || "Image editing service temporarily unavailable. Please try again.",
            code: "POLLINATIONS_UNAVAILABLE"
          }),
          { status: pollinationsError.status || 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
    } else if (error?.message?.includes("warming up")) {
      clientMessage = "AI model is warming up. Please try again in 30 seconds.";
      statusCode = 503;
    }

    return new Response(
      JSON.stringify({ error: clientMessage, errorId }),
      { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
