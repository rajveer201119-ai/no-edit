import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Design-specific prompt templates - TEXT-FREE designs (user adds text manually)
const designTemplates: Record<string, string> = {
  logo: "PRECISE LOGO DESIGN: Create a professional, modern logo ICON ONLY with clean vector-style graphics. Use minimalist geometric shapes, bold iconic symbol, flat design with 2-3 colors maximum. Corporate-grade quality, scalable design, centered composition on solid white or transparent background. The logo must be memorable, unique, and instantly recognizable. DO NOT include any text, letters, words, or typography - icon/symbol only.",
  social: "PRECISE SOCIAL MEDIA GRAPHIC: Create a visually striking Instagram/Facebook post background with perfect 1:1 composition. Use bold, eye-catching colors with high contrast. Include engaging imagery, modern gradient backgrounds with geometric accents. Marketing-ready, scroll-stopping visual design. DO NOT include any text, letters, words, numbers, or typography - visual elements only.",
  banner: "PRECISE WEB BANNER BACKGROUND: Create a professional horizontal banner with 16:9 aspect ratio. Use clean, modern layout with compelling visuals and graphics. High contrast colors, dynamic composition. Marketing-grade quality, web-optimized visual design. DO NOT include any text, letters, words, or typography - visual/graphic elements only.",
  poster: "PRECISE EVENT POSTER BACKGROUND: Create a professional vertical poster with striking visual impact. Use dramatic colors, balanced composition, eye-catching graphics and imagery. Print-ready quality, attention-grabbing visual design. DO NOT include any text, letters, words, numbers, dates, or typography - visual elements only.",
  default: "PRECISE GRAPHIC DESIGN: Create a professional, modern graphic with clean aesthetics, balanced composition, and high-quality execution. Use appropriate colors and clear visual hierarchy. DO NOT include any text, letters, or typography.",
};

// Size mapping for API - optimized dimensions
const sizeMap: Record<string, { width: number; height: number }> = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 832, height: 1216 },
  landscape: { width: 1216, height: 832 },
};

