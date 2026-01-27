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

// Build enhanced prompt with context-aware modifications
function buildEnhancedPrompt(userPrompt: string): string {
  const isColorChange = /change|color|turn|make/i.test(userPrompt);
  const isStyleChange = /style|artistic|paint|sketch|cartoon|anime/i.test(userPrompt);
  const isRemoval = /remove|delete|erase|get rid of/i.test(userPrompt);
  const isEnhance = /enhance|improve|better|sharper|cleaner|fix/i.test(userPrompt);
  
  let contextualSuffix = "";
  
  if (isColorChange) {
    contextualSuffix = ", identical lighting and angle, keep face and body unchanged, preserve background exactly";
  } else if (isStyleChange) {
    contextualSuffix = ", maintain original composition and subject positioning, consistent character identity";
  } else if (isRemoval) {
    contextualSuffix = ", seamless background fill, natural lighting continuity";
  } else if (isEnhance) {
    contextualSuffix = ", preserve original style and composition, subtle refinement only";
  } else {
    contextualSuffix = ", preserve original composition, maintain layout";
  }
  
  const qualityBoosters = "photorealistic, sharp details, natural lighting, 8K resolution, professional quality";
  
  return `${userPrompt}${contextualSuffix}, ${qualityBoosters}`;
}

// Build smart inpainting prompt
function buildInpaintingPrompt(userPrompt: string): string {
  const isTextRequest = /\btext\b|write|word|letter|font|typography|caption|title|headline|label|sign|logo|saying|quote/i.test(userPrompt);
  const isRemoval = /remove|delete|erase|get rid of|clear|empty|clean|wipe/i.test(userPrompt);
  const isReplacement = /replace|swap|change|transform|convert|turn into/i.test(userPrompt);
  
  if (isTextRequest) {
    return `${userPrompt}, clean typography, high contrast, readable, sharp edges, centered in masked area`;
  } else if (isRemoval) {
    return `${userPrompt}, seamless background continuation, natural fill, matching surrounding area exactly, no artifacts`;
  } else if (isReplacement) {
    return `${userPrompt}, seamless integration, matching lighting and perspective, natural appearance, high quality`;
  } else {
    return `${userPrompt}, seamless blend, natural lighting, sharp details, high quality`;
  }
}

