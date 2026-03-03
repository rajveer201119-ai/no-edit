import {
  Sparkles, Zap, Download, Smartphone, Shield, Star, Users, Palette, ArrowRight, Flame, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LandingCredibilityProps {
  onStartDesigning: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const stats = [
  { value: "280+", label: "Active Users" },
  { value: "15+", label: "Countries" },
  { value: "1K+", label: "Sitemaps Created" },
  { value: "Free", label: "To Start" },
];

const processSteps = [
  { step: "1", title: "Describe or Drag", description: "Pick pages from the sidebar or type your own. Structure appears instantly.", icon: Palette },
  { step: "2", title: "Connect & Arrange", description: "Draw navigation flows. EPIC auto-layouts and keeps everything clean.", icon: Sparkles },
  { step: "3", title: "Export & Ship", description: "Download as HD PNG or developer-ready JSON. Plug into any builder.", icon: Download },
];

export const LandingCredibility = ({ onStartDesigning }: LandingCredibilityProps) => {
  return (
    <div className="relative py-16 md:py-24">
      {/* Stats bar */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="rounded-xl p-8 md:p-10 border border-border bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Process Steps — How It Works */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
            Your sitemap in 3 steps
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            No tutorials needed. Just open, build, export.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {processSteps.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={Number(item.step)} variants={fadeUp}
                className="relative p-6 rounded-xl bg-card border border-border">
                <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-md bg-foreground text-background font-semibold text-xs flex items-center justify-center">
                  {item.step}
                </div>
                <Icon className="h-5 w-5 mb-4 text-foreground" strokeWidth={1.5} />
                <h3 className="font-medium text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Social Proof — Featured Quote */}
      <section className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="text-center p-8 md:p-10 rounded-xl bg-muted/20 border border-border">
          <div className="flex justify-center gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
            ))}
          </div>
          <p className="text-base md:text-lg font-medium mb-4 max-w-xl mx-auto leading-relaxed">
            "We planned our entire SaaS in EPIC before writing any code. The JSON export saved our team hours of architecture meetings."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium text-xs">Hundreds of builders</p>
              <p className="text-[10px] text-muted-foreground">Already using EPIC</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
