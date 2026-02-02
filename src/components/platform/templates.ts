import type { DesignCategory } from "./DesignTypeModal";

export interface Template {
  id: string;
  name: string;
  category: DesignCategory;
  thumbnailUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: TemplateElement[];
}

export interface TemplateElement {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

// Premium high-quality templates
export const templates: Template[] = [
  // ========== INSTAGRAM TEMPLATES ==========
  {
    id: "instagram-gradient-bold",
    name: "Gradient Bold",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1080, height: 1080, backgroundColor: "#667eea" },
      { id: "overlay", type: "shape", x: 0, y: 540, width: 1080, height: 540, backgroundColor: "#764ba2" },
      { id: "headline", type: "text", x: 80, y: 300, width: 920, height: 150, content: "MAKE IT\nHAPPEN", fontSize: 96, fontWeight: "bold", color: "#ffffff" },
      { id: "subhead", type: "text", x: 80, y: 500, width: 920, height: 60, content: "Your success story starts today", fontSize: 28, color: "#ffffff" },
      { id: "accent", type: "shape", x: 80, y: 620, width: 120, height: 6, backgroundColor: "#ffffff", borderRadius: 3 },
      { id: "cta", type: "text", x: 80, y: 900, width: 400, height: 40, content: "@yourbrand - Link in bio", fontSize: 20, color: "#ffffff" },
    ],
  },
  {
    id: "instagram-minimal-quote",
    name: "Minimal Quote",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1080, height: 1080, backgroundColor: "#fafafa" },
      { id: "quote-mark", type: "text", x: 100, y: 200, width: 100, height: 150, content: "\"", fontSize: 200, fontWeight: "bold", color: "#e5e5e5" },
      { id: "quote", type: "text", x: 100, y: 350, width: 880, height: 250, content: "The only way to do great work is to love what you do.", fontSize: 48, fontWeight: "bold", color: "#1a1a1a" },
      { id: "author", type: "text", x: 100, y: 650, width: 880, height: 40, content: "- Steve Jobs", fontSize: 24, color: "#666666" },
      { id: "line", type: "shape", x: 100, y: 750, width: 200, height: 3, backgroundColor: "#1a1a1a" },
      { id: "handle", type: "text", x: 100, y: 900, width: 400, height: 30, content: "@yourbrand", fontSize: 18, color: "#999999" },
    ],
  },
  {
    id: "instagram-carousel-tips",
    name: "Tips Carousel",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1080, height: 1080, backgroundColor: "#0f172a" },
      { id: "number", type: "text", x: 80, y: 100, width: 150, height: 100, content: "01", fontSize: 72, fontWeight: "bold", color: "#3b82f6" },
      { id: "title", type: "text", x: 80, y: 220, width: 920, height: 120, content: "Start With\nWhy", fontSize: 64, fontWeight: "bold", color: "#ffffff" },
      { id: "body", type: "text", x: 80, y: 400, width: 920, height: 200, content: "Understanding your purpose is the foundation of everything you build. Define your 'why' before diving into execution.", fontSize: 28, color: "#94a3b8" },
      { id: "icon-bg", type: "shape", x: 80, y: 700, width: 80, height: 80, backgroundColor: "#3b82f6", borderRadius: 40 },
      { id: "swipe", type: "text", x: 750, y: 980, width: 250, height: 30, content: "Swipe →", fontSize: 16, fontWeight: "bold", color: "#3b82f6" },
    ],
  },
  {
    id: "instagram-product-promo",
    name: "Product Promo",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1080, height: 1080, backgroundColor: "#18181b" },
      { id: "glow", type: "shape", x: 240, y: 200, width: 600, height: 600, backgroundColor: "#7c3aed", borderRadius: 300 },
      { id: "badge", type: "shape", x: 80, y: 80, width: 160, height: 50, backgroundColor: "#22c55e", borderRadius: 25 },
      { id: "badge-text", type: "text", x: 95, y: 90, width: 130, height: 30, content: "NEW", fontSize: 18, fontWeight: "bold", color: "#ffffff" },
      { id: "product", type: "text", x: 80, y: 750, width: 920, height: 80, content: "Introducing Pro X", fontSize: 56, fontWeight: "bold", color: "#ffffff" },
      { id: "desc", type: "text", x: 80, y: 850, width: 920, height: 50, content: "The future of productivity", fontSize: 24, color: "#a1a1aa" },
      { id: "cta", type: "text", x: 80, y: 950, width: 400, height: 40, content: "Shop Now → Link in Bio", fontSize: 18, fontWeight: "bold", color: "#7c3aed" },
    ],
  },

  // ========== YOUTUBE THUMBNAILS ==========
  {
    id: "youtube-tutorial-pro",
    name: "Tutorial Pro",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1280, height: 720, backgroundColor: "#0f172a" },
      { id: "accent-line", type: "shape", x: 0, y: 0, width: 8, height: 720, backgroundColor: "#3b82f6" },
      { id: "headline", type: "text", x: 60, y: 150, width: 700, height: 200, content: "Complete\nBeginner Guide", fontSize: 72, fontWeight: "bold", color: "#ffffff" },
      { id: "year", type: "text", x: 60, y: 380, width: 200, height: 50, content: "2024", fontSize: 36, fontWeight: "bold", color: "#3b82f6" },
      { id: "badge", type: "shape", x: 60, y: 500, width: 200, height: 50, backgroundColor: "#ef4444", borderRadius: 8 },
      { id: "badge-text", type: "text", x: 75, y: 508, width: 170, height: 35, content: "FREE COURSE", fontSize: 16, fontWeight: "bold", color: "#ffffff" },
      { id: "avatar-bg", type: "shape", x: 950, y: 350, width: 280, height: 320, backgroundColor: "#1e293b", borderRadius: 20 },
    ],
  },
  {
    id: "youtube-reaction",
    name: "Reaction Style",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1280, height: 720, backgroundColor: "#fbbf24" },
      { id: "shadow-box", type: "shape", x: 40, y: 80, width: 600, height: 560, backgroundColor: "#000000", borderRadius: 20 },
      { id: "headline", type: "text", x: 80, y: 150, width: 520, height: 250, content: "THIS IS\nINSANE!!", fontSize: 84, fontWeight: "bold", color: "#ffffff" },
      { id: "arrow", type: "shape", x: 500, y: 420, width: 150, height: 80, backgroundColor: "#ef4444", borderRadius: 8 },
      { id: "subhead", type: "text", x: 80, y: 450, width: 400, height: 60, content: "You won't believe this...", fontSize: 28, color: "#ffffff" },
      { id: "face-zone", type: "shape", x: 700, y: 100, width: 520, height: 520, backgroundColor: "#1f2937", borderRadius: 30 },
    ],
  },
  {
    id: "youtube-listicle",
    name: "Listicle Style",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1280, height: 720, backgroundColor: "#1e1b4b" },
      { id: "number", type: "text", x: 60, y: 100, width: 300, height: 250, content: "10", fontSize: 200, fontWeight: "bold", color: "#a855f7" },
      { id: "headline", type: "text", x: 60, y: 350, width: 800, height: 150, content: "MUST-KNOW\nSECRETS", fontSize: 72, fontWeight: "bold", color: "#ffffff" },
      { id: "sub", type: "text", x: 60, y: 530, width: 600, height: 50, content: "That will change everything", fontSize: 28, color: "#c4b5fd" },
      { id: "badge", type: "shape", x: 60, y: 620, width: 180, height: 50, backgroundColor: "#dc2626", borderRadius: 8 },
      { id: "badge-text", type: "text", x: 75, y: 630, width: 150, height: 30, content: "WATCH NOW", fontSize: 14, fontWeight: "bold", color: "#ffffff" },
    ],
  },

  // ========== POSTER TEMPLATES ==========
  {
    id: "poster-event-dark",
    name: "Dark Event",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 1200, backgroundColor: "#0a0a0a" },
      { id: "glow-top", type: "shape", x: 100, y: -200, width: 600, height: 600, backgroundColor: "#7c3aed", borderRadius: 300 },
      { id: "date-badge", type: "shape", x: 50, y: 50, width: 200, height: 80, backgroundColor: "#ffffff", borderRadius: 8 },
      { id: "date", type: "text", x: 65, y: 65, width: 170, height: 50, content: "MAR 15", fontSize: 32, fontWeight: "bold", color: "#0a0a0a" },
      { id: "headline", type: "text", x: 50, y: 400, width: 700, height: 200, content: "TECH\nSUMMIT\n2024", fontSize: 80, fontWeight: "bold", color: "#ffffff" },
      { id: "location", type: "text", x: 50, y: 700, width: 700, height: 50, content: "San Francisco, CA", fontSize: 24, color: "#a1a1aa" },
      { id: "time", type: "text", x: 50, y: 760, width: 700, height: 40, content: "9:00 AM - 6:00 PM PST", fontSize: 18, color: "#71717a" },
      { id: "cta-btn", type: "shape", x: 50, y: 900, width: 250, height: 60, backgroundColor: "#7c3aed", borderRadius: 30 },
      { id: "cta-text", type: "text", x: 65, y: 915, width: 220, height: 30, content: "Get Tickets →", fontSize: 18, fontWeight: "bold", color: "#ffffff" },
      { id: "sponsors", type: "text", x: 50, y: 1100, width: 700, height: 30, content: "Presented by TechCorp & Partners", fontSize: 14, color: "#525252" },
    ],
  },
  {
    id: "poster-sale-bold",
    name: "Bold Sale",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 1200, backgroundColor: "#dc2626" },
      { id: "stripe1", type: "shape", x: -100, y: 200, width: 1000, height: 100, backgroundColor: "#000000" },
      { id: "stripe2", type: "shape", x: -100, y: 400, width: 1000, height: 100, backgroundColor: "#000000" },
      { id: "percent", type: "text", x: 50, y: 500, width: 700, height: 300, content: "70%", fontSize: 250, fontWeight: "bold", color: "#ffffff" },
      { id: "off", type: "text", x: 50, y: 780, width: 300, height: 80, content: "OFF", fontSize: 72, fontWeight: "bold", color: "#ffffff" },
      { id: "everything", type: "text", x: 50, y: 880, width: 700, height: 50, content: "EVERYTHING MUST GO", fontSize: 32, fontWeight: "bold", color: "#fecaca" },
      { id: "dates", type: "text", x: 50, y: 1000, width: 700, height: 40, content: "This Weekend Only • Fri-Sun", fontSize: 24, color: "#ffffff" },
      { id: "terms", type: "text", x: 50, y: 1100, width: 700, height: 30, content: "*Terms and conditions apply", fontSize: 14, color: "#fca5a5" },
    ],
  },
  {
    id: "poster-conference",
    name: "Conference",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 1200, backgroundColor: "#1e293b" },
      { id: "header-bar", type: "shape", x: 0, y: 0, width: 800, height: 100, backgroundColor: "#3b82f6" },
      { id: "logo-area", type: "text", x: 50, y: 30, width: 300, height: 40, content: "DEVCON 2024", fontSize: 24, fontWeight: "bold", color: "#ffffff" },
      { id: "headline", type: "text", x: 50, y: 200, width: 700, height: 250, content: "The Future of\nDeveloper\nExperience", fontSize: 56, fontWeight: "bold", color: "#ffffff" },
      { id: "date-line", type: "shape", x: 50, y: 500, width: 3, height: 150, backgroundColor: "#3b82f6" },
      { id: "when", type: "text", x: 70, y: 500, width: 300, height: 30, content: "WHEN", fontSize: 14, fontWeight: "bold", color: "#3b82f6" },
      { id: "date", type: "text", x: 70, y: 530, width: 300, height: 40, content: "October 15-17, 2024", fontSize: 20, color: "#ffffff" },
      { id: "where", type: "text", x: 70, y: 580, width: 300, height: 30, content: "WHERE", fontSize: 14, fontWeight: "bold", color: "#3b82f6" },
      { id: "location", type: "text", x: 70, y: 610, width: 300, height: 40, content: "Moscone Center, SF", fontSize: 20, color: "#ffffff" },
      { id: "speakers", type: "text", x: 50, y: 750, width: 700, height: 30, content: "50+ SPEAKERS • 100+ SESSIONS", fontSize: 16, fontWeight: "bold", color: "#60a5fa" },
      { id: "cta", type: "shape", x: 50, y: 850, width: 300, height: 60, backgroundColor: "#3b82f6", borderRadius: 8 },
      { id: "cta-text", type: "text", x: 65, y: 865, width: 270, height: 30, content: "Register Now", fontSize: 18, fontWeight: "bold", color: "#ffffff" },
      { id: "website", type: "text", x: 50, y: 1100, width: 700, height: 30, content: "devcon2024.io", fontSize: 16, color: "#64748b" },
    ],
  },

  // ========== LOGO TEMPLATES ==========
  {
    id: "logo-minimal-tech",
    name: "Minimal Tech",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 800, backgroundColor: "#ffffff" },
      { id: "icon-outer", type: "shape", x: 275, y: 200, width: 250, height: 250, backgroundColor: "#0f172a", borderRadius: 50 },
      { id: "icon-inner", type: "shape", x: 325, y: 250, width: 150, height: 150, backgroundColor: "#3b82f6", borderRadius: 30 },
      { id: "brand", type: "text", x: 200, y: 520, width: 400, height: 80, content: "techflow", fontSize: 56, fontWeight: "bold", color: "#0f172a" },
      { id: "tagline", type: "text", x: 200, y: 600, width: 400, height: 40, content: "innovate • build • scale", fontSize: 18, color: "#64748b" },
    ],
  },
  {
    id: "logo-bold-creative",
    name: "Bold Creative",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 800, backgroundColor: "#18181b" },
      { id: "circle1", type: "shape", x: 200, y: 180, width: 200, height: 200, backgroundColor: "#ec4899", borderRadius: 100 },
      { id: "circle2", type: "shape", x: 320, y: 240, width: 200, height: 200, backgroundColor: "#8b5cf6", borderRadius: 100 },
      { id: "circle3", type: "shape", x: 400, y: 180, width: 200, height: 200, backgroundColor: "#3b82f6", borderRadius: 100 },
      { id: "brand", type: "text", x: 150, y: 480, width: 500, height: 100, content: "STUDIO", fontSize: 72, fontWeight: "bold", color: "#ffffff" },
      { id: "tagline", type: "text", x: 150, y: 580, width: 500, height: 40, content: "Creative Agency", fontSize: 24, color: "#71717a" },
    ],
  },
  {
    id: "logo-professional",
    name: "Professional",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 800, backgroundColor: "#f8fafc" },
      { id: "shield", type: "shape", x: 300, y: 150, width: 200, height: 240, backgroundColor: "#1e40af", borderRadius: 20 },
      { id: "shield-inner", type: "shape", x: 340, y: 190, width: 120, height: 140, backgroundColor: "#ffffff", borderRadius: 10 },
      { id: "company", type: "text", x: 150, y: 450, width: 500, height: 80, content: "VENTURE", fontSize: 64, fontWeight: "bold", color: "#1e40af" },
      { id: "type", type: "text", x: 150, y: 530, width: 500, height: 50, content: "CAPITAL GROUP", fontSize: 28, color: "#64748b" },
      { id: "line", type: "shape", x: 300, y: 620, width: 200, height: 3, backgroundColor: "#1e40af" },
      { id: "est", type: "text", x: 300, y: 650, width: 200, height: 30, content: "EST. 2024", fontSize: 14, color: "#94a3b8" },
    ],
  },

  // ========== CERTIFICATE TEMPLATES ==========
  {
    id: "certificate-professional",
    name: "Professional",
    category: "certificate",
    thumbnailUrl: "",
    canvasWidth: 1200,
    canvasHeight: 850,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1200, height: 850, backgroundColor: "#fefce8" },
      { id: "border", type: "shape", x: 30, y: 30, width: 1140, height: 790, backgroundColor: "transparent", borderRadius: 0 },
      { id: "header-line", type: "shape", x: 100, y: 80, width: 1000, height: 3, backgroundColor: "#854d0e" },
      { id: "title", type: "text", x: 100, y: 120, width: 1000, height: 60, content: "CERTIFICATE OF ACHIEVEMENT", fontSize: 32, fontWeight: "bold", color: "#854d0e" },
      { id: "presented", type: "text", x: 100, y: 220, width: 1000, height: 40, content: "This certificate is proudly presented to", fontSize: 18, color: "#78716c" },
      { id: "name", type: "text", x: 100, y: 280, width: 1000, height: 80, content: "John Doe", fontSize: 56, fontWeight: "bold", color: "#1c1917" },
      { id: "name-line", type: "shape", x: 200, y: 370, width: 800, height: 2, backgroundColor: "#d6d3d1" },
      { id: "for", type: "text", x: 100, y: 400, width: 1000, height: 40, content: "for successfully completing the", fontSize: 18, color: "#78716c" },
      { id: "course", type: "text", x: 100, y: 450, width: 1000, height: 50, content: "Advanced Professional Development Program", fontSize: 28, fontWeight: "bold", color: "#1c1917" },
      { id: "date-label", type: "text", x: 150, y: 600, width: 300, height: 30, content: "DATE", fontSize: 12, color: "#78716c" },
      { id: "date", type: "text", x: 150, y: 625, width: 300, height: 40, content: "March 15, 2024", fontSize: 18, color: "#1c1917" },
      { id: "sig-label", type: "text", x: 750, y: 600, width: 300, height: 30, content: "SIGNATURE", fontSize: 12, color: "#78716c" },
      { id: "sig-line", type: "shape", x: 750, y: 660, width: 250, height: 2, backgroundColor: "#1c1917" },
      { id: "footer-line", type: "shape", x: 100, y: 750, width: 1000, height: 3, backgroundColor: "#854d0e" },
    ],
  },
  {
    id: "certificate-modern",
    name: "Modern",
    category: "certificate",
    thumbnailUrl: "",
    canvasWidth: 1200,
    canvasHeight: 850,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1200, height: 850, backgroundColor: "#0f172a" },
      { id: "accent-top", type: "shape", x: 0, y: 0, width: 1200, height: 8, backgroundColor: "#3b82f6" },
      { id: "accent-bottom", type: "shape", x: 0, y: 842, width: 1200, height: 8, backgroundColor: "#3b82f6" },
      { id: "badge", type: "shape", x: 525, y: 60, width: 150, height: 150, backgroundColor: "#3b82f6", borderRadius: 75 },
      { id: "title", type: "text", x: 100, y: 250, width: 1000, height: 50, content: "CERTIFICATE OF COMPLETION", fontSize: 24, fontWeight: "bold", color: "#3b82f6" },
      { id: "name", type: "text", x: 100, y: 330, width: 1000, height: 100, content: "Jane Smith", fontSize: 64, fontWeight: "bold", color: "#ffffff" },
      { id: "desc", type: "text", x: 100, y: 450, width: 1000, height: 80, content: "Has successfully completed all requirements for the\nFull Stack Development Certification", fontSize: 22, color: "#94a3b8" },
      { id: "date", type: "text", x: 150, y: 650, width: 300, height: 40, content: "March 2024", fontSize: 18, color: "#64748b" },
      { id: "sig-box", type: "shape", x: 750, y: 620, width: 300, height: 100, backgroundColor: "#1e293b", borderRadius: 12 },
      { id: "sig-text", type: "text", x: 770, y: 680, width: 260, height: 30, content: "Authorized Signature", fontSize: 14, color: "#64748b" },
    ],
  },

  // ========== PRESENTATION TEMPLATES ==========
  {
    id: "presentation-pitch-cover",
    name: "Pitch Deck Cover",
    category: "presentation",
    thumbnailUrl: "",
    canvasWidth: 1920,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1920, height: 1080, backgroundColor: "#0f172a" },
      { id: "gradient-orb", type: "shape", x: 1200, y: -200, width: 1000, height: 1000, backgroundColor: "#3b82f6", borderRadius: 500 },
      { id: "logo-area", type: "shape", x: 100, y: 80, width: 60, height: 60, backgroundColor: "#3b82f6", borderRadius: 12 },
      { id: "company", type: "text", x: 180, y: 90, width: 300, height: 40, content: "TechStartup", fontSize: 24, fontWeight: "bold", color: "#ffffff" },
      { id: "headline", type: "text", x: 100, y: 350, width: 900, height: 200, content: "Revolutionizing\nThe Future of Work", fontSize: 80, fontWeight: "bold", color: "#ffffff" },
      { id: "tagline", type: "text", x: 100, y: 580, width: 800, height: 50, content: "AI-powered productivity for the modern enterprise", fontSize: 28, color: "#94a3b8" },
      { id: "series", type: "text", x: 100, y: 700, width: 400, height: 40, content: "Series A Pitch Deck", fontSize: 20, color: "#64748b" },
      { id: "footer", type: "text", x: 100, y: 980, width: 800, height: 30, content: "Confidential • Q1 2024", fontSize: 16, color: "#475569" },
    ],
  },
  {
    id: "presentation-problem-solution",
    name: "Problem Solution",
    category: "presentation",
    thumbnailUrl: "",
    canvasWidth: 1920,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1920, height: 1080, backgroundColor: "#ffffff" },
      { id: "left-panel", type: "shape", x: 0, y: 0, width: 960, height: 1080, backgroundColor: "#fef2f2" },
      { id: "right-panel", type: "shape", x: 960, y: 0, width: 960, height: 1080, backgroundColor: "#f0fdf4" },
      { id: "problem-label", type: "text", x: 100, y: 100, width: 200, height: 40, content: "PROBLEM", fontSize: 16, fontWeight: "bold", color: "#dc2626" },
      { id: "problem", type: "text", x: 100, y: 180, width: 760, height: 300, content: "Businesses lose\n40% of productivity\nto manual tasks", fontSize: 56, fontWeight: "bold", color: "#1f2937" },
      { id: "solution-label", type: "text", x: 1060, y: 100, width: 200, height: 40, content: "SOLUTION", fontSize: 16, fontWeight: "bold", color: "#16a34a" },
      { id: "solution", type: "text", x: 1060, y: 180, width: 760, height: 300, content: "AI automation\nthat saves 20+\nhours per week", fontSize: 56, fontWeight: "bold", color: "#1f2937" },
      { id: "divider", type: "shape", x: 955, y: 150, width: 10, height: 780, backgroundColor: "#d1d5db" },
      { id: "slide-num", type: "text", x: 1800, y: 980, width: 50, height: 30, content: "03", fontSize: 18, color: "#9ca3af" },
    ],
  },
  {
    id: "presentation-features",
    name: "Feature Comparison",
    category: "presentation",
    thumbnailUrl: "",
    canvasWidth: 1920,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1920, height: 1080, backgroundColor: "#f8fafc" },
      { id: "title", type: "text", x: 100, y: 80, width: 1000, height: 60, content: "Why Choose Us?", fontSize: 48, fontWeight: "bold", color: "#0f172a" },
      { id: "card1", type: "shape", x: 100, y: 200, width: 540, height: 350, backgroundColor: "#ffffff", borderRadius: 24 },
      { id: "card1-icon", type: "shape", x: 140, y: 240, width: 60, height: 60, backgroundColor: "#dbeafe", borderRadius: 12 },
      { id: "card1-title", type: "text", x: 140, y: 330, width: 460, height: 40, content: "Lightning Fast", fontSize: 28, fontWeight: "bold", color: "#0f172a" },
      { id: "card1-desc", type: "text", x: 140, y: 380, width: 460, height: 100, content: "10x faster processing than traditional solutions", fontSize: 18, color: "#64748b" },
      { id: "card2", type: "shape", x: 690, y: 200, width: 540, height: 350, backgroundColor: "#ffffff", borderRadius: 24 },
      { id: "card2-icon", type: "shape", x: 730, y: 240, width: 60, height: 60, backgroundColor: "#dcfce7", borderRadius: 12 },
      { id: "card2-title", type: "text", x: 730, y: 330, width: 460, height: 40, content: "Secure by Design", fontSize: 28, fontWeight: "bold", color: "#0f172a" },
      { id: "card2-desc", type: "text", x: 730, y: 380, width: 460, height: 100, content: "Enterprise-grade security with SOC 2 compliance", fontSize: 18, color: "#64748b" },
      { id: "card3", type: "shape", x: 1280, y: 200, width: 540, height: 350, backgroundColor: "#ffffff", borderRadius: 24 },
      { id: "card3-icon", type: "shape", x: 1320, y: 240, width: 60, height: 60, backgroundColor: "#fef3c7", borderRadius: 12 },
      { id: "card3-title", type: "text", x: 1320, y: 330, width: 460, height: 40, content: "Easy Integration", fontSize: 28, fontWeight: "bold", color: "#0f172a" },
      { id: "card3-desc", type: "text", x: 1320, y: 380, width: 460, height: 100, content: "Connect with 100+ tools in minutes", fontSize: 18, color: "#64748b" },
      { id: "slide-num", type: "text", x: 1800, y: 980, width: 50, height: 30, content: "05", fontSize: 18, color: "#9ca3af" },
    ],
  },

  // ========== THUMBNAIL TEMPLATES ==========
  {
    id: "thumbnail-ai-tool",
    name: "AI Tool",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1280, height: 720, backgroundColor: "#0c0a09" },
      { id: "glow1", type: "shape", x: -100, y: 100, width: 500, height: 500, backgroundColor: "#7c3aed", borderRadius: 250 },
      { id: "glow2", type: "shape", x: 900, y: 200, width: 400, height: 400, backgroundColor: "#3b82f6", borderRadius: 200 },
      { id: "ai-badge", type: "shape", x: 60, y: 60, width: 80, height: 40, backgroundColor: "#22c55e", borderRadius: 8 },
      { id: "ai-text", type: "text", x: 75, y: 68, width: 50, height: 24, content: "AI", fontSize: 16, fontWeight: "bold", color: "#ffffff" },
      { id: "headline", type: "text", x: 60, y: 180, width: 700, height: 200, content: "This AI Tool\nChanges\nEverything", fontSize: 72, fontWeight: "bold", color: "#ffffff" },
      { id: "free", type: "shape", x: 60, y: 450, width: 150, height: 45, backgroundColor: "#dc2626", borderRadius: 8 },
      { id: "free-text", type: "text", x: 75, y: 458, width: 120, height: 30, content: "FREE", fontSize: 20, fontWeight: "bold", color: "#ffffff" },
      { id: "avatar-zone", type: "shape", x: 850, y: 150, width: 380, height: 420, backgroundColor: "#1c1917", borderRadius: 30 },
    ],
  },
  {
    id: "thumbnail-educational",
    name: "Educational",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1280, height: 720, backgroundColor: "#1e3a5f" },
      { id: "step1-bg", type: "shape", x: 40, y: 80, width: 380, height: 260, backgroundColor: "#2563eb", borderRadius: 16 },
      { id: "step1-num", type: "text", x: 60, y: 100, width: 80, height: 60, content: "01", fontSize: 48, fontWeight: "bold", color: "#93c5fd" },
      { id: "step1-text", type: "text", x: 60, y: 180, width: 340, height: 80, content: "Research", fontSize: 32, fontWeight: "bold", color: "#ffffff" },
      { id: "step2-bg", type: "shape", x: 450, y: 80, width: 380, height: 260, backgroundColor: "#7c3aed", borderRadius: 16 },
      { id: "step2-num", type: "text", x: 470, y: 100, width: 80, height: 60, content: "02", fontSize: 48, fontWeight: "bold", color: "#c4b5fd" },
      { id: "step2-text", type: "text", x: 470, y: 180, width: 340, height: 80, content: "Plan", fontSize: 32, fontWeight: "bold", color: "#ffffff" },
      { id: "step3-bg", type: "shape", x: 860, y: 80, width: 380, height: 260, backgroundColor: "#059669", borderRadius: 16 },
      { id: "step3-num", type: "text", x: 880, y: 100, width: 80, height: 60, content: "03", fontSize: 48, fontWeight: "bold", color: "#6ee7b7" },
      { id: "step3-text", type: "text", x: 880, y: 180, width: 340, height: 80, content: "Execute", fontSize: 32, fontWeight: "bold", color: "#ffffff" },
      { id: "title", type: "text", x: 40, y: 400, width: 800, height: 120, content: "Complete Guide\nto Success", fontSize: 56, fontWeight: "bold", color: "#ffffff" },
      { id: "badge", type: "shape", x: 40, y: 560, width: 200, height: 50, backgroundColor: "#fbbf24", borderRadius: 8 },
      { id: "badge-text", type: "text", x: 60, y: 570, width: 160, height: 30, content: "STEP BY STEP", fontSize: 14, fontWeight: "bold", color: "#1c1917" },
    ],
  },

  // ========== ADDITIONAL INSTAGRAM TEMPLATES ==========
  {
    id: "instagram-story-sale",
    name: "Story Sale",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1920,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1080, height: 1920, backgroundColor: "#0f0f0f" },
      { id: "accent-circle", type: "shape", x: -200, y: 600, width: 800, height: 800, backgroundColor: "#dc2626", borderRadius: 400 },
      { id: "sale-text", type: "text", x: 80, y: 500, width: 920, height: 300, content: "FLASH\nSALE", fontSize: 120, fontWeight: "bold", color: "#ffffff" },
      { id: "percent", type: "text", x: 80, y: 900, width: 500, height: 200, content: "50%", fontSize: 180, fontWeight: "bold", color: "#fbbf24" },
      { id: "off", type: "text", x: 80, y: 1100, width: 300, height: 80, content: "OFF", fontSize: 64, fontWeight: "bold", color: "#ffffff" },
      { id: "timer", type: "text", x: 80, y: 1350, width: 920, height: 50, content: "Ends in 24 hours", fontSize: 28, color: "#a1a1aa" },
      { id: "cta", type: "shape", x: 80, y: 1500, width: 400, height: 70, backgroundColor: "#ffffff", borderRadius: 35 },
      { id: "cta-text", type: "text", x: 120, y: 1515, width: 320, height: 40, content: "Shop Now →", fontSize: 24, fontWeight: "bold", color: "#0f0f0f" },
      { id: "handle", type: "text", x: 80, y: 1750, width: 400, height: 40, content: "@yourbrand", fontSize: 20, color: "#71717a" },
    ],
  },
  {
    id: "instagram-announcement",
    name: "Announcement",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1080, height: 1080, backgroundColor: "#fef3c7" },
      { id: "emoji-zone", type: "text", x: 340, y: 150, width: 400, height: 200, content: "🎉", fontSize: 150, color: "#000000" },
      { id: "headline", type: "text", x: 80, y: 380, width: 920, height: 150, content: "BIG NEWS", fontSize: 96, fontWeight: "bold", color: "#1c1917" },
      { id: "subhead", type: "text", x: 80, y: 550, width: 920, height: 120, content: "We're launching something exciting!", fontSize: 36, color: "#44403c" },
      { id: "divider", type: "shape", x: 400, y: 720, width: 280, height: 4, backgroundColor: "#1c1917" },
      { id: "date", type: "text", x: 80, y: 780, width: 920, height: 60, content: "Coming March 15th", fontSize: 32, fontWeight: "bold", color: "#1c1917" },
      { id: "cta", type: "text", x: 80, y: 900, width: 920, height: 40, content: "Stay tuned 👀", fontSize: 24, color: "#78716c" },
    ],
  },

  // ========== ADDITIONAL POSTER TEMPLATES ==========
  {
    id: "poster-music-event",
    name: "Music Event",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 1200, backgroundColor: "#0a0a0a" },
      { id: "line1", type: "shape", x: 0, y: 200, width: 800, height: 2, backgroundColor: "#ec4899" },
      { id: "line2", type: "shape", x: 0, y: 400, width: 800, height: 2, backgroundColor: "#8b5cf6" },
      { id: "line3", type: "shape", x: 0, y: 600, width: 800, height: 2, backgroundColor: "#3b82f6" },
      { id: "artist", type: "text", x: 50, y: 250, width: 700, height: 120, content: "ARTIST\nNAME", fontSize: 80, fontWeight: "bold", color: "#ffffff" },
      { id: "live", type: "text", x: 50, y: 450, width: 200, height: 60, content: "LIVE", fontSize: 48, fontWeight: "bold", color: "#ec4899" },
      { id: "venue", type: "text", x: 50, y: 650, width: 700, height: 80, content: "Madison Square Garden", fontSize: 32, color: "#a1a1aa" },
      { id: "date", type: "text", x: 50, y: 750, width: 700, height: 60, content: "December 15, 2024 • 8PM", fontSize: 24, color: "#71717a" },
      { id: "ticket-btn", type: "shape", x: 50, y: 900, width: 300, height: 60, backgroundColor: "#ec4899", borderRadius: 30 },
      { id: "ticket-text", type: "text", x: 80, y: 915, width: 240, height: 30, content: "Get Tickets", fontSize: 20, fontWeight: "bold", color: "#ffffff" },
      { id: "price", type: "text", x: 50, y: 1020, width: 700, height: 40, content: "Tickets from $45", fontSize: 18, color: "#525252" },
    ],
  },
  {
    id: "poster-workshop",
    name: "Workshop",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 1200, backgroundColor: "#faf5ff" },
      { id: "accent", type: "shape", x: 0, y: 0, width: 800, height: 300, backgroundColor: "#7c3aed" },
      { id: "type", type: "text", x: 50, y: 50, width: 300, height: 40, content: "WORKSHOP", fontSize: 16, fontWeight: "bold", color: "#e9d5ff" },
      { id: "title", type: "text", x: 50, y: 120, width: 700, height: 150, content: "Design\nThinking", fontSize: 64, fontWeight: "bold", color: "#ffffff" },
      { id: "desc", type: "text", x: 50, y: 350, width: 700, height: 120, content: "Learn the fundamentals of design thinking and problem solving in this hands-on workshop.", fontSize: 22, color: "#3f3f46" },
      { id: "detail-bg", type: "shape", x: 50, y: 520, width: 700, height: 250, backgroundColor: "#ffffff", borderRadius: 16 },
      { id: "when", type: "text", x: 80, y: 550, width: 300, height: 30, content: "WHEN", fontSize: 12, fontWeight: "bold", color: "#7c3aed" },
      { id: "date", type: "text", x: 80, y: 580, width: 300, height: 40, content: "April 20, 2024", fontSize: 20, color: "#1c1917" },
      { id: "time", type: "text", x: 80, y: 620, width: 300, height: 30, content: "10:00 AM - 4:00 PM", fontSize: 16, color: "#71717a" },
      { id: "where", type: "text", x: 80, y: 680, width: 300, height: 30, content: "WHERE", fontSize: 12, fontWeight: "bold", color: "#7c3aed" },
      { id: "location", type: "text", x: 80, y: 710, width: 300, height: 40, content: "Innovation Hub", fontSize: 20, color: "#1c1917" },
      { id: "register-btn", type: "shape", x: 50, y: 850, width: 700, height: 60, backgroundColor: "#7c3aed", borderRadius: 12 },
      { id: "register-text", type: "text", x: 280, y: 865, width: 240, height: 30, content: "Register Now", fontSize: 18, fontWeight: "bold", color: "#ffffff" },
      { id: "spots", type: "text", x: 50, y: 940, width: 700, height: 30, content: "Only 20 spots available", fontSize: 14, color: "#a1a1aa" },
      { id: "price", type: "text", x: 50, y: 1000, width: 700, height: 50, content: "Early Bird: $99", fontSize: 28, fontWeight: "bold", color: "#1c1917" },
    ],
  },

  // ========== ADDITIONAL LOGO TEMPLATES ==========
  {
    id: "logo-gradient-modern",
    name: "Gradient Modern",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 800, backgroundColor: "#0f172a" },
      { id: "shape1", type: "shape", x: 280, y: 150, width: 120, height: 120, backgroundColor: "#3b82f6", borderRadius: 20 },
      { id: "shape2", type: "shape", x: 350, y: 220, width: 120, height: 120, backgroundColor: "#8b5cf6", borderRadius: 20 },
      { id: "shape3", type: "shape", x: 400, y: 290, width: 120, height: 120, backgroundColor: "#ec4899", borderRadius: 20 },
      { id: "brand", type: "text", x: 150, y: 480, width: 500, height: 80, content: "NEXUS", fontSize: 72, fontWeight: "bold", color: "#ffffff" },
      { id: "tagline", type: "text", x: 150, y: 570, width: 500, height: 40, content: "Connect. Create. Grow.", fontSize: 20, color: "#64748b" },
    ],
  },
  {
    id: "logo-startup-badge",
    name: "Startup Badge",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 800, height: 800, backgroundColor: "#ffffff" },
      { id: "badge", type: "shape", x: 200, y: 150, width: 400, height: 400, backgroundColor: "#0f172a", borderRadius: 200 },
      { id: "inner", type: "shape", x: 230, y: 180, width: 340, height: 340, backgroundColor: "#1e293b", borderRadius: 170 },
      { id: "letter", type: "text", x: 300, y: 280, width: 200, height: 150, content: "A", fontSize: 140, fontWeight: "bold", color: "#ffffff" },
      { id: "brand", type: "text", x: 200, y: 600, width: 400, height: 60, content: "ACME", fontSize: 48, fontWeight: "bold", color: "#0f172a" },
      { id: "type", type: "text", x: 200, y: 660, width: 400, height: 40, content: "SOLUTIONS", fontSize: 24, color: "#64748b" },
    ],
  },

  // ========== ADDITIONAL CERTIFICATE TEMPLATES ==========
  {
    id: "certificate-achievement",
    name: "Achievement",
    category: "certificate",
    thumbnailUrl: "",
    canvasWidth: 1200,
    canvasHeight: 850,
    elements: [
      { id: "bg", type: "shape", x: 0, y: 0, width: 1200, height: 850, backgroundColor: "#fffbeb" },
      { id: "border", type: "shape", x: 20, y: 20, width: 1160, height: 810, backgroundColor: "transparent" },
      { id: "gold-top", type: "shape", x: 0, y: 0, width: 1200, height: 60, backgroundColor: "#f59e0b" },
      { id: "gold-bottom", type: "shape", x: 0, y: 790, width: 1200, height: 60, backgroundColor: "#f59e0b" },
      { id: "seal", type: "shape", x: 525, y: 80, width: 150, height: 150, backgroundColor: "#b45309", borderRadius: 75 },
      { id: "seal-inner", type: "shape", x: 550, y: 105, width: 100, height: 100, backgroundColor: "#f59e0b", borderRadius: 50 },
      { id: "title", type: "text", x: 100, y: 270, width: 1000, height: 50, content: "CERTIFICATE OF ACHIEVEMENT", fontSize: 28, fontWeight: "bold", color: "#b45309" },
      { id: "presented", type: "text", x: 100, y: 340, width: 1000, height: 40, content: "This is to certify that", fontSize: 18, color: "#78716c" },
      { id: "name", type: "text", x: 100, y: 390, width: 1000, height: 80, content: "Award Recipient", fontSize: 52, fontWeight: "bold", color: "#1c1917" },
      { id: "line", type: "shape", x: 250, y: 480, width: 700, height: 2, backgroundColor: "#d6d3d1" },
      { id: "desc", type: "text", x: 100, y: 510, width: 1000, height: 80, content: "Has demonstrated outstanding achievement and excellence", fontSize: 20, color: "#57534e" },
      { id: "date-label", type: "text", x: 200, y: 650, width: 200, height: 25, content: "Date", fontSize: 12, color: "#a8a29e" },
      { id: "date", type: "text", x: 200, y: 675, width: 200, height: 35, content: "______________", fontSize: 16, color: "#78716c" },
      { id: "sig-label", type: "text", x: 800, y: 650, width: 200, height: 25, content: "Signature", fontSize: 12, color: "#a8a29e" },
      { id: "sig", type: "text", x: 800, y: 675, width: 200, height: 35, content: "______________", fontSize: 16, color: "#78716c" },
    ],
  },
];

export const getTemplatesByCategory = (category: DesignCategory): Template[] => {
  return templates.filter((t) => t.category === category);
};

export const getRandomTemplate = (category: DesignCategory): Template | null => {
  const categoryTemplates = getTemplatesByCategory(category);
  if (categoryTemplates.length === 0) return null;
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
};

export const getAllTemplates = (): Template[] => templates;

export const searchTemplates = (query: string): Template[] => {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  );
};
