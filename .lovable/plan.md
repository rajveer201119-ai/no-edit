

# Plan: Reduce Lovable AI Credit Usage with Hugging Face Image Editing

## Problem Statement

Every AI-powered image edit currently consumes Lovable AI credits via Gemini 2.5 Flash. Users are running out of credits quickly because each edit costs 1 credit, and there's no free alternative being used.

**Your previous suggestion (Pollinations AI) doesn't work** because it's a text-to-image generator that creates entirely new images instead of editing existing ones.

## Solution: Use Hugging Face's InstructPix2Pix Model

Good news: You already have `HUGGING_FACE_ACCESS_TOKEN` configured in your secrets! We can use Hugging Face's **Inference API** with the `timbrooks/instruct-pix2pix` model, which:

- ✅ Accepts an input image
- ✅ Applies targeted edits based on text prompts
- ✅ Preserves original composition
- ✅ Is **free** within Hugging Face's rate limits (no cost per request)

```text
User Edit Request
       │
       ▼
┌─────────────────────┐
│   Hugging Face      │  ◄── Try first (FREE)
│  InstructPix2Pix    │
│  (img2img editing)  │
└─────────────────────┘
       │
   Fails?
       │
       ▼
┌─────────────────────┐
│   Lovable AI        │  ◄── Fallback only
│   (Gemini)          │      (uses credits)
└─────────────────────┘
       │
       ▼
   Return edited image
```

## Implementation Steps

### Step 1: Add Hugging Face Editing Function

Create a new `editWithHuggingFace()` function in the edge function that:

1. Downloads the source image as a blob
2. Sends it to Hugging Face's inference API with the `timbrooks/instruct-pix2pix` model
3. Receives the edited image back
4. Converts to base64 for storage

**Technical Details:**
```typescript
async function editWithHuggingFace(
  imageUrl: string, 
  prompt: string
): Promise<string> {
  const HF_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
  
  // Download source image
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();
  
  // Call Hugging Face img2img API
  const response = await fetch(
    "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: await blobToBase64(imageBlob),
          prompt: prompt,
        },
        parameters: {
          guidance_scale: 7.5,
          image_guidance_scale: 1.5,
        }
      }),
    }
  );
  
  // Response is the edited image as binary
  const editedImageBlob = await response.blob();
  return await blobToBase64(editedImageBlob);
}
```

### Step 2: Implement Try/Fallback Pattern

Update the main request handler:

```typescript
let editedImageData: string;
let usedService: string;

try {
  editedImageData = await editWithHuggingFace(imageUrl, sanitizedPrompt);
  usedService = "Hugging Face (free)";
  console.log("Edit completed via Hugging Face InstructPix2Pix");
} catch (hfError) {
  console.warn("Hugging Face failed, falling back to Lovable AI:", hfError);
  editedImageData = await editWithLovableAI(imageUrl, sanitizedPrompt);
  usedService = "Lovable AI (credits)";
}
```

### Step 3: Handle Hugging Face Specifics

- **Rate Limits**: HF free tier has rate limits (~30 requests/hour) - on rate limit, fallback to Lovable AI
- **Model Loading**: First request may be slow (model cold start) - handle with timeout and fallback
- **Response Format**: HF returns binary image directly, not JSON - convert appropriately

### Step 4: Add Logging for Monitoring

Log which service was used for each edit so you can track credit savings:

```typescript
console.log(`Edit completed via ${usedService}`);
```

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Primary Service | Lovable AI (always) | Hugging Face (free) |
| Fallback Service | None | Lovable AI (when HF fails) |
| Credits per Edit | 1 credit always | 0 credits (HF) or 1 credit (fallback) |
| Estimated Savings | 0% | 70-90% (most edits via free HF) |

## Why This Works (Unlike Pollinations)

| Feature | Pollinations | Hugging Face InstructPix2Pix |
|---------|--------------|------------------------------|
| Accepts input image | ❌ No | ✅ Yes |
| True image editing | ❌ No (generates new) | ✅ Yes (modifies original) |
| Preserves composition | ❌ No | ✅ Yes |
| Free to use | ✅ Yes | ✅ Yes (with rate limits) |

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/edit-image/index.ts` | Add `editWithHuggingFace()` function, implement try/fallback logic, add base64 conversion helper |

## Limitations & Considerations

1. **Hugging Face Rate Limits**: Free tier allows ~30 requests/hour. Heavy users may still hit Lovable AI fallback.

2. **Model Cold Starts**: First request after inactivity may take 20-60 seconds while model loads. Consider showing a "warming up" message or implementing a timeout with fallback.

3. **Edit Quality**: InstructPix2Pix is excellent for style changes and simple edits, but Gemini may still produce better results for complex, nuanced edits. Users always get a working result due to fallback.

## No Frontend Changes Required

The API contract remains identical - users won't notice any difference except their credits lasting much longer!

