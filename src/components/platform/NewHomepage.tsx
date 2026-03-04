import { WebGLShader } from "@/components/ui/web-gl-shader";
import epicLogo from "@/assets/epic-logo.png";
import logoLovable from "@/assets/logo-lovable.png";
import logoSupabase from "@/assets/logo-supabase.jpg";
import logoGoogle from "@/assets/logo-google.png";
import logoChatGPT from "@/assets/logo-chatgpt.png";
import {
  Layers, Download, Type, Image, Layout, Wand2, Star, ArrowRight,
  Network, CheckCircle, FileJson, GitBranch, MousePointerClick, Grip,
  Play, Flame, Globe, Zap, Users, Shield, Crown, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface NewHomepageProps {
  onStartDesigning: () => void;
  onBrowseInspiration: () => void;
  onAIModeClick?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

/* ── Logo carousel data ── */
const partnerLogos = [
  { src: logoLovable, alt: "Lovable", h: "h-7" },
  { src: logoSupabase, alt: "Supabase", h: "h-6" },
  { src: logoGoogle, alt: "Google", h: "h-7" },
  { src: logoChatGPT, alt: "ChatGPT", h: "h-7" },
  { src: logoLovable, alt: "Lovable", h: "h-7" },
  { src: logoSupabase, alt: "Supabase", h: "h-6" },
  { src: logoGoogle, alt: "Google", h: "h-7" },
  { src: logoChatGPT, alt: "ChatGPT", h: "h-7" },
];

/* ── Testimonials ── */
const testimonials = [
  {
    name: "Arjun P.",
    role: "Indie Founder",
    text: "I planned my entire SaaS navigation in 5 minutes. Exported JSON and plugged it straight into my codebase. Nothing else does this.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    role: "UX Designer",
    text: "Finally a tool that thinks in structure first. The visual sitemap maker is incredibly fast and the export quality is professional-grade.",
    rating: 5,
  },
  {
    name: "Rahul M.",
    role: "Startup CTO",
    text: "We use EPIC for every new project kickoff. Plan the sitemap, agree on structure, then build. Saves us hours of back-and-forth.",
    rating: 5,
  },
];

/* ── Feature grid ── */
const navFeatures = [
  { icon: Grip, title: "Drag & Drop Canvas", desc: "Visually arrange pages with fluid drag-and-drop. 50+ pre-built page templates." },
  { icon: GitBranch, title: "Smart Connections", desc: "Draw navigation flows between pages. Curved paths with auto-layout." },
  { icon: FileJson, title: "JSON + PNG Export", desc: "Export structured JSON sitemaps or high-res PNG maps. Builder-ready schemas." },
];

const platformFeatures = [
  { icon: Layers, title: "200+ Templates", desc: "Professional designs for every occasion" },
  { icon: Type, title: "Smart Text Engine", desc: "Auto-fit, auto-contrast, beautiful typography" },
  { icon: Image, title: "Elements Library", desc: "Icons, shapes, badges, frames & more" },
  { icon: Download, title: "HD Export", desc: "Download in PNG, JPG, PDF instantly" },
  { icon: Layout, title: "Smart Resize", desc: "One-click resize to any social format" },
  { icon: Wand2, title: "AI Mode", desc: "Generate designs with AI prompts" },
];

const showcaseCategories = [
  { label: "Posters", emoji: "🎨" },
  { label: "Certificates", emoji: "📜" },
  { label: "Social Media", emoji: "📱" },
  { label: "Thumbnails", emoji: "▶️" },
  { label: "Business Cards", emoji: "💼" },
  { label: "Presentations", emoji: "📊" },
  { label: "Resumes", emoji: "📝" },
  { label: "Festival Designs", emoji: "🎉" },
];

export const NewHomepage = ({ onStartDesigning, onBrowseInspiration, onAIModeClick }: NewHomepageProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* ═══════ HERO — CRO Optimized ═══════ */}
      <section className="relative mx-auto w-full pt-28 md:pt-44 px-6 text-center min-h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 -z-20"><WebGLShader /></div>
        <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-[1px]" />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="flex justify-center mb-6 relative z-10">
          <img src={epicLogo} alt="EPIC — Visual Sitemap & Design Platform" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl" width={112} height={112} loading="eager" />
        </motion.div>

        {/* Headline — outcome-focused */}
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="text-balance bg-gradient-to-b from-white to-white/60 bg-clip-text py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-[-0.04em] text-transparent relative z-10 max-w-3xl">
          Ship your website faster with a clear structure
        </motion.h1>

        {/* Subheadline — outcome, not feature */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 mb-8 text-balance text-sm md:text-base tracking-tight text-white/60 max-w-lg mx-auto relative z-10 leading-relaxed">
          Plan your website's navigation visually. Export clean JSON for developers or HD images for stakeholders — in under 2 minutes.
        </motion.p>

        {/* Dual CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3 relative z-20">
          <Button onClick={() => navigate("/navigation-maker")} size="lg"
            className="gap-2 min-w-[240px] min-h-[52px] rounded-[0.625rem] bg-white text-neutral-900 hover:bg-white/90 font-semibold text-sm shadow-lg shadow-white/10">
            <Network className="h-4 w-4" /> Create Your Sitemap — Free
          </Button>
          <Button onClick={() => {
            const demo = document.getElementById("live-demo");
            demo?.scrollIntoView({ behavior: "smooth" });
          }} variant="outline" size="lg"
            className="gap-2 min-w-[200px] min-h-[52px] rounded-[0.625rem] border-white/20 text-white hover:bg-white/10 font-medium text-sm">
            <Play className="h-4 w-4" /> See Live Demo
          </Button>
        </motion.div>

        {/* Micro-trust indicators */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40 relative z-10">
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> Free forever</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> No credit card</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> No signup required</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> JSON + PNG export</span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ═══════ SOCIAL PROOF — Logo Carousel ═══════ */}
      <section className="py-12 md:py-16 bg-background border-b border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 font-medium">
            Trusted by founders and builders worldwide
          </p>

          {/* Sliding carousel */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="flex animate-logo-scroll gap-16 items-center w-max">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <img key={i} src={logo.src} alt={logo.alt} className={`${logo.h} object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300`} />
              ))}
            </div>
          </div>

          {/* Hacker News + metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card">
              <Flame className="h-3 w-3 text-orange-500" /> Featured on Hacker News
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card">
              <Users className="h-3 w-3" /> 280+ active users
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card">
              <Globe className="h-3 w-3" /> Used in 15+ countries
            </span>
          </div>
        </div>
      </section>

      {/* ═══════ LIVE DEMO — Navigation Maker Hero Feature ═══════ */}
      <section id="live-demo" className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-primary mb-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">✦ Flagship Tool</span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-[-0.03em] mb-4">
              Website Navigation Maker
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Stop planning websites in spreadsheets. Drag, connect, export — your entire site structure in minutes.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {navFeatures.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp}
                className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors duration-300">
                <f.icon className="h-5 w-5 text-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Live Preview Mock */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
            className="relative rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md bg-muted flex items-center px-3">
                <span className="text-[10px] text-muted-foreground">epic.app/navigation-maker</span>
              </div>
              <div className="flex gap-1">
                <div className="px-2 py-1 text-[9px] rounded border border-border text-muted-foreground">Export JSON</div>
                <div className="px-2 py-1 text-[9px] rounded border border-border text-muted-foreground">Export PNG</div>
              </div>
            </div>
            <div className="flex">
              <div className="w-48 border-r border-border p-3 hidden md:block bg-muted/10">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Stock Pages</p>
                {["Home", "Login", "Dashboard", "Products", "Blog", "Contact"].map(p => (
                  <div key={p} className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-foreground/70 hover:bg-muted/50 cursor-default">
                    <div className="w-3 h-3 rounded bg-foreground/10" />
                    {p}
                  </div>
                ))}
              </div>
              <div className="flex-1 h-64 md:h-80 relative bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border)/0.3)_1px,transparent_0)] bg-[size:20px_20px]">
                <div className="absolute top-8 left-[15%] w-28 h-10 rounded-lg bg-foreground text-primary-foreground flex items-center justify-center text-[11px] font-medium shadow-sm">Home</div>
                <div className="absolute top-8 right-[15%] w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium">Login</div>
                <div className="absolute top-[55%] left-[30%] w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium">Dashboard</div>
                <div className="absolute top-[55%] right-[30%] w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium">Products</div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium">Blog</div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <line x1="22%" y1="18%" x2="78%" y2="18%" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.15" />
                  <line x1="22%" y1="22%" x2="36%" y2="55%" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.15" />
                  <line x1="78%" y1="22%" x2="64%" y2="55%" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.15" />
                  <line x1="36%" y1="62%" x2="50%" y2="82%" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.15" />
                </svg>
                <div className="absolute bottom-3 right-3 w-40 rounded-lg bg-card/95 backdrop-blur border border-border p-2.5 text-[9px] font-mono text-muted-foreground leading-relaxed shadow-lg hidden md:block">
                  <p className="text-foreground font-semibold mb-1 text-[10px]">sitemap.json</p>
                  {`{`}<br/>
                  &nbsp;&nbsp;{`"pages": [`}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{ "id": "home" },`}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{ "id": "login" },`}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{`...`}<br/>
                  &nbsp;&nbsp;{`]`}<br/>
                  {`}`}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp} className="text-center mt-10">
            <Button onClick={() => navigate("/navigation-maker")} size="lg" className="gap-2 rounded-lg text-sm min-h-[48px] px-8">
              <Network className="h-4 w-4" /> Open Navigation Maker <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════ WHY EPIC — Differentiation ═══════ */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
              Why EPIC?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Not another Canva clone. EPIC is built for people who think in structure first, visuals second.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Users,
                title: "Built for founders & developers",
                desc: "Plan your website architecture before writing a single line of code. Export developer-ready JSON sitemaps.",
              },
              {
                icon: Zap,
                title: "Speed over complexity",
                desc: "No layers, no panels, no learning curve. Create professional outputs in under 2 minutes.",
              },
              {
                icon: Shield,
                title: "Structure → Design → Ship",
                desc: "The only tool that combines website planning with visual design. From sitemap to social graphics, one platform.",
              },
            ].map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors duration-300">
                <f.icon className="h-5 w-5 text-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold text-center mb-12 text-foreground tracking-tight">
            Loved by Builders
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SHOWCASE CATEGORIES ═══════ */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold text-center mb-3 text-foreground tracking-tight">
            Create Anything You Imagine
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="text-muted-foreground text-center mb-12 max-w-lg mx-auto text-sm">
            From social media posts to professional presentations.
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {showcaseCategories.map((cat, i) => (
              <motion.div key={cat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                onClick={onStartDesigning}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 text-center hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                <span className="text-2xl mb-2 block">{cat.emoji}</span>
                <span className="text-sm font-medium text-foreground">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold text-center mb-3 text-foreground tracking-tight">
            Everything You Need to Design
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="text-muted-foreground text-center mb-12 max-w-lg mx-auto text-sm">
            Powerful features that make EPIC the easiest design tool on the planet.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platformFeatures.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors duration-300 group">
                <f.icon className="h-5 w-5 text-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING — Simple 2-tier ═══════ */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
              Simple, honest pricing
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Start free. Upgrade when you need professional exports and unlimited access.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-lg font-semibold text-foreground mb-1">Free</h3>
              <p className="text-muted-foreground text-xs mb-6">Perfect for getting started</p>
              <div className="text-3xl font-semibold text-foreground mb-6">₹0 <span className="text-sm font-normal text-muted-foreground">forever</span></div>
              <ul className="space-y-3 mb-8">
                {["Visual sitemap builder", "Basic PNG export", "50+ templates", "Watermarked exports", "3 exports per day"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate("/navigation-maker")} variant="outline" className="w-full rounded-lg">
                Start Free
              </Button>
            </motion.div>

            {/* Pro */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
              className="bg-card border-2 border-primary/30 rounded-xl p-8 relative">
              <span className="absolute -top-3 left-6 px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-primary text-primary-foreground rounded-full">
                Most Popular
              </span>
              <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" /> Pro
              </h3>
              <p className="text-muted-foreground text-xs mb-6">For professionals who ship</p>
              <div className="text-3xl font-semibold text-foreground mb-6">₹299 <span className="text-sm font-normal text-muted-foreground">lifetime</span></div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited exports",
                  "No watermarks",
                  "High-res PNG & PDF",
                  "JSON sitemap export",
                  "Shareable public links",
                  "All premium templates",
                  "Priority processing",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate("/auth")} className="w-full rounded-lg">
                Upgrade to Pro
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold mb-3 text-foreground tracking-tight">
            Ready to plan your next website?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="text-muted-foreground mb-8 text-sm">
            Join hundreds of founders using EPIC. Free to start, no signup required.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/navigation-maker")} size="lg" className="gap-2 rounded-lg text-sm min-h-[48px] px-8">
              <Network className="h-4 w-4" /> Create Your Sitemap
            </Button>
            <Button onClick={onStartDesigning} variant="outline" size="lg" className="gap-2 rounded-lg text-sm min-h-[48px] px-8">
              Start Designing <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
