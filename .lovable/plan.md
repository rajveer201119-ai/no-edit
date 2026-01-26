
# Plan: Add FAQ Schema and Static HTML for SEO

## Overview

Add FAQ structured data (JSON-LD) and visible FAQ content to improve rich results eligibility and long-tail search traffic. The FAQ content will be crawlable by search engines and match exactly between HTML and schema.

## Changes to `index.html`

### 1. Add FAQ JSON-LD Schema in `<head>`

Insert new FAQPage schema after the existing BreadcrumbList schema (after line 107):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is EPIC AI Image Generator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EPIC is a zero-edit AI image generator that lets users create high-quality images instantly without prompts, editing, or design skills."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need prompts or editing skills to use EPIC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. EPIC is designed to work without prompts or manual editing. Users generate images instantly with a simple and beginner-friendly workflow."
      }
    },
    {
      "@type": "Question",
      "name": "Is EPIC free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EPIC offers a free tier for basic image generation. Paid plans unlock higher resolution images, faster generation, and extended usage."
      }
    },
    {
      "@type": "Question",
      "name": "Who should use EPIC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EPIC is ideal for creators, students, marketers, founders, and anyone who wants AI-generated images without technical complexity."
      }
    }
  ]
}
```

### 2. Add FAQ HTML Section Inside `<div id="root">`

Insert a new FAQ section after the existing Features section (after line 144, before `</main>`):

```html
<section>
  <h2>Frequently Asked Questions</h2>

  <h3>What is EPIC AI Image Generator?</h3>
  <p>
    EPIC is a zero-edit AI image generator that allows users to create
    high-quality images instantly without prompts, editing, or design skills.
  </p>

  <h3>Do I need prompts or editing skills to use EPIC?</h3>
  <p>
    No. EPIC removes the need for prompts and manual editing, making AI
    image generation simple and accessible for everyone.
  </p>

  <h3>Is EPIC free to use?</h3>
  <p>
    EPIC includes a free tier. Premium plans provide higher resolution,
    faster image generation, and extended usage limits.
  </p>

  <h3>Who should use EPIC?</h3>
  <p>
    EPIC is built for creators, students, marketers, founders, and beginners
    who want instant AI-generated images without complexity.
  </p>
</section>
```

## Technical Details

| Aspect | Implementation |
|--------|----------------|
| File modified | `index.html` only |
| Schema placement | New `<script type="application/ld+json">` after BreadcrumbList |
| HTML placement | New `<section>` inside existing `<main class="seo-fallback">` |
| Visibility | Content uses existing `.seo-fallback` class (hidden for JS users, visible for bots) |
| Content matching | HTML and schema content match semantically |

## What Will NOT Change

- App routing and navigation
- UI appearance after React hydrates
- Editor functionality
- Any JavaScript behavior
- Existing structured data schemas (WebApplication, BreadcrumbList)

## Expected Results

| Test | Expected Result |
|------|-----------------|
| Google Rich Results Test | FAQPage schema detected, no errors |
| Page source view | FAQ questions and answers visible in raw HTML |
| Browser with JS | No visual change (content hidden, React hydrates) |
| Search appearance | Eligible for FAQ rich snippets in Google results |
