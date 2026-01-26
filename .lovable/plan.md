

# Fix Hugging Face API Endpoint for Image Editor

## Problem Identified

The Hugging Face API endpoint in the `edit-image` edge function is **deprecated** (returning 410 Gone), causing every edit request to fall back to Lovable AI and consume your credits.

**Error from logs:**
```
Hugging Face error: 410 {"error":"https://api-inference.huggingface.co is no longer supported. Please use https://router.huggingface.co instead."}
```

## Solution

Update the Hugging Face API URL from the deprecated endpoint to the new router endpoint.

## Changes Required

### File: `supabase/functions/edit-image/index.ts`

**Line 38-39 - Update API URL:**

| Current (Broken) | New (Fixed) |
|------------------|-------------|
| `https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix` | `https://router.huggingface.co/hf-inference/models/timbrooks/instruct-pix2pix` |

---

## Technical Details

The change is a single-line URL update:

```text
Before:
  "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix"

After:
  "https://router.huggingface.co/hf-inference/models/timbrooks/instruct-pix2pix"
```

## Expected Outcome

After this fix:
- Hugging Face InstructPix2Pix will work as the **primary free editor**
- Lovable AI will only be used as a fallback when HF fails (rate limits, cold starts)
- Your credits will be preserved for fallback scenarios only

## Important Note About Text Editing

InstructPix2Pix is a general image-to-image model and has **limited capability** for precise text rendering tasks. For complex text operations (adding specific text, changing fonts, etc.), the Lovable AI fallback (Gemini) is actually better suited. However, with this fix, simple edits like color changes, style adjustments, and element modifications will use the free Hugging Face service first.

