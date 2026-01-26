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

const defaultOgImage = "https://no-edit.lovable.app/og.png";
const baseUrl = "https://no-edit.lovable.app";

export const SEO = ({
  title = "EPIC — Generate AI Images Instantly",
  description = "EPIC is a zero-edit AI image generator. Create stunning AI images instantly without prompts, editing, or design skills.",
  keywords = "AI image generator, zero-edit AI, instant image generation, AI graphics, no-prompt image creator, beginner-friendly AI design",
  canonicalUrl = baseUrl,
  ogImage = defaultOgImage,
  ogType = "website",
  structuredData,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes("EPIC") ? title : `${title} | EPIC Design`;

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
      <meta property="og:site_name" content="EPIC Design Generator" />

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
      "name": "EPIC",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Any",
      "url": baseUrl,
      "description": "EPIC is a zero-edit AI image generator. Create stunning AI images instantly without prompts, editing, or design skills.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "One-click AI image generation",
        "Zero editing required",
        "No complex prompts",
        "Instant downloads",
        "Beginner-friendly interface"
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
      "name": "EPIC",
      "publisher": {
        "@id": `${baseUrl}/#organization`
      }
    }
  ]
};

export const pricingPageSchema = (currency: string, proPrice: number) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "EPIC Pro Plan",
  "description": "Unlimited AI image generation with priority support and advanced features",
  "brand": {
    "@type": "Brand",
    "name": "EPIC Design"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
      "description": "5 free design generations per day"
    },
    {
      "@type": "Offer",
      "name": "Pro Plan",
      "price": proPrice.toString(),
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "description": "Unlimited AI design generation with priority support"
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
