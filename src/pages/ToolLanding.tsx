import { useParams, useNavigate } from "react-router-dom";
import { SEO, faqSchema } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, Star, Zap } from "lucide-react";
import epicLogo from "@/assets/epic-logo.png";

const baseUrl = "https://no-edit.lovable.app";

interface ToolPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  keywords: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  useCases: string[];
  schema: object;
}

const toolPages: Record<string, ToolPage> = {
  "poster-maker": {
    slug: "poster-maker",
    title: "Free Poster Maker Online",
    metaTitle: "Free Poster Maker Online — Create Stunning Posters | EPIC",
    metaDescription: "Create professional posters in seconds with EPIC's free poster maker. 200+ templates, drag-and-drop editor, HD export. No design skills needed.",
    h1: "Free Online Poster Maker",
    subtitle: "Design eye-catching posters for events, promotions, and social media in minutes — no design skills required.",
    keywords: "poster maker, free poster maker online, create poster, event poster creator, poster design tool, poster template",
    features: ["200+ poster templates", "Drag-and-drop editor", "HD PNG/JPG/PDF export", "Custom sizes & layouts", "Smart text auto-fit", "One-click social media resize"],
    useCases: ["Event promotions", "Concert posters", "Movie posters", "Educational posters", "Sale announcements", "Motivational quotes"],
    faqs: [
      { question: "Is the poster maker free?", answer: "Yes! EPIC's poster maker is free with 3 designs per day. Upgrade to Creator Mode for unlimited access." },
      { question: "Can I download posters in high quality?", answer: "Absolutely. Export in PNG, JPG, or PDF at up to 2x resolution for print-ready quality." },
      { question: "Do I need design skills?", answer: "No. Choose a template, edit the text, and download. EPIC handles the design for you." },
      { question: "What poster sizes are supported?", answer: "A4, A3, Instagram (1080x1080), Story (1080x1920), and custom sizes." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Poster Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "980" },
    },
  },
  "logo-maker": {
    slug: "logo-maker",
    title: "Free Logo Maker",
    metaTitle: "Free Logo Maker — Design a Logo in Minutes | EPIC",
    metaDescription: "Create a professional logo for your brand with EPIC's free logo maker. Choose from templates, customize colors & fonts, and download instantly.",
    h1: "Free Logo Maker Online",
    subtitle: "Build a memorable brand identity with a professional logo — designed in minutes, not days.",
    keywords: "logo maker, free logo maker, logo design, brand logo creator, logo generator, business logo",
    features: ["Logo-focused templates", "Icon & shape library", "Custom color palettes", "Typography controls", "Transparent PNG export", "Scalable vector-quality output"],
    useCases: ["Startup branding", "YouTube channel logos", "Social media profiles", "Business cards", "App icons", "Watermarks"],
    faqs: [
      { question: "Can I use the logo commercially?", answer: "Yes. Logos you create in EPIC are yours to use for any purpose, including commercial use." },
      { question: "Do I get transparent backgrounds?", answer: "Yes. Export your logo with a transparent background in PNG format." },
      { question: "How is EPIC different from other logo makers?", answer: "EPIC combines AI-powered design with a full manual editor, giving you creative control other tools don't offer." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Logo Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "resume-builder": {
    slug: "resume-builder",
    title: "Free Resume Builder",
    metaTitle: "Free Resume Builder Online — Create Professional CV | EPIC",
    metaDescription: "Build a standout resume in minutes with EPIC's free resume builder. Professional templates, easy editing, and instant PDF download.",
    h1: "Free Online Resume Builder",
    subtitle: "Land your dream job with a professionally designed resume — created in minutes with zero design experience.",
    keywords: "resume builder, free resume maker, CV builder online, professional resume template, resume creator",
    features: ["Professional resume templates", "A4 & Letter sizes", "Clean typography presets", "PDF export", "Easy text editing", "Print-ready quality"],
    useCases: ["Job applications", "Internship resumes", "Freelancer portfolios", "Academic CVs", "Cover letters", "LinkedIn profiles"],
    faqs: [
      { question: "Is the resume builder really free?", answer: "Yes. Create and download resumes for free. Creator Mode unlocks unlimited downloads and HD export." },
      { question: "Can I download my resume as PDF?", answer: "Yes. EPIC supports PDF, PNG, and JPG export for all designs including resumes." },
      { question: "Are the templates ATS-friendly?", answer: "EPIC templates use clean layouts and standard fonts that work well with ATS systems." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Resume Builder",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "youtube-thumbnail-maker": {
    slug: "youtube-thumbnail-maker",
    title: "YouTube Thumbnail Maker",
    metaTitle: "Free YouTube Thumbnail Maker — Get More Clicks | EPIC",
    metaDescription: "Create click-worthy YouTube thumbnails with EPIC. Professional templates, bold typography, and instant 1280x720 export. Free to use.",
    h1: "Free YouTube Thumbnail Maker",
    subtitle: "Design thumbnails that get clicks. Bold text, vibrant colors, and the perfect 1280×720 size — every time.",
    keywords: "youtube thumbnail maker, thumbnail creator, free thumbnail maker, youtube thumbnail template, video thumbnail",
    features: ["1280x720 optimized templates", "Bold text & gradient styles", "Face cutout support", "Vibrant color presets", "Instant PNG download", "Click-through rate optimized"],
    useCases: ["YouTube videos", "Podcast covers", "Course thumbnails", "Webinar banners", "Video previews", "Channel art"],
    faqs: [
      { question: "What size are YouTube thumbnails?", answer: "YouTube recommends 1280×720 pixels. EPIC automatically uses this size for all thumbnail templates." },
      { question: "Can I add my face to thumbnails?", answer: "Yes. Upload your photo and layer it over backgrounds with EPIC's image tools." },
      { question: "How do I make thumbnails that get clicks?", answer: "Use bold text, high contrast colors, and expressive imagery. EPIC's templates are designed for maximum CTR." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC YouTube Thumbnail Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "instagram-post-maker": {
    slug: "instagram-post-maker",
    title: "Instagram Post Maker",
    metaTitle: "Free Instagram Post Maker — Create Stunning Posts | EPIC",
    metaDescription: "Design beautiful Instagram posts with EPIC's free tool. 1080x1080 templates, stunning typography, and instant download. Grow your following.",
    h1: "Free Instagram Post Maker",
    subtitle: "Create scroll-stopping Instagram posts with professional templates and a powerful editor. Stand out in the feed.",
    keywords: "instagram post maker, instagram design tool, social media post creator, instagram template, free instagram maker",
    features: ["1080x1080 Instagram templates", "Story & Reel sizes", "Gradient backgrounds", "Text overlay tools", "Carousel layouts", "Brand kit support"],
    useCases: ["Feed posts", "Instagram Stories", "Carousels", "Quote graphics", "Product promotions", "Announcements"],
    faqs: [
      { question: "What size should Instagram posts be?", answer: "Instagram feed posts are 1080×1080 pixels. Stories are 1080×1920. EPIC supports both sizes." },
      { question: "Can I create Instagram Stories too?", answer: "Yes! Switch to 1080×1920 size or use Story-specific templates in EPIC." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Instagram Post Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "certificate-maker": {
    slug: "certificate-maker",
    title: "Certificate Maker",
    metaTitle: "Free Certificate Maker Online — Professional Designs | EPIC",
    metaDescription: "Create professional certificates for awards, courses, and events. Beautiful templates, customizable text, and instant PDF download.",
    h1: "Free Online Certificate Maker",
    subtitle: "Design elegant certificates for courses, events, and achievements in minutes with professional templates.",
    keywords: "certificate maker, free certificate generator, award certificate template, online certificate creator",
    features: ["Elegant certificate templates", "A4 landscape layouts", "Gold & silver accents", "Custom fonts & borders", "PDF export for printing", "Batch name support"],
    useCases: ["Course completion", "Employee awards", "School certificates", "Event participation", "Training programs", "Competition prizes"],
    faqs: [
      { question: "Can I print the certificates?", answer: "Yes. Export as high-resolution PDF for professional printing quality." },
      { question: "Are certificate templates free?", answer: "Yes. EPIC offers free certificate templates. Creator Mode unlocks premium designs." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Certificate Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "flyer-maker": {
    slug: "flyer-maker",
    title: "Flyer Maker",
    metaTitle: "Free Flyer Maker Online — Create Professional Flyers | EPIC",
    metaDescription: "Design eye-catching flyers for events, businesses, and promotions. Professional templates, easy editing, instant download. Free to use.",
    h1: "Free Online Flyer Maker",
    subtitle: "Create professional flyers for any occasion with drag-and-drop simplicity and beautiful templates.",
    keywords: "flyer maker, free flyer creator, flyer design tool, event flyer template, business flyer maker",
    features: ["Professional flyer templates", "A4 & custom sizes", "Print-ready export", "Photo filters", "Shape & icon library", "Color palette tools"],
    useCases: ["Event flyers", "Business promotions", "Real estate flyers", "Restaurant menus", "Concert flyers", "School events"],
    faqs: [
      { question: "What size are flyers?", answer: "Standard flyers are A4 (210×297mm) or US Letter. EPIC supports both plus custom sizes." },
      { question: "Can I print my flyer?", answer: "Yes. Export as high-resolution PDF for professional print quality." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Flyer Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "business-card-maker": {
    slug: "business-card-maker",
    title: "Business Card Maker",
    metaTitle: "Free Business Card Maker — Design Cards Online | EPIC",
    metaDescription: "Create professional business cards in minutes. Modern templates, custom layouts, and instant download. Free online business card maker.",
    h1: "Free Business Card Maker Online",
    subtitle: "Make a lasting first impression with a professionally designed business card — created in minutes.",
    keywords: "business card maker, free business card creator, business card design, visiting card maker online",
    features: ["Modern card templates", "3.5×2 inch standard size", "Both sides design", "QR code support", "Print-ready PDF", "Brand color matching"],
    useCases: ["Professional networking", "Startup branding", "Freelancer cards", "Real estate agents", "Consultants", "Creative professionals"],
    faqs: [
      { question: "What is the standard business card size?", answer: "Standard business cards are 3.5×2 inches (89×51mm). EPIC uses this size by default." },
      { question: "Can I design both sides?", answer: "Yes. Create front and back designs separately and export both for printing." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Business Card Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "presentation-maker": {
    slug: "presentation-maker",
    title: "Presentation Maker",
    metaTitle: "Free Presentation Maker — Create Stunning Slides | EPIC",
    metaDescription: "Design professional presentations and pitch decks. Modern templates, 16:9 slides, and instant export. Free alternative to PowerPoint.",
    h1: "Free Online Presentation Maker",
    subtitle: "Create stunning presentations and pitch decks with modern templates. No PowerPoint needed.",
    keywords: "presentation maker, free slide maker, pitch deck creator, presentation design tool, powerpoint alternative",
    features: ["16:9 slide templates", "Pitch deck layouts", "Data visualization", "Icon library", "Consistent branding", "PDF & PNG export"],
    useCases: ["Business presentations", "Pitch decks", "School projects", "Training materials", "Conference talks", "Webinar slides"],
    faqs: [
      { question: "Can I replace PowerPoint with EPIC?", answer: "EPIC is perfect for creating beautiful individual slides. Export them as images for any presentation software." },
      { question: "What slide size does EPIC use?", answer: "EPIC uses the standard 1920×1080 (16:9) format for all presentation templates." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Presentation Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "invitation-maker": {
    slug: "invitation-maker",
    title: "Invitation Maker",
    metaTitle: "Free Invitation Maker — Beautiful Invites | EPIC",
    metaDescription: "Design wedding, birthday, and event invitations online for free. Professional templates, easy editing, instant download.",
    h1: "Free Online Invitation Maker",
    subtitle: "Create beautiful invitations for weddings, birthdays, baby showers, and any event — in minutes.",
    keywords: "invitation maker, free invitation creator, wedding invitation design, birthday invite maker, event invitation template",
    features: ["Wedding invitation templates", "Birthday party invites", "Baby shower designs", "RSVP card layouts", "Custom fonts & colors", "HD print-ready export"],
    useCases: ["Weddings", "Birthday parties", "Baby showers", "Graduation ceremonies", "Corporate events", "Holiday gatherings"],
    faqs: [
      { question: "Can I make wedding invitations?", answer: "Yes! EPIC has elegant wedding invitation templates with customizable fonts, colors, and layouts." },
      { question: "Are invitations printable?", answer: "Absolutely. Export as high-resolution PDF or PNG for professional print quality." },
      { question: "Can I add RSVP details?", answer: "Yes. Customize text fields to include RSVP information, venue details, and more." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Invitation Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "banner-maker": {
    slug: "banner-maker",
    title: "Banner Maker",
    metaTitle: "Free Banner Maker — Web & Social Banners | EPIC",
    metaDescription: "Design banners for websites, social media, and ads. Professional templates, multiple sizes, instant download.",
    h1: "Free Online Banner Maker",
    subtitle: "Create professional banners for websites, social media ads, and promotions with beautiful templates.",
    keywords: "banner maker, free banner creator, web banner design, social media banner, ad banner maker, YouTube banner",
    features: ["Web banner templates", "Social media ad sizes", "YouTube channel banners", "Animated-ready designs", "Brand kit support", "Multiple export formats"],
    useCases: ["Website headers", "Facebook covers", "YouTube banners", "Google ads", "Email headers", "Event banners"],
    faqs: [
      { question: "What banner sizes are available?", answer: "EPIC supports all standard sizes: leaderboard (728x90), medium rectangle (300x250), YouTube banner (2560x1440), and custom sizes." },
      { question: "Can I make YouTube channel art?", answer: "Yes! Use the 2560x1440 template optimized for YouTube channel banners." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Banner Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "website-navigation-maker": {
    slug: "website-navigation-maker",
    title: "Website Navigation Maker",
    metaTitle: "Free Website Navigation Maker — Plan Site | EPIC",
    metaDescription: "Drag-and-drop website navigation builder. Plan page flow, create sitemaps, and export navigation maps. 50+ templates.",
    h1: "Free Website Navigation Maker",
    subtitle: "Plan your website structure with a visual drag-and-drop builder. Add pages, connect flows, and export your sitemap.",
    keywords: "website navigation maker, sitemap builder, page flow designer, website structure planner, drag and drop navigation, site architecture tool",
    features: ["Drag-and-drop interface", "50+ stock page templates", "Auto arrow connections", "PNG export", "Category-organized pages", "Visual sitemap builder"],
    useCases: ["Website planning", "UX wireframing", "Client presentations", "Site architecture", "App flow design", "Startup MVPs"],
    faqs: [
      { question: "How does the navigation maker work?", answer: "Drag pages from the sidebar onto the canvas, connect them with arrows to show navigation flow, then export as PNG." },
      { question: "Is it free?", answer: "Yes! The Website Navigation Maker is completely free with unlimited exports." },
      { question: "Can I use it for mobile app flows?", answer: "Yes. The stock page templates include common mobile screens like onboarding, login, and settings." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Website Navigation Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "340" },
    },
  },
  "meme-maker": {
    slug: "meme-maker",
    title: "Meme Maker",
    metaTitle: "Free Meme Maker Online — Create Viral Memes | EPIC",
    metaDescription: "Create hilarious memes in seconds with EPIC's free meme maker. Add text to images, use popular templates, and download instantly. No watermark.",
    h1: "Free Online Meme Maker",
    subtitle: "Create viral memes with bold text, popular templates, and instant sharing — no design skills needed.",
    keywords: "meme maker, free meme generator, meme creator online, meme template, make memes free, meme design tool",
    features: ["Popular meme templates", "Bold impact text overlay", "Custom image upload", "No watermark on free tier", "Instant PNG download", "Social media optimized sizes"],
    useCases: ["Social media content", "Marketing campaigns", "Discord & Slack reactions", "Reddit posts", "Twitter/X engagement", "Group chats"],
    faqs: [
      { question: "Is the meme maker free?", answer: "Yes! Create and download memes for free. No account required for basic memes." },
      { question: "Can I upload my own images?", answer: "Absolutely. Upload any image and add meme-style text with EPIC's editor." },
      { question: "Are there watermarks?", answer: "No watermarks on free downloads. Premium users get extra templates and HD export." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Meme Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "infographic-maker": {
    slug: "infographic-maker",
    title: "Infographic Maker",
    metaTitle: "Free Infographic Maker Online — Create Stunning Infographics | EPIC",
    metaDescription: "Design professional infographics with EPIC's free tool. Data visualization templates, charts, icons, and easy drag-and-drop editor. Download in HD.",
    h1: "Free Online Infographic Maker",
    subtitle: "Turn data into beautiful visual stories with professional infographic templates and an intuitive editor.",
    keywords: "infographic maker, free infographic creator, infographic template, data visualization tool, infographic design, infographic generator",
    features: ["Infographic templates", "Data chart widgets", "Icon & illustration library", "Tall format layouts", "Brand color matching", "HD PNG & PDF export"],
    useCases: ["Blog content", "Reports & whitepapers", "Social media posts", "Presentations", "Educational materials", "Marketing statistics"],
    faqs: [
      { question: "What makes a good infographic?", answer: "Clear data hierarchy, consistent colors, readable fonts, and visual flow. EPIC's templates handle all of this for you." },
      { question: "Can I add my own data?", answer: "Yes. Customize all text, numbers, and charts in EPIC's editor to match your data." },
      { question: "What sizes are supported?", answer: "Standard infographic sizes (800x2000), social media sizes, and custom dimensions." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Infographic Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "menu-maker": {
    slug: "menu-maker",
    title: "Menu Maker",
    metaTitle: "Free Menu Maker Online — Restaurant & Cafe Menus | EPIC",
    metaDescription: "Create beautiful restaurant, cafe, and bar menus online for free. Professional templates, easy editing, print-ready PDF download. No design skills needed.",
    h1: "Free Online Menu Maker",
    subtitle: "Design stunning restaurant, cafe, and bar menus with elegant templates — ready to print in minutes.",
    keywords: "menu maker, free menu creator, restaurant menu design, cafe menu template, bar menu maker, food menu generator",
    features: ["Restaurant menu templates", "Cafe & bar layouts", "Food category sections", "Price list formatting", "Print-ready PDF export", "Elegant typography"],
    useCases: ["Restaurant menus", "Cafe menus", "Bar drink lists", "Catering menus", "Food truck menus", "Event dining menus"],
    faqs: [
      { question: "Can I print the menu?", answer: "Yes. Export as high-resolution PDF for professional printing on any paper size." },
      { question: "Are menu templates free?", answer: "Yes! EPIC offers free menu templates. Creator Mode unlocks premium designs and unlimited downloads." },
      { question: "Can I add food images?", answer: "Yes. Upload photos of your dishes and place them anywhere on the menu." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Menu Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "brochure-maker": {
    slug: "brochure-maker",
    title: "Brochure Maker",
    metaTitle: "Free Brochure Maker Online — Design Professional Brochures | EPIC",
    metaDescription: "Create professional tri-fold and bi-fold brochures online for free. Beautiful templates, easy editing, and print-ready PDF export.",
    h1: "Free Online Brochure Maker",
    subtitle: "Design professional brochures for your business, events, or products with stunning templates and easy editing.",
    keywords: "brochure maker, free brochure creator, tri-fold brochure template, bi-fold brochure design, brochure generator online",
    features: ["Tri-fold & bi-fold templates", "Product showcase layouts", "Photo grid designs", "Brand color matching", "Print-ready PDF export", "A4 & Letter sizes"],
    useCases: ["Business brochures", "Product catalogs", "Travel brochures", "Real estate listings", "School prospectuses", "Event programs"],
    faqs: [
      { question: "What brochure types are available?", answer: "EPIC supports tri-fold, bi-fold, and single-page brochure layouts in A4 and Letter sizes." },
      { question: "Can I add multiple pages?", answer: "Design each panel separately and export all pages for professional printing." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Brochure Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "album-cover-maker": {
    slug: "album-cover-maker",
    title: "Album Cover Maker",
    metaTitle: "Free Album Cover Maker — Design Music Artwork | EPIC",
    metaDescription: "Create stunning album covers, single artwork, and playlist covers for Spotify, Apple Music, and SoundCloud. Free templates, instant download.",
    h1: "Free Album Cover Maker",
    subtitle: "Design eye-catching album art, single covers, and playlist thumbnails for every music platform.",
    keywords: "album cover maker, music artwork creator, spotify cover maker, single artwork design, playlist cover generator",
    features: ["3000x3000 HD artwork", "Spotify/Apple Music optimized", "Genre-specific templates", "Typography effects", "Photo filters & overlays", "Instant PNG download"],
    useCases: ["Album artwork", "Single covers", "Spotify playlists", "SoundCloud tracks", "Podcast covers", "Mixtape art"],
    faqs: [
      { question: "What size should album covers be?", answer: "Most platforms require 3000×3000 pixels. EPIC uses this standard size for all music artwork templates." },
      { question: "Can I use the artwork commercially?", answer: "Yes. All artwork you create in EPIC is yours to use for commercial releases." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC Album Cover Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
  "ebook-cover-maker": {
    slug: "ebook-cover-maker",
    title: "eBook Cover Maker",
    metaTitle: "Free eBook Cover Maker — Design Book Covers Online | EPIC",
    metaDescription: "Design professional eBook covers for Kindle, Amazon KDP, and self-publishing. Beautiful templates, custom sizes, instant download. Free to use.",
    h1: "Free eBook Cover Maker",
    subtitle: "Create professional book covers for Kindle, Amazon KDP, and self-publishing — in minutes.",
    keywords: "ebook cover maker, book cover creator, kindle cover design, amazon kdp cover, self publishing cover maker",
    features: ["Kindle-optimized templates", "Amazon KDP sizes", "Genre-specific designs", "Spine & back cover", "High-res PDF export", "Typography controls"],
    useCases: ["Kindle eBooks", "Amazon KDP", "Self-published books", "Wattpad stories", "Course materials", "Lead magnets"],
    faqs: [
      { question: "What size should a Kindle cover be?", answer: "Amazon recommends 2560×1600 pixels with a 1.6:1 aspect ratio. EPIC templates use this size." },
      { question: "Can I design the back cover too?", answer: "Yes. Create front, spine, and back cover designs separately for print publishing." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EPIC eBook Cover Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
};
const ToolLanding = () => {
  const { tool } = useParams<{ tool: string }>();
  const navigate = useNavigate();
  const page = tool ? toolPages[tool] : null;

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: page.title, item: `${baseUrl}/tools/${page.slug}` },
    ],
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalUrl={`${baseUrl}/tools/${page.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [page.schema, faqSchema(page.faqs), breadcrumbSchema],
        }}
      />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Nav */}
        <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={epicLogo} alt="EPIC" className="w-8 h-8" width={32} height={32} />
              <span className="font-bold text-foreground">EPIC</span>
            </button>
          </div>
        </nav>
        
        {/* Breadcrumbs with Schema */}
        <Breadcrumbs items={[
          { label: "Tools", href: "/" },
          { label: page.title }
        ]} />

        {/* Hero */}
        <header className="py-20 md:py-28 px-6 text-center bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-3xl mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              {page.h1}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {page.subtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button onClick={() => navigate("/")} size="lg" className="gap-2 rounded-full text-base min-h-[48px] px-8">
                Start Creating Free <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Features */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">What You Get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {page.features.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-4">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">Perfect For</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {page.useCases.map((uc) => (
                <span key={uc} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{uc}</span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose a Template", desc: "Pick from hundreds of professionally designed templates." },
                { step: "2", title: "Customize Your Design", desc: "Edit text, colors, images, and layout with our easy editor." },
                { step: "3", title: "Download & Share", desc: "Export in HD quality as PNG, JPG, or PDF. Share anywhere." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">{s.step}</div>
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools (Smart — 4 most relevant) */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">Explore Related Tools</h2>
            <p className="text-muted-foreground text-center mb-10">Other free design tools you might love.</p>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {(() => {
                const relatedMap: Record<string, string[]> = {
                  "poster-maker": ["flyer-maker", "banner-maker", "invitation-maker", "certificate-maker"],
                  "logo-maker": ["business-card-maker", "banner-maker", "brochure-maker", "youtube-thumbnail-maker"],
                  "resume-builder": ["certificate-maker", "business-card-maker", "presentation-maker", "brochure-maker"],
                  "youtube-thumbnail-maker": ["banner-maker", "instagram-post-maker", "meme-maker", "poster-maker"],
                  "instagram-post-maker": ["youtube-thumbnail-maker", "banner-maker", "poster-maker", "meme-maker"],
                  "certificate-maker": ["resume-builder", "invitation-maker", "presentation-maker", "poster-maker"],
                  "flyer-maker": ["poster-maker", "brochure-maker", "banner-maker", "menu-maker"],
                  "business-card-maker": ["logo-maker", "resume-builder", "brochure-maker", "certificate-maker"],
                  "presentation-maker": ["infographic-maker", "poster-maker", "certificate-maker", "banner-maker"],
                  "invitation-maker": ["certificate-maker", "poster-maker", "flyer-maker", "menu-maker"],
                  "banner-maker": ["youtube-thumbnail-maker", "instagram-post-maker", "poster-maker", "flyer-maker"],
                  "website-navigation-maker": ["infographic-maker", "presentation-maker", "brochure-maker", "poster-maker"],
                  "meme-maker": ["instagram-post-maker", "youtube-thumbnail-maker", "poster-maker", "banner-maker"],
                  "infographic-maker": ["presentation-maker", "poster-maker", "brochure-maker", "resume-builder"],
                  "menu-maker": ["flyer-maker", "brochure-maker", "poster-maker", "invitation-maker"],
                  "brochure-maker": ["flyer-maker", "business-card-maker", "poster-maker", "menu-maker"],
                  "album-cover-maker": ["poster-maker", "instagram-post-maker", "youtube-thumbnail-maker", "banner-maker"],
                  "ebook-cover-maker": ["poster-maker", "resume-builder", "presentation-maker", "brochure-maker"],
                };
                const related = relatedMap[page.slug] || Object.keys(toolPages).filter(s => s !== page.slug).slice(0, 4);
                return related.map(slug => {
                  const t = toolPages[slug];
                  if (!t) return null;
                  return (
                    <button
                      key={t.slug}
                      onClick={() => navigate(`/tools/${t.slug}`)}
                      className="bg-card border border-border/50 rounded-xl p-5 text-left hover:border-primary/50 transition-colors"
                    >
                      <span className="font-semibold text-sm text-foreground">{t.title}</span>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{t.subtitle}</p>
                    </button>
                  );
                });
              })()}
            </div>

            {/* Navigation Maker CTA */}
            {page.slug !== "website-navigation-maker" && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-center">
                <h3 className="text-lg font-bold text-foreground mb-2">🆕 Try Website Navigation Maker</h3>
                <p className="text-sm text-muted-foreground mb-4">Plan your website structure visually with drag-and-drop. 50+ stock pages included.</p>
                <Button onClick={() => navigate("/navigation-maker")} className="gap-2 rounded-full">
                  Open Navigation Maker <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group bg-card border border-border/50 rounded-xl">
                  <summary className="cursor-pointer p-5 font-medium text-foreground list-none flex items-center justify-between">
                    {faq.question}
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-gradient-to-t from-primary/5 to-background text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Start Designing Now — It's Free</h2>
          <p className="text-muted-foreground mb-8">No sign-up required. Create your first design in 30 seconds.</p>
          <Button onClick={() => navigate("/")} size="lg" className="gap-2 rounded-full text-base min-h-[48px] px-8">
            <Zap className="h-5 w-5" /> Open EPIC Editor
          </Button>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ToolLanding;
