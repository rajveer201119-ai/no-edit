

# Plan: Switch to Pollinations AI for Image Generation

## Overview
Replace Lovable AI with Pollinations AI (free, no API key required) for **image generation only**, while keeping Lovable AI for the **image editing** feature. Pollinations AI now integrates with Flux models which have significantly improved text rendering.

## Changes Required

### 1. Update Edge Function: `supabase/functions/generate-image/index.ts`

**Current State:**
- Uses Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- Model: `google/gemini-2.5-flash-image-preview`
- Consumes credits from your Lovable AI balance

**New Implementation:**
- Use Pollinations AI (`https://image.pollinations.ai/prompt/`)
- Model: Flux (default, best text rendering)
- Completely free, no API key required

**Key Changes:**
```text
┌─────────────────────────────────────────────────────────────┐
│  BEFORE: Lovable AI (credit-based)                         │
│  ─────────────────────────────────────                      │
│  fetch("https://ai.gateway.lovable.dev/v1/chat/completions")│
│  Authorization: Bearer ${LOVABLE_API_KEY}                   │
│  Returns: base64 image in JSON response                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  AFTER: Pollinations AI (free)                              │
│  ────────────────────────────                               │
│  fetch("https://image.pollinations.ai/prompt/${prompt}")    │
│  No API key required                                        │
│  Returns: Direct image URL                                  │
└─────────────────────────────────────────────────────────────┘
```

**Technical Implementation:**
1. Remove LOVABLE_API_KEY dependency for generation
2. URL-encode the styled prompt
3. Add Pollinations parameters for quality and model selection:
   - `model=flux` - Best text rendering model
   - `width/height` - Based on size parameter
   - `nologo=true` - Remove watermark
   - `enhance=true` - Better quality
4. Return the direct image URL instead of base64

### 2. Prompt Engineering Updates

Keep the existing design templates but optimize for Pollinations/Flux:
- Maintain text accuracy instructions
- Simplify prompt format (Flux handles text better with cleaner prompts)
- Add explicit quotes around text that needs exact spelling

### 3. Size Mapping

| App Size | Pollinations Dimensions |
|----------|-------------------------|
| square | 1024x1024 |
| portrait | 832x1216 |
| landscape | 1216x832 |

### 4. What Stays the Same

- **Image Editing**: Continues using Lovable AI (Gemini) via `edit-image` function
- **Design Templates**: Same logo, social, banner, poster templates
- **Style Options**: Same style aesthetic modifiers
- **Error Handling**: Same 429/402 handling (though Pollinations rarely rate-limits)

## Benefits

| Aspect | Before (Lovable AI) | After (Pollinations AI) |
|--------|---------------------|-------------------------|
| **Cost** | Uses credits | Free |
| **API Key** | Required | Not required |
| **Rate Limits** | Strict | Relaxed |
| **Text Accuracy** | Good (Gemini) | Good (Flux) |
| **Speed** | Fast | Fast |

## File Changes Summary

| File | Action |
|------|--------|
| `supabase/functions/generate-image/index.ts` | Rewrite to use Pollinations AI |

## Fallback Strategy

If Pollinations AI fails (rare), the function will return a clear error message asking the user to try again, rather than silently failing.