// ============================================
// PRIMARY: Pollinations AI Kontext (FREE, reliable img2img)
// Best quality for image editing without API key
// ============================================
async function editWithPollinationsKontext(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Pollinations AI Kontext (PRIMARY - FREE)...");
  
  const enhancedPrompt = buildEnhancedPrompt(prompt);
  const encodedPrompt = encodeURIComponent(enhancedPrompt);
  const encodedImageUrl = encodeURIComponent(imageUrl);
  
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=kontext&image=${encodedImageUrl}&width=1024&height=1024&nologo=true`;
  
  console.log("Pollinations Kontext URL generated...");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout for img2img

  try {
    const response = await fetch(pollinationsUrl, {
      method: "GET",
      headers: { "Accept": "image/*" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pollinations error:", response.status, errorText);

      if (response.status === 429) {
        const error = new Error("Rate limit exceeded. Please try again in a moment.");
        (error as any).status = 429;
        throw error;
      }

      const error = new Error(`Pollinations failed: ${response.status}`);
      (error as any).status = response.status;
      throw error;
    }

    const contentType = response.headers.get("content-type") || "";
    
    if (!contentType.startsWith("image/")) {
      console.error("Pollinations returned non-image:", contentType);
      throw new Error("Pollinations returned invalid content type");
    }

    const editedBlob = await response.blob();
    
    // Validate image size
    if (editedBlob.size < 5000) {
      console.error("Pollinations returned small image:", editedBlob.size, "bytes");
      throw new Error("Pollinations returned invalid image");
    }
    
    const editedBase64 = await blobToBase64(editedBlob);
    
    console.log("Pollinations Kontext edit successful! Size:", editedBlob.size, "bytes");
    return `data:image/png;base64,${editedBase64}`;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Pollinations request timed out. Please try again.");
    }
    throw error;
  }
}

// ============================================
// SECONDARY: Cloudflare Workers AI (FREE, size-limited)
// Good fallback for smaller images
// ============================================
async function editWithCloudflareAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Cloudflare Workers AI...");
  
  const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
  const CF_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
  
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }

  // Download source image
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    console.log("Downloading source image for Cloudflare...");
    const imageResponse = await fetch(imageUrl, { signal: controller.signal });
    
    clearTimeout(timeoutId);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download source image: ${imageResponse.status}`);
    }
    
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageSizeBytes = imageArrayBuffer.byteLength;
    console.log("Source image size:", imageSizeBytes, "bytes");
    
    // Cloudflare has size limits
    if (imageSizeBytes > 300000) {
      console.log("Image too large for Cloudflare AI (max ~300KB)");
      const error = new Error("IMAGE_TOO_LARGE");
      (error as any).status = 413;
      throw error;
    }
    
    const imageArray = Array.from(new Uint8Array(imageArrayBuffer));

    const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`;

    console.log("Sending request to Cloudflare Workers AI...");

    const cfController = new AbortController();
    const cfTimeoutId = setTimeout(() => cfController.abort(), 60000);

    const response = await fetch(cfEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageArray,
        prompt: buildEnhancedPrompt(prompt),
        strength: 0.35,
        num_steps: 20,
        guidance: 7.5
      }),
      signal: cfController.signal,
    });

    clearTimeout(cfTimeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare AI error:", response.status, errorText);

      if (response.status === 429) {
        const error = new Error("Rate limit exceeded.");
        (error as any).status = 429;
        throw error;
      }
      
      if (response.status === 413) {
        const error = new Error("IMAGE_TOO_LARGE");
        (error as any).status = 413;
        throw error;
      }

      const error = new Error(`Cloudflare AI failed: ${response.status}`);
      (error as any).status = response.status;
      throw error;
    }

    const editedBlob = await response.blob();
    const contentType = response.headers.get("content-type") || "";
    
    if (!contentType.startsWith("image/")) {
      throw new Error("Cloudflare returned invalid content");
    }
    
    const editedBase64 = await blobToBase64(editedBlob);
    console.log("Cloudflare Workers AI edit successful!");
    return `data:image/png;base64,${editedBase64}`;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Cloudflare request timed out.");
    }
    throw error;
  }
}

// ============================================
// TERTIARY: Lovable AI Gateway (Gemini) - uses credits
// Most reliable but costs credits
// ============================================
async function editWithLovableAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Lovable AI (Gemini)...");
  
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
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
            content: "You are an image editor. ALWAYS output a modified version of the input image. Apply the user's edit request directly and return the edited image. Preserve original composition, style, and elements unless specifically asked to change them. Do NOT add any text, letters, or typography to the image."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Apply this edit to the image: "${prompt}". Output the modified image directly. Keep original composition, only apply the specific changes requested.`
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        const error = new Error("Rate limit exceeded. Please try again later.");
        (error as any).status = 429;
        throw error;
      }
      if (response.status === 402) {
        const error = new Error("AI credits exhausted. Please add funds to continue.");
        (error as any).status = 402;
        throw error;
      }
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error("Lovable AI edit failed");
    }

    const data = await response.json();
    const editedImageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!editedImageData) {
      console.error("No image in Lovable AI response");
      throw new Error("No edited image returned from Lovable AI");
    }

    console.log("Lovable AI edit successful");
    return editedImageData;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Lovable AI request timed out.");
    }
    throw error;
  }
}

