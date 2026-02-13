import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import epicLogo from "@/assets/epic-logo.png";
import { Zap, Layers, Download, Sparkles, Palette, Type, Image, Layout, Wand2, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NewHomepageProps {
  onStartDesigning: () => void;
  onBrowseInspiration: () => void;
  onAIModeClick?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Layers, title: "200+ Templates", desc: "Professional designs for every occasion" },
  { icon: Type, title: "Smart Text Engine", desc: "Auto-fit, auto-contrast, beautiful typography" },
  { icon: Image, title: "Elements Library", desc: "Icons, shapes, badges, frames & more" },
  { icon: Download, title: "HD Export", desc: "Download in PNG, JPG, PDF instantly" },
  { icon: Layout, title: "Smart Resize", desc: "One-click resize to any social format" },
  { icon: Wand2, title: "AI Mode", desc: "Generate designs with AI prompts" },
];

const testimonials = [
  { name: "Priya S.", role: "Social Media Manager", text: "EPIC replaced Canva for my entire workflow. The templates are stunning!", rating: 5 },
  { name: "Rahul M.", role: "Startup Founder", text: "I created our pitch deck, business cards, and social posts in 30 minutes.", rating: 5 },
  { name: "Ananya K.", role: "Student", text: "Perfect for college projects. The certificate and poster templates saved me hours.", rating: 5 },
];

const showcaseCategories = [
  { label: "Posters", color: "from-purple-500 to-pink-500" },
  { label: "Certificates", color: "from-amber-500 to-orange-500" },
  { label: "Social Media", color: "from-blue-500 to-cyan-500" },
  { label: "Thumbnails", color: "from-red-500 to-rose-500" },
  { label: "Business Cards", color: "from-emerald-500 to-teal-500" },
  { label: "Presentations", color: "from-violet-500 to-purple-500" },
  { label: "Resumes", color: "from-slate-500 to-zinc-500" },
  { label: "Festival Designs", color: "from-yellow-500 to-amber-500" },
];

export const NewHomepage = ({ onStartDesigning, onBrowseInspiration, onAIModeClick }: NewHomepageProps) => {
  return (
    <div className="w-full">
      {/* ===== HERO ===== */}
      <section className="relative mx-auto w-full pt-24 md:pt-40 px-6 text-center min-h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 -z-20"><WebGLShader /></div>
        <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-sm" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.03] to-transparent" />

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="flex justify-center mb-6 relative z-10">
          <img src={epicLogo} alt="EPIC Design Generator" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl" width={128} height={128} loading="eager" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-balance bg-gradient-to-br from-white from-30% to-white/60 bg-clip-text py-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-transparent relative z-10 max-w-3xl">
          Design in seconds — with or without AI
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4 mb-8 text-balance text-base md:text-lg tracking-tight text-gray-300 max-w-xl mx-auto relative z-10">
          Create stunning posters, logos, and social graphics. 200+ templates. No design skills needed.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-4 relative z-20">
          {onAIModeClick && (
            <Button onClick={onAIModeClick} className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white min-w-[200px] min-h-[48px] rounded-full text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 active:scale-95">
              <Zap className="h-5 w-5" /> ⚡ AI Mode
            </Button>
          )}
          <LiquidButton className="text-foreground border rounded-full min-w-[200px] min-h-[48px] cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200" size="xl" onClick={onStartDesigning}>
            Start Designing
          </LiquidButton>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ===== SHOWCASE CATEGORIES ===== */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-2xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Create Anything You Imagine
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            From social media posts to professional presentations — EPIC has you covered.
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showcaseCategories.map((cat, i) => (
              <motion.div key={cat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                onClick={onStartDesigning}
                className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/3]">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg md:text-xl drop-shadow-lg">{cat.label}</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-2xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Everything You Need to Design
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Powerful features that make EPIC the easiest design tool on the planet.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-2xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Loved by Creators
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-2xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Create Something Amazing?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="text-muted-foreground mb-8">
            Join thousands of creators already using EPIC. Free to start.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}>
            <Button onClick={onStartDesigning} size="lg" className="gap-2 rounded-full text-base min-h-[48px] px-8 bg-primary hover:bg-primary/90">
              Start Designing Free <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
