import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface HreflangEntry {
  lang: string;
  href: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  structuredData?: object;
  noIndex?: boolean;
  hreflang?: HreflangEntry[];
}

const defaultOgImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/ywM0UvtJ3VdIZjuQEJN3LrvvOCt2/social-images/social-1769532119034-download (1).jpeg";
const baseUrl = "https://no-edit.lovable.app";

export { baseUrl };

export const SEO = ({
  title = "EPIC — Visual Sitemap Builder & User Flow Planner for Founders",
  description = "Plan website structure and user flows visually. Free for indie hackers, startup founders, and product builders in India. Export JSON, PDF, PNG sitemaps in minutes.",
  keywords = "visual sitemap builder, sitemap builder India, website structure planner, user flow builder, startup planning tool India, product planning tool, indie hacker tools India, website architecture, UX planning India, sitemap maker, navigation maker, founder tools",
  canonicalUrl,
  ogImage = defaultOgImage,
  ogType = "website",
  structuredData,
  noIndex = false,
  hreflang,
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

      {/* India-targeted geo signals */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="language" content="English" />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Hreflang Tags */}
      {hreflang?.map((entry) => (
        <link key={entry.lang} rel="alternate" hrefLang={entry.lang} href={entry.href} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="EPIC Design Generator" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="en_US" />

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
      "description": "EPIC is a free visual sitemap builder and design tool. Plan website navigation, export developer-ready JSON sitemaps, and create professional graphics. Used by 280+ founders worldwide.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Visual sitemap builder",
        "Website navigation planner",
        "JSON sitemap export",
        "HD PNG export",
        "UX Score analyzer",
        "200+ design templates",
        "Drag & drop page builder",
        "No signup required"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "280"
      }
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "EPIC Design",
      "url": baseUrl,
      "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/kG5hIp7FM3biSpv5njI7csuUQ6O2/uploads/1759212272541-file_00000000100c61faa64c1df9bb0aebc8.png",
      "sameAs": [
        "https://x.com/epicdesigngen",
        "https://instagram.com/epicdesigngen",
        "https://linkedin.com/company/epicdesigngen"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": `${baseUrl}/contact`,
        "availableLanguage": "English"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "EPIC — Sitemap Builder & Design Tool",
      "description": "Plan website structure visually, export JSON sitemaps, and create professional designs — free",
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
      "name": "EPIC Sitemap Builder",
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
