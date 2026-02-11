import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MousePointer2,
  Type,
  ImageIcon,
  Shapes,
  Upload,
  Layers,
  ZoomIn,
  Download,
  ChevronRight,
  X,
  Lightbulb,
} from "lucide-react";

const ONBOARDING_KEY = "epic_onboarding_seen_v2";

interface OnboardingStep {
  icon: React.ElementType;
  title: string;
  description: string;
  tip: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: MousePointer2,
    title: "Select & Move",
    description: "Click any element to select it. Drag to move, use corner handles to resize.",
    tip: "Hold Shift to select multiple elements",
  },
  {
    icon: Type,
    title: "Add Text",
    description: "Click the Text tool, then click anywhere on canvas to place text. Double-click to edit.",
    tip: "Use the side panel to change fonts, size, and color",
  },
  {
    icon: Shapes,
    title: "Add Shapes",
    description: "Choose from rectangles, circles, triangles, lines, and arrows.",
    tip: "Shapes are great for backgrounds, dividers, and accents",
  },
  {
    icon: Upload,
    title: "Upload Images",
    description: "Click Upload to add your own photos and logos to the design.",
    tip: "Drag images to position them perfectly",
  },
  {
    icon: Layers,
    title: "Manage Layers",
    description: "Click the Layers button to see all elements. Reorder, lock, or hide layers.",
    tip: "Right-click brings up layer options",
  },
  {
    icon: ZoomIn,
    title: "Zoom & Navigate",
    description: "Use +/- buttons or Ctrl+Scroll to zoom. Press 100% to fit the canvas.",
    tip: "Keyboard: Ctrl+Z to undo, Ctrl+Shift+Z to redo",
  },
  {
    icon: Download,
    title: "Export Your Design",
    description: "Click Export to download as PNG, JPG, or PDF. Use 'Size Pack' for multiple sizes.",
    tip: "Your work auto-saves every few seconds!",
  },
];

export const OnboardingGuide = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      // Show after a short delay so the UI is ready
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  if (!show) return null;

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="relative pointer-events-auto bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step indicator */}
        <div className="flex gap-1 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg">{current.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{current.description}</p>
            <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
              <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-primary">{current.tip}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-muted-foreground">
            {step + 1} of {STEPS.length}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={dismiss}>
              Skip
            </Button>
            <Button size="sm" onClick={next} className="gap-1">
              {step < STEPS.length - 1 ? (
                <>
                  Next <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                "Get Started!"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button to re-open guide
export const OnboardingTrigger = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => {
      localStorage.removeItem(ONBOARDING_KEY);
      onClick();
    }}
    className="gap-1.5 text-xs"
    title="How to use"
  >
    <Lightbulb className="h-3.5 w-3.5" />
    <span className="hidden md:inline">Guide</span>
  </Button>
);
