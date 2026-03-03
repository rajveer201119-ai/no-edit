import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, FileJson, MousePointerClick, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "epic_onboarding_seen";

const steps = [
  {
    icon: Network,
    title: "Welcome to EPIC",
    body: "Plan your website's structure visually — drag pages, connect navigation flows, and export developer-ready sitemaps.",
  },
  {
    icon: FileJson,
    title: "Why Visual Sitemaps?",
    body: "See your entire website architecture at a glance. Spot missing pages, fix broken flows, and align your team — before writing code.",
  },
  {
    icon: MousePointerClick,
    title: "Start Here",
    body: "Click \"Create Your Sitemap\" in the hero, or open the Navigation Maker from the menu. Your first sitemap takes under 2 minutes.",
  },
];

export const OnboardingOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(ONBOARDING_KEY, "1");
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        onClick={dismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-2xl"
        >
          <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>

          {/* Step indicator */}
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">{current.body}</p>

          <div className="flex items-center justify-between">
            <button onClick={dismiss} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Skip
            </button>
            <Button onClick={next} size="sm" className="gap-1.5 rounded-lg">
              {step < steps.length - 1 ? "Next" : "Get Started"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
