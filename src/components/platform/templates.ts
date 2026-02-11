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

// Helper to create templates faster
const t = (id: string, name: string, category: DesignCategory, w: number, h: number, elements: TemplateElement[]): Template => ({
  id, name, category, thumbnailUrl: "", canvasWidth: w, canvasHeight: h, elements,
});
const bg = (w: number, h: number, color: string): TemplateElement => ({ id: "bg", type: "shape", x: 0, y: 0, width: w, height: h, backgroundColor: color });
const txt = (id: string, x: number, y: number, w: number, h: number, content: string, fontSize: number, color: string, fontWeight = "normal"): TemplateElement => ({ id, type: "text", x, y, width: w, height: h, content, fontSize, fontWeight, color });
const shp = (id: string, x: number, y: number, w: number, h: number, bg: string, br = 0): TemplateElement => ({ id, type: "shape", x, y, width: w, height: h, backgroundColor: bg, borderRadius: br });

// Premium high-quality templates — 100+
export const templates: Template[] = [
  // ========== INSTAGRAM (20+) ==========
  t("ig-gradient-bold", "Gradient Bold", "instagram", 1080, 1080, [
    bg(1080, 1080, "#667eea"), shp("overlay", 0, 540, 1080, 540, "#764ba2"),
    txt("headline", 80, 300, 920, 150, "MAKE IT\nHAPPEN", 96, "#ffffff", "bold"),
    txt("subhead", 80, 500, 920, 60, "Your success story starts today", 28, "#ffffff"),
    shp("accent", 80, 620, 120, 6, "#ffffff", 3),
    txt("cta", 80, 900, 400, 40, "@yourbrand - Link in bio", 20, "#ffffff"),
  ]),
  t("ig-minimal-quote", "Minimal Quote", "instagram", 1080, 1080, [
    bg(1080, 1080, "#fafafa"),
    txt("quote-mark", 100, 200, 100, 150, "\"", 200, "#e5e5e5", "bold"),
    txt("quote", 100, 350, 880, 250, "The only way to do great work is to love what you do.", 48, "#1a1a1a", "bold"),
    txt("author", 100, 650, 880, 40, "- Steve Jobs", 24, "#666666"),
    shp("line", 100, 750, 200, 3, "#1a1a1a"),
    txt("handle", 100, 900, 400, 30, "@yourbrand", 18, "#999999"),
  ]),
  t("ig-carousel-tips", "Tips Carousel", "instagram", 1080, 1080, [
    bg(1080, 1080, "#0f172a"),
    txt("number", 80, 100, 150, 100, "01", 72, "#3b82f6", "bold"),
    txt("title", 80, 220, 920, 120, "Start With\nWhy", 64, "#ffffff", "bold"),
    txt("body", 80, 400, 920, 200, "Understanding your purpose is the foundation of everything you build.", 28, "#94a3b8"),
    shp("icon-bg", 80, 700, 80, 80, "#3b82f6", 40),
    txt("swipe", 750, 980, 250, 30, "Swipe →", 16, "#3b82f6", "bold"),
  ]),
  t("ig-product-promo", "Product Promo", "instagram", 1080, 1080, [
    bg(1080, 1080, "#18181b"),
    shp("glow", 240, 200, 600, 600, "#7c3aed", 300),
    shp("badge", 80, 80, 160, 50, "#22c55e", 25),
    txt("badge-text", 95, 90, 130, 30, "NEW", 18, "#ffffff", "bold"),
    txt("product", 80, 750, 920, 80, "Introducing Pro X", 56, "#ffffff", "bold"),
    txt("desc", 80, 850, 920, 50, "The future of productivity", 24, "#a1a1aa"),
    txt("cta", 80, 950, 400, 40, "Shop Now → Link in Bio", 18, "#7c3aed", "bold"),
  ]),
  t("ig-story-sale", "Story Sale", "instagram", 1080, 1920, [
    bg(1080, 1920, "#0f0f0f"),
    shp("accent-circle", -200, 600, 800, 800, "#dc2626", 400),
    txt("sale-text", 80, 500, 920, 300, "FLASH\nSALE", 120, "#ffffff", "bold"),
    txt("percent", 80, 900, 500, 200, "50%", 180, "#fbbf24", "bold"),
    txt("off", 80, 1100, 300, 80, "OFF", 64, "#ffffff", "bold"),
    txt("timer", 80, 1350, 920, 50, "Ends in 24 hours", 28, "#a1a1aa"),
    shp("cta", 80, 1500, 400, 70, "#ffffff", 35),
    txt("cta-text", 120, 1515, 320, 40, "Shop Now →", 24, "#0f0f0f", "bold"),
  ]),
  t("ig-announcement", "Announcement", "instagram", 1080, 1080, [
    bg(1080, 1080, "#fef3c7"),
    txt("emoji", 340, 150, 400, 200, "🎉", 150, "#000000"),
    txt("headline", 80, 380, 920, 150, "BIG NEWS", 96, "#1c1917", "bold"),
    txt("subhead", 80, 550, 920, 120, "We're launching something exciting!", 36, "#44403c"),
    shp("divider", 400, 720, 280, 4, "#1c1917"),
    txt("date", 80, 780, 920, 60, "Coming March 15th", 32, "#1c1917", "bold"),
  ]),
  t("ig-app-launch", "App Launch", "instagram", 1080, 1080, [
    bg(1080, 1080, "#0f172a"),
    shp("glow1", -100, 200, 600, 600, "#3b82f6", 300),
    shp("glow2", 600, 400, 500, 500, "#8b5cf6", 250),
    shp("phone-bg", 340, 250, 400, 600, "#1e293b", 40),
    txt("title", 80, 80, 920, 100, "NOW AVAILABLE", 32, "#94a3b8", "bold"),
    txt("app-name", 80, 900, 920, 80, "Download the App", 48, "#ffffff", "bold"),
    txt("stores", 80, 1000, 920, 40, "App Store • Google Play", 24, "#64748b"),
  ]),
  t("ig-startup-promo", "Startup Promo", "instagram", 1080, 1080, [
    bg(1080, 1080, "#fafafa"),
    shp("accent-block", 0, 800, 1080, 280, "#18181b"),
    shp("logo-area", 80, 80, 80, 80, "#3b82f6", 16),
    txt("tagline", 80, 220, 920, 200, "The future of\nproductivity is here", 64, "#18181b", "bold"),
    txt("desc", 80, 480, 700, 100, "AI-powered tools that help you work smarter.", 28, "#52525b"),
    txt("cta", 80, 860, 920, 60, "Join 10,000+ teams →", 28, "#ffffff", "bold"),
  ]),
  t("ig-product-launch", "Product Launch", "instagram", 1080, 1080, [
    bg(1080, 1080, "#f5f5f4"),
    shp("product-zone", 140, 150, 800, 600, "#e7e5e4", 40),
    shp("new-badge", 80, 80, 140, 50, "#18181b", 25),
    txt("new-text", 100, 90, 100, 30, "NEW", 18, "#ffffff", "bold"),
    txt("product-name", 80, 800, 920, 80, "Product Name", 48, "#18181b", "bold"),
    txt("price", 80, 890, 300, 60, "$129.00", 36, "#18181b", "bold"),
  ]),
  t("ig-sale-banner", "Sale Banner", "instagram", 1080, 1080, [
    bg(1080, 1080, "#000000"),
    shp("stripe1", -50, 150, 1200, 80, "#dc2626"),
    shp("stripe2", -50, 850, 1200, 80, "#dc2626"),
    txt("main-text", 80, 350, 920, 200, "BLACK\nFRIDAY", 120, "#ffffff", "bold"),
    txt("discount", 80, 580, 920, 120, "UP TO 70% OFF", 56, "#fbbf24", "bold"),
    txt("code", 80, 960, 920, 40, "Use Code: SAVE70", 20, "#dc2626", "bold"),
  ]),
  t("ig-testimonial", "Testimonial", "instagram", 1080, 1080, [
    bg(1080, 1080, "#f0f9ff"),
    shp("card", 60, 200, 960, 600, "#ffffff", 24),
    txt("stars", 120, 250, 300, 50, "★★★★★", 36, "#f59e0b"),
    txt("review", 120, 330, 840, 200, "\"This product completely changed how I work. Absolutely worth every penny.\"", 32, "#0f172a"),
    txt("author", 120, 580, 400, 40, "— Sarah M., Designer", 20, "#64748b"),
    shp("avatar", 120, 650, 60, 60, "#3b82f6", 30),
    txt("brand", 80, 900, 920, 40, "@yourbrand", 20, "#94a3b8"),
  ]),
  t("ig-before-after", "Before & After", "instagram", 1080, 1080, [
    bg(1080, 1080, "#18181b"),
    shp("left", 0, 0, 540, 1080, "#27272a"),
    txt("before", 80, 80, 400, 50, "BEFORE", 24, "#71717a", "bold"),
    txt("after", 620, 80, 400, 50, "AFTER", 24, "#22c55e", "bold"),
    shp("divider", 530, 0, 20, 1080, "#3b82f6"),
    txt("headline", 80, 880, 920, 80, "See the Difference", 48, "#ffffff", "bold"),
    txt("cta", 80, 980, 400, 40, "Try it yourself →", 20, "#3b82f6", "bold"),
  ]),
  t("ig-checklist", "Checklist Post", "instagram", 1080, 1080, [
    bg(1080, 1080, "#0f172a"),
    txt("title", 80, 80, 920, 100, "Morning Routine\nChecklist", 52, "#ffffff", "bold"),
    shp("line", 80, 200, 920, 2, "#334155"),
    txt("item1", 80, 240, 920, 60, "✅  Wake up at 6 AM", 28, "#e2e8f0"),
    txt("item2", 80, 320, 920, 60, "✅  10 min meditation", 28, "#e2e8f0"),
    txt("item3", 80, 400, 920, 60, "✅  Workout for 30 min", 28, "#e2e8f0"),
    txt("item4", 80, 480, 920, 60, "✅  Healthy breakfast", 28, "#e2e8f0"),
    txt("item5", 80, 560, 920, 60, "✅  Plan the day", 28, "#e2e8f0"),
    txt("save", 80, 900, 920, 40, "Save this for later 📌", 22, "#64748b"),
    txt("handle", 80, 980, 400, 30, "@yourbrand", 18, "#475569"),
  ]),
  t("ig-podcast", "Podcast Episode", "instagram", 1080, 1080, [
    bg(1080, 1080, "#1a1a2e"),
    shp("mic-bg", 340, 100, 400, 400, "#e94560", 200),
    txt("new-ep", 80, 550, 300, 40, "NEW EPISODE", 16, "#e94560", "bold"),
    txt("title", 80, 610, 920, 120, "How to Build a\n7-Figure Brand", 48, "#ffffff", "bold"),
    txt("guest", 80, 780, 920, 40, "with John Smith", 24, "#a1a1aa"),
    txt("listen", 80, 900, 400, 50, "🎧 Listen Now", 28, "#e94560", "bold"),
    txt("platforms", 80, 980, 920, 30, "Spotify • Apple Podcasts • YouTube", 16, "#64748b"),
  ]),
  t("ig-countdown", "Countdown", "instagram", 1080, 1080, [
    bg(1080, 1080, "#7c3aed"),
    txt("coming", 80, 200, 920, 60, "COMING SOON", 28, "#e9d5ff", "bold"),
    txt("title", 80, 300, 920, 150, "Something\nBig Is\nComing", 72, "#ffffff", "bold"),
    shp("box1", 120, 600, 200, 200, "#6d28d9", 20),
    shp("box2", 360, 600, 200, 200, "#6d28d9", 20),
    shp("box3", 600, 600, 200, 200, "#6d28d9", 20),
    txt("d", 160, 640, 120, 80, "05", 64, "#ffffff", "bold"),
    txt("h", 400, 640, 120, 80, "12", 64, "#ffffff", "bold"),
    txt("m", 640, 640, 120, 80, "30", 64, "#ffffff", "bold"),
    txt("dl", 170, 740, 100, 30, "DAYS", 14, "#c4b5fd"),
    txt("hl", 410, 740, 100, 30, "HOURS", 14, "#c4b5fd"),
    txt("ml", 650, 740, 100, 30, "MINS", 14, "#c4b5fd"),
    txt("cta", 80, 900, 920, 40, "Stay tuned 👀", 24, "#e9d5ff"),
  ]),
  t("ig-stats", "Stats Infographic", "instagram", 1080, 1080, [
    bg(1080, 1080, "#ffffff"),
    txt("title", 80, 80, 920, 60, "2024 IN NUMBERS", 36, "#0f172a", "bold"),
    shp("line", 80, 160, 200, 4, "#3b82f6"),
    shp("card1", 80, 220, 440, 300, "#f0f9ff", 16),
    shp("card2", 560, 220, 440, 300, "#f0fdf4", 16),
    shp("card3", 80, 560, 440, 300, "#fef3c7", 16),
    shp("card4", 560, 560, 440, 300, "#fce7f3", 16),
    txt("n1", 130, 280, 340, 100, "10K+", 72, "#2563eb", "bold"),
    txt("l1", 130, 400, 340, 40, "Happy Customers", 20, "#64748b"),
    txt("n2", 610, 280, 340, 100, "50+", 72, "#16a34a", "bold"),
    txt("l2", 610, 400, 340, 40, "Countries", 20, "#64748b"),
    txt("n3", 130, 620, 340, 100, "99%", 72, "#d97706", "bold"),
    txt("l3", 130, 740, 340, 40, "Satisfaction", 20, "#64748b"),
    txt("n4", 610, 620, 340, 100, "24/7", 72, "#db2777", "bold"),
    txt("l4", 610, 740, 340, 40, "Support", 20, "#64748b"),
  ]),
  t("ig-recipe", "Recipe Card", "instagram", 1080, 1080, [
    bg(1080, 1080, "#fef7ed"),
    shp("photo-zone", 0, 0, 1080, 500, "#fed7aa"),
    txt("type", 80, 530, 200, 30, "RECIPE", 14, "#c2410c", "bold"),
    txt("title", 80, 570, 920, 80, "Homemade Pasta", 56, "#1c1917", "bold"),
    txt("time", 80, 670, 400, 40, "⏱️ 30 mins  |  🍽️ Serves 4", 18, "#78716c"),
    shp("divider", 80, 730, 920, 2, "#e7e5e4"),
    txt("ing", 80, 760, 920, 200, "• 2 cups flour\n• 3 eggs\n• 1 tbsp olive oil\n• Pinch of salt", 22, "#44403c"),
    txt("handle", 80, 1000, 400, 30, "@yourbrand", 18, "#a8a29e"),
  ]),

  // ========== YOUTUBE THUMBNAILS (10+) ==========
  t("yt-tutorial-pro", "Tutorial Pro", "youtube", 1280, 720, [
    bg(1280, 720, "#0f172a"),
    shp("accent-line", 0, 0, 8, 720, "#3b82f6"),
    txt("headline", 60, 150, 700, 200, "Complete\nBeginner Guide", 72, "#ffffff", "bold"),
    txt("year", 60, 380, 200, 50, "2024", 36, "#3b82f6", "bold"),
    shp("badge", 60, 500, 200, 50, "#ef4444", 8),
    txt("badge-text", 75, 508, 170, 35, "FREE COURSE", 16, "#ffffff", "bold"),
    shp("avatar-bg", 950, 350, 280, 320, "#1e293b", 20),
  ]),
  t("yt-reaction", "Reaction Style", "youtube", 1280, 720, [
    bg(1280, 720, "#fbbf24"),
    shp("shadow-box", 40, 80, 600, 560, "#000000", 20),
    txt("headline", 80, 150, 520, 250, "THIS IS\nINSANE!!", 84, "#ffffff", "bold"),
    txt("subhead", 80, 450, 400, 60, "You won't believe this...", 28, "#ffffff"),
    shp("face-zone", 700, 100, 520, 520, "#1f2937", 30),
  ]),
  t("yt-listicle", "Listicle Style", "youtube", 1280, 720, [
    bg(1280, 720, "#1e1b4b"),
    txt("number", 60, 100, 300, 250, "10", 200, "#a855f7", "bold"),
    txt("headline", 60, 350, 800, 150, "MUST-KNOW\nSECRETS", 72, "#ffffff", "bold"),
    txt("sub", 60, 530, 600, 50, "That will change everything", 28, "#c4b5fd"),
    shp("badge", 60, 620, 180, 50, "#dc2626", 8),
    txt("badge-text", 75, 630, 150, 30, "WATCH NOW", 14, "#ffffff", "bold"),
  ]),
  t("yt-ai-tool", "AI Tool", "youtube", 1280, 720, [
    bg(1280, 720, "#0c0a09"),
    shp("glow1", -100, 100, 500, 500, "#7c3aed", 250),
    shp("glow2", 900, 200, 400, 400, "#3b82f6", 200),
    shp("ai-badge", 60, 60, 80, 40, "#22c55e", 8),
    txt("ai-text", 75, 68, 50, 24, "AI", 16, "#ffffff", "bold"),
    txt("headline", 60, 180, 700, 200, "This AI Tool\nChanges\nEverything", 72, "#ffffff", "bold"),
    shp("free", 60, 450, 150, 45, "#dc2626", 8),
    txt("free-text", 75, 458, 120, 30, "FREE", 20, "#ffffff", "bold"),
    shp("avatar-zone", 850, 150, 380, 420, "#1c1917", 30),
  ]),
  t("yt-educational", "Educational", "youtube", 1280, 720, [
    bg(1280, 720, "#1e3a5f"),
    shp("step1-bg", 40, 80, 380, 260, "#2563eb", 16),
    txt("step1-num", 60, 100, 80, 60, "01", 48, "#93c5fd", "bold"),
    txt("step1-text", 60, 180, 340, 80, "Research", 32, "#ffffff", "bold"),
    shp("step2-bg", 450, 80, 380, 260, "#7c3aed", 16),
    txt("step2-num", 470, 100, 80, 60, "02", 48, "#c4b5fd", "bold"),
    txt("step2-text", 470, 180, 340, 80, "Plan", 32, "#ffffff", "bold"),
    shp("step3-bg", 860, 80, 380, 260, "#059669", 16),
    txt("step3-num", 880, 100, 80, 60, "03", 48, "#6ee7b7", "bold"),
    txt("step3-text", 880, 180, 340, 80, "Execute", 32, "#ffffff", "bold"),
    txt("title", 40, 400, 800, 120, "Complete Guide\nto Success", 56, "#ffffff", "bold"),
    shp("badge", 40, 560, 200, 50, "#fbbf24", 8),
    txt("badge-text", 60, 570, 160, 30, "STEP BY STEP", 14, "#1c1917", "bold"),
  ]),
  t("yt-versus", "VS Comparison", "youtube", 1280, 720, [
    bg(1280, 720, "#0f172a"),
    shp("left", 0, 0, 600, 720, "#1e293b"),
    txt("vs", 560, 280, 160, 160, "VS", 80, "#ef4444", "bold"),
    txt("left-title", 60, 200, 480, 100, "Option A", 64, "#ffffff", "bold"),
    txt("right-title", 700, 200, 480, 100, "Option B", 64, "#ffffff", "bold"),
    txt("left-sub", 60, 400, 480, 60, "The Classic Way", 24, "#94a3b8"),
    txt("right-sub", 700, 400, 480, 60, "The New Way", 24, "#94a3b8"),
    shp("accent-l", 60, 550, 200, 4, "#3b82f6"),
    shp("accent-r", 700, 550, 200, 4, "#22c55e"),
  ]),
  t("yt-review", "Product Review", "youtube", 1280, 720, [
    bg(1280, 720, "#000000"),
    shp("red-bar", 0, 660, 1280, 60, "#dc2626"),
    txt("review", 60, 100, 600, 80, "HONEST REVIEW", 24, "#ef4444", "bold"),
    txt("title", 60, 200, 700, 200, "Is It Worth\nYour Money?", 72, "#ffffff", "bold"),
    txt("stars", 60, 450, 400, 60, "★★★★☆", 48, "#fbbf24"),
    txt("verdict", 60, 540, 400, 50, "My Verdict Inside", 24, "#a1a1aa"),
    shp("product-zone", 850, 80, 380, 500, "#1f2937", 20),
    txt("bar-text", 100, 673, 400, 30, "SUBSCRIBE FOR MORE REVIEWS", 14, "#ffffff", "bold"),
  ]),
  t("yt-motivation", "Motivation", "youtube", 1280, 720, [
    bg(1280, 720, "#0a0a0a"),
    shp("glow", 200, 50, 880, 620, "#b91c1c", 300),
    txt("title", 60, 180, 800, 200, "STOP\nMAKING\nEXCUSES", 80, "#ffffff", "bold"),
    txt("sub", 60, 500, 600, 50, "The truth no one tells you", 28, "#fca5a5"),
    shp("badge", 60, 600, 200, 50, "#ffffff", 8),
    txt("badge-text", 80, 610, 160, 30, "MUST WATCH", 14, "#0a0a0a", "bold"),
  ]),

  // ========== POSTERS (15+) ==========
  t("poster-event-dark", "Dark Event", "poster", 800, 1200, [
    bg(800, 1200, "#0a0a0a"),
    shp("glow-top", 100, -200, 600, 600, "#7c3aed", 300),
    shp("date-badge", 50, 50, 200, 80, "#ffffff", 8),
    txt("date", 65, 65, 170, 50, "MAR 15", 32, "#0a0a0a", "bold"),
    txt("headline", 50, 400, 700, 200, "TECH\nSUMMIT\n2024", 80, "#ffffff", "bold"),
    txt("location", 50, 700, 700, 50, "San Francisco, CA", 24, "#a1a1aa"),
    shp("cta-btn", 50, 900, 250, 60, "#7c3aed", 30),
    txt("cta-text", 65, 915, 220, 30, "Get Tickets →", 18, "#ffffff", "bold"),
  ]),
  t("poster-sale-bold", "Bold Sale", "poster", 800, 1200, [
    bg(800, 1200, "#dc2626"),
    txt("percent", 50, 300, 700, 300, "70%", 250, "#ffffff", "bold"),
    txt("off", 50, 580, 300, 80, "OFF", 72, "#ffffff", "bold"),
    txt("everything", 50, 700, 700, 50, "EVERYTHING MUST GO", 32, "#fecaca", "bold"),
    txt("dates", 50, 820, 700, 40, "This Weekend Only", 24, "#ffffff"),
  ]),
  t("poster-conference", "Conference", "poster", 800, 1200, [
    bg(800, 1200, "#1e293b"),
    shp("header-bar", 0, 0, 800, 100, "#3b82f6"),
    txt("logo-area", 50, 30, 300, 40, "DEVCON 2024", 24, "#ffffff", "bold"),
    txt("headline", 50, 200, 700, 250, "The Future of\nDeveloper\nExperience", 56, "#ffffff", "bold"),
    txt("when", 70, 500, 300, 30, "WHEN", 14, "#3b82f6", "bold"),
    txt("date", 70, 530, 300, 40, "October 15-17, 2024", 20, "#ffffff"),
    shp("cta", 50, 850, 300, 60, "#3b82f6", 8),
    txt("cta-text", 65, 865, 270, 30, "Register Now", 18, "#ffffff", "bold"),
  ]),
  t("poster-music-event", "Music Event", "poster", 800, 1200, [
    bg(800, 1200, "#0a0a0a"),
    shp("line1", 0, 200, 800, 2, "#ec4899"),
    shp("line2", 0, 400, 800, 2, "#8b5cf6"),
    txt("artist", 50, 250, 700, 120, "ARTIST\nNAME", 80, "#ffffff", "bold"),
    txt("live", 50, 450, 200, 60, "LIVE", 48, "#ec4899", "bold"),
    txt("venue", 50, 650, 700, 80, "Madison Square Garden", 32, "#a1a1aa"),
    shp("ticket-btn", 50, 900, 300, 60, "#ec4899", 30),
    txt("ticket-text", 80, 915, 240, 30, "Get Tickets", 20, "#ffffff", "bold"),
  ]),
  t("poster-workshop", "Workshop", "poster", 800, 1200, [
    bg(800, 1200, "#faf5ff"),
    shp("accent", 0, 0, 800, 300, "#7c3aed"),
    txt("type", 50, 50, 300, 40, "WORKSHOP", 16, "#e9d5ff", "bold"),
    txt("title", 50, 120, 700, 150, "Design\nThinking", 64, "#ffffff", "bold"),
    txt("desc", 50, 350, 700, 120, "Learn design thinking fundamentals in this hands-on workshop.", 22, "#3f3f46"),
    shp("register-btn", 50, 850, 700, 60, "#7c3aed", 12),
    txt("register-text", 280, 865, 240, 30, "Register Now", 18, "#ffffff", "bold"),
  ]),
  t("poster-restaurant", "Restaurant Promo", "poster", 800, 1200, [
    bg(800, 1200, "#1c1917"),
    shp("accent-top", 0, 0, 800, 400, "#b91c1c"),
    txt("title", 50, 80, 700, 150, "GRAND\nOPENING", 80, "#ffffff", "bold"),
    txt("restaurant", 50, 280, 700, 60, "THE GRILL HOUSE", 36, "#fecaca", "bold"),
    shp("offer", 50, 450, 700, 200, "#fbbf24", 20),
    txt("offer-text", 100, 490, 600, 120, "FREE APPETIZER\nWith Any Entrée", 42, "#1c1917", "bold"),
    txt("address", 50, 800, 700, 80, "📍 123 Main Street\n📞 (555) 123-4567", 24, "#d6d3d1"),
  ]),
  t("poster-fitness", "Fitness Promo", "poster", 800, 1200, [
    bg(800, 1200, "#0a0a0a"),
    shp("accent", 0, 0, 8, 1200, "#22c55e"),
    shp("badge", 50, 50, 200, 50, "#22c55e", 25),
    txt("badge-text", 70, 60, 160, 30, "LIMITED OFFER", 14, "#0a0a0a", "bold"),
    txt("headline", 50, 200, 700, 200, "GET FIT\nFOR LESS", 80, "#ffffff", "bold"),
    txt("price", 50, 450, 400, 120, "$19/mo", 72, "#22c55e", "bold"),
    txt("features", 50, 650, 700, 200, "✓ Unlimited access\n✓ Free training\n✓ All classes", 24, "#d4d4d4"),
    shp("cta", 50, 920, 400, 70, "#22c55e", 12),
    txt("cta-text", 100, 935, 300, 40, "Join Now →", 24, "#0a0a0a", "bold"),
  ]),
  t("poster-school", "School Event", "poster", 800, 1200, [
    bg(800, 1200, "#1e40af"),
    txt("title", 50, 80, 700, 150, "SCIENCE\nFAIR 2024", 72, "#ffffff", "bold"),
    txt("school", 50, 280, 700, 50, "Lincoln High School Presents", 22, "#bfdbfe"),
    txt("emoji", 300, 380, 200, 150, "🔬", 120, "#ffffff"),
    txt("date", 50, 800, 700, 60, "📅 March 22, 2024", 28, "#fbbf24", "bold"),
    shp("free", 250, 1050, 300, 60, "#fbbf24", 30),
    txt("free-text", 280, 1065, 240, 30, "FREE ADMISSION", 18, "#1e40af", "bold"),
  ]),
  t("poster-graduation", "Graduation", "poster", 800, 1200, [
    bg(800, 1200, "#0c0a09"),
    shp("gold-accent", 0, 0, 800, 400, "#b45309"),
    txt("cap", 280, 80, 240, 200, "🎓", 150, "#ffffff"),
    txt("congrats", 50, 320, 700, 60, "CONGRATULATIONS", 32, "#fbbf24", "bold"),
    txt("class", 50, 450, 700, 150, "CLASS OF\n2024", 80, "#ffffff", "bold"),
    txt("school", 50, 650, 700, 50, "Central High School", 28, "#a8a29e"),
  ]),
  t("poster-movie", "Movie Premiere", "poster", 800, 1200, [
    bg(800, 1200, "#000000"),
    shp("glow", 100, 100, 600, 400, "#b91c1c", 300),
    txt("title", 50, 500, 700, 200, "THE LAST\nSTAND", 96, "#ffffff", "bold"),
    txt("tagline", 50, 720, 700, 50, "When everything is on the line", 24, "#ef4444"),
    shp("line", 50, 800, 300, 2, "#dc2626"),
    txt("date", 50, 850, 700, 40, "IN THEATERS JULY 4", 20, "#a1a1aa", "bold"),
    txt("credits", 50, 1100, 700, 30, "Directed by John Smith • A Studio Production", 14, "#525252"),
  ]),
  t("poster-charity", "Charity Gala", "poster", 800, 1200, [
    bg(800, 1200, "#1a1a2e"),
    shp("gold-bar", 0, 0, 800, 8, "#d4af37"),
    shp("gold-bar2", 0, 1192, 800, 8, "#d4af37"),
    txt("org", 50, 60, 700, 40, "HOPE FOUNDATION", 20, "#d4af37", "bold"),
    txt("event", 50, 200, 700, 60, "ANNUAL", 32, "#94a3b8"),
    txt("title", 50, 280, 700, 200, "CHARITY\nGALA 2024", 80, "#ffffff", "bold"),
    txt("dress", 50, 550, 700, 40, "Black Tie Event", 24, "#d4af37"),
    txt("date", 50, 650, 700, 50, "December 20, 2024 • 7 PM", 24, "#94a3b8"),
    txt("venue", 50, 720, 700, 40, "Grand Ballroom, The Ritz", 20, "#64748b"),
    shp("ticket-btn", 50, 900, 350, 60, "#d4af37", 8),
    txt("ticket-text", 100, 915, 250, 30, "Reserve Your Seat", 18, "#1a1a2e", "bold"),
  ]),

  // ========== LOGOS (8+) ==========
  t("logo-minimal-tech", "Minimal Tech", "logo", 800, 800, [
    bg(800, 800, "#ffffff"),
    shp("icon-outer", 275, 200, 250, 250, "#0f172a", 50),
    shp("icon-inner", 325, 250, 150, 150, "#3b82f6", 30),
    txt("brand", 200, 520, 400, 80, "techflow", 56, "#0f172a", "bold"),
    txt("tagline", 200, 600, 400, 40, "innovate • build • scale", 18, "#64748b"),
  ]),
  t("logo-bold-creative", "Bold Creative", "logo", 800, 800, [
    bg(800, 800, "#18181b"),
    shp("circle1", 200, 180, 200, 200, "#ec4899", 100),
    shp("circle2", 320, 240, 200, 200, "#8b5cf6", 100),
    shp("circle3", 400, 180, 200, 200, "#3b82f6", 100),
    txt("brand", 150, 480, 500, 100, "STUDIO", 72, "#ffffff", "bold"),
    txt("tagline", 150, 580, 500, 40, "Creative Agency", 24, "#71717a"),
  ]),
  t("logo-professional", "Professional", "logo", 800, 800, [
    bg(800, 800, "#f8fafc"),
    shp("shield", 300, 150, 200, 240, "#1e40af", 20),
    shp("shield-inner", 340, 190, 120, 140, "#ffffff", 10),
    txt("company", 150, 450, 500, 80, "VENTURE", 64, "#1e40af", "bold"),
    txt("type", 150, 530, 500, 50, "CAPITAL GROUP", 28, "#64748b"),
    shp("line", 300, 620, 200, 3, "#1e40af"),
    txt("est", 300, 650, 200, 30, "EST. 2024", 14, "#94a3b8"),
  ]),
  t("logo-gradient-modern", "Gradient Modern", "logo", 800, 800, [
    bg(800, 800, "#0f172a"),
    shp("shape1", 280, 150, 120, 120, "#3b82f6", 20),
    shp("shape2", 350, 220, 120, 120, "#8b5cf6", 20),
    shp("shape3", 400, 290, 120, 120, "#ec4899", 20),
    txt("brand", 150, 480, 500, 80, "NEXUS", 72, "#ffffff", "bold"),
    txt("tagline", 150, 570, 500, 40, "Connect. Create. Grow.", 20, "#64748b"),
  ]),
  t("logo-startup-badge", "Startup Badge", "logo", 800, 800, [
    bg(800, 800, "#ffffff"),
    shp("badge", 200, 150, 400, 400, "#0f172a", 200),
    shp("inner", 230, 180, 340, 340, "#1e293b", 170),
    txt("letter", 300, 280, 200, 150, "A", 140, "#ffffff", "bold"),
    txt("brand", 200, 600, 400, 60, "ACME", 48, "#0f172a", "bold"),
    txt("type", 200, 660, 400, 40, "SOLUTIONS", 24, "#64748b"),
  ]),
  t("logo-monogram", "Monogram", "logo", 800, 800, [
    bg(800, 800, "#0f172a"),
    shp("circle", 200, 150, 400, 400, "#ffffff", 200),
    txt("letters", 260, 250, 280, 200, "JD", 140, "#0f172a", "bold"),
    txt("name", 200, 600, 400, 50, "JAMES DOE", 32, "#ffffff", "bold"),
    txt("title", 200, 660, 400, 30, "PHOTOGRAPHY", 18, "#64748b"),
  ]),
  t("logo-eco", "Eco Brand", "logo", 800, 800, [
    bg(800, 800, "#f0fdf4"),
    shp("leaf1", 320, 150, 160, 200, "#22c55e", 80),
    shp("leaf2", 350, 200, 100, 150, "#16a34a", 50),
    txt("brand", 200, 420, 400, 80, "evergreen", 56, "#15803d", "bold"),
    txt("tagline", 200, 510, 400, 40, "sustainable living", 20, "#4ade80"),
  ]),
  t("logo-luxury", "Luxury", "logo", 800, 800, [
    bg(800, 800, "#0c0a09"),
    shp("frame", 200, 150, 400, 300, "transparent", 0),
    shp("line-t", 200, 150, 400, 2, "#d4af37"),
    shp("line-b", 200, 448, 400, 2, "#d4af37"),
    shp("line-l", 200, 150, 2, 300, "#d4af37"),
    shp("line-r", 598, 150, 2, 300, "#d4af37"),
    txt("brand", 220, 250, 360, 100, "MAISON", 64, "#d4af37", "bold"),
    txt("sub", 220, 350, 360, 40, "P A R I S", 24, "#d4af37"),
    txt("est", 300, 500, 200, 30, "ESTABLISHED 1924", 12, "#78716c"),
  ]),

  // ========== CERTIFICATES (4) ==========
  t("cert-professional", "Professional", "certificate", 1200, 850, [
    bg(1200, 850, "#fefce8"),
    shp("header-line", 100, 80, 1000, 3, "#854d0e"),
    txt("title", 100, 120, 1000, 60, "CERTIFICATE OF ACHIEVEMENT", 32, "#854d0e", "bold"),
    txt("presented", 100, 220, 1000, 40, "This certificate is proudly presented to", 18, "#78716c"),
    txt("name", 100, 280, 1000, 80, "John Doe", 56, "#1c1917", "bold"),
    shp("name-line", 200, 370, 800, 2, "#d6d3d1"),
    txt("for", 100, 400, 1000, 40, "for successfully completing the", 18, "#78716c"),
    txt("course", 100, 450, 1000, 50, "Advanced Professional Development Program", 28, "#1c1917", "bold"),
    shp("footer-line", 100, 750, 1000, 3, "#854d0e"),
  ]),
  t("cert-modern", "Modern", "certificate", 1200, 850, [
    bg(1200, 850, "#0f172a"),
    shp("accent-top", 0, 0, 1200, 8, "#3b82f6"),
    shp("accent-bottom", 0, 842, 1200, 8, "#3b82f6"),
    shp("badge", 525, 60, 150, 150, "#3b82f6", 75),
    txt("title", 100, 250, 1000, 50, "CERTIFICATE OF COMPLETION", 24, "#3b82f6", "bold"),
    txt("name", 100, 330, 1000, 100, "Jane Smith", 64, "#ffffff", "bold"),
    txt("desc", 100, 450, 1000, 80, "Has successfully completed all requirements for the\nFull Stack Development Certification", 22, "#94a3b8"),
  ]),
  t("cert-achievement", "Achievement", "certificate", 1200, 850, [
    bg(1200, 850, "#fffbeb"),
    shp("gold-top", 0, 0, 1200, 60, "#f59e0b"),
    shp("gold-bottom", 0, 790, 1200, 60, "#f59e0b"),
    shp("seal", 525, 80, 150, 150, "#b45309", 75),
    txt("title", 100, 270, 1000, 50, "CERTIFICATE OF ACHIEVEMENT", 28, "#b45309", "bold"),
    txt("name", 100, 390, 1000, 80, "Award Recipient", 52, "#1c1917", "bold"),
    txt("desc", 100, 510, 1000, 80, "Has demonstrated outstanding achievement and excellence", 20, "#57534e"),
  ]),
  t("cert-course", "Course Completion", "certificate", 1200, 850, [
    bg(1200, 850, "#ffffff"),
    shp("sidebar", 0, 0, 60, 850, "#7c3aed"),
    txt("org", 120, 60, 400, 40, "LEARNING ACADEMY", 18, "#7c3aed", "bold"),
    txt("title", 120, 150, 800, 50, "Certificate of Completion", 36, "#0f172a", "bold"),
    shp("divider", 120, 220, 400, 3, "#7c3aed"),
    txt("name", 120, 280, 800, 80, "Student Name", 56, "#0f172a", "bold"),
    txt("course", 120, 400, 800, 50, "Full Stack Web Development Bootcamp", 24, "#64748b"),
    txt("date", 120, 500, 400, 30, "Completed: March 2024", 16, "#94a3b8"),
    txt("hours", 120, 540, 400, 30, "Duration: 120 Hours", 16, "#94a3b8"),
    shp("sig-line", 120, 700, 300, 2, "#0f172a"),
    txt("sig-label", 120, 710, 300, 25, "Director of Education", 12, "#94a3b8"),
  ]),

  // ========== PRESENTATIONS (5) ==========
  t("pres-pitch-cover", "Pitch Deck Cover", "presentation", 1920, 1080, [
    bg(1920, 1080, "#0f172a"),
    shp("gradient-orb", 1200, -200, 1000, 1000, "#3b82f6", 500),
    shp("logo-area", 100, 80, 60, 60, "#3b82f6", 12),
    txt("company", 180, 90, 300, 40, "TechStartup", 24, "#ffffff", "bold"),
    txt("headline", 100, 350, 900, 200, "Revolutionizing\nThe Future of Work", 80, "#ffffff", "bold"),
    txt("tagline", 100, 580, 800, 50, "AI-powered productivity for the modern enterprise", 28, "#94a3b8"),
    txt("footer", 100, 980, 800, 30, "Confidential • Q1 2024", 16, "#475569"),
  ]),
  t("pres-problem-solution", "Problem Solution", "presentation", 1920, 1080, [
    bg(1920, 1080, "#ffffff"),
    shp("left-panel", 0, 0, 960, 1080, "#fef2f2"),
    shp("right-panel", 960, 0, 960, 1080, "#f0fdf4"),
    txt("problem-label", 100, 100, 200, 40, "PROBLEM", 16, "#dc2626", "bold"),
    txt("problem", 100, 180, 760, 300, "Businesses lose\n40% of productivity\nto manual tasks", 56, "#1f2937", "bold"),
    txt("solution-label", 1060, 100, 200, 40, "SOLUTION", 16, "#16a34a", "bold"),
    txt("solution", 1060, 180, 760, 300, "AI automation\nthat saves 20+\nhours per week", 56, "#1f2937", "bold"),
    shp("divider", 955, 150, 10, 780, "#d1d5db"),
  ]),
  t("pres-features", "Feature Comparison", "presentation", 1920, 1080, [
    bg(1920, 1080, "#f8fafc"),
    txt("title", 100, 80, 1000, 60, "Why Choose Us?", 48, "#0f172a", "bold"),
    shp("card1", 100, 200, 540, 350, "#ffffff", 24),
    txt("card1-title", 140, 330, 460, 40, "Lightning Fast", 28, "#0f172a", "bold"),
    txt("card1-desc", 140, 380, 460, 100, "10x faster than traditional solutions", 18, "#64748b"),
    shp("card2", 690, 200, 540, 350, "#ffffff", 24),
    txt("card2-title", 730, 330, 460, 40, "Secure by Design", 28, "#0f172a", "bold"),
    txt("card2-desc", 730, 380, 460, 100, "Enterprise-grade security with SOC 2", 18, "#64748b"),
    shp("card3", 1280, 200, 540, 350, "#ffffff", 24),
    txt("card3-title", 1320, 330, 460, 40, "Easy Integration", 28, "#0f172a", "bold"),
    txt("card3-desc", 1320, 380, 460, 100, "Connect with 100+ tools in minutes", 18, "#64748b"),
  ]),
  t("pres-team", "Meet the Team", "presentation", 1920, 1080, [
    bg(1920, 1080, "#0f172a"),
    txt("title", 100, 80, 800, 60, "Meet Our Team", 48, "#ffffff", "bold"),
    shp("line", 100, 160, 200, 4, "#3b82f6"),
    shp("p1", 100, 250, 380, 500, "#1e293b", 20),
    shp("p2", 530, 250, 380, 500, "#1e293b", 20),
    shp("p3", 960, 250, 380, 500, "#1e293b", 20),
    shp("p4", 1390, 250, 380, 500, "#1e293b", 20),
    txt("n1", 130, 600, 320, 40, "Alex Johnson", 22, "#ffffff", "bold"),
    txt("r1", 130, 650, 320, 30, "CEO & Founder", 16, "#3b82f6"),
    txt("n2", 560, 600, 320, 40, "Sarah Chen", 22, "#ffffff", "bold"),
    txt("r2", 560, 650, 320, 30, "CTO", 16, "#3b82f6"),
    txt("n3", 990, 600, 320, 40, "Mike Torres", 22, "#ffffff", "bold"),
    txt("r3", 990, 650, 320, 30, "Head of Design", 16, "#3b82f6"),
    txt("n4", 1420, 600, 320, 40, "Lisa Park", 22, "#ffffff", "bold"),
    txt("r4", 1420, 650, 320, 30, "VP Marketing", 16, "#3b82f6"),
  ]),
  t("pres-timeline", "Timeline", "presentation", 1920, 1080, [
    bg(1920, 1080, "#ffffff"),
    txt("title", 100, 60, 800, 50, "Our Journey", 40, "#0f172a", "bold"),
    shp("line", 100, 540, 1720, 4, "#e2e8f0"),
    shp("d1", 200, 520, 40, 40, "#3b82f6", 20),
    shp("d2", 600, 520, 40, 40, "#8b5cf6", 20),
    shp("d3", 1000, 520, 40, 40, "#22c55e", 20),
    shp("d4", 1400, 520, 40, 40, "#f97316", 20),
    txt("y1", 140, 450, 160, 30, "2020", 18, "#3b82f6", "bold"),
    txt("t1", 140, 580, 200, 60, "Founded", 20, "#0f172a", "bold"),
    txt("y2", 540, 450, 160, 30, "2021", 18, "#8b5cf6", "bold"),
    txt("t2", 540, 580, 200, 60, "First Product", 20, "#0f172a", "bold"),
    txt("y3", 940, 450, 160, 30, "2022", 18, "#22c55e", "bold"),
    txt("t3", 940, 580, 200, 60, "Series A", 20, "#0f172a", "bold"),
    txt("y4", 1340, 450, 160, 30, "2023", 18, "#f97316", "bold"),
    txt("t4", 1340, 580, 200, 60, "Global Launch", 20, "#0f172a", "bold"),
  ]),

  // ========== LINKEDIN (4) ==========
  t("linkedin-announcement", "LinkedIn Announcement", "instagram", 1200, 627, [
    bg(1200, 627, "#0a66c2"),
    txt("excited", 60, 60, 400, 40, "EXCITING NEWS 🎉", 20, "#ffffff", "bold"),
    txt("headline", 60, 130, 800, 150, "We're Hiring!\nJoin Our Team", 56, "#ffffff", "bold"),
    shp("card", 60, 340, 600, 220, "#ffffff", 16),
    txt("role", 100, 370, 520, 40, "Senior Software Engineer", 24, "#0f172a", "bold"),
    txt("details", 100, 420, 520, 80, "📍 Remote • Full-time\n💰 Competitive salary\n🚀 Fast-growing startup", 16, "#64748b"),
    txt("cta", 100, 520, 300, 30, "Apply → Link in comments", 14, "#0a66c2", "bold"),
  ]),
  t("linkedin-quote", "LinkedIn Quote", "instagram", 1200, 627, [
    bg(1200, 627, "#f8fafc"),
    shp("accent", 0, 0, 8, 627, "#0a66c2"),
    txt("quote", 80, 80, 900, 200, "\"Leadership is not about being in charge. It's about taking care of those in your charge.\"", 36, "#0f172a"),
    txt("author", 80, 330, 500, 40, "— Simon Sinek", 22, "#64748b"),
    shp("divider", 80, 420, 200, 3, "#0a66c2"),
    txt("profile", 80, 460, 500, 40, "Your Name • CEO at Company", 18, "#0f172a"),
    txt("engage", 80, 520, 800, 30, "💡 What's the best leadership advice you've received?", 16, "#64748b"),
  ]),

  // ========== TWITTER/X (4) ==========
  t("twitter-thread-cover", "Thread Cover", "instagram", 1200, 675, [
    bg(1200, 675, "#0f172a"),
    shp("accent", 0, 0, 1200, 6, "#1d9bf0"),
    txt("thread", 60, 60, 200, 30, "🧵 THREAD", 14, "#1d9bf0", "bold"),
    txt("title", 60, 120, 900, 200, "10 Lessons I Learned\nBuilding a $1M Business", 52, "#ffffff", "bold"),
    txt("sub", 60, 380, 800, 50, "A thread on entrepreneurship, failure, and success.", 22, "#94a3b8"),
    txt("read", 60, 500, 400, 40, "Read below ↓", 20, "#1d9bf0", "bold"),
    txt("handle", 60, 600, 400, 30, "@yourusername", 16, "#64748b"),
  ]),
  t("twitter-announcement", "X Announcement", "instagram", 1200, 675, [
    bg(1200, 675, "#000000"),
    txt("breaking", 60, 60, 300, 40, "⚡ BREAKING", 18, "#f59e0b", "bold"),
    txt("news", 60, 140, 900, 200, "Major Product\nUpdate Dropped", 64, "#ffffff", "bold"),
    txt("details", 60, 400, 800, 60, "Everything you need to know about v2.0", 24, "#a1a1aa"),
    shp("badge", 60, 520, 200, 50, "#1d9bf0", 8),
    txt("badge-text", 80, 530, 160, 30, "READ MORE", 14, "#ffffff", "bold"),
  ]),

  // ========== MISC / FACEBOOK (4) ==========
  t("fb-event-cover", "Event Cover", "instagram", 1920, 1080, [
    bg(1920, 1080, "#1e1b4b"),
    shp("glow", 800, -200, 800, 800, "#7c3aed", 400),
    txt("event", 100, 300, 1000, 200, "SUMMER\nMUSIC FEST", 100, "#ffffff", "bold"),
    txt("date", 100, 550, 800, 60, "August 15-17, 2024 • Central Park", 28, "#c4b5fd"),
    shp("cta", 100, 700, 350, 70, "#ffffff", 35),
    txt("cta-text", 140, 715, 270, 40, "Get Tickets →", 22, "#1e1b4b", "bold"),
    txt("lineup", 100, 850, 800, 40, "Featuring: Artist A • Artist B • Artist C", 20, "#8b5cf6"),
  ]),
  t("fb-sale-cover", "Sale Cover", "instagram", 1920, 1080, [
    bg(1920, 1080, "#dc2626"),
    txt("mega", 100, 150, 1000, 200, "MEGA\nSALE", 140, "#ffffff", "bold"),
    txt("percent", 100, 450, 800, 150, "UP TO 80% OFF", 72, "#fef2f2", "bold"),
    shp("bar", 100, 700, 600, 70, "#000000", 8),
    txt("bar-text", 140, 715, 520, 40, "SHOP NOW →", 28, "#ffffff", "bold"),
    txt("valid", 100, 850, 800, 40, "Valid Dec 26 - Jan 2", 22, "#fecaca"),
  ]),
  t("whatsapp-status-promo", "WhatsApp Promo", "instagram", 1080, 1920, [
    bg(1080, 1920, "#25d366"),
    txt("hey", 80, 400, 920, 100, "HEY! 👋", 72, "#ffffff", "bold"),
    txt("msg", 80, 600, 920, 200, "Don't miss our\nbiggest sale\nof the year!", 56, "#ffffff", "bold"),
    shp("card", 80, 1000, 920, 300, "#ffffff", 24),
    txt("deal", 130, 1050, 820, 80, "50% OFF Everything", 48, "#25d366", "bold"),
    txt("code", 130, 1150, 820, 50, "Use code: WHATSAPP50", 24, "#64748b"),
    txt("shop", 130, 1220, 300, 40, "Shop now →", 20, "#25d366", "bold"),
    txt("footer", 80, 1700, 920, 40, "Share this status!", 22, "#ffffff"),
  ]),
  t("pinterest-pin", "Pinterest Pin", "instagram", 1000, 1500, [
    bg(1000, 1500, "#fef7ed"),
    shp("photo-zone", 50, 50, 900, 800, "#fed7aa", 20),
    txt("title", 50, 900, 900, 120, "20 Home Decor\nIdeas for 2024", 52, "#1c1917", "bold"),
    txt("desc", 50, 1060, 900, 100, "Transform your space with these trending interior design tips.", 22, "#78716c"),
    shp("save-btn", 50, 1250, 250, 60, "#dc2626", 30),
    txt("save", 90, 1265, 170, 30, "Save Pin", 18, "#ffffff", "bold"),
    txt("credit", 50, 1400, 400, 30, "📌 yourbrand.com", 16, "#a8a29e"),
  ]),
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
