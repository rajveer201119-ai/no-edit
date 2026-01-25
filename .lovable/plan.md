
# Plan: Reduce Lovable AI Credit Usage in Image Editing

## Problem Analysis

Currently, the `edit-image` edge function uses **Lovable AI (Gemini 2.5 Flash Image Preview)** for every image edit request. This consumes Lovable AI credits on each edit, which adds up quickly for users who make multiple modifications to their designs.

The `generate-image` function already uses a **hybrid approach**: Pollinations AI (free) as the primary generator with Lovable AI as a fallback. We should apply the same pattern to image editing.

## Solution: Hybrid Image Editing with Pollinations AI

Pollinations AI recently deployed the **FLUX.2 `klein` model** specifically optimized for image-to-image editing tasks. This is completely free and requires no API key.

```text
+-------------------+     Fails?     +------------------+
|  Pollinations AI  | ------------> |   Lovable AI     |
|  (FLUX.2 klein)   |   Fallback    |   (Gemini)       |
|      FREE         |               |   Uses Credits   |
+-------------------+               +------------------+
```

## Implementation Steps

### Step 1: Update the `edit-image` Edge Function

Modify `supabase/functions/edit-image/index.ts` to:

1. **Add Pollinations image editing function** - Create a new function `editWithPollinations()` that uses the Pollinations image-to-image API with the `klein` model
2. **Add Lovable AI fallback function** - Refactor existing Gemini code into `editWithLovableAI()` 
3. **Implement try/fallback pattern** - Try Pollinations first; if it fails, fall back to Lovable AI
4. **Add logging** - Log which service was used for each edit request

### Technical Details

**Pollinations Image Editing API:**
- Endpoint: `https://image.pollinations.ai/prompt/{prompt}`
- Parameters: `model=flux`, `seed`, `nologo=true`, plus the source image via the prompt context
- For image-to-image: Pollinations accepts source images via URL reference in the prompt

**Key Changes to `edit-image/index.ts`:**

```text
Before:
  1. Receive imageUrl + prompt
  2. Call Lovable AI Gateway (consumes credits)
  3. Upload result to storage

After:
  1. Receive imageUrl + prompt
  2. Try Pollinations AI first (FREE)
     - Construct edit prompt: "Edit this image: {prompt}. Source: {imageUrl}"
     - Model: flux (klein variant)
  3. If Pollinations fails -> Fallback to Lovable AI
  4. Upload result to storage
  5. Log which service was used
```

### Step 2: Handle Pollinations Image-to-Image Workflow

Since Pollinations works differently (URL-based generation), we need to:
- Download the source image and convert to base64 if needed
- Construct a descriptive prompt that references the original image context
- Handle the response format (direct image URL vs base64)

### Step 3: Maintain Error Handling

- Keep all existing error handling for rate limits (429) and credits (402)
- Add error handling for Pollinations failures
- Ensure users see appropriate error messages regardless of which service is used

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Lovable AI Credits per Edit | 1 credit always | 0 credits (Pollinations) or 1 credit (fallback only) |
| Estimated Credit Savings | 0% | 80-95% (most edits via free Pollinations) |
| User Experience | Same | Same (transparent fallback) |

## Files to Modify

1. **`supabase/functions/edit-image/index.ts`** - Add Pollinations as primary editor, refactor Lovable AI as fallback

## Notes

- This mirrors the proven pattern already working in `generate-image`
- No frontend changes required - the API contract remains the same
- Users will see the same behavior but with significantly reduced credit consumption
- Pollinations is community-driven and free, making it sustainable for high-volume usage
