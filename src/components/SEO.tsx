import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

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

const defaultOgImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/ywM0UvtJ3VdIZjuQEJN3LrvvOCt2/social-images/social-1769532119034-download (1).jpeg";
const baseUrl = "https://no-edit.lovable.app";

export { baseUrl };

export const SEO = ({
  title = "EPIC — AI Design Generator | Create Professional Graphics Instantly",
  description = "Create stunning posters, logos, social media graphics, YouTube thumbnails, and more in seconds. No design skills needed. Free to use.",
  keywords = "AI design generator, logo maker, poster creator, YouTube thumbnail maker, Instagram post creator, social media graphics, free design tool, AI graphics, canva alternative",
  canonicalUrl,
  ogImage = defaultOgImage,
  ogType = "website",
  structuredData,
  noIndex = false,
}: SEOProps) => {
  const location = useLocation();
  const resolvedCanonical = canonicalUrl || `${baseUrl}${location.pathname}`;
  const fullTitle = title.includes("EPIC") ? title : `${title} | EPIC Design`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={resolvedCanonical} />
      
      {/* Mobile & PWA */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="EPIC Design Generator" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={resolvedCanonical} />
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
      "description": "EPIC is a free AI design generator. Create stunning posters, logos, YouTube thumbnails, Instagram posts, and more in seconds. No design skills needed.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "AI-powered design generation",
        "YouTube thumbnail maker",
        "Instagram post creator",
        "Logo designer",
        "Poster creator",
        "No design skills required",
        "Free to use"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250"
      }
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "EPIC Design",
      "url": baseUrl,
      "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/kG5hIp7FM3biSpv5njI7csuUQ6O2/uploads/1759212272541-file_00000000100c61faa64c1df9bb0aebc8.png",
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "EPIC Design Generator",
      "description": "Create professional designs in seconds with AI",
      "publisher": {
        "@id": `${baseUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "EPIC Design Generator",
      "operatingSystem": "Web",
      "applicationCategory": "DesignApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
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
      "priceValidUntil": "2026-12-31",
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
