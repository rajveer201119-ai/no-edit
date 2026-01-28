import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Design-specific prompt templates - STRICTLY TEXT-FREE designs only
// CRITICAL: These templates MUST enforce zero text/typography output
const designTemplates: Record<string, string> = {
  logo: "ABSTRACT LOGO ICON ONLY: Create a PURE SYMBOL/ICON design with geometric shapes, abstract forms, or stylized imagery. NO TEXT, NO LETTERS, NO INITIALS, NO MONOGRAMS, NO WORDMARKS. Only visual icon with clean vector aesthetic, 2-3 colors max, centered on solid background. Think Apple logo, Nike swoosh, Twitter bird - PURE ICON ONLY.",
  social: "SOCIAL MEDIA VISUAL BACKGROUND: Create an eye-catching abstract background image with bold gradients, geometric patterns, or artistic imagery. This is a TEMPLATE BACKGROUND where text will be added later. Generate ONLY colors, shapes, patterns, illustrations - ABSOLUTELY ZERO TEXT, LETTERS, OR WORDS.",
  banner: "WEB BANNER BACKGROUND IMAGE: Create a horizontal background with abstract visuals, gradients, or artistic elements. This is a TEMPLATE where text will be overlaid. Generate ONLY visual elements - NO TEXT, NO LETTERS, NO WORDS, NO TYPOGRAPHY OF ANY KIND.",
  poster: "POSTER BACKGROUND VISUAL: Create a vertical artistic background with dramatic colors and visual impact. This is a TEMPLATE for text overlay. Generate ONLY imagery and colors - ABSOLUTELY NO TEXT, NO LETTERS, NO NUMBERS, NO DATES, NO WORDS.",
  default: "ABSTRACT GRAPHIC: Professional visual design with shapes, colors, and artistic elements. ZERO TEXT OR TYPOGRAPHY - only pure visual graphics.",
};

// Size mapping - optimized dimensions
const sizeMap: Record<string, { width: number; height: number }> = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 832, height: 1216 },
  landscape: { width: 1216, height: 832 },
};

// ============================================
// PRIMARY: Pollinations AI (FREE, fast, reliable)
// Uses FLUX model for high-quality generation
// ============================================
async function generateWithPollinations(styledPrompt: string, dimensions: { width: number; height: number }): Promise<string> {
  console.log("Generating image with Pollinations AI (FLUX model)...");
  
  // Build STRICT text-free enforced prompt with maximum emphasis
  const textFreePrompt = `${styledPrompt}. 

MANDATORY RULES - FOLLOW EXACTLY:
1. Generate ONLY visual graphics, abstract shapes, colors, patterns, icons, or imagery
2. DO NOT include ANY text, letters, words, numbers, or typography
3. DO NOT include ANY watermarks, signatures, labels, or captions
4. DO NOT include ANY brand names, initials, monograms, or wordmarks
5. The output must be 100% text-free - pure visual design only
6. If the prompt mentions a name or brand, create an ABSTRACT SYMBOL to represent it, not text`;
  
  const encodedPrompt = encodeURIComponent(textFreePrompt);
  const pollinationsUrl = new URL(`https://image.pollinations.ai/prompt/${encodedPrompt}`);
  
  // Set parameters for best quality
  pollinationsUrl.searchParams.set("model", "flux");
  pollinationsUrl.searchParams.set("width", dimensions.width.toString());
  pollinationsUrl.searchParams.set("height", dimensions.height.toString());
  pollinationsUrl.searchParams.set("nologo", "true");
  pollinationsUrl.searchParams.set("enhance", "true");
  pollinationsUrl.searchParams.set("seed", Math.floor(Math.random() * 1000000).toString());
  // Maximum aggressive negative prompt to completely exclude ANY text
  pollinationsUrl.searchParams.set("negative", "text, letters, words, alphabet, typography, watermark, signature, logo text, brand name, company name, writing, numbers, digits, dates, captions, labels, titles, headlines, slogans, inscriptions, fonts, handwriting, printed text, written content, initials, monogram, letterform, calligraphy, script, any readable characters, wordmark, logotype, lettering, characters, symbols that look like letters, gibberish text, random letters, decorative text, artistic text, stylized text, embossed text, 3d text");

  console.log("Pollinations URL generated, fetching image...");
  
  // Fetch with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout
  
  try {
    const response = await fetch(pollinationsUrl.toString(), {
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
      
      throw new Error(`Pollinations failed: ${response.status}`);
    }

    // Validate content type
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.error("Pollinations returned non-image:", contentType);
      throw new Error("Invalid response from Pollinations");
    }

    console.log("Pollinations AI generation successful!");
    return pollinationsUrl.toString();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Pollinations request timed out. Please try again.");
    }
    throw error;
  }
}

