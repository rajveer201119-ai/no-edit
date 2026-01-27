

# Implement Stable Diffusion XL (SDXL) Image Editing Pipeline

## Overview

Replace the current Cloudflare Workers AI img2img with Stable Diffusion XL via Hugging Face's Inference API for higher quality, more precise image editing with better structural preservation.

---

## Current Architecture

```text
edit-image edge function
    |
    +-- PRIMARY: Cloudflare Workers AI (SD 1.5 img2img)
    |       - Free, but limited quality
    |       - Issues with excessive changes
    |
    +-- FALLBACK: Lovable AI (Gemini)
            - Uses credits
            - Better for complex edits
```

## New Architecture

```text
edit-image edge function
    |
    +-- PRIMARY: Hugging Face SDXL img2img
    |       - stabilityai/stable-diffusion-xl-refiner-1.0
    |       - High quality, 1024x1024 output
    |       - Conservative strength for preservation
    |
    +-- FALLBACK: Lovable AI (Gemini)
            - Only used when HF fails/rate-limited
```

---

## Implementation Details

### Step 1: Replace Cloudflare with SDXL via Hugging Face

**File:** `supabase/functions/edit-image/index.ts`

Replace the `editWithCloudflareAI` function with a new `editWithSDXL` function that:

1. **Uses the new Hugging Face Router API** (the old api-inference.huggingface.co is deprecated)
   - Endpoint: `https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-refiner-1.0`
   - Uses `HUGGING_FACE_ACCESS_TOKEN` (already configured)

2. **Sends the source image as base64** for img2img processing

3. **Applies conservative parameters** for structural preservation:
   - `strength: 0.25-0.35` - Low strength to preserve original composition
   - `guidance_scale: 7.5` - Balanced prompt adherence
   - `num_inference_steps: 30` - Quality steps

4. **Enhanced prompt engineering** for preservation:
   ```text
   Prompt: "{user_edit}, preserve original composition, maintain layout, subtle modification, high quality"
   Negative: "distorted, blurry, major changes, different composition, text, watermark"
   ```

### Step 2: Model Selection Strategy

Use a tiered approach for different edit types:

| Edit Type | Model | Reason |
|-----------|-------|--------|
| Style/color edits | SDXL Refiner | Best for subtle adjustments |
| Complex edits | SDXL Base + Refiner | Two-stage for quality |
| Fallback | Lovable AI Gemini | Credits-based backup |

For this implementation, we'll use **SDXL Refiner** as it's optimized for image-to-image refinement with excellent preservation characteristics.

### Step 3: Code Changes

```typescript
// New SDXL editing function
async function editWithSDXL(imageUrl: string, prompt: string): Promise<string> {
  console.log("Editing image with Stable Diffusion XL...");
  
  const HF_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
  if (!HF_TOKEN) {
    throw new Error("Hugging Face token not configured");
  }

  // Download and convert source image to base64
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to download source image");
  }
  const imageBlob = await imageResponse.blob();
  const imageBase64 = await blobToBase64(imageBlob);

  // SDXL img2img endpoint via HF Router
  const hfEndpoint = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-refiner-1.0";

  // Preservation-focused prompt engineering
  const enhancedPrompt = `${prompt}, preserve original composition, maintain original style, subtle refinement, high quality, detailed, professional`;
  
  const negativePrompt = "distorted, blurry, low quality, different layout, major changes, text, watermark, signature, artifacts";

  const response = await fetch(hfEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: imageBase64,
      parameters: {
        prompt: enhancedPrompt,
        negative_prompt: negativePrompt,
        strength: 0.3,           // Conservative for preservation
        guidance_scale: 7.5,     // Balanced prompt adherence
        num_inference_steps: 30  // Quality output
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("SDXL error:", response.status, errorText);
    
    if (response.status === 429) {
      const error = new Error("Rate limit exceeded");
      (error as any).status = 429;
      throw error;
    }
    if (response.status === 503) {
      const error = new Error("Model is loading, please retry");
      (error as any).status = 503;
      throw error;
    }
    
    throw new Error(`SDXL failed: ${response.status}`);
  }

  // HF returns image as binary blob
  const editedBlob = await response.blob();
  const editedBase64 = await blobToBase64(editedBlob);
  
  console.log("SDXL edit successful");
  return `data:image/png;base64,${editedBase64}`;
}
```

### Step 4: Update Main Handler

Update the try/catch chain to use SDXL as primary:

```typescript
// Try SDXL first (free via HF), fallback to Lovable AI
try {
  editedImageData = await editWithSDXL(imageUrl, sanitizedPrompt);
  usedService = "Stable Diffusion XL (free)";
} catch (sdxlError: any) {
  console.warn("SDXL failed, falling back to Lovable AI:", sdxlError.message);
  
  try {
    editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
    usedService = "Lovable AI Gemini (credits)";
  } catch (lovableError: any) {
    // Handle rate limit and credit errors...
  }
}
```

---

## Parameter Tuning for Preservation

The key to preserving the original image while applying edits is in the parameters:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `strength` | 0.25-0.35 | Lower = more preservation, higher = more change |
| `guidance_scale` | 7.0-8.0 | How closely to follow the prompt |
| `num_inference_steps` | 25-30 | Quality of output |

For your use case (preventing "too much change"), we'll use:
- **strength: 0.3** - Preserves ~70% of original image structure
- **guidance_scale: 7.5** - Balanced prompt following
- **num_inference_steps: 30** - High quality output

---

## Alternative Models (If Refiner Doesn't Perform Well)

If the SDXL Refiner doesn't meet quality expectations, we can try:

1. **stabilityai/stable-diffusion-xl-base-1.0** - Full SDXL base model
2. **timbrooks/instruct-pix2pix** - Instruction-based editing (already available)
3. **diffusers/controlnet-sdxl** - With structural guidance

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/edit-image/index.ts` | Replace Cloudflare function with SDXL, update handler |

---

## Expected Outcomes

After implementation:
- Higher quality edits with better texture and lighting
- Preserved composition, layout, and proportions
- Conservative edits that don't drastically change the image
- Free usage via Hugging Face (with rate limits)
- Automatic fallback to Lovable AI when needed

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| HF model cold starts (503) | Retry logic with delay, fallback to Lovable AI |
| Rate limits (429) | Graceful fallback with user-friendly message |
| Quality issues | Tunable strength parameter, can adjust per feedback |