// ============================================
// PRIMARY: Runware API with FLUX Model
// High-quality image generation
// ============================================
async function generateWithRunware(prompt: string, dimensions: { width: number; height: number }): Promise<string> {
  console.log("Generating image with Runware API (FLUX)...");
  
  const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY");
  if (!RUNWARE_API_KEY) {
    throw new Error("RUNWARE_API_KEY not configured");
  }

  const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

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
                console.log("Runware authenticated, starting image generation...");
                isAuthenticated = true;
                
                // Step 2: Send image generation request with STRONG anti-text instructions
                const generateMessage = [{
                  taskType: "imageInference",
                  taskUUID,
                  model: "runware:100@1", // FLUX model for text-to-image
                  positivePrompt: prompt,
                  negativePrompt: "text, letters, words, typography, watermark, signature, logo text, brand name, writing, alphabet, numbers, digits, dates, captions, labels, titles, headlines, slogans, inscriptions, characters, symbols with letters, fonts, handwriting, printed text, any written content, blurry, low quality, distorted, artifacts, pixelated",
                  width: dimensions.width,
                  height: dimensions.height,
                  numberResults: 1,
                  outputFormat: "PNG",
                  CFGScale: 7.5,
                  scheduler: "FlowMatchEulerDiscreteScheduler",
                  steps: 25,
                  includeCost: true,
                }];
                
                console.log("Sending generation request:", dimensions);
                ws.send(JSON.stringify(generateMessage));
              } else if (item.taskType === "imageInference" && item.taskUUID === taskUUID) {
                clearTimeout(timeout);
                ws.close();
                
                if (item.imageURL) {
                  console.log("Runware generation successful! Cost:", item.cost || "N/A");
                  resolve(item.imageURL);
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
// SECONDARY: Pollinations AI (free, no API key)
// ============================================
async function generateWithPollinations(styledPrompt: string, dimensions: { width: number; height: number }): Promise<string> {
  const encodedPrompt = encodeURIComponent(styledPrompt);
  const pollinationsUrl = new URL(`https://image.pollinations.ai/prompt/${encodedPrompt}`);
  
  pollinationsUrl.searchParams.set("model", "flux");
  pollinationsUrl.searchParams.set("width", dimensions.width.toString());
  pollinationsUrl.searchParams.set("height", dimensions.height.toString());
  pollinationsUrl.searchParams.set("nologo", "true");
  pollinationsUrl.searchParams.set("enhance", "true");
  pollinationsUrl.searchParams.set("seed", Math.floor(Math.random() * 1000000).toString());

  console.log("Trying Pollinations AI fallback...");
  
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

// ============================================
// TERTIARY: Lovable AI (Gemini) fallback
// ============================================
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
      model: "google/gemini-2.5-flash-image",
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
    const { prompt, style, size, designType, isGuest } = await req.json();

    // Validate design type is provided and valid
    const validDesignTypes = ["logo", "social", "banner", "poster"];
    if (!designType || !validDesignTypes.includes(designType)) {
      return new Response(
        JSON.stringify({ error: "Please select a design type (Logo, Social Post, Banner, or Poster)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    // Handle authenticated users
    if (authHeader?.startsWith('Bearer ')) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );

      const token = authHeader.replace('Bearer ', '');
      const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
      
      if (!claimsError && claimsData?.claims?.sub) {
        userId = claimsData.claims.sub;

        // Check rate limits for authenticated users
        const { data: limitData, error: limitError } = await supabaseClient.rpc('check_generation_limit', {
          user_id_param: userId
        });

        if (limitError || !limitData?.[0]?.can_generate) {
          return new Response(
            JSON.stringify({ error: "Daily generation limit reached. Upgrade to Pro for more generations." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // For guest users (isGuest=true and no valid userId), allow one generation
    // The client-side tracks this via localStorage
    if (!userId && !isGuest) {
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Guest mode: proceed without auth but log it
    if (isGuest && !userId) {
      console.log("Guest generation request");
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Please enter a description for your design." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation - limit prompt length
    const sanitizedPrompt = prompt.trim().slice(0, 1000);

    // Get the design template based on type
    const template = designTemplates[designType] || designTemplates.default;
    
    // Get dimensions based on size
    const dimensions = sizeMap[size] || sizeMap.square;

    // Build PRECISE optimized prompt with STRICT TEXT-FREE instructions
    const promptParts = [
      `DESIGN REQUEST: ${sanitizedPrompt}`,
      template,
      style ? `Style: ${style} aesthetic with professional execution` : null,
      // STRICT no-text instruction - repeated for emphasis
      "ABSOLUTELY NO TEXT: This design must contain ZERO text, letters, words, numbers, dates, typography, logos with text, brand names, watermarks, signatures, captions, labels, titles, slogans, or any written content whatsoever. Generate ONLY pure visual and graphic elements. The entire image must be completely text-free and typography-free.",
      // Quality enforcement
      "QUALITY: 8K ultra HD resolution, razor-sharp details, professional studio quality, clean minimalist design",
      "RESTRICTIONS: NO text, NO letters, NO words, NO numbers, NO photorealistic human faces, NO AI artifacts, NO blurry elements, NO watermarks",
    ];
    
    const styledPrompt = promptParts.filter(Boolean).join(". ");

    console.log("Design generation request:", { 
      userId: userId ? userId.substring(0, 8) + '...' : 'guest',
      designType, 
      style, 
      size, 
      dimensions
    });

    let imageUrl: string;

    // Try Runware first (high quality), fallback to Pollinations, then Lovable AI
    try {
      imageUrl = await generateWithRunware(styledPrompt, dimensions);
      console.log("Design generated successfully via Runware API (FLUX)");
    } catch (runwareError) {
      console.warn("Runware failed, trying Pollinations fallback:", runwareError);
      
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
          throw new Error("All AI services failed. Please try again.");
        }
      }
    }

    // Track usage after successful generation (only for authenticated users)
    if (userId) {
      const authHeader = req.headers.get('Authorization');
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader! } } }
      );
      await supabaseClient.rpc('increment_generation_usage', {
        user_id_param: userId
      });
    }

    return new Response(JSON.stringify({ imageUrl, prompt: styledPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Generate error ID for support correlation
    const errorId = crypto.randomUUID().substring(0, 8);
    
    // Safe server-side logging (no sensitive data)
    console.error(`[${errorId}] Generation error:`, {
      timestamp: new Date().toISOString(),
      errorType: error?.constructor?.name || 'Unknown'
    });

    // Map to safe user-facing messages
    let clientMessage = "Failed to generate image. Please try again.";
    let statusCode = 500;

    if (error?.message?.includes("Rate limit")) {
      clientMessage = "Too many requests. Please try again in a moment.";
      statusCode = 429;
    } else if (error?.message?.includes("credits") || error?.message?.includes("402")) {
      clientMessage = "Service temporarily unavailable. Please try again later.";
      statusCode = 503;
    }

    return new Response(
      JSON.stringify({ error: clientMessage, errorId }),
      { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