// ============================================
// SECONDARY: Lovable AI (Gemini) - uses credits
// ============================================
async function generateWithLovableAI(styledPrompt: string): Promise<string> {
  console.log("Generating image with Lovable AI (Gemini)...");
  
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const textFreePrompt = `${styledPrompt}. IMPORTANT: Generate ONLY visual graphics with NO text, letters, words, or typography anywhere in the image.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: textFreePrompt }],
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
        const error = new Error("AI credits exhausted. Please try again later.");
        (error as any).status = 402;
        throw error;
      }
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error("Lovable AI generation failed");
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      console.error("No image in Lovable AI response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No image returned from Lovable AI");
    }

    console.log("Lovable AI generation successful!");
    return generatedImageUrl;
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

    const { prompt, style, size, designType, isGuest } = body;

    // Validate design type
    const validDesignTypes = ["logo", "social", "banner", "poster"];
    if (!designType || !validDesignTypes.includes(designType)) {
      return new Response(
        JSON.stringify({ error: "Please select a design type (Logo, Social Post, Banner, or Poster)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Please enter a description for your design." }),
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
          const { data: limitData, error: limitError } = await supabaseClient.rpc('check_generation_limit', {
            user_id_param: userId
          });

          if (limitError) {
            console.error("Rate limit check error:", limitError);
          } else if (!limitData?.[0]?.can_generate) {
            return new Response(
              JSON.stringify({ error: "Daily generation limit reached. Upgrade to Pro for more generations." }),
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

    if (isGuest && !userId) {
      console.log("Guest generation request");
    }

    // Sanitize and limit prompt length
    const sanitizedPrompt = prompt.trim().slice(0, 1000);

    // Get template and dimensions
    const template = designTemplates[designType] || designTemplates.default;
    const dimensions = sizeMap[size] || sizeMap.square;

    // Build final prompt with text-free enforcement
    const promptParts = [
      `DESIGN REQUEST: ${sanitizedPrompt}`,
      template,
      style ? `Style: ${style} aesthetic with professional execution` : null,
      "QUALITY: 8K ultra HD, razor-sharp details, professional studio quality, clean design",
      "RESTRICTIONS: NO text, NO letters, NO words, NO numbers, NO watermarks, NO AI artifacts",
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

    // PRIMARY: Pollinations AI, FALLBACK: Lovable AI
    try {
      imageUrl = await generateWithPollinations(styledPrompt, dimensions);
      console.log("Design generated successfully via Pollinations AI (FLUX)");
    } catch (pollinationsError: any) {
      console.warn("Pollinations failed:", pollinationsError.message);
      
      // Check if it's a rate limit error - pass through
      if (pollinationsError.status === 429) {
        return new Response(
          JSON.stringify({ error: pollinationsError.message }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Fallback to Lovable AI
      try {
        imageUrl = await generateWithLovableAI(styledPrompt);
        console.log("Design generated successfully via Lovable AI (Gemini) fallback");
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
          JSON.stringify({ error: "Image generation service temporarily unavailable. Please try again." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Track usage after successful generation (authenticated users only)
    if (userId && supabaseClient) {
      try {
        await supabaseClient.rpc('increment_generation_usage', {
          user_id_param: userId
        });
      } catch (usageError) {
        console.error("Usage tracking error:", usageError);
        // Don't fail the request for usage tracking errors
      }
    }

    return new Response(
      JSON.stringify({ imageUrl, prompt: styledPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    // Generate error ID for debugging
    const errorId = crypto.randomUUID().substring(0, 8);
    
    console.error(`[${errorId}] Generation error:`, {
      timestamp: new Date().toISOString(),
      message: error?.message || "Unknown error",
      type: error?.constructor?.name || "Unknown"
    });

    // Map to safe user-facing messages
    let clientMessage = "Failed to generate image. Please try again.";
    let statusCode = 500;

    if (error?.message?.includes("Rate limit") || error?.status === 429) {
      clientMessage = "Too many requests. Please try again in a moment.";
      statusCode = 429;
    } else if (error?.message?.includes("credits") || error?.status === 402) {
      clientMessage = "Service temporarily unavailable. Please try again later.";
      statusCode = 503;
    } else if (error?.message?.includes("timeout")) {
      clientMessage = "Request timed out. Please try again.";
      statusCode = 504;
    }

    return new Response(
      JSON.stringify({ error: clientMessage, errorId }),
      { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
