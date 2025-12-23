import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  structuredData?: object;
  noIndex?: boolean;
}

const defaultOgImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/kG5hIp7FM3biSpv5njI7csuUQ6O2/social-images/social-1759212279524-no-edit.lovable.app_.png";
const baseUrl = "https://epic-ai-generator.lovable.app";

export const SEO = ({
  title = "EPIC - AI Image Generator | Create Stunning Art in Seconds",
  description = "Free AI image generator with Ghibli, 3D, Realistic, Cyberpunk styles. Create professional artwork, ads, posters, and social media graphics instantly. No design skills needed.",
  keywords = "AI image generator, free AI art, AI art generator, text to image, Ghibli style art, 3D render, realistic AI photos, cyberpunk art, AI poster maker",
  canonicalUrl = baseUrl,
  ogImage = defaultOgImage,
  ogType = "website",
  structuredData,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes("EPIC") ? title : `${title} | EPIC AI`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="EPIC AI Image Generator" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Pre-configured structured data schemas
export const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      "name": "EPIC AI Image Generator",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "url": baseUrl,
      "description": "Free AI image generator with multiple artistic styles including Ghibli, 3D renders, realistic photos, and cyberpunk graphics.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Ghibli Anime Style Generation",
        "3D Render Art Creation",
        "Realistic AI Photos",
        "Cyberpunk Graphics",
        "Vintage Poster Design",
        "Animated Character Art"
      ]
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "NO BOX",
      "url": baseUrl,
      "founder": {
        "@type": "Person",
        "name": "Rajveer Rinku"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "EPIC AI Image Generator",
      "publisher": {
        "@id": `${baseUrl}/#organization`
      }
    }
  ]
};

export const pricingPageSchema = (currency: string, proPrice: number) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "EPIC AI Pro Plan",
  "description": "Unlimited AI image generation with priority support and advanced features",
  "brand": {
    "@type": "Brand",
    "name": "EPIC AI"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
      "description": "5 free image generations per day"
    },
    {
      "@type": "Offer",
      "name": "Pro Plan",
      "price": proPrice.toString(),
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "description": "Unlimited AI image generation with priority support"
    }
  ]
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
