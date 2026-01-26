import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Design-specific prompt templates - PRECISE, detailed instructions for high-quality output
const designTemplates: Record<string, { template: string; includesText: boolean }> = {
  logo: {
    template: "PRECISE LOGO DESIGN: Create a professional, modern logo with clean vector-style graphics. Use minimalist geometric shapes, bold iconic symbol, flat design with 2-3 colors maximum. Corporate-grade quality, scalable design, centered composition on solid white or transparent background. The logo must be memorable, unique, and instantly recognizable.",
    includesText: true
  },
  social: {
    template: "PRECISE SOCIAL MEDIA POST: Create a visually striking Instagram/Facebook post with perfect 1:1 composition. Use bold, eye-catching colors with high contrast. Include clear visual hierarchy with prominent headline text, engaging imagery, and professional layout. Modern gradient backgrounds with geometric accents. Marketing-ready, scroll-stopping design.",
    includesText: true
  },
  banner: {
    template: "PRECISE WEB BANNER: Create a professional horizontal banner with 16:9 aspect ratio. Use clean, modern layout with bold headline on left/center, compelling visuals on right. High contrast colors, readable sans-serif typography, clear call-to-action area. Marketing-grade quality, web-optimized composition.",
    includesText: true
  },
  poster: {
    template: "PRECISE EVENT POSTER: Create a professional vertical poster with striking visual impact. Use bold typography hierarchy (title largest, details smaller), balanced composition, dramatic colors. Include space for event details, date, and venue. Print-ready quality, attention-grabbing from distance.",
    includesText: true
  },
  default: {
    template: "PRECISE GRAPHIC DESIGN: Create a professional, modern graphic with clean aesthetics, balanced composition, and high-quality execution. Use appropriate colors and clear visual hierarchy.",
    includesText: false
  },
};

// PRECISE text generation prompts for typography
const textPrompts: Record<string, string> = {
  logo: "Render the brand name in stylized, legible typography that complements the icon. Text must be crisp and professional.",
  social: "Include ONE bold headline (3-5 words max), optional subtitle. Typography must be large, readable, and perfectly aligned.",
  banner: "Include main headline (5-7 words), brief subtitle, CTA text. All text must be crisp, properly kerned, and highly readable.",
  poster: "Include event title prominently, date/time, location. Use clear typographic hierarchy. All text must be spelled correctly and legible.",
};

// Size mapping for Pollinations API - optimized dimensions
const sizeMap: Record<string, { width: number; height: number }> = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 832, height: 1216 },
  landscape: { width: 1216, height: 832 },
};

// Generate with Pollinations AI (free, no API key)
async function generateWithPollinations(styledPrompt: string, dimensions: { width: number; height: number }): Promise<string> {
  const encodedPrompt = encodeURIComponent(styledPrompt);
  const pollinationsUrl = new URL(`https://image.pollinations.ai/prompt/${encodedPrompt}`);
  
  pollinationsUrl.searchParams.set("model", "flux");
  pollinationsUrl.searchParams.set("width", dimensions.width.toString());
  pollinationsUrl.searchParams.set("height", dimensions.height.toString());
  pollinationsUrl.searchParams.set("nologo", "true");
  pollinationsUrl.searchParams.set("enhance", "true");
  pollinationsUrl.searchParams.set("seed", Math.floor(Math.random() * 1000000).toString());

  console.log("Trying Pollinations AI...");
  
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

// Fallback to Lovable AI (Gemini) if Pollinations fails
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
      model: "google/gemini-2.5-flash-image-preview",
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
    const templateConfig = designTemplates[designType] || designTemplates.default;
    const template = templateConfig.template;
    const textPrompt = textPrompts[designType] || "";
    
    // Get dimensions based on size
    const dimensions = sizeMap[size] || sizeMap.square;

    // Build PRECISE optimized prompt with strict quality instructions
    const promptParts = [
      `DESIGN REQUEST: ${sanitizedPrompt}`,
      template,
      style ? `Style: ${style} aesthetic with professional execution` : null,
    ];
    
    // Add text-specific instructions for designs that need text
    if (templateConfig.includesText && textPrompt) {
      promptParts.push(`TYPOGRAPHY: ${textPrompt}`);
      promptParts.push("CRITICAL: All text must be spelled correctly, perfectly rendered, crisp, and highly legible");
    }
    
    // Quality enforcement
    promptParts.push("QUALITY: 8K ultra HD resolution, razor-sharp details, professional studio quality");
    promptParts.push("RESTRICTIONS: NO photorealistic human faces, NO AI artifacts, NO blurry elements, NO watermarks");
    
    const styledPrompt = promptParts.filter(Boolean).join(". ");

    console.log("Design generation request:", { 
      userId: userId ? userId.substring(0, 8) + '...' : 'guest',
      designType, 
      style, 
      size, 
      dimensions
    });

    let imageUrl: string;

    // Try Pollinations first (free), fallback to Lovable AI
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
        throw new Error("Both AI services failed. Please try again.");
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