// ============================================
// Main Handler
// ============================================
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageUrl, prompt, projectId, isGuest, useLovableAI, maskDataUrl, isInpainting } = body;

    // Validate required fields
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Edit prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate image URL format
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:image/")) {
      return new Response(
        JSON.stringify({ error: "Invalid image URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Auth check
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let supabaseClient: any = null;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: authHeader } } }
        );

        const token = authHeader.replace('Bearer ', '');
        const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
        
        if (!claimsError && claimsData?.claims?.sub) {
          userId = claimsData.claims.sub;

          // Check rate limits
          const { data: limitData, error: limitError } = await supabaseClient.rpc('check_edit_limit', {
            user_id_param: userId
          });

          if (limitError) {
            console.error("Rate limit check error:", limitError);
          } else if (!limitData?.[0]?.can_edit) {
            return new Response(
              JSON.stringify({ error: "Daily edit limit reached. Upgrade to Pro for more edits." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      } catch (authError) {
        console.error("Auth error:", authError);
        // Continue as guest if auth fails
      }
    }

    // Require auth or guest mode
    if (!userId && !isGuest) {
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize prompt
    const sanitizedPrompt = prompt.trim().slice(0, 1000);

    console.log("Editing image:", { 
      userId: userId ? userId.substring(0, 8) + '...' : 'guest', 
      prompt: sanitizedPrompt.substring(0, 50) + '...',
      isInpainting: !!isInpainting,
      hasMask: !!maskDataUrl
    });

    let editedImageData: string;
    let usedService: string;

    // Handle inpainting with mask - use Lovable AI as it handles masks well
    if (isInpainting && maskDataUrl) {
      console.log("Processing inpainting request...");
      const inpaintPrompt = buildInpaintingPrompt(sanitizedPrompt);
      
      try {
        editedImageData = await editWithLovableAI(imageUrl, inpaintPrompt);
        usedService = "Lovable AI Gemini (inpainting)";
      } catch (inpaintError: any) {
        console.error("Inpainting failed:", inpaintError.message);
        return new Response(
          JSON.stringify({ 
            error: inpaintError.message || "Inpainting failed. Please try again.",
            code: "INPAINT_FAILED"
          }),
          { status: inpaintError.status || 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    // Direct Lovable AI request (user explicitly requested)
    else if (useLovableAI === true) {
      try {
        editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
        usedService = "Lovable AI Gemini (credits)";
      } catch (lovableError: any) {
        return new Response(
          JSON.stringify({ 
            error: lovableError.message || "Edit failed.",
            code: "EDIT_FAILED"
          }),
          { status: lovableError.status || 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    // Normal flow: Pollinations (primary) -> Cloudflare -> Lovable AI
    else {
      try {
        editedImageData = await editWithPollinationsKontext(imageUrl, sanitizedPrompt);
        usedService = "Pollinations Kontext (free)";
      } catch (pollinationsError: any) {
        console.warn("Pollinations failed:", pollinationsError.message);
        
        // Rate limit - pass through
        if (pollinationsError.status === 429) {
          return new Response(
            JSON.stringify({ error: pollinationsError.message }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Try Cloudflare
        try {
          editedImageData = await editWithCloudflareAI(imageUrl, sanitizedPrompt);
          usedService = "Cloudflare Workers AI (free)";
        } catch (cfError: any) {
          console.warn("Cloudflare failed:", cfError.message);
          
          // Final fallback to Lovable AI
          try {
            editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
            usedService = "Lovable AI Gemini (fallback)";
          } catch (lovableError: any) {
            console.error("All services failed:", lovableError.message);
            
            // Pass through specific errors
            if (lovableError.status === 429 || lovableError.status === 402) {
              return new Response(
                JSON.stringify({ error: lovableError.message }),
                { status: lovableError.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
            
            return new Response(
              JSON.stringify({ 
                error: "Image editing service temporarily unavailable. Please try again.",
                code: "EDIT_FAILED"
              }),
              { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }
    }

    console.log(`Image edit completed via ${usedService}`);

    // Track edit usage (authenticated users only)
    if (userId && supabaseClient) {
      try {
        await supabaseClient.rpc('increment_edit_usage', { user_id_param: userId });
      } catch (usageError) {
        console.error("Usage tracking error:", usageError);
        // Don't fail the request for usage tracking errors
      }
    }

    // Upload edited image to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    let imageBytes: Uint8Array;
    let contentType = "image/png";
    let fileExt = "png";

    // Handle different image data formats
    if (editedImageData.startsWith("data:image/")) {
      const match = editedImageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      if (match?.[1]) {
        contentType = match[1];
        fileExt = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
      }
      const base64Data = editedImageData.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
      imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    } else if (editedImageData.startsWith("http://") || editedImageData.startsWith("https://")) {
      const remoteResp = await fetch(editedImageData);
      if (!remoteResp.ok) {
        throw new Error("Failed to download edited image");
      }
      const remoteBlob = await remoteResp.blob();
      contentType = remoteBlob.type || "image/png";
      fileExt = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
      imageBytes = new Uint8Array(await remoteBlob.arrayBuffer());
    } else {
      throw new Error("Unsupported edited image format");
    }
    
    const fileName = `${userId || 'guest'}/${Date.now()}-edited.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageBytes, { contentType, upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to save edited image");
    }

    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(fileName);

    // Update project if projectId provided
    if (projectId) {
      try {
        await supabase
          .from("projects")
          .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq("id", projectId);
      } catch (projectError) {
        console.error("Project update error:", projectError);
        // Don't fail for project update errors
      }
    }

    console.log("Image edited and uploaded successfully:", publicUrl);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, service: usedService }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    const errorId = crypto.randomUUID().substring(0, 8);
    
    console.error(`[${errorId}] Edit error:`, {
      timestamp: new Date().toISOString(),
      message: error?.message || "Unknown error",
      type: error?.constructor?.name || "Unknown"
    });

    // Map to safe user messages
    let statusCode = error?.status || 500;
    let message = "Failed to edit image. Please try again.";
    
    if (error?.message?.includes("Rate limit") || statusCode === 429) {
      message = "Too many requests. Please try again in a moment.";
      statusCode = 429;
    } else if (error?.message?.includes("credits") || statusCode === 402) {
      message = "Service temporarily unavailable.";
      statusCode = 503;
    } else if (error?.message?.includes("timeout")) {
      message = "Request timed out. Please try again.";
      statusCode = 504;
    } else if (statusCode === 500) {
      message = `An unexpected error occurred. Reference: ${errorId}`;
    }

    return new Response(
      JSON.stringify({ error: message, errorId }),
      { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
