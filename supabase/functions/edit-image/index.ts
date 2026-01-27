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

// ============================================
// PRIMARY: Runware API with FLUX Kontext Model
// High-quality img2img editing with character consistency
// Free tier supports 100+ daily edits
// ============================================
async function editWithRunware(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Runware API (FLUX Kontext)...");
  
  const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY");
  if (!RUNWARE_API_KEY) {
    throw new Error("RUNWARE_API_KEY not configured");
  }

  const API_ENDPOINT = "wss://ws-api.runware.ai/v1";
  
  // Build enhanced prompt with quality boosters and preservation rules
  const enhancedPrompt = buildEnhancedPrompt(prompt);
  
  console.log("Enhanced prompt:", enhancedPrompt);

  // Use WebSocket for Runware API
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Runware API timeout after 60s"));
    }, 60000);

    try {
      const ws = new WebSocket(API_ENDPOINT);
      
      ws.onopen = () => {
        console.log("WebSocket connected to Runware");
        
        // Step 1: Authenticate
        const authMessage = [{
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY,
        }];
        ws.send(JSON.stringify(authMessage));
      };

      let isAuthenticated = false;
      const taskUUID = crypto.randomUUID();
      
      ws.onmessage = async (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Runware response:", JSON.stringify(response).substring(0, 500));
          
          if (response.error || response.errors) {
            clearTimeout(timeout);
            ws.close();
            const errorMessage = response.errorMessage || response.errors?.[0]?.message || "Runware API error";
            reject(new Error(errorMessage));
            return;
          }

          if (response.data) {
            for (const item of response.data) {
              if (item.taskType === "authentication") {
                console.log("Runware authenticated, starting image edit...");
                isAuthenticated = true;
                
                // Step 2: Send image editing request
                // Using imageInference with the source image for img2img
                const editMessage = [{
                  taskType: "imageInference",
                  taskUUID,
                  model: "runware:101@1", // Flux Kontext model
                  positivePrompt: enhancedPrompt,
                  negativePrompt: "blurry, distorted, low quality, text, watermark, signature, different composition, major changes to background",
                  width: 1024,
                  height: 1024,
                  numberResults: 1,
                  outputFormat: "PNG",
                  CFGScale: 7.5,
                  scheduler: "FlowMatchEulerDiscreteScheduler",
                  steps: 25,
                  strength: 0.35, // Conservative for preservation
                  seedImage: imageUrl, // Source image for img2img
                  includeCost: true,
                }];
                
                console.log("Sending edit request with seedImage:", imageUrl.substring(0, 50) + "...");
                ws.send(JSON.stringify(editMessage));
              } else if (item.taskType === "imageInference" && item.taskUUID === taskUUID) {
                clearTimeout(timeout);
                ws.close();
                
                if (item.imageURL) {
                  console.log("Runware edit successful! Cost:", item.cost || "N/A");
                  
                  // Download and convert to base64
                  const imageResp = await fetch(item.imageURL);
                  if (!imageResp.ok) {
                    reject(new Error("Failed to download edited image from Runware"));
                    return;
                  }
                  const imageBlob = await imageResp.blob();
                  const base64 = await blobToBase64(imageBlob);
                  resolve(`data:image/png;base64,${base64}`);
                } else {
                  reject(new Error("No image URL in Runware response"));
                }
              }
            }
          }
        } catch (parseError) {
          console.error("Error parsing Runware response:", parseError);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error("WebSocket error:", error);
        reject(new Error("Runware WebSocket connection failed"));
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        if (!isAuthenticated) {
          clearTimeout(timeout);
          reject(new Error("Runware connection closed before completion"));
        }
      };

    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

// ============================================
// INPAINTING: Runware API with Mask Support
// Uses FLUX Kontext for high-quality masked edits
// ============================================
async function inpaintWithRunware(imageUrl: string, maskDataUrl: string, prompt: string): Promise<string> {
  console.log("Inpainting image with Runware API (FLUX Kontext + Mask)...");
  
  const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY");
  if (!RUNWARE_API_KEY) {
    throw new Error("RUNWARE_API_KEY not configured");
  }

  const API_ENDPOINT = "wss://ws-api.runware.ai/v1";
  
  // Build smart prompt based on content type
  const enhancedPrompt = buildInpaintingPrompt(prompt);
  
  console.log("Inpainting prompt:", enhancedPrompt);

  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Runware inpainting timeout after 90s"));
    }, 90000);

    try {
      const ws = new WebSocket(API_ENDPOINT);
      
      ws.onopen = () => {
        console.log("WebSocket connected to Runware for inpainting");
        
        const authMessage = [{
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY,
        }];
        ws.send(JSON.stringify(authMessage));
      };

      let isAuthenticated = false;
      const taskUUID = crypto.randomUUID();
      
      ws.onmessage = async (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Runware inpaint response:", JSON.stringify(response).substring(0, 500));
          
          if (response.error || response.errors) {
            clearTimeout(timeout);
            ws.close();
            const errorMessage = response.errorMessage || response.errors?.[0]?.message || "Runware inpainting error";
            reject(new Error(errorMessage));
            return;
          }

          if (response.data) {
            for (const item of response.data) {
              if (item.taskType === "authentication") {
                console.log("Runware authenticated, starting inpainting...");
                isAuthenticated = true;
                
                // Inpainting request with mask
                const inpaintMessage = [{
                  taskType: "imageInference",
                  taskUUID,
                  model: "runware:101@1", // Flux Kontext
                  positivePrompt: enhancedPrompt,
                  negativePrompt: "blurry, artifacts, distorted, unnatural edges, seams visible",
                  width: 1024,
                  height: 1024,
                  numberResults: 1,
                  outputFormat: "PNG",
                  CFGScale: 7.5,
                  scheduler: "FlowMatchEulerDiscreteScheduler",
                  steps: 30, // More steps for better inpainting
                  strength: 0.85, // Higher strength for inpainting masked areas
                  seedImage: imageUrl,
                  maskImage: maskDataUrl, // Black/white mask
                  includeCost: true,
                }];
                
                console.log("Sending inpaint request with mask...");
                ws.send(JSON.stringify(inpaintMessage));
              } else if (item.taskType === "imageInference" && item.taskUUID === taskUUID) {
                clearTimeout(timeout);
                ws.close();
                
                if (item.imageURL) {
                  console.log("Runware inpainting successful! Cost:", item.cost || "N/A");
                  
                  const imageResp = await fetch(item.imageURL);
                  if (!imageResp.ok) {
                    reject(new Error("Failed to download inpainted image from Runware"));
                    return;
                  }
                  const imageBlob = await imageResp.blob();
                  const base64 = await blobToBase64(imageBlob);
                  resolve(`data:image/png;base64,${base64}`);
                } else {
                  reject(new Error("No image URL in Runware inpainting response"));
                }
              }
            }
          }
        } catch (parseError) {
          console.error("Error parsing Runware inpaint response:", parseError);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error("WebSocket error during inpainting:", error);
        reject(new Error("Runware inpainting connection failed"));
      };

      ws.onclose = (event) => {
        console.log("Inpainting WebSocket closed:", event.code, event.reason);
        if (!isAuthenticated) {
          clearTimeout(timeout);
          reject(new Error("Runware inpainting connection closed before completion"));
        }
      };

    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

// Build enhanced prompt with embedded prompting rules
function buildEnhancedPrompt(userPrompt: string): string {
  // Detect edit type for context-aware prompting
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
  
  // Quality boosters embedded in prompt
  const qualityBoosters = "photorealistic, sharp details, natural lighting, 8K resolution, professional quality";
  
  return `${userPrompt}${contextualSuffix}, ${qualityBoosters}`;
}

// Build smart inpainting prompt - handles text separately from other content
function buildInpaintingPrompt(userPrompt: string): string {
  // Detect if user wants text/typography
  const isTextRequest = /\btext\b|write|word|letter|font|typography|caption|title|headline|label|sign|logo|saying|quote/i.test(userPrompt);
  
  // Detect removal requests
  const isRemoval = /remove|delete|erase|get rid of|clear|empty|clean|wipe/i.test(userPrompt);
  
  // Detect replacement requests
  const isReplacement = /replace|swap|change|transform|convert|turn into/i.test(userPrompt);
  
  if (isTextRequest) {
    // For text: AI models struggle with text, give simple clear instructions
    // NOTE: We still try, but results may be poor - user should use Text Tool for reliable text
    return `${userPrompt}, clean typography, high contrast, readable, sharp edges, centered in masked area`;
  } else if (isRemoval) {
    // For removal: focus on seamless fill
    return `${userPrompt}, seamless background continuation, natural fill, matching surrounding area exactly, no artifacts`;
  } else if (isReplacement) {
    // For replacement: focus on the new content fitting naturally
    return `${userPrompt}, seamless integration, matching lighting and perspective, natural appearance, high quality`;
  } else {
    // Default: general enhancement
    return `${userPrompt}, seamless blend, natural lighting, sharp details, high quality`;
  }
}

// ============================================
// SECONDARY: Pollinations AI Kontext (FREE backup)
// ============================================
async function editWithPollinationsKontext(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Pollinations AI Kontext (FREE)...");
  
  const editPrompt = `${prompt}, preserve original composition, subtle modification`;
  const encodedPrompt = encodeURIComponent(editPrompt);
  const encodedImageUrl = encodeURIComponent(imageUrl);
  
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=kontext&image=${encodedImageUrl}&width=1024&height=1024&nologo=true`;
  
  console.log("Pollinations Kontext URL:", pollinationsUrl.substring(0, 150) + "...");

  const response = await fetch(pollinationsUrl, {
    method: "GET",
    headers: { "Accept": "image/*" },
  });

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
    console.error("Pollinations returned non-image content:", contentType);
    throw new Error("Pollinations returned invalid content type");
  }

  const editedBlob = await response.blob();
  
  if (editedBlob.size < 5000) {
    console.error("Pollinations returned suspiciously small image:", editedBlob.size, "bytes");
    throw new Error("Pollinations returned invalid image");
  }
  
  const editedBase64 = await blobToBase64(editedBlob);
  
  console.log("Pollinations Kontext edit successful! Size:", editedBlob.size, "bytes");
  return `data:image/png;base64,${editedBase64}`;
}

// ============================================
// TERTIARY: Cloudflare Workers AI (FREE, size-limited)
// ============================================
async function editWithCloudflareAI(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Cloudflare Workers AI (img2img)...");
  
  const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
  const CF_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
  
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }

  console.log("Downloading source image for Cloudflare...");
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download source image: ${imageResponse.status}`);
  }
  const imageArrayBuffer = await imageResponse.arrayBuffer();
  const imageSizeBytes = imageArrayBuffer.byteLength;
  console.log("Source image size:", imageSizeBytes, "bytes");
  
  if (imageSizeBytes > 300000) {
    console.log("Image too large for Cloudflare AI (max ~300KB binary)");
    const error = new Error("IMAGE_TOO_LARGE");
    (error as any).status = 413;
    throw error;
  }
  
  const imageArray = Array.from(new Uint8Array(imageArrayBuffer));

  const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`;

  console.log("Sending request to Cloudflare Workers AI...");

  const response = await fetch(cfEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageArray,
      prompt: prompt,
      strength: 0.35,
      num_steps: 20,
      guidance: 7.5
    }),
  });

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
  console.log("Cloudflare Workers AI img2img edit successful!");
  return `data:image/png;base64,${editedBase64}`;
}

// ============================================
// FALLBACK: Lovable AI Gateway (Gemini) - uses credits
// ============================================
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
              image_url: { url: imageUrl }
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

// ============================================
// Main Handler
// ============================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, prompt, projectId, isGuest, useLovableAI, useRunware, maskDataUrl, isInpainting } = await req.json();

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

    if (!userId && !isGuest) {
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedPrompt = prompt.trim().slice(0, 1000);

    console.log("Editing image:", { 
      userId: userId ? userId.substring(0, 8) + '...' : 'guest', 
      prompt: sanitizedPrompt,
      isInpainting: !!isInpainting,
      hasMask: !!maskDataUrl
    });

    let editedImageData: string;
    let usedService: string;

    // Handle inpainting with mask
    if (isInpainting && maskDataUrl) {
      console.log("Processing inpainting request with mask...");
      try {
        editedImageData = await inpaintWithRunware(imageUrl, maskDataUrl, sanitizedPrompt);
        usedService = "Runware FLUX Kontext Inpainting";
      } catch (inpaintError: any) {
        console.warn("Runware inpainting failed:", inpaintError.message);
        // Fallback to regular edit with enhanced prompt
        const inpaintPrompt = `In the masked area: ${sanitizedPrompt}. Keep all other areas exactly the same.`;
        try {
          editedImageData = await editWithLovableAI(imageUrl, inpaintPrompt);
          usedService = "Lovable AI Gemini (inpainting fallback)";
        } catch (fallbackError: any) {
          console.error("Inpainting fallback failed:", fallbackError.message);
          return new Response(
            JSON.stringify({ 
              error: fallbackError.message || "Inpainting failed. Please try again.",
              code: "INPAINT_FAILED"
            }),
            { status: fallbackError.status || 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }
    // Strategy: Runware (primary) -> Pollinations -> Cloudflare -> Lovable AI
    else if (useLovableAI === true) {
      editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
      usedService = "Lovable AI Gemini (credits)";
    } else if (useRunware === true || Deno.env.get("RUNWARE_API_KEY")) {
      // Try Runware first if API key is configured
      try {
        editedImageData = await editWithRunware(imageUrl, sanitizedPrompt);
        usedService = "Runware FLUX Kontext (high-quality)";
      } catch (runwareError: any) {
        console.warn("Runware failed:", runwareError.message);
        
        // Fallback chain
        try {
          editedImageData = await editWithPollinationsKontext(imageUrl, sanitizedPrompt);
          usedService = "Pollinations Kontext (free)";
        } catch (kontextError: any) {
          console.warn("Pollinations Kontext failed:", kontextError.message);
          
          try {
            editedImageData = await editWithCloudflareAI(imageUrl, sanitizedPrompt);
            usedService = "Cloudflare Workers AI (free)";
          } catch (cfError: any) {
            console.warn("Cloudflare AI failed:", cfError.message);
            
            try {
              editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
              usedService = "Lovable AI Gemini (fallback)";
            } catch (lovableError: any) {
              console.error("All services failed. Last error:", lovableError.message);
              return new Response(
                JSON.stringify({ 
                  error: lovableError.message || "Image editing service temporarily unavailable.",
                  code: "EDIT_FAILED"
                }),
                { status: lovableError.status || 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }
        }
      }
    } else {
      // No Runware key, start with Pollinations
      try {
        editedImageData = await editWithPollinationsKontext(imageUrl, sanitizedPrompt);
        usedService = "Pollinations Kontext (free)";
      } catch (kontextError: any) {
        console.warn("Pollinations Kontext failed:", kontextError.message);
        
        try {
          editedImageData = await editWithCloudflareAI(imageUrl, sanitizedPrompt);
          usedService = "Cloudflare Workers AI (free)";
        } catch (cfError: any) {
          console.warn("Cloudflare AI failed:", cfError.message);
          
          try {
            editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
            usedService = "Lovable AI Gemini (fallback)";
          } catch (lovableError: any) {
            console.error("All services failed. Last error:", lovableError.message);
            return new Response(
              JSON.stringify({ 
                error: lovableError.message || "Image editing service temporarily unavailable.",
                code: "EDIT_FAILED"
              }),
              { status: lovableError.status || 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }
    }

    console.log(`Image edit completed via ${usedService}`);

    // Track edit usage after successful edit
    if (userId && supabaseClient) {
      await supabaseClient.rpc('increment_edit_usage', { user_id_param: userId });
    }

    // Upload the edited image to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
      if (!remoteResp.ok) throw new Error("Failed to download edited image");
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
      .upload(fileName, imageBytes, { contentType, upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to save edited image");
    }

    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(fileName);

    if (projectId) {
      await supabase
        .from("projects")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", projectId);
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
      message: error?.message || "Unknown error"
    });

    const status = error?.status || 500;
    const message = status === 500 
      ? `An unexpected error occurred. Reference: ${errorId}`
      : error?.message || "Failed to edit image";

    return new Response(
      JSON.stringify({ error: message, errorId }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
