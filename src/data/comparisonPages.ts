export interface ComparisonRow {
  feature: string;
  epic: string;
  competitor: string;
}

export interface ComparisonPage {
  slug: string;
  competitor: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  heroSubtitle: string;
  checkedDate: string;
  summary: string;
  sections: { heading: string; content: string }[];
  table: ComparisonRow[];
  bestFor: { epic: string; competitor: string };
  epicStrengths: string[];
  epicLimitations: string[];
  competitorStrengths: string[];
  faqs: { question: string; answer: string }[];
  relatedComparisons: string[];
}

export const comparisonPages: Record<string, ComparisonPage> = {
  "epic-vs-relume": {
    slug: "epic-vs-relume",
    competitor: "Relume",
    metaTitle: "EPIC vs Relume: Sitemap & Site Planning Compared | EPIC",
    metaDescription:
      "Compare EPIC and Relume for AI sitemap and website planning: AI generation, visual editing, templates, exports, and who each tool suits best.",
    keywords:
      "epic vs relume, relume alternative, ai sitemap generator, relume sitemap builder, website planning tool comparison",
    h1: "EPIC vs Relume",
    heroSubtitle:
      "Two very different tools that both touch website planning — see which fits your workflow.",
    checkedDate: "2026-08-08",
    summary:
      "Relume is a design-system-focused platform best known for its Figma component library and site-builder pairing, with a sitemap step as part of a larger design workflow. EPIC is a focused, browser-based AI sitemap builder: describe your site, get an editable visual sitemap in seconds, and export or share it without needing Figma or Webflow set up. If your priority is a fast, standalone sitemap you can iterate on and share, EPIC is the more direct tool. If you're already building in Figma or Webflow and want a sitemap that feeds a component-driven design system, Relume's ecosystem is built for that.",
    sections: [
      {
        heading: "AI sitemap generation",
        content:
          "Relume's AI sitemap builder generates a page list and site structure from a short prompt, then lets you push that structure into its Figma component library or its own site builder to start wireframing. It is one part of a broader AI website-design pipeline that also covers copy and layout suggestions. EPIC's AI generation is purpose-built around the sitemap itself: you describe the site in plain language and EPIC produces a full visual, editable site tree with pages and hierarchy already laid out on a canvas, without requiring you to move into a separate design tool to see or adjust the structure.",
      },
      {
        heading: "Visual editing and user flows",
        content:
          "EPIC's canvas is a drag-and-drop sitemap editor with a dedicated user-flow mode for mapping how visitors move between pages, which is useful for UX planning conversations that happen before any visual design begins. Relume's structural editing largely happens either in its own builder or after export into Figma, where teams reflow the sitemap into wireframes and page sections using Relume's component library — a heavier but more design-integrated process.",
      },
      {
        heading: "Templates and component libraries",
        content:
          "Relume's biggest strength is its large, actively maintained library of Figma and Webflow components and page templates, which is a mature part of its product and a major reason design and no-code teams adopt it. EPIC does not compete on template depth; it focuses on generating and editing the sitemap structure itself rather than providing a large library of ready-made page designs.",
      },
      {
        heading: "Collaboration, sharing, and exports",
        content:
          "EPIC supports saving projects to an account, sharing sitemaps via a public link, and exporting the sitemap as a PNG for quick reference or presentations. Relume's collaboration largely runs through Figma and Webflow's own sharing and commenting systems, since that's where most of the detailed work happens after the initial AI structure is generated.",
      },
      {
        heading: "Who each tool is really for",
        content:
          "Relume suits designers and agencies already committed to Figma or Webflow who want an AI head start on both structure and visual design. EPIC suits founders, marketers, SEOs, and product teams who want a quick, clear sitemap to plan or communicate a site's structure without opening a design tool at all.",
      },
    ],
    table: [
      { feature: "AI sitemap generation from a prompt", epic: "Yes, generates full visual tree", competitor: "Yes, generates page/structure list" },
      { feature: "Standalone visual sitemap canvas", epic: "Yes, drag-and-drop editor", competitor: "Limited; structure mainly used in Figma/builder" },
      { feature: "User-flow mapping mode", epic: "Yes", competitor: "Not a core feature" },
      { feature: "Figma component library", epic: "No", competitor: "Yes, large and actively maintained" },
      { feature: "Webflow integration", epic: "No", competitor: "Yes" },
      { feature: "Page/wireframe templates", epic: "Limited", competitor: "Extensive library" },
      { feature: "PNG export", epic: "Yes", competitor: "Via Figma export" },
      { feature: "Shareable public sitemap link", epic: "Yes", competitor: "Via Figma/Webflow sharing" },
      { feature: "Browser-based, no install", epic: "Yes", competitor: "Yes (Figma/Webflow required for full workflow)" },
      { feature: "Free tier available", epic: "Yes, generous limits", competitor: "Free trial/tier available" },
      { feature: "Primary use case", epic: "Fast sitemap planning & sharing", competitor: "AI-assisted design system & wireframing" },
    ],
    bestFor: {
      epic: "Teams that want a quick, editable, shareable sitemap without opening a design tool.",
      competitor: "Design and no-code teams building visual pages in Figma or Webflow.",
    },
    epicStrengths: [
      "Generates a complete visual sitemap directly from a text description",
      "Simple drag-and-drop editing with a dedicated user-flow mode",
      "Works entirely in the browser with no design-tool setup required",
      "Free tier with generous limits, plus an India-focused pricing option",
    ],
    epicLimitations: [
      "No Figma or Webflow export, so it doesn't plug into an existing design-system workflow",
      "Smaller template library than Relume's long-established component catalog",
      "Newer product with a smaller community and fewer third-party integrations",
    ],
    competitorStrengths: [
      "Large, actively maintained library of Figma and Webflow components",
      "AI assistance spans structure, wireframes, and copy, not just the sitemap",
      "Strong fit for teams already standardized on Figma or Webflow",
      "Established product with a large user base and documentation",
    ],
    faqs: [
      {
        question: "Is Relume a sitemap tool or a design tool?",
        answer:
          "Relume is primarily a design system and AI website-building platform; sitemap generation is one step in a larger workflow that continues into Figma or Webflow wireframing.",
      },
      {
        question: "Can I use EPIC if my team designs in Figma?",
        answer:
          "Yes, you can use EPIC to plan and agree on structure quickly, then hand off the page list to your Figma workflow manually, since EPIC does not currently export directly into Figma.",
      },
      {
        question: "Which tool is faster for just getting a sitemap?",
        answer:
          "EPIC is built specifically to go from a text description to an editable visual sitemap in one step, without needing to set up a design file first.",
      },
    ],
    relatedComparisons: ["epic-vs-slickplan", "epic-vs-octopus", "epic-vs-flowmapp"],
  },

  "epic-vs-slickplan": {
    slug: "epic-vs-slickplan",
    competitor: "Slickplan",
    metaTitle: "EPIC vs Slickplan: AI Sitemap Tools Compared | EPIC",
    metaDescription:
      "See how EPIC's AI sitemap generator compares to Slickplan's sitemap and content planning suite — features, workflow, and best-fit users.",
    keywords:
      "epic vs slickplan, slickplan alternative, ai sitemap generator, sitemap builder comparison, website planning tool",
    h1: "EPIC vs Slickplan",
    heroSubtitle:
      "A long-established sitemap and content-planning suite versus a newer AI-first sitemap generator.",
    checkedDate: "2026-08-08",
    summary:
      "Slickplan is a well-established, purpose-built sitemap tool with a broader planning suite that includes content diagramming, wireframing, and user-testing add-ons built up over many years. EPIC is a newer, AI-first alternative focused squarely on generating and editing a visual sitemap from a plain-language description, aimed at people who want to skip manual page-by-page setup. Teams that need Slickplan's fuller planning toolkit (redesign workflows, content inventories, user testing) may prefer its depth; teams that want the fastest path from an idea to a shareable sitemap will find EPIC's AI generation step saves the most time upfront.",
    sections: [
      {
        heading: "AI sitemap generation",
        content:
          "EPIC's core workflow starts with AI: describe the website you want in a sentence or two, and it generates a full sitemap with pages and hierarchy already arranged on a visual canvas, ready to edit. Slickplan has historically been built around manual sitemap construction — adding pages, dragging them into a tree, and organizing content types — with AI-assisted features added on top over time rather than being the primary entry point. If your goal is to avoid manual setup entirely, EPIC's generation step is the more direct route.",
      },
      {
        heading: "Visual editing and structure",
        content:
          "Both tools offer drag-and-drop sitemap trees. Slickplan adds page status labels, content types, and notes fields aimed at larger content-governance projects, which is useful for teams managing redesigns of large existing sites. EPIC keeps the canvas simpler and pairs it with a user-flow mode for visualizing navigation paths, prioritizing speed and clarity over granular content metadata.",
      },
      {
        heading: "Additional planning tools",
        content:
          "Slickplan's suite extends beyond the sitemap into wireframing, content diagrams, and optional user-testing tools, making it a more complete toolkit for agencies running structured website redesign projects. EPIC does not currently offer wireframing or user-testing modules; it is focused specifically on the sitemap and flow layer of planning.",
      },
      {
        heading: "Crawling and importing existing sites",
        content:
          "Slickplan includes the ability to import an existing site structure to speed up redesign work on established sites. EPIC does not currently include a site crawler or URL-import feature, so mapping an existing site in EPIC means recreating its structure through the AI prompt or by building it manually on the canvas.",
      },
      {
        heading: "Sharing and exports",
        content:
          "EPIC supports public shareable links and PNG export for quick presentation of a sitemap. Slickplan offers a broader set of export formats given its longer feature history, along with commenting and review tools built for agency client sign-off processes.",
      },
    ],
    table: [
      { feature: "AI sitemap generation from a prompt", epic: "Yes, primary entry point", competitor: "Available as an added feature" },
      { feature: "Manual drag-and-drop sitemap editor", epic: "Yes", competitor: "Yes, with content-type labels and notes" },
      { feature: "User-flow mapping mode", epic: "Yes", competitor: "Limited" },
      { feature: "Site crawler / URL import", epic: "No", competitor: "Yes" },
      { feature: "Wireframing tools", epic: "No", competitor: "Yes" },
      { feature: "Content inventory / governance features", epic: "No", competitor: "Yes" },
      { feature: "User testing add-ons", epic: "No", competitor: "Yes" },
      { feature: "PNG export", epic: "Yes", competitor: "Yes, plus additional formats" },
      { feature: "Shareable public link", epic: "Yes", competitor: "Yes" },
      { feature: "Browser-based, no install", epic: "Yes", competitor: "Yes" },
      { feature: "Free tier available", epic: "Yes, generous limits", competitor: "Limited free/trial option" },
    ],
    bestFor: {
      epic: "Quickly generating and sharing a sitemap for a new or in-progress site.",
      competitor: "Agencies running structured redesign projects on existing, established sites.",
    },
    epicStrengths: [
      "AI generates the full sitemap structure from a description, skipping manual setup",
      "Clean, fast visual canvas with a dedicated user-flow mode",
      "Free tier with generous limits and an India-focused pricing option",
      "No installation — works entirely in the browser",
    ],
    epicLimitations: [
      "No site crawler or URL import for mapping existing websites",
      "No wireframing or user-testing modules the way Slickplan offers",
      "Newer product without Slickplan's years of agency-focused feature depth",
    ],
    competitorStrengths: [
      "Established sitemap tool with a long track record among agencies",
      "Site crawling/import for speeding up redesigns of existing sites",
      "Broader planning suite including wireframes and content governance",
      "Content-type labeling suited to large, complex site structures",
    ],
    faqs: [
      {
        question: "Does Slickplan use AI to generate sitemaps?",
        answer:
          "Slickplan has added AI-assisted features over time, but its core workflow was built around manual sitemap construction, whereas EPIC's primary workflow starts from an AI-generated structure.",
      },
      {
        question: "Can EPIC import my existing website's structure?",
        answer:
          "Not currently — EPIC does not include a site crawler, so recreating an existing site means describing it to the AI generator or building it manually on the canvas.",
      },
      {
        question: "Which tool is better for a large agency redesign project?",
        answer:
          "Slickplan's broader suite of content governance, wireframing, and import tools is generally better suited to large, multi-stakeholder redesign projects on existing sites.",
      },
    ],
    relatedComparisons: ["epic-vs-relume", "epic-vs-octopus", "epic-vs-flowmapp"],
  },

  "epic-vs-octopus": {
    slug: "epic-vs-octopus",
    competitor: "Octopus.do",
    metaTitle: "EPIC vs Octopus.do: Visual Sitemap Tools Compared | EPIC",
    metaDescription:
      "Compare EPIC and Octopus.do for AI-assisted visual sitemaps and lo-fi wireframes, including editing, collaboration, and best-fit users.",
    keywords:
      "epic vs octopus.do, octopus.do alternative, visual sitemap tool, ai sitemap generator, website planner comparison",
    h1: "EPIC vs Octopus.do",
    heroSubtitle:
      "Two browser-based visual sitemap tools with different sweet spots.",
    checkedDate: "2026-08-08",
    summary:
      "Octopus.do is a well-known, browser-based visual sitemap tool that pairs simple page trees with lo-fi wireframing, positioned as a fast way to plan a website's structure and rough layout together. EPIC covers similar ground for the sitemap itself but leads with AI generation from a text description, plus a dedicated user-flow mode. If you want to sketch rough page layouts alongside your sitemap, Octopus.do's wireframe pairing is a strong fit; if you want the structure generated for you first and refined visually, EPIC's AI-first entry point is faster to a usable result.",
    sections: [
      {
        heading: "Getting started: manual vs AI-generated",
        content:
          "Octopus.do's core interface is a drag-and-drop tree where you add pages and connect them manually, with quick keyboard shortcuts for building a structure fast by hand. EPIC instead starts with an AI step: you describe the website and receive a generated sitemap already populated with pages and hierarchy, which you then edit rather than build from scratch. Both approaches lead to an editable canvas, but EPIC removes the initial blank-page step.",
      },
      {
        heading: "Wireframing and lo-fi layouts",
        content:
          "A key part of Octopus.do's appeal is its lo-fi wireframe mode, letting you sketch rough page layouts attached to sitemap nodes, useful for early-stage design conversations without leaving the sitemap tool. EPIC does not include a wireframing mode; it stays focused on the sitemap and navigation-flow layer rather than page-level layout.",
      },
      {
        heading: "User flows and navigation mapping",
        content:
          "EPIC includes a dedicated user-flow mode for mapping how users move between pages, distinct from the static hierarchy view. Octopus.do's focus is more on the site tree and lo-fi layout pairing than on dedicated flow-diagramming between pages.",
      },
      {
        heading: "Collaboration and sharing",
        content:
          "Both tools are browser-based and support sharing sitemaps with others; Octopus.do has built a following partly on its simple, free-friendly sharing experience for quick client or team reviews. EPIC similarly offers shareable public links and account-based project saving, along with PNG export for offline sharing.",
      },
      {
        heading: "Who each tool suits",
        content:
          "Octopus.do suits people who want to manually sketch structure and rough layout together in one lightweight tool, often for early client presentations. EPIC suits people who'd rather describe the site and get a structured starting point immediately, then refine it, especially when a user-flow view matters as much as the page tree.",
      },
    ],
    table: [
      { feature: "AI sitemap generation from a prompt", epic: "Yes, primary entry point", competitor: "Limited AI assistance; mainly manual" },
      { feature: "Drag-and-drop sitemap tree", epic: "Yes", competitor: "Yes" },
      { feature: "Lo-fi wireframe mode", epic: "No", competitor: "Yes" },
      { feature: "Dedicated user-flow mapping mode", epic: "Yes", competitor: "Not a core feature" },
      { feature: "PNG export", epic: "Yes", competitor: "Yes" },
      { feature: "Shareable public link", epic: "Yes", competitor: "Yes" },
      { feature: "Browser-based, no install", epic: "Yes", competitor: "Yes" },
      { feature: "Free tier available", epic: "Yes, generous limits", competitor: "Yes, free plan available" },
      { feature: "Site crawler / import", epic: "No", competitor: "Limited" },
      { feature: "Primary strength", epic: "Fast AI-generated structure + flows", competitor: "Manual tree building + lo-fi wireframes" },
    ],
    bestFor: {
      epic: "Getting a structured, editable sitemap and user flow started instantly from a description.",
      competitor: "Sketching a site tree and rough page layouts together by hand.",
    },
    epicStrengths: [
      "AI generates a ready-to-edit sitemap from a plain-language description",
      "Dedicated user-flow mode for mapping navigation paths",
      "Free tier with generous limits and an India-focused pricing option",
      "Simple, modern browser-based canvas",
    ],
    epicLimitations: [
      "No lo-fi wireframing mode for sketching page layouts",
      "No site crawler for importing an existing website's structure",
      "Newer product with a smaller established user base than Octopus.do",
    ],
    competitorStrengths: [
      "Simple, fast manual tree-building with keyboard shortcuts",
      "Lo-fi wireframe pairing for early layout sketches",
      "Long-standing, widely recognized tool in the sitemap category",
      "Free plan that has attracted a large user base over time",
    ],
    faqs: [
      {
        question: "Does Octopus.do use AI to build sitemaps?",
        answer:
          "Octopus.do is primarily a manual drag-and-drop sitemap and wireframing tool; it is not built around AI-first generation the way EPIC is.",
      },
      {
        question: "Can I sketch page layouts in EPIC like Octopus.do's wireframes?",
        answer:
          "Not currently — EPIC focuses on the sitemap structure and user-flow layer rather than page-level lo-fi wireframing.",
      },
      {
        question: "Which tool is faster to start a sitemap with?",
        answer:
          "EPIC is generally faster to a usable first draft since it generates the structure from a description, while Octopus.do requires building the tree manually from a blank canvas.",
      },
    ],
    relatedComparisons: ["epic-vs-relume", "epic-vs-slickplan", "epic-vs-flowmapp"],
  },

  "epic-vs-flowmapp": {
    slug: "epic-vs-flowmapp",
    competitor: "FlowMapp",
    metaTitle: "EPIC vs FlowMapp: Sitemap & UX Planning Compared | EPIC",
    metaDescription:
      "Compare EPIC and FlowMapp for sitemaps, user flows, and website planning — AI generation, editing, personas, and who each tool suits.",
    keywords:
      "epic vs flowmapp, flowmapp alternative, ai sitemap generator, user flow tool comparison, website planning software",
    h1: "EPIC vs FlowMapp",
    heroSubtitle:
      "A UX planning suite with sitemaps and personas versus a focused AI sitemap generator.",
    checkedDate: "2026-08-08",
    summary:
      "FlowMapp is a broader UX planning suite covering sitemaps, user flows, personas, and customer journey mapping, aimed at UX teams documenting a project across multiple diagram types. EPIC is narrower by design: an AI-first sitemap builder that generates a visual site structure from a text description and adds a user-flow mode, without the wider UX-documentation toolkit. Teams that need personas and journey maps alongside their sitemap will get more from FlowMapp's full suite; teams that just need a sitemap and flow diagram fast, without manual setup, will find EPIC's AI generation the quicker path.",
    sections: [
      {
        heading: "AI sitemap generation",
        content:
          "EPIC's defining feature is generating a full sitemap from a plain-language description of the website, producing an editable visual tree immediately. FlowMapp's sitemap tool is built around manual construction of the page hierarchy, with its value coming from how that sitemap connects to its other planning diagrams rather than from AI-generated structure as the entry point.",
      },
      {
        heading: "User flows and UX documentation",
        content:
          "Both tools support user-flow diagramming, but FlowMapp treats it as one of several linked UX artifacts — alongside personas, customer journey maps, and site audits — aimed at teams documenting a full UX process for a project. EPIC's user-flow mode is more lightweight, focused specifically on visualizing page-to-page navigation as an extension of the sitemap, without the broader persona or journey-mapping layer.",
      },
      {
        heading: "Personas and customer journeys",
        content:
          "FlowMapp includes dedicated persona-building and customer journey mapping tools, which is useful for UX teams that need to justify structural decisions with audience research. EPIC does not include persona or journey-mapping features; it stays scoped to sitemap structure and navigation flow.",
      },
      {
        heading: "Team collaboration",
        content:
          "FlowMapp is built with team workspaces and multi-project organization aimed at agencies managing several client UX projects at once. EPIC supports account-based project saving and shareable public sitemap links, which covers straightforward sharing and review needs without the multi-project workspace structure FlowMapp offers.",
      },
      {
        heading: "Who each tool is really for",
        content:
          "FlowMapp suits UX teams and agencies that want one connected suite for sitemaps, flows, personas, and journeys across multiple client projects. EPIC suits anyone — including non-UX specialists — who wants a fast, AI-generated sitemap and flow diagram without learning a fuller UX documentation toolkit.",
      },
    ],
    table: [
      { feature: "AI sitemap generation from a prompt", epic: "Yes, primary entry point", competitor: "Manual sitemap construction" },
      { feature: "Drag-and-drop visual editor", epic: "Yes", competitor: "Yes" },
      { feature: "User-flow diagramming", epic: "Yes, lightweight dedicated mode", competitor: "Yes, part of broader UX suite" },
      { feature: "Persona builder", epic: "No", competitor: "Yes" },
      { feature: "Customer journey mapping", epic: "No", competitor: "Yes" },
      { feature: "Multi-project team workspaces", epic: "Limited", competitor: "Yes" },
      { feature: "PNG export", epic: "Yes", competitor: "Yes" },
      { feature: "Shareable public link", epic: "Yes", competitor: "Yes" },
      { feature: "Browser-based, no install", epic: "Yes", competitor: "Yes" },
      { feature: "Free tier available", epic: "Yes, generous limits", competitor: "Limited free/trial option" },
    ],
    bestFor: {
      epic: "Fast, AI-generated sitemaps and flow diagrams without a full UX toolkit.",
      competitor: "UX teams and agencies needing sitemaps, personas, and journey maps in one connected suite.",
    },
    epicStrengths: [
      "AI generates a complete, editable sitemap from a written description",
      "Focused, easy-to-learn interface without a wider UX-suite learning curve",
      "Free tier with generous limits and an India-focused pricing option",
      "Browser-based with public sharing and PNG export",
    ],
    epicLimitations: [
      "No persona builder or customer journey mapping tools",
      "Limited multi-project team workspace features compared to FlowMapp",
      "Newer product without FlowMapp's longer history in UX-focused teams",
    ],
    competitorStrengths: [
      "Connected suite covering sitemaps, flows, personas, and journey maps",
      "Built for multi-project agency and team workflows",
      "Established tool with a UX-focused feature set and audience",
      "Useful for teams that need to document research alongside structure",
    ],
    faqs: [
      {
        question: "Does FlowMapp offer AI sitemap generation?",
        answer:
          "FlowMapp's sitemap tool is primarily built around manual construction as part of its broader UX suite, unlike EPIC which generates the initial structure from a text description.",
      },
      {
        question: "Can I build personas in EPIC?",
        answer:
          "No — EPIC is scoped to sitemap structure and user-flow diagrams and does not include persona or customer journey tools.",
      },
      {
        question: "Which tool fits a solo founder better?",
        answer:
          "EPIC's focused, AI-first workflow is generally quicker for a solo founder who just needs a sitemap, while FlowMapp's fuller suite is more useful for teams running a structured UX process.",
      },
    ],
    relatedComparisons: ["epic-vs-relume", "epic-vs-slickplan", "epic-vs-octopus"],
  },
};
