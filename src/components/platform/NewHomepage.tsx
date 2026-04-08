import { useState, useRef } from "react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import {
  Network, CheckCircle, FileJson, GitBranch, MousePointerClick, Grip,
  Play, Globe, Zap, Users, Shield, Crown, ArrowRight, Star,
  Download, Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Heroimage from '../assets/Site mapping and user flow tool.png'

interface NewHomepageProps {
  onStartDesigning: () => void;
  onBrowseInspiration: () => void;
  onAIModeClick?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

/* ── Testimonials ── */
const testimonials = [
  {
    name: "Arjun",
    role: "Indie Founder",
    text: "I planned my entire SaaS navigation in 5 minutes. Exported JSON and plugged it straight into my codebase.",
    rating: 5,
  },
  {
    name: "Sarah",
    role: "UX Designer",
    text: "Finally a tool that thinks in structure first. The visual sitemap maker is incredibly fast.",
    rating: 5,
  },
  {
    name: "Rahul",
    role: "Startup CTO",
    text: "We use EPIC for every new project kickoff. Plan the sitemap, agree on structure, then build.",
    rating: 5,
  },
];

/* ── Feature grid ── */
const navFeatures = [
  { icon: Grip, title: "Drag & Drop Canvas", desc: "Visually arrange pages with fluid drag-and-drop. 50+ pre-built page templates." },
  { icon: GitBranch, title: "Smart Connections", desc: "Draw navigation flows between pages. Curved paths with auto-layout." },
  { icon: FileJson, title: "JSON + PNG Export", desc: "Export structured JSON sitemaps or high-res PNG maps. Builder-ready schemas." },
];

export const NewHomepage = ({ onStartDesigning, onBrowseInspiration, onAIModeClick }: NewHomepageProps) => {
  const navigate = useNavigate();
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* Video Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowDemoVideo(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDemoVideo(false)} className="absolute -top-10 right-0 text-white hover:text-white/80 text-sm font-medium">✕ Close</button>
            <video
              ref={videoRef}
              src="/epic-demo.mp4"
              controls
              autoPlay
              className="w-full rounded-xl shadow-2xl"
              onLoadedData={() => videoRef.current?.play()}
            />
          </div>
        </div>
      )}
    <div className="w-full">
      {/* ═══════ HERO — CRO Optimized ═══════ */}
      <section className="relative mx-auto w-full pt-28 md:pt-44 px-6 text-center min-h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 -z-20"><WebGLShader /></div>
        <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-[1px]" />

        {/* Headline — outcome-focused, single clear message */}
        
        <img
          src="/epic-logo.png"
          alt="EPIC logo"
          classname="w-10 h-10 mx-auto mb-4 relative z-10"
          style={{ width:"100px"}}
          />
        
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="text-balance bg-gradient-to-b from-black to-neutral-500 dark:from-white dark:to-white/60 bg-clip-text py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-[-0.04em] text-transparent relative z-10 max-w-3xl">
          Plan Your Website Structure Visually
        </motion.h1>

        {/* Subheadline */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 mb-8 text-balance text-sm md:text-base tracking-tight text-neutral-600 dark:text-white/60 max-w-lg mx-auto relative z-10 leading-relaxed">
          Plan and analyze website structures and organize user-flow visually. Export JSON and PNG file — no signup required.
        </motion.p>

        {/* Single primary CTA + secondary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3 relative z-20">
          <Button onClick={() => navigate("/navigation-maker")} size="lg"
            className="gap-2 min-w-[260px] min-h-[52px] rounded-[0.625rem] bg-neutral-100 dark:hover:bg-white/50: text-neutral-900 hover:bg-white/90 font-semibold text-sm shadow-lg shadow-white/10">
            <Network className="h-4 w-4" /> Build sitemap
          </Button>
          <Button onClick={() => navigate("/analyzer")} variant="outline" size="lg"
            className="gap-2 min-w-[200px] min-h-[52px] rounded-[0.625rem] border border-neutral-300 text-neutral-800 dark:border-white/20 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 font-medium text-sm">
            <Globe className="h-4 w-4" /> Analyze any Website
          </Button>
        </motion.div>

        {/* Micro-trust indicators */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-600 dark:text-white/40 relative z-10">
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> Easy to Build</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> JSON + PNG export</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> 33+ SITEMAP templates</span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
        
        <img
          src={Heroimage}
          alt="Site mapping and user flow tool"
          classname="w-20 h-20 mx-auto mb-8 relative z-10"
          
          />
        
      

      {/* ═══════ HOW IT WORKS — 3 Steps ═══════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
              Your sitemap in 3 steps
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              No tutorials needed. Open, build, export.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Drag pages onto canvas", desc: "Pick from 60+ stock page types or add your own. Structure appears instantly.", icon: Grip },
              { step: "2", title: "Connect & arrange", desc: "Draw navigation flows between pages. Auto-layout keeps everything clean.", icon: GitBranch },
              { step: "3", title: "Export & ship", desc: "Download as HD PNG for decks or developer-ready JSON for your codebase.", icon: Download },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp}
                className="relative p-6 rounded-xl bg-card border border-border">
                <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-md bg-foreground text-background font-semibold text-xs flex items-center justify-center">
                  {item.step}
                </div>
                <item.icon className="h-5 w-5 mb-4 text-foreground" strokeWidth={1.5} />
                <h3 className="font-medium text-sm mb-1.5 text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LIVE DEMO — Navigation Maker Hero Feature ═══════ */}
      <section id="live-demo" className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-primary mb-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">✦ Flagship Tool</span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-[-0.03em] mb-4">
              Visual Sitemap Builder
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
                <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
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
                <div className="absolute top-8 left-[15%] w-28 h-10 rounded-lg bg-foreground text-background flex items-center justify-center text-[11px] font-medium shadow-sm">Home</div>
                <div className="absolute top-8 right-[15%] w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium text-foreground">Login</div>
                <div className="absolute top-[55%] left-[30%] w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium text-foreground">Dashboard</div>
                <div className="absolute top-[55%] right-[30%] w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium text-foreground">Products</div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[11px] font-medium text-foreground">Blog</div>
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
              <Network className="h-4 w-4" /> Try the Sitemap Builder <ArrowRight className="h-4 w-4" />
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
              Built for people who think in structure first.
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
                desc: "No layers, no panels, no learning curve. Create a professional sitemap in under 2 minutes.",
              },
              {
                icon: Shield,
                title: "Structure → Design → Ship",
                desc: "Plan your sitemap, test UX score, export and hand off to your developer. One workflow.",
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

      {/* ═══════ TRUST & SECURITY STRIP ═══════ */}
      <section className="py-12 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, label: "No Data Stored", desc: "Designs stay on your device" },
              { icon: Zap, label: "Instant Load", desc: "No signup required" },
              { icon: Globe, label: "Works Everywhere", desc: "Browser-based, any device" },
              { icon: CheckCircle, label: "Free Forever", desc: "Core features always free" },
            ].map((item, i) => (
              <motion.div key={item.label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="flex flex-col items-center gap-2">
                <item.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TOOLS STRIP ═══════ */}
      <section className="py-16 px-6 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold text-center mb-3 text-foreground tracking-tight">
            Explore Our Tools
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="text-muted-foreground text-center mb-10 max-w-lg mx-auto text-sm">
            Everything you need to plan, analyze, and build better websites.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Website Analyzer", desc: "Enter any domain and get a full architecture report with visual sitemap.", icon: Globe, href: "/analyzer" },
              { title: "Sitemap Library", desc: "Browse visual sitemaps of 30+ popular websites for inspiration.", icon: Layout, href: "/sitemaps" },
              { title: "Sitemap Builder", desc: "Build your website's navigation structure visually and export as JSON or PNG.", icon: Network, href: "/navigation-maker" },
            ].map((tool, i) => (
              <motion.div key={tool.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                onClick={() => navigate(tool.href)}
                className="group cursor-pointer bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <tool.icon className="h-6 w-6 text-primary mb-3" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{tool.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tool.desc}</p>
                <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Try it free <ArrowRight className="h-3 w-3" />
                </span>
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
                {["1 visual sitemap project", "Up to 10 pages per sitemap", "JSON Export", "Basic templates"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate("/navigation-maker")} variant="outline" className="w-full rounded-lg">
                Start Building Free
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
              <div className="text-3xl font-semibold text-foreground mb-1">₹299 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
              <p className="text-xs text-muted-foreground mb-6">or ₹1,500 lifetime</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited visual sitemaps",
                  "Unlimited pages per sitemap",
                  "PNG Export (HD)",
                  "UX Tester & Analyzer",
                  "Website Structure Library",
                  "Priority support",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate("/pricing-india")} className="w-full rounded-lg">
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
            Start building your sitemap now
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="text-muted-foreground mb-8 text-sm">
            No signup required. Try the builder instantly.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}>
            <Button onClick={() => navigate("/navigation-maker")} size="lg" className="gap-2 rounded-lg text-sm min-h-[48px] px-8">
              <Network className="h-4 w-4" /> Build Sitemap
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};
