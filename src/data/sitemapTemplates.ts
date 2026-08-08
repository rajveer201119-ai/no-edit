import type { AiSitemap, AiSitemapPage, AiPageType } from "@/lib/sitemap/schema";

export interface TemplateNode {
  name: string;
  slug: string;
  type?: AiPageType;
  note?: string;
  children?: TemplateNode[];
}

export interface SitemapTemplate {
  slug: string;
  name: string;
  category: string;
  /** One-line summary used on the hub cards. */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  /** 2-3 unique opening paragraphs. */
  intro: string[];
  /** What this kind of website is and who builds it. */
  siteTypeExplainer: string;
  /** Why the recommended hierarchy works. */
  whyItWorks: string;
  mustHavePages: { page: string; why: string }[];
  seoNotes: string[];
  uxNotes: string[];
  mistakes: { mistake: string; fix: string }[];
  navigation: { primary: string[]; footer: string[] };
  /** Prompt a visitor can paste into EPIC's AI sitemap generator. */
  aiPrompt: string;
  tree: TemplateNode[];
  faqs: { question: string; answer: string }[];
  relatedTemplates: string[];
  relatedArticles: string[];
  /** ISO date — only bump on a meaningful content update. */
  published: string;
  updated: string;
}

/** Count every node in a template tree. */
export function countPages(nodes: TemplateNode[]): number {
  return nodes.reduce((n, node) => n + 1 + countPages(node.children ?? []), 0);
}

/** Convert a template tree into the AiSitemap shape the editor already consumes. */
export function templateToAiSitemap(template: SitemapTemplate): AiSitemap {
  let counter = 0;
  const walk = (
    nodes: TemplateNode[],
    parentId: string | null,
  ): AiSitemapPage[] =>
    nodes.map((node, index) => {
      const id = `tpl-${counter++}`;
      return {
        id,
        name: node.name,
        slug: node.slug,
        pageType: node.type ?? "content",
        description: node.note ?? "",
        parentId,
        order: index,
        children: walk(node.children ?? [], id),
      };
    });

  return {
    projectName: template.name,
    websiteType: template.category,
    description: template.summary,
    pages: walk(template.tree, null),
  };
}

