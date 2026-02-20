export interface PillarPageData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  heroSubtitle: string;
  sections: { heading: string; content: string }[];
  comparison: { feature: string; epic: boolean; others: boolean }[];
  faqs: { question: string; answer: string }[];
  relatedPillars: string[];
  cta: { title: string; description: string };
  schema: object;
}

const baseUrl = "https://no-edit.lovable.app";

export const pillarPages: Record<string, PillarPageData> = {
  "website-flow-generator": {
    slug: "website-flow-generator",
    metaTitle: "Website Flow Generator — Plan Site UX Visually | EPIC",
    metaDescription: "Create website user flows with drag-and-drop. Plan page connections, map navigation paths, and export flow diagrams. Free visual website flow generator.",
    keywords: "website flow generator, website navigation flow, user flow creator, website flow diagram, site flow tool, website UX flow planner online, drag and drop website flow builder",
    h1: "Free Website Flow Generator",
    heroSubtitle: "Plan, visualize, and export your website's user flow — from homepage to conversion. Drag-and-drop simplicity, zero learning curve.",
    sections: [
      {
        heading: "What Is a Website Flow Generator?",
        content: "A website flow generator is a visual planning tool that helps you map how users navigate through your website. Instead of writing documentation or using complex wireframing software, you drag pages onto a canvas, draw connections between them, and instantly see how your site's navigation works. This is essential for UX designers, product managers, developers, and anyone building a website who wants to ensure smooth user journeys.\n\nEPIC's website flow generator takes this concept and makes it accessible to everyone. Whether you're a seasoned UX professional or a first-time website builder, you can create comprehensive flow diagrams in minutes. The tool comes with 50+ pre-built page templates covering everything from login screens to checkout flows, making it easy to model any type of website.\n\nUnlike traditional tools that require expensive subscriptions and steep learning curves, EPIC's flow generator is free, browser-based, and requires zero installation. You can start mapping your website's navigation immediately and export your diagrams as high-quality PNG files for presentations, documentation, or team collaboration."
      },
      {
        heading: "Why Website Flow Planning Matters",
        content: "Planning your website's flow before development saves time, money, and frustration. Studies show that fixing a UX issue during the design phase costs 10x less than fixing it after launch. A well-planned website flow ensures that users can find what they need quickly, reducing bounce rates and increasing conversions.\n\nConsider an e-commerce website: without proper flow planning, users might struggle to find products, get confused during checkout, or miss important information. A flow diagram reveals these potential issues before a single line of code is written. You can see dead ends, unnecessary steps, and confusing navigation paths at a glance.\n\nFor SaaS products, website flow planning is even more critical. Users need to move smoothly from your landing page through sign-up, onboarding, and into the core product experience. A broken flow at any point means lost customers. EPIC's flow generator helps you model these journeys visually, test different navigation approaches, and settle on the optimal path before committing to development."
      },
      {
        heading: "How to Create a Website Flow in EPIC",
        content: "Creating a website flow in EPIC takes just three steps. First, open the Navigation Maker tool and browse the template library. You'll find 50+ page templates organized by category: authentication pages, e-commerce pages, dashboard pages, content pages, and more. Drag the pages you need onto the canvas.\n\nSecond, connect your pages. Click on a page's output connector and drag to another page's input. EPIC automatically draws smooth SVG arrows between pages, creating a clear visual map of your navigation. You can create complex flows with multiple branches, loops, and decision points.\n\nThird, customize and export. Rearrange pages by dragging them around the canvas. Add or remove connections as needed. When you're satisfied with your flow, click Export and download a high-resolution PNG file. Your flow diagram is ready for presentations, documentation, or developer handoff.\n\nPro tip: Start with your most important user journey — usually the path from landing page to conversion. Build that flow first, then add secondary paths like account management, help pages, and settings."
      },
      {
        heading: "Website Flow Best Practices",
        content: "Keep your navigation hierarchy shallow. Users should reach any page within 3 clicks from the homepage. Deep navigation trees frustrate users and hurt SEO. EPIC's visual canvas makes it easy to spot when your hierarchy is getting too deep.\n\nEvery page should have a clear purpose and a logical next step. Avoid dead-end pages that leave users stranded. In your flow diagram, look for pages with no outgoing connections — these are potential drop-off points that need attention.\n\nConsider multiple user personas. A first-time visitor and a returning customer have different needs. Create separate flows for each persona to ensure your navigation serves everyone. EPIC lets you create multiple flow diagrams so you can model different user journeys.\n\nTest your flow with real users before development. Share your EPIC flow diagram with stakeholders, potential users, or team members. Getting feedback on the flow is much cheaper than redesigning after launch."
      },
      {
        heading: "Who Uses Website Flow Generators?",
        content: "UX designers use flow generators to map user journeys and present navigation concepts to clients. Product managers use them to plan feature rollouts and ensure new features integrate smoothly into existing navigation. Developers use them to understand the full scope of a project before writing code.\n\nStartup founders use flow generators to quickly prototype website structures for investor presentations. Marketing teams use them to plan landing page funnels and conversion paths. Freelancers use them to communicate website structure to clients and get sign-off before development begins.\n\nStudents and educators use flow generators for website planning courses, UX design classes, and computer science projects. EPIC's free, browser-based tool makes it accessible to everyone regardless of budget or technical skill level."
      }
    ],
    comparison: [
      { feature: "Free to use", epic: true, others: false },
      { feature: "No account required", epic: true, others: false },
      { feature: "50+ page templates", epic: true, others: false },
      { feature: "PNG export", epic: true, others: true },
      { feature: "Drag-and-drop canvas", epic: true, others: true },
      { feature: "Browser-based (no install)", epic: true, others: false },
      { feature: "Mobile friendly", epic: true, others: false },
    ],
    faqs: [
      { question: "What is a website flow generator?", answer: "A website flow generator is a visual tool that lets you map page-to-page navigation paths for your website. EPIC's generator uses drag-and-drop to connect 50+ page templates into complete flow diagrams." },
      { question: "Is EPIC's website flow generator free?", answer: "Yes, completely free. Create unlimited flow diagrams, connect pages, and export as PNG — no account or payment required." },
      { question: "Can I export my website flow diagram?", answer: "Absolutely. Export your flow as a high-quality PNG file for presentations, documentation, or team sharing." },
      { question: "Who should use a website flow generator?", answer: "UX designers, product managers, developers, startup founders, students, and anyone planning a website's navigation structure." },
      { question: "How is EPIC different from Figma or Miro for flows?", answer: "EPIC is purpose-built for website flows with pre-made page templates and instant connections. No learning curve — just drag, connect, export." },
    ],
    relatedPillars: ["visual-sitemap-maker", "user-flow-diagram-tool", "saas-navigation-planner", "drag-drop-website-builder"],
    cta: { title: "Start Building Your Website Flow", description: "Open the drag-and-drop flow generator and map your site's navigation in minutes." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Website Flow Generator",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/website-flow-generator`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1340" },
    },
  },
  "visual-sitemap-maker": {
    slug: "visual-sitemap-maker",
    metaTitle: "Visual Sitemap Maker — Create Site Maps Online | EPIC",
    metaDescription: "Build visual sitemaps with drag-and-drop. Plan your website structure, connect pages, and export sitemap diagrams. Free online visual sitemap maker.",
    keywords: "visual sitemap maker, sitemap creator, create website sitemap visually, website structure planner, visual website structure planner, site map generator",
    h1: "Free Visual Sitemap Maker",
    heroSubtitle: "Plan your website's architecture visually. Drag pages, draw connections, and see your entire site structure at a glance.",
    sections: [
      {
        heading: "What Is a Visual Sitemap?",
        content: "A visual sitemap is a diagram showing every page on your website and how they connect to each other. Unlike XML sitemaps (which are for search engines), visual sitemaps are for humans — they help you plan, communicate, and refine your website's structure before building it.\n\nThink of it as a blueprint for your website. Just as an architect draws floor plans before construction, a visual sitemap maps out your digital structure before development. It shows the hierarchy of pages, the relationships between sections, and the overall navigation flow.\n\nEPIC's visual sitemap maker turns this planning process into a simple drag-and-drop experience. Choose from 50+ page templates, arrange them on a canvas, and connect them with arrows. In minutes, you have a complete visual sitemap ready for team review, client approval, or developer handoff."
      },
      {
        heading: "Why Visual Sitemaps Beat Spreadsheets",
        content: "Many teams still plan websites using spreadsheets or bullet-point lists. While these methods capture page names, they miss the crucial relationships between pages. A visual sitemap shows navigation paths, content hierarchies, and user flows that text-based planning simply cannot communicate.\n\nVisual sitemaps also make it easy to spot problems. Orphan pages with no incoming links, sections that are buried too deep in the hierarchy, and redundant pages that could be consolidated — these issues jump out in a visual format but hide in spreadsheets.\n\nFor client communication, visual sitemaps are invaluable. Instead of explaining your website plan with words, you show a clear diagram that anyone can understand. Clients can see exactly what they're getting, provide informed feedback, and approve the structure with confidence."
      },
      {
        heading: "How to Build a Visual Sitemap in EPIC",
        content: "Start by listing the main sections of your website. Most sites have 5-8 top-level sections: Home, About, Products/Services, Blog, Contact, etc. Drag these page templates from EPIC's library onto the canvas and arrange them horizontally.\n\nNext, add sub-pages under each section. Under Products, you might have Category pages and individual Product pages. Under Blog, you'll have article pages. Connect parent pages to child pages with EPIC's arrow tool.\n\nFinally, add cross-links. These are connections between pages in different sections — like a Blog post linking to a Product page, or the About page linking to the Contact form. These cross-links create a web of internal connections that improves both usability and SEO.\n\nExport your finished sitemap as a PNG file. Share it with your team, present it to clients, or keep it as reference documentation during development."
      },
      {
        heading: "Visual Sitemap Templates for Every Website Type",
        content: "EPIC includes page templates for every common website type. E-commerce sites can use product listing, product detail, cart, and checkout templates. SaaS sites get landing page, pricing, features, and dashboard templates. Portfolio sites have project gallery, case study, and bio page templates.\n\nBlog and content sites can use article, category, author, and archive templates. Corporate sites get about, team, careers, and investor relations templates. Educational sites find course listing, lesson, quiz, and certificate templates.\n\nEach template is clearly labeled and categorized, so you can find exactly what you need quickly. Simply drag templates onto the canvas and customize the page names to match your project."
      },
      {
        heading: "From Sitemap to Finished Website",
        content: "Your visual sitemap is the foundation of your website project. Once approved, it guides every phase of development. Content writers know exactly which pages need copy. Designers know the navigation structure to implement. Developers know the routing and linking requirements.\n\nMany teams use visual sitemaps as project management tools. Each page on the sitemap becomes a task or ticket in your project tracker. This ensures nothing gets missed during development and everyone has a clear understanding of the project scope.\n\nAfter launch, your visual sitemap remains useful. When planning updates, new features, or content additions, refer back to your sitemap to see how new pages fit into the existing structure. EPIC makes it easy to create updated versions as your website evolves."
      }
    ],
    comparison: [
      { feature: "Free visual sitemap creation", epic: true, others: false },
      { feature: "50+ page templates", epic: true, others: false },
      { feature: "Drag-and-drop interface", epic: true, others: true },
      { feature: "PNG export", epic: true, others: true },
      { feature: "No sign-up required", epic: true, others: false },
      { feature: "Browser-based", epic: true, others: true },
    ],
    faqs: [
      { question: "What is a visual sitemap?", answer: "A visual sitemap is a diagram that shows all the pages on your website and how they're connected. It's used for planning website structure before development." },
      { question: "How do I create a visual sitemap in EPIC?", answer: "Drag page templates onto the canvas, connect them with arrows, arrange the layout, and export as PNG. It takes just minutes." },
      { question: "What's the difference between a visual sitemap and an XML sitemap?", answer: "A visual sitemap is a human-readable diagram for planning. An XML sitemap is a machine-readable file for search engines. Both are important but serve different purposes." },
      { question: "Can I use EPIC's sitemap maker for client projects?", answer: "Yes! Create visual sitemaps for client presentations, proposals, and project documentation. Export as PNG for easy sharing." },
    ],
    relatedPillars: ["website-flow-generator", "user-flow-diagram-tool", "drag-drop-website-builder", "saas-navigation-planner"],
    cta: { title: "Build Your Visual Sitemap Now", description: "Start mapping your website structure with drag-and-drop templates." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Visual Sitemap Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/visual-sitemap-maker`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "user-flow-diagram-tool": {
    slug: "user-flow-diagram-tool",
    metaTitle: "User Flow Diagram Tool — Map UX Journeys Free | EPIC",
    metaDescription: "Create user flow diagrams with drag-and-drop. Map UX journeys, plan navigation paths, and export flow charts. Free user flow diagram tool online.",
    keywords: "user flow diagram tool, UX flow chart, user journey map, website user flow, user flow creator online, UX navigation tool",
    h1: "Free User Flow Diagram Tool",
    heroSubtitle: "Map user journeys from entry to conversion. Visualize every click, decision, and path through your product.",
    sections: [
      {
        heading: "Understanding User Flow Diagrams",
        content: "A user flow diagram is a visual representation of the steps a user takes to complete a task on your website or app. Unlike sitemaps that show page hierarchy, user flows show the actual journey — including decision points, alternative paths, and dead ends.\n\nUser flow diagrams answer critical questions: How does a new user sign up? What happens when a customer wants to buy a product? Where do users go after reading a blog post? By mapping these journeys, you can identify friction points, unnecessary steps, and opportunities to improve the experience.\n\nEPIC's user flow diagram tool makes this process visual and intuitive. Drag page templates onto a canvas, connect them with directional arrows, and instantly see how users move through your product. The result is a clear, shareable diagram that aligns your entire team around the user experience."
      },
      {
        heading: "Types of User Flows",
        content: "Task flows map a single path through your product — like the checkout process or account creation. These are linear and straightforward, showing each step from start to completion.\n\nWire flows combine wireframes with flow diagrams, showing both the page layout and the connections between pages. EPIC's page templates function like simplified wireframes, making it easy to create wire flows.\n\nUser journeys are broader, encompassing the emotional experience alongside the functional steps. While EPIC focuses on page-to-page navigation, you can annotate your flows to capture user emotions and pain points.\n\nNavigation flows show how users move between major sections of your site. These are particularly useful for complex products with many features and sections."
      },
      {
        heading: "Creating Effective User Flows",
        content: "Start with a clear goal. What task is the user trying to accomplish? Sign up for an account? Make a purchase? Find information? Define the start and end points before mapping the flow.\n\nInclude decision points. Users don't always follow a linear path. They might abandon their cart, go back to browse more products, or switch between sections. Your flow should account for these real-world behaviors.\n\nKeep it focused. A single flow diagram should map one primary user journey. Trying to capture every possible path on one diagram creates confusion. Instead, create multiple focused flows for different tasks.\n\nValidate with data. If you have an existing product, use analytics to confirm your flow matches actual user behavior. Identify where users drop off and focus your optimization efforts there."
      },
      {
        heading: "User Flows for Different Products",
        content: "E-commerce user flows typically cover: browsing → product selection → add to cart → checkout → confirmation. Key decision points include size/color selection, coupon application, and payment method choice.\n\nSaaS user flows focus on: landing page → sign-up → onboarding → first value moment → regular usage. The onboarding flow is critical — users who don't reach their first value moment quickly will churn.\n\nContent websites have flows like: homepage → category → article → related articles → subscription. The goal is keeping users engaged and eventually converting them to subscribers.\n\nEPIC's template library covers all these scenarios with pre-built page types that you can drag, connect, and customize."
      },
      {
        heading: "From Diagram to Development",
        content: "User flow diagrams bridge the gap between design and development. Developers can see exactly which pages need to be built, what navigation elements are required, and how screens connect to each other.\n\nUse your flow diagram during sprint planning to estimate work accurately. Each page and connection in the flow represents development effort that needs to be accounted for.\n\nShare flow diagrams with QA teams so they know which paths to test. Every connection in the diagram is a navigation path that needs to work correctly in the final product.\n\nAfter launch, revisit your flow diagrams when planning new features. New features need to integrate into existing flows without breaking the user experience."
      }
    ],
    comparison: [
      { feature: "Free user flow creation", epic: true, others: false },
      { feature: "Pre-built page templates", epic: true, others: false },
      { feature: "Visual drag-and-drop", epic: true, others: true },
      { feature: "Export to PNG", epic: true, others: true },
      { feature: "No learning curve", epic: true, others: false },
      { feature: "Zero installation", epic: true, others: true },
    ],
    faqs: [
      { question: "What is a user flow diagram?", answer: "A user flow diagram shows the steps a user takes to complete a task on your website. It maps the journey from entry point to goal completion, including decision points and alternative paths." },
      { question: "How do I create a user flow in EPIC?", answer: "Drag page templates onto the canvas, draw connections between pages with arrows, and export your completed flow as a PNG file." },
      { question: "What's the difference between a user flow and a sitemap?", answer: "A sitemap shows page hierarchy and structure. A user flow shows the actual journey a user takes through those pages to complete a task." },
      { question: "Can I make multiple user flows?", answer: "Yes. Create separate flow diagrams for different user tasks — sign-up flow, purchase flow, onboarding flow, etc." },
    ],
    relatedPillars: ["website-flow-generator", "visual-sitemap-maker", "saas-navigation-planner", "drag-drop-website-builder"],
    cta: { title: "Map Your User Flows Now", description: "Create clear, visual user flow diagrams with drag-and-drop." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC User Flow Diagram Tool",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/user-flow-diagram-tool`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "saas-navigation-planner": {
    slug: "saas-navigation-planner",
    metaTitle: "SaaS Navigation Planner — Plan App UX Free | EPIC",
    metaDescription: "Plan your SaaS product's navigation structure visually. Map onboarding flows, dashboard layouts, and feature discovery paths. Free SaaS navigation planner.",
    keywords: "SaaS navigation planner, SaaS website flow creator, app navigation design, product navigation planning, SaaS UX flow, SaaS onboarding flow design",
    h1: "Free SaaS Navigation Planner",
    heroSubtitle: "Design your SaaS product's navigation from onboarding to power-user flows. Reduce churn with clear, planned user journeys.",
    sections: [
      {
        heading: "Why SaaS Navigation Is Different",
        content: "SaaS products have unique navigation challenges. Unlike simple websites, SaaS applications have authenticated areas, role-based access, complex feature sets, and multi-step workflows. Getting navigation wrong means confused users, higher support costs, and increased churn.\n\nThe average SaaS product loses 75% of new users within the first week. Poor navigation is a leading cause — users can't find features, don't understand where to go next, or get lost in complex menus. Planning your navigation before building prevents these costly mistakes.\n\nEPIC's SaaS navigation planner helps you model your product's structure visually. Map the journey from marketing site through signup, onboarding, and into the product. See how features connect, where users might get stuck, and how to guide them toward their goals."
      },
      {
        heading: "Mapping the SaaS User Journey",
        content: "Every SaaS product has three critical navigation zones: acquisition, activation, and retention. The acquisition zone covers your marketing site — landing pages, pricing, features, and signup. The activation zone covers onboarding, setup, and first-value delivery. The retention zone covers the core product experience.\n\nStart mapping from your landing page. How does a visitor become a user? What pages do they see during signup? What's the first screen after login? Where does onboarding guide them? Each transition between pages is a potential drop-off point that needs careful planning.\n\nEPIC's page templates include SaaS-specific screens: pricing pages, feature comparison tables, onboarding wizards, dashboards, settings panels, and more. Drag them onto your canvas and model your complete SaaS navigation flow."
      },
      {
        heading: "Onboarding Flow Design",
        content: "The onboarding flow is the most critical part of SaaS navigation. Users need to reach their first value moment quickly — the moment they understand why your product is worth using. Every unnecessary screen or confusing navigation choice delays this moment and increases the chance of abandonment.\n\nMap your onboarding as a separate flow diagram. Start with the first screen after signup and end with the user performing their core action for the first time. Count the steps. If there are more than 5, look for steps to eliminate or combine.\n\nConsider progressive disclosure. Not every feature needs to be visible on day one. Your navigation should gradually reveal complexity as users become more comfortable. EPIC's flow diagrams help you plan which features are accessible when."
      },
      {
        heading: "Dashboard and Feature Navigation",
        content: "SaaS dashboards are navigation hubs. Users land here and navigate to different features, settings, reports, and workflows. A well-planned dashboard reduces the number of clicks needed to reach any feature.\n\nOrganize features into logical groups. Use EPIC's flow diagrams to map how features relate to each other and which ones users access most frequently. High-traffic features should be prominent in your navigation; rarely-used features can be nested in sub-menus.\n\nPlan your navigation for growth. As you add new features, they need to fit into your existing navigation structure. A well-planned hierarchy accommodates new features without confusing existing users."
      },
      {
        heading: "Multi-Role Navigation Planning",
        content: "Many SaaS products serve multiple user roles: admins, managers, team members, and sometimes external stakeholders. Each role needs a tailored navigation experience that shows relevant features and hides irrelevant ones.\n\nCreate separate flow diagrams for each role. An admin might need access to billing, user management, and analytics. A team member might only need the core product features. Mapping these separately helps you design role-appropriate navigation.\n\nEPIC's canvas lets you model these different experiences side by side. Compare role-based flows to ensure consistency where needed and appropriate differences where required."
      }
    ],
    comparison: [
      { feature: "SaaS-specific templates", epic: true, others: false },
      { feature: "Free to use", epic: true, others: false },
      { feature: "Onboarding flow planning", epic: true, others: false },
      { feature: "Multi-role flow support", epic: true, others: false },
      { feature: "PNG export", epic: true, others: true },
      { feature: "No account needed", epic: true, others: false },
    ],
    faqs: [
      { question: "What is a SaaS navigation planner?", answer: "A SaaS navigation planner helps you visually map how users move through your software product — from marketing site to signup, onboarding, and core features." },
      { question: "Why is SaaS navigation planning important?", answer: "Poor navigation causes user confusion and churn. Planning navigation visually before development ensures users can find features and reach value quickly." },
      { question: "Can I plan onboarding flows?", answer: "Yes. Use EPIC's page templates to map your onboarding step by step, from signup to first value moment." },
      { question: "Does EPIC support multi-role navigation?", answer: "Yes. Create separate flow diagrams for each user role — admin, manager, team member — to plan role-appropriate navigation." },
    ],
    relatedPillars: ["website-flow-generator", "user-flow-diagram-tool", "visual-sitemap-maker", "drag-drop-website-builder"],
    cta: { title: "Plan Your SaaS Navigation", description: "Map onboarding flows and feature navigation with drag-and-drop templates." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC SaaS Navigation Planner",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/saas-navigation-planner`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "drag-drop-website-builder": {
    slug: "drag-drop-website-builder",
    metaTitle: "Drag & Drop Website Builder — Plan Sites Free | EPIC",
    metaDescription: "Plan your website structure with drag-and-drop simplicity. Arrange pages, set navigation paths, and export site plans. Free visual website builder tool.",
    keywords: "drag and drop website builder, website planner, site structure builder, visual website builder, drag drop website flow builder, website planning tool",
    h1: "Free Drag & Drop Website Planner",
    heroSubtitle: "Plan your website's structure by dragging pages and drawing connections. No coding, no complexity — just visual planning.",
    sections: [
      {
        heading: "Visual Website Planning Made Simple",
        content: "Building a website starts with planning its structure. Which pages do you need? How do they connect? What's the navigation hierarchy? EPIC's drag-and-drop website planner answers these questions visually.\n\nInstead of writing complex documentation or learning design software, you simply drag page templates onto a canvas and connect them. The result is a clear visual plan that shows your entire website structure at a glance. It's website planning reduced to its simplest form.\n\nEPIC includes 50+ page templates covering every common website section: homepages, about pages, product listings, blog articles, contact forms, pricing tables, and more. Each template is clearly labeled, making it easy to build your site structure quickly."
      },
      {
        heading: "From Concept to Complete Plan in Minutes",
        content: "Most website projects start with a conversation about what pages are needed. With EPIC, you can turn that conversation into a visual plan in real-time. During a client meeting or team brainstorm, open EPIC and start dragging pages onto the canvas.\n\nAs you discuss each section of the website, add the corresponding page templates. When someone mentions 'we need a blog,' drag in the blog landing page, category pages, and article templates. When they say 'users need to log in,' add authentication pages and connect them to the dashboard.\n\nBy the end of the meeting, you have a complete website plan that everyone agrees on. Export it as a PNG and share it immediately — no post-meeting documentation needed."
      },
      {
        heading: "Template Library for Every Website Type",
        content: "EPIC's template library is organized by category to help you find the right pages quickly. The Authentication category includes login, register, forgot password, and profile pages. The E-Commerce category includes product listing, product detail, cart, checkout, and order confirmation pages.\n\nThe Dashboard category includes analytics, settings, notifications, and user management pages. The Content category includes blog, article, gallery, portfolio, and FAQ pages. The Marketing category includes landing pages, pricing tables, feature tours, and testimonial pages.\n\nEach template represents a page that you might include in your website. You're not limited to the template names — rename them to match your specific project. The templates serve as starting points that speed up your planning process."
      },
      {
        heading: "Planning for SEO and Performance",
        content: "Your website's structure directly impacts SEO. Search engines prefer flat hierarchies where important pages are reachable within a few clicks from the homepage. EPIC's visual planner makes it easy to check your hierarchy depth and ensure no important page is buried too deep.\n\nInternal linking is another SEO factor that's easy to plan visually. In your EPIC diagram, connections between pages represent navigation links. A well-connected site where pages link to related content performs better in search engines than a linear site with minimal cross-linking.\n\nURL structure should mirror your site hierarchy. When you plan your structure in EPIC, you're also planning your URL patterns. A clear hierarchy like /products/category/product-name is better for SEO than random or flat URL structures."
      },
      {
        heading: "Collaboration and Handoff",
        content: "EPIC's exported PNG diagrams are perfect for team collaboration. Share them in Slack, email, or project management tools. Everyone from designers to developers to stakeholders can understand a visual site plan.\n\nFor client projects, visual site plans are more effective than written proposals. Clients can see exactly what they're getting and provide specific feedback. 'Move the contact page higher' is much more actionable than vague requests about navigation.\n\nDevelopers particularly appreciate visual site plans because they can see the routing structure, navigation requirements, and page relationships at a glance. This reduces questions during development and ensures the final product matches the plan."
      }
    ],
    comparison: [
      { feature: "Free website planning", epic: true, others: false },
      { feature: "Drag-and-drop interface", epic: true, others: true },
      { feature: "50+ page templates", epic: true, others: false },
      { feature: "Instant PNG export", epic: true, others: true },
      { feature: "No account required", epic: true, others: false },
      { feature: "Works on mobile", epic: true, others: false },
    ],
    faqs: [
      { question: "Is this a website builder?", answer: "EPIC is a website planning tool, not a website builder. You plan your site's structure visually, then use the plan to guide actual development with your preferred tools." },
      { question: "Can I plan any type of website?", answer: "Yes. With 50+ page templates covering e-commerce, SaaS, blogs, portfolios, and more, you can plan any website type." },
      { question: "Do I need design skills?", answer: "No. Just drag page templates onto the canvas and connect them with arrows. EPIC handles the visual layout." },
      { question: "Can I share my site plan with others?", answer: "Yes. Export as PNG and share via email, Slack, or any platform. The visual format is universally understandable." },
    ],
    relatedPillars: ["website-flow-generator", "visual-sitemap-maker", "user-flow-diagram-tool", "canva-alternative-for-students"],
    cta: { title: "Start Planning Your Website", description: "Drag, connect, and export your website plan in minutes." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Drag & Drop Website Planner",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/drag-drop-website-builder`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "canva-alternative-for-students": {
    slug: "canva-alternative-for-students",
    metaTitle: "Free Canva Alternative for Students — EPIC Design Tool",
    metaDescription: "EPIC is the best free Canva alternative for students. Create posters, presentations, logos, and more with AI. No subscription, no watermarks, no limits.",
    keywords: "canva alternative for students, free design tool students, canva alternative free, beginner friendly design tool, student design tool, free poster maker students",
    h1: "Best Free Canva Alternative for Students",
    heroSubtitle: "Everything students need to create stunning designs — posters, presentations, logos, thumbnails — completely free with AI assistance.",
    sections: [
      {
        heading: "Why Students Need a Canva Alternative",
        content: "Canva is a great tool, but its free tier has significant limitations for students. Many premium templates, elements, and features are locked behind a paid subscription. For students on tight budgets, these restrictions are frustrating — especially when a project deadline is approaching.\n\nEPIC offers a genuinely free alternative. Create professional designs without hitting paywalls, watermarks, or feature restrictions. Our AI-powered design generator handles the heavy lifting, so you get professional results even without design experience.\n\nWhether you're making a presentation for class, a poster for a campus event, a logo for your student organization, or a thumbnail for your YouTube channel, EPIC has you covered. No subscription required, no credit card needed, no strings attached."
      },
      {
        heading: "Design Tools Students Actually Need",
        content: "EPIC focuses on the design types that matter most to students. Presentation slides for class projects — create professional 16:9 slides that impress your professors. Posters for events, clubs, and fundraisers — eye-catching designs in minutes.\n\nResume and CV designs for internship and job applications — stand out from the stack with a professionally designed resume. Social media graphics for student organizations, personal brands, and side projects — consistent, professional content.\n\nYouTube thumbnails for student creators — click-worthy designs that grow your channel. Logos for student startups, clubs, and projects — build a brand identity without hiring a designer. Certificates for events, courses, and awards — professional-looking recognition."
      },
      {
        heading: "AI-Powered Design for Beginners",
        content: "Not every student has design skills — and that's perfectly fine. EPIC's AI design generator creates professional-quality designs from simple text descriptions. Describe what you want, and the AI generates it. No need to learn complex design software or spend hours arranging elements.\n\nThe AI understands design principles like color harmony, typography pairing, and visual hierarchy. It applies these principles automatically, so every design looks professional. You can then customize the AI's output using EPIC's editor — change colors, edit text, resize, and export.\n\nThis combination of AI generation and manual editing gives students the best of both worlds: speed and control. Generate a design in seconds, then refine it to match your exact vision."
      },
      {
        heading: "EPIC vs Canva: Feature Comparison",
        content: "Both EPIC and Canva offer design tools, but the experience is fundamentally different. Canva uses a template-first approach where you browse templates and customize them. EPIC uses an AI-first approach where you describe what you want and the AI creates it.\n\nCanva's free tier includes templates but many premium elements are locked. EPIC's free tier gives you full access to AI generation and editing tools. Canva requires an account to save designs. EPIC lets you download immediately without signing up.\n\nFor students specifically, EPIC's advantage is simplicity. There's no learning curve — describe your design, generate it, download it. Canva's editor, while powerful, takes time to learn and master. When you need a design quickly for a deadline, speed matters."
      },
      {
        heading: "Student Success Stories",
        content: "Students worldwide use EPIC for their academic and extracurricular design needs. Engineering students create professional project presentations. Marketing students design campaign materials. Art students generate reference imagery and inspiration boards.\n\nStudent organizations use EPIC for consistent branding across all their materials — posters, social media posts, flyers, and banners. Student entrepreneurs create logos, business cards, and pitch deck slides for their startup ideas.\n\nThe website navigation maker is particularly popular among computer science students who need to plan website architectures for their projects. Instead of drawing crude diagrams by hand, they create professional flow diagrams with EPIC's drag-and-drop tool."
      }
    ],
    comparison: [
      { feature: "Truly free for students", epic: true, others: false },
      { feature: "AI-powered design generation", epic: true, others: false },
      { feature: "No account needed to download", epic: true, others: false },
      { feature: "Template library", epic: true, others: true },
      { feature: "Presentation maker", epic: true, others: true },
      { feature: "Website flow planning", epic: true, others: false },
      { feature: "No watermarks on free tier", epic: true, others: false },
    ],
    faqs: [
      { question: "Is EPIC really free for students?", answer: "Yes. EPIC's core features including AI design generation, editing, and download are free for everyone — students included. No education email or verification needed." },
      { question: "How is EPIC different from Canva?", answer: "EPIC uses AI to generate designs from text descriptions, while Canva uses templates. EPIC is simpler to use and has fewer paywalled features." },
      { question: "Can I use EPIC for school presentations?", answer: "Absolutely. Create professional presentation slides, export them as images, and use them in PowerPoint, Google Slides, or any presentation software." },
      { question: "Do I need design skills to use EPIC?", answer: "No. EPIC's AI handles the design work. Describe what you want, and the AI creates a professional design you can customize and download." },
      { question: "Can I make a logo for my student club?", answer: "Yes. Use EPIC's logo maker to create a professional logo. Export with transparent background for use on all your materials." },
    ],
    relatedPillars: ["free-poster-design-tool", "online-logo-maker-fast", "drag-drop-website-builder", "website-flow-generator"],
    cta: { title: "Start Designing for Free", description: "Create professional designs in seconds — no account, no subscription, no limits." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC - Canva Alternative for Students",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/canva-alternative-for-students`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "2100" },
    },
  },
  "free-poster-design-tool": {
    slug: "free-poster-design-tool",
    metaTitle: "Free Poster Design Tool — Create Posters Online | EPIC",
    metaDescription: "Design stunning posters with AI. Professional templates, drag-and-drop editor, HD export. The best free poster design tool online. No skills needed.",
    keywords: "free poster design tool, poster maker online, poster creator free, AI poster design, event poster maker, poster generator",
    h1: "Free AI Poster Design Tool",
    heroSubtitle: "Create professional posters for events, marketing, education, and social media. AI-powered design — just describe what you need.",
    sections: [
      {
        heading: "The Fastest Way to Design Posters",
        content: "Traditional poster design requires expensive software, design skills, and hours of work. EPIC eliminates all three barriers. Describe your poster idea in plain language, and the AI generates a professional design in seconds.\n\nNeed a concert poster? Describe the event, date, and vibe. Need a marketing flyer? Describe your product and target audience. Need an educational poster? Describe the topic and key points. EPIC's AI understands context and creates appropriate designs.\n\nAfter generation, customize anything using the built-in editor. Change text, adjust colors, resize elements, and add your logo. Export in HD quality for both digital and print use. The entire process takes minutes, not hours."
      },
      {
        heading: "Poster Design for Every Occasion",
        content: "Event posters are EPIC's specialty. Concerts, conferences, workshops, webinars, fundraisers, and community events all deserve professional promotion. EPIC's AI creates event-appropriate designs with proper hierarchy — event name prominent, date and venue clearly visible, key details easy to find.\n\nMarketing posters help businesses promote products, services, and offers. EPIC creates designs that follow marketing best practices: clear value proposition, strong visual hierarchy, compelling call-to-action, and brand-consistent styling.\n\nEducational posters communicate information clearly. Science fair boards, classroom displays, infographics, and research posters all benefit from EPIC's clean, professional design approach. The AI ensures information is organized and readable."
      },
      {
        heading: "Print-Ready Quality",
        content: "EPIC exports posters in high resolution suitable for professional printing. Whether you're printing at home, at a copy shop, or through a professional print service, EPIC's output meets quality standards.\n\nSupported sizes include A4, A3, US Letter, and custom dimensions. Export in PNG or JPG format at 2x resolution for crisp, detailed prints. The designs use print-safe colors and clear typography that reproduce well on paper.\n\nFor digital use — social media, websites, email newsletters — EPIC's output is already optimized. Standard RGB color profiles, web-optimized file sizes, and popular aspect ratios mean your posters look great everywhere."
      },
      {
        heading: "Why Choose EPIC Over Other Poster Tools",
        content: "Speed is EPIC's biggest advantage. While other tools require you to browse templates, replace placeholder content, and manually adjust layouts, EPIC generates a complete design from your description. You go from idea to finished poster in under a minute.\n\nAI intelligence is another key differentiator. EPIC's AI doesn't just apply random templates — it understands your content and creates designs that make sense. A concert poster looks different from a business flyer, and EPIC knows the difference.\n\nCost is the third advantage. EPIC is free for daily use. No monthly subscription, no per-download fees, no watermarks on basic designs. For students, small businesses, and individuals, this means professional poster design without the professional price tag."
      },
      {
        heading: "Tips for Better Poster Design",
        content: "Keep your message clear. A poster should communicate one main idea. If you're promoting an event, lead with the event name and date. If you're advertising a product, lead with the benefit. EPIC's AI follows this principle, but you can reinforce it during customization.\n\nUse contrast for readability. Light text on dark backgrounds or dark text on light backgrounds ensures your message is readable from a distance. EPIC's AI automatically chooses high-contrast combinations.\n\nInclude a call-to-action. Every poster should tell the viewer what to do next: 'Get tickets at...', 'Visit us at...', 'Scan to learn more'. Make sure your CTA is clear and prominent in the design.\n\nLess is more. Don't try to include every detail on your poster. Focus on the essential information and direct people to a website or QR code for additional details."
      }
    ],
    comparison: [
      { feature: "AI-generated posters", epic: true, others: false },
      { feature: "Free HD export", epic: true, others: false },
      { feature: "No account required", epic: true, others: false },
      { feature: "Print-ready quality", epic: true, others: true },
      { feature: "Custom sizes", epic: true, others: true },
      { feature: "Text customization", epic: true, others: true },
    ],
    faqs: [
      { question: "Can I print posters made with EPIC?", answer: "Yes. EPIC exports at high resolution (2x) suitable for professional printing in A4, A3, and custom sizes." },
      { question: "Is EPIC better than Canva for posters?", answer: "EPIC is faster — AI generates complete designs from descriptions. Canva requires manual template customization. EPIC is also free without watermarks." },
      { question: "What poster sizes does EPIC support?", answer: "A4, A3, US Letter, Instagram square (1080x1080), story (1080x1920), and custom dimensions." },
      { question: "Do I need to create an account?", answer: "No. Generate and download posters immediately without creating an account." },
    ],
    relatedPillars: ["canva-alternative-for-students", "online-logo-maker-fast", "website-flow-generator", "drag-drop-website-builder"],
    cta: { title: "Design Your Poster Now", description: "Describe your poster idea and get a professional design in seconds." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Poster Design Tool",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/free-poster-design-tool`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "online-logo-maker-fast": {
    slug: "online-logo-maker-fast",
    metaTitle: "Online Logo Maker — Design Logos in Seconds | EPIC",
    metaDescription: "Create professional logos instantly with AI. Text-based logo generation, transparent PNG export, no design skills needed. Free online logo maker.",
    keywords: "online logo maker, fast logo creator, AI logo generator, free logo maker, instant logo design, logo maker online free",
    h1: "Fast Online Logo Maker with AI",
    heroSubtitle: "Generate professional logos in seconds. Describe your brand, and AI creates logo options instantly. Free, fast, no design skills needed.",
    sections: [
      {
        heading: "Logo Design in Seconds, Not Days",
        content: "Traditional logo design takes days or weeks — briefing a designer, reviewing concepts, requesting revisions, and finalizing files. EPIC compresses this entire process into seconds. Describe your brand name and style preference, and the AI generates professional logo concepts.\n\nThis doesn't replace professional designers for complex branding projects. But for startups, side projects, student organizations, social media channels, and small businesses that need a quality logo quickly, EPIC delivers professional results at zero cost.\n\nThe generated logos follow established design principles: clean typography, balanced composition, appropriate color usage, and scalable simplicity. They work at any size from favicon to billboard."
      },
      {
        heading: "AI Understands Branding",
        content: "EPIC's AI doesn't just generate random graphics. It understands branding context. Tell it you're a tech startup and it creates modern, clean designs. Tell it you're a bakery and it creates warm, inviting designs. Tell it you're a law firm and it creates professional, trustworthy designs.\n\nThe AI considers industry conventions, color psychology, and typography trends. A children's brand gets playful fonts and bright colors. A luxury brand gets elegant serifs and muted tones. A sports brand gets bold, dynamic styling.\n\nYou can guide the AI with style preferences: 'minimalist', 'vintage', 'modern', 'playful', 'elegant'. The more context you provide, the better the AI tailors its output to your vision."
      },
      {
        heading: "Export Options for Every Use Case",
        content: "EPIC exports logos in formats that work everywhere. PNG with transparent background for websites, social media, and documents. High-resolution output for print materials like business cards, letterheads, and signage.\n\nFor digital use, EPIC's logos are already optimized — proper file sizes for fast web loading, crisp rendering on retina displays, and clean edges at any zoom level.\n\nFor print use, export at 2x resolution for crisp, professional results on any printed material."
      },
      {
        heading: "Building a Brand Identity with EPIC",
        content: "A logo is just the starting point of brand identity. Once you have your logo, use EPIC to create matching brand materials: business cards, social media headers, email signatures, presentation templates, and marketing materials.\n\nEPIC's design system ensures consistency. The colors, typography, and style from your logo carry through to all your materials. This consistency is what separates amateur branding from professional brand identity.\n\nFor students and entrepreneurs, this complete branding toolkit is invaluable. Instead of paying thousands for a branding agency, create a cohesive brand identity yourself in an afternoon."
      },
      {
        heading: "When to Use AI Logo Makers vs Human Designers",
        content: "AI logo makers like EPIC are ideal for: MVPs and prototypes that need quick branding, personal projects and side hustles, student organizations and clubs, social media channels, testing brand concepts before investing in professional design.\n\nProfessional designers are better for: established businesses building long-term brand equity, complex multi-element logos with custom illustration, branding that requires extensive market research and strategy, visual identities that will be used across hundreds of touchpoints.\n\nMany professionals use EPIC for initial concept exploration before commissioning custom work. The AI-generated concepts serve as a starting point for the brief, helping communicate vision and style preferences to human designers."
      }
    ],
    comparison: [
      { feature: "AI-generated logos", epic: true, others: false },
      { feature: "Free transparent PNG export", epic: true, others: false },
      { feature: "No account needed", epic: true, others: false },
      { feature: "Instant generation", epic: true, others: false },
      { feature: "Brand-aware AI", epic: true, others: false },
      { feature: "Commercial use license", epic: true, others: true },
    ],
    faqs: [
      { question: "Can I use the logo for my business?", answer: "Yes. Logos created with EPIC are yours to use commercially — on your website, business cards, products, and anywhere else." },
      { question: "Do I get transparent backgrounds?", answer: "Yes. Export your logo as PNG with transparent background, ready for use on any colored background." },
      { question: "How fast can I create a logo?", answer: "Seconds. Describe your brand, generate logo concepts, customize if needed, and download. The entire process takes under a minute." },
      { question: "Is EPIC's logo maker really free?", answer: "Yes. Generate and download logos for free. No watermarks, no hidden fees, no account required." },
    ],
    relatedPillars: ["canva-alternative-for-students", "free-poster-design-tool", "website-flow-generator", "drag-drop-website-builder"],
    cta: { title: "Create Your Logo Now", description: "Describe your brand and get a professional logo in seconds." },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Online Logo Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/online-logo-maker-fast`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
};

export const pillarSlugs = Object.keys(pillarPages);