export const sitemapTemplates: Record<string, SitemapTemplate> = {
  saas: {
    slug: "saas",
    name: "SaaS Website Sitemap Template",
    category: "SaaS",
    summary:
      "Marketing site, product pages, pricing, docs and app entry points for a subscription software product.",
    metaTitle: "SaaS Sitemap Template — Website Structure for Software Products | EPIC",
    metaDescription:
      "A complete SaaS website sitemap template: product, features, pricing, integrations, docs and company pages. Open it in EPIC and edit it visually.",
    keywords: "saas sitemap template, saas website structure, software website sitemap, saas site architecture",
    h1: "SaaS Website Sitemap Template",
    intro: [
      "A SaaS website has to do two jobs at once. It has to convince a stranger that the product solves their problem, and it has to get an existing customer into the application in one click. Most badly-structured SaaS sites fail the second job: the login link is buried, the docs live on a subdomain nobody links to, and the pricing page is three clicks from the homepage.",
      "This template separates the site into four zones — marketing, proof, product knowledge, and company — with a persistent path into the app. It is the structure you will recognise from most well-run B2B software companies, reduced to the pages that actually earn their place.",
      "Use it as a starting point, then delete anything you cannot maintain. A SaaS site with twelve strong pages outperforms one with forty thin ones.",
    ],
    siteTypeExplainer:
      "A SaaS website is the marketing and self-service surface for a subscription software product. It is not the product. Its purpose is to explain the value, qualify the visitor, answer objections (price, security, integrations), and hand the visitor to a trial or a sales conversation. Everything behind login is the application and should sit outside the public sitemap.",
    whyItWorks:
      "The hierarchy is shallow — every commercially important page is one or two clicks from the homepage — and it maps to how buyers actually evaluate software. Solution and use-case pages capture the 'software for X' searches that convert best. Integrations pages capture the long tail of 'X + Y integration' queries. Pricing sits at the top level because it is the second-most visited page on nearly every SaaS site, and hiding it only sends people to review sites for the answer.",
    mustHavePages: [
      { page: "Homepage", why: "Positioning in one sentence, primary CTA, and social proof above the fold." },
      { page: "Features (with a child page per major feature)", why: "Feature children rank for specific capability searches that the homepage never will." },
      { page: "Solutions / Use cases", why: "Buyers search by their job, not by your feature names." },
      { page: "Pricing", why: "The highest-intent page on the site. Include plan comparison and a pricing FAQ." },
      { page: "Integrations directory", why: "A scalable page cluster with real long-tail search demand." },
      { page: "Documentation", why: "Signals product maturity and captures 'how to' traffic from evaluators." },
      { page: "Changelog", why: "Shows the product is alive; frequently linked by customers." },
      { page: "Security / Trust", why: "Required for any B2B deal over a few hundred dollars." },
      { page: "About and Careers", why: "Credibility for enterprise buyers and inbound hiring." },
      { page: "Login and Sign up", why: "Always in the header. Both should be noindex." },
    ],
    seoNotes: [
      "Give every feature and integration its own indexable URL — do not hide them behind tabs on one page.",
      "Keep /pricing free of noindex and free of forced login; it is the page most likely to earn links.",
      "Use a single canonical host and self-referencing canonicals on every marketing page.",
      "Docs should live on the main domain (/docs) rather than a subdomain so the authority compounds.",
      "Mark login, signup, app and account routes as noindex, follow.",
    ],
    uxNotes: [
      "Header: product, solutions, pricing, docs, then a single high-contrast CTA plus a quiet Login link.",
      "Never make a visitor pass a form to see pricing.",
      "Keep the depth at three levels maximum; four-level SaaS navigation is where drop-off starts.",
      "Repeat the primary CTA at the end of every marketing page.",
    ],
    mistakes: [
      { mistake: "One giant /features page covering everything.", fix: "Split into a parent page plus one child per feature." },
      { mistake: "Pricing hidden behind 'Contact sales'.", fix: "Publish at least starting prices and a comparison table." },
      { mistake: "Docs on a separate subdomain with no internal links.", fix: "Serve docs at /docs and link them from the header." },
      { mistake: "Blog posts that never link to a product page.", fix: "Give every article one contextual product link." },
    ],
    navigation: {
      primary: ["Product", "Solutions", "Pricing", "Docs", "Blog", "Login", "Start free"],
      footer: ["Features", "Integrations", "Changelog", "Security", "About", "Careers", "Contact", "Privacy", "Terms"],
    },
    aiPrompt:
      "Create a SaaS website sitemap for a subscription product. Include a homepage, a product section with one page per major feature, solution pages by industry, pricing with a comparison table, an integrations directory, documentation, changelog, blog, security page, about, careers, contact, and auth pages for login and signup.",
    tree: [
      {
        name: "Home", slug: "/", type: "landing", note: "Positioning, primary CTA, social proof",
        children: [
          {
            name: "Product", slug: "/product", type: "product", note: "Overview of the platform",
            children: [
              { name: "Feature One", slug: "/product/feature-one", type: "product" },
              { name: "Feature Two", slug: "/product/feature-two", type: "product" },
              { name: "Feature Three", slug: "/product/feature-three", type: "product" },
              { name: "Integrations", slug: "/integrations", type: "product", note: "Directory page + one child per integration" },
            ],
          },
          {
            name: "Solutions", slug: "/solutions", type: "marketing",
            children: [
              { name: "For Startups", slug: "/solutions/startups", type: "marketing" },
              { name: "For Agencies", slug: "/solutions/agencies", type: "marketing" },
              { name: "For Enterprise", slug: "/solutions/enterprise", type: "marketing" },
            ],
          },
          { name: "Pricing", slug: "/pricing", type: "marketing", note: "Plan comparison + pricing FAQ" },
          {
            name: "Resources", slug: "/resources", type: "content",
            children: [
              { name: "Documentation", slug: "/docs", type: "content" },
              { name: "Blog", slug: "/blog", type: "blog" },
              { name: "Changelog", slug: "/changelog", type: "content" },
              { name: "Customer Stories", slug: "/customers", type: "content" },
            ],
          },
          {
            name: "Company", slug: "/company", type: "marketing",
            children: [
              { name: "About", slug: "/about", type: "marketing" },
              { name: "Careers", slug: "/careers", type: "marketing" },
              { name: "Security", slug: "/security", type: "legal" },
              { name: "Contact", slug: "/contact", type: "support" },
            ],
          },
          { name: "Log in", slug: "/login", type: "auth", note: "noindex" },
          { name: "Sign up", slug: "/signup", type: "auth", note: "noindex" },
          { name: "Privacy Policy", slug: "/privacy", type: "legal" },
          { name: "Terms of Service", slug: "/terms", type: "legal" },
        ],
      },
    ],
    faqs: [
      { question: "How many pages should a SaaS website have?", answer: "Most early-stage SaaS sites need 12-20 public pages: homepage, a product overview with 3-6 feature children, pricing, docs, blog, a few solution pages, and the company and legal pages. Add integration and use-case pages later, once each one can carry genuinely unique content." },
      { question: "Should documentation be in the sitemap?", answer: "Yes. Public documentation is some of the highest-quality content a SaaS company owns and it attracts evaluators mid-decision. Keep it on the main domain at /docs and include it in sitemap.xml." },
      { question: "Should the app itself be indexed?", answer: "No. Dashboard, account, settings and any authenticated project URLs should be noindex, follow and excluded from sitemap.xml." },
    ],
    relatedTemplates: ["startup", "marketplace", "documentation"],
    relatedArticles: ["saas-website-sitemap-structure", "seo-friendly-website-structure-guide", "how-to-create-a-visual-sitemap"],
    published: "2026-08-08",
    updated: "2026-08-08",
  },

  ecommerce: {
    slug: "ecommerce",
    name: "Ecommerce Website Sitemap Template",
    category: "Ecommerce",
    summary:
      "Category and product hierarchy, cart and checkout flow, plus the policy pages every online store needs.",
    metaTitle: "Ecommerce Sitemap Template — Online Store Structure | EPIC",
    metaDescription:
      "An ecommerce website sitemap template with category, collection and product page hierarchy, checkout flow and policy pages. Edit it visually in EPIC.",
    keywords: "ecommerce sitemap template, ecommerce website structure, online store sitemap, product category structure",
    h1: "Ecommerce Website Sitemap Template",
    intro: [
      "Ecommerce structure is a search problem before it is a design problem. Category pages are what rank; product pages are what convert. Get the category hierarchy wrong and you end up with thousands of product URLs that no search engine can reach efficiently and no shopper can browse.",
      "This template uses a three-tier retail hierarchy — department, category, product — with collections layered on top for merchandising rather than as a replacement for categories. Cart, checkout and account are modelled as a linear flow rather than as browsable pages, because that is how they behave.",
      "It scales from a 20-product store to a few thousand SKUs without restructuring.",
    ],
    siteTypeExplainer:
      "An ecommerce website sells physical or digital products directly. Unlike a brochure site, most of its URLs are generated from a catalogue, so the structure has to be a rule rather than a hand-drawn map: every product belongs to exactly one canonical category, and every category belongs to one department.",
    whyItWorks:
      "Department and category pages are stable, text-rich and linkable, so they carry the ranking weight and pass it down to products. Products sit at a predictable depth, which keeps crawl paths short. Collections (Sale, New In, Gift Guide) sit beside the taxonomy instead of inside it, so seasonal merchandising never breaks the canonical URL of a product. Checkout is deliberately isolated: no navigation, no distractions, no indexable URLs.",
    mustHavePages: [
      { page: "Homepage", why: "Routes traffic to departments and current merchandising, not to individual products." },
      { page: "Department pages", why: "The top of the taxonomy and the pages most likely to rank for broad head terms." },
      { page: "Category pages", why: "Where the commercial search demand actually lives ('men's running shoes')." },
      { page: "Product detail pages", why: "Conversion pages: images, variants, stock, reviews, delivery." },
      { page: "Collections", why: "Merchandising surfaces for sales and seasons, kept out of the canonical taxonomy." },
      { page: "Cart and Checkout", why: "A short, isolated, noindex flow." },
      { page: "Account area", why: "Orders, addresses, returns. All noindex." },
      { page: "Shipping, Returns, FAQ", why: "Objection handlers that reduce support load and pre-purchase anxiety." },
      { page: "Search results", why: "Essential for shoppers, but should be noindex to avoid infinite thin URLs." },
    ],
    seoNotes: [
      "Every product needs one canonical URL, even when it appears in several collections.",
      "Noindex faceted filter combinations (colour + size + price) or you will bury the catalogue in near-duplicates.",
      "Write genuine intro copy on category pages; a grid of thumbnails alone rarely ranks.",
      "Keep product URLs shallow and stable — /products/slug beats /dept/cat/subcat/slug for long-term maintenance.",
      "Exclude cart, checkout, account and internal search from sitemap.xml.",
    ],
    uxNotes: [
      "Show the full department list in the header; hidden navigation kills discovery on mobile.",
      "Breadcrumbs on every product page — they are the primary way shoppers browse sideways.",
      "Strip the navigation out of checkout to reduce abandonment.",
      "Offer guest checkout as a first-class path, not a hidden link.",
    ],
    mistakes: [
      { mistake: "Products living only inside seasonal collections.", fix: "Give every product a permanent category home and treat collections as views." },
      { mistake: "Indexable filter URLs.", fix: "Noindex filter combinations and canonicalise them to the clean category." },
      { mistake: "A five-level deep category tree.", fix: "Flatten to department → category → product wherever possible." },
      { mistake: "Policies buried in the footer only.", fix: "Link shipping and returns directly from the product page." },
    ],
    navigation: {
      primary: ["Shop by department", "New In", "Sale", "Search", "Account", "Cart"],
      footer: ["About", "Contact", "Shipping", "Returns", "FAQ", "Size guide", "Privacy", "Terms"],
    },
    aiPrompt:
      "Create an ecommerce website sitemap for an online store. Include a homepage, two or three department pages each with category children and example product pages, collection pages for New In and Sale, a cart and checkout flow, an account area, and policy pages for shipping, returns, privacy and terms.",
    tree: [
      {
        name: "Home", slug: "/", type: "landing",
        children: [
          {
            name: "Shop", slug: "/shop", type: "product", note: "Department index",
            children: [
              {
                name: "Department A", slug: "/shop/department-a", type: "product",
                children: [
                  { name: "Category A1", slug: "/shop/department-a/category-a1", type: "product", children: [
                    { name: "Product Detail", slug: "/products/example-product", type: "product", note: "Variants, reviews, delivery" },
                  ] },
                  { name: "Category A2", slug: "/shop/department-a/category-a2", type: "product" },
                ],
              },
              {
                name: "Department B", slug: "/shop/department-b", type: "product",
                children: [
                  { name: "Category B1", slug: "/shop/department-b/category-b1", type: "product" },
                  { name: "Category B2", slug: "/shop/department-b/category-b2", type: "product" },
                ],
              },
            ],
          },
          { name: "New In", slug: "/collections/new-in", type: "product", note: "Merchandising view" },
          { name: "Sale", slug: "/collections/sale", type: "product", note: "Merchandising view" },
          { name: "Search Results", slug: "/search", type: "utility", note: "noindex" },
          {
            name: "Cart", slug: "/cart", type: "utility", note: "noindex",
            children: [
              { name: "Checkout", slug: "/checkout", type: "utility", note: "noindex, no navigation", children: [
                { name: "Order Confirmation", slug: "/checkout/confirmation", type: "utility", note: "noindex" },
              ] },
            ],
          },
          {
            name: "Account", slug: "/account", type: "auth", note: "noindex",
            children: [
              { name: "Orders", slug: "/account/orders", type: "dashboard", note: "noindex" },
              { name: "Addresses", slug: "/account/addresses", type: "dashboard", note: "noindex" },
            ],
          },
          {
            name: "Help", slug: "/help", type: "support",
            children: [
              { name: "Shipping", slug: "/help/shipping", type: "support" },
              { name: "Returns", slug: "/help/returns", type: "support" },
              { name: "FAQ", slug: "/help/faq", type: "support" },
              { name: "Contact", slug: "/contact", type: "support" },
            ],
          },
          { name: "About", slug: "/about", type: "marketing" },
          { name: "Privacy Policy", slug: "/privacy", type: "legal" },
          { name: "Terms of Sale", slug: "/terms", type: "legal" },
        ],
      },
    ],
    faqs: [
      { question: "Should products sit under their category in the URL?", answer: "Not necessarily. Flat product URLs like /products/slug are easier to maintain because a product can be re-categorised without a redirect. Use breadcrumbs and internal links to express the hierarchy instead." },
      { question: "How should I handle filters and facets?", answer: "Keep them usable for shoppers but non-indexable for crawlers. Canonicalise filtered views to the clean category URL and exclude them from sitemap.xml." },
      { question: "Do collection pages hurt SEO?", answer: "No, as long as each one has a distinct purpose and its own copy, and products keep a single canonical URL. Problems only start when the same product set appears under several indexable near-identical pages." },
    ],
    relatedTemplates: ["marketplace", "restaurant", "landing-page"],
    relatedArticles: ["ecommerce-website-sitemap-structure", "seo-friendly-website-structure-guide", "website-information-architecture-guide"],
    published: "2026-08-08",
    updated: "2026-08-08",
  },
};

export const templateList = () => Object.values(sitemapTemplates);
