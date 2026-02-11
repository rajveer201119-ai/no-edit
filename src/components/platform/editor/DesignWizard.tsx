import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Maximize2,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Download,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Template, TemplateElement } from "../templates";
import { getContrastTextColor } from "./AutoContrastEngine";

interface DesignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (template: Template) => void;
}

const SIZES = [
  { label: "Instagram Post", w: 1080, h: 1080, icon: "1:1" },
  { label: "Instagram Story", w: 1080, h: 1920, icon: "9:16" },
  { label: "YouTube Thumbnail", w: 1280, h: 720, icon: "16:9" },
  { label: "Poster", w: 800, h: 1200, icon: "2:3" },
  { label: "Logo", w: 800, h: 800, icon: "1:1" },
  { label: "Presentation", w: 1920, h: 1080, icon: "16:9" },
];

const BG_COLORS = [
  "#0f172a", "#1e293b", "#18181b", "#0c0a09",
  "#ffffff", "#fafafa", "#f8fafc", "#fef3c7",
  "#dc2626", "#7c3aed", "#2563eb", "#059669",
  "#ec4899", "#f97316", "#eab308", "#14b8a6",
];

const STEPS = [
  { title: "Choose Size", icon: Maximize2 },
  { title: "Add Title", icon: Type },
  { title: "Pick Background", icon: ImageIcon },
  { title: "Add CTA", icon: MousePointerClick },
  { title: "Generate", icon: Download },
];

export const DesignWizard = ({ open, onOpenChange, onComplete }: DesignWizardProps) => {
  const [step, setStep] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [title, setTitle] = useState("Your Title Here");
  const [subtitle, setSubtitle] = useState("Add your message");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [ctaText, setCtaText] = useState("Learn More →");

  const progress = ((step + 1) / STEPS.length) * 100;
  const size = SIZES[selectedSize];

  const handleComplete = () => {
    const textColor = getContrastTextColor(bgColor);
    const isVertical = size.h > size.w;
    const titleSize = Math.round(size.w * 0.08);
    const subSize = Math.round(size.w * 0.03);
    const ctaSize = Math.round(size.w * 0.025);

    const elements: TemplateElement[] = [
      { id: "bg", type: "shape", x: 0, y: 0, width: size.w, height: size.h, backgroundColor: bgColor },
      {
        id: "title", type: "text",
        x: size.w * 0.08, y: isVertical ? size.h * 0.25 : size.h * 0.2,
        width: size.w * 0.84, height: titleSize * 3,
        content: title, fontSize: titleSize, fontWeight: "bold", color: textColor,
      },
      {
        id: "subtitle", type: "text",
        x: size.w * 0.08, y: isVertical ? size.h * 0.45 : size.h * 0.5,
        width: size.w * 0.84, height: subSize * 3,
        content: subtitle, fontSize: subSize, color: textColor,
      },
      {
        id: "cta-bg", type: "shape",
        x: size.w * 0.08, y: isVertical ? size.h * 0.7 : size.h * 0.72,
        width: size.w * 0.4, height: ctaSize * 3,
        backgroundColor: textColor, borderRadius: ctaSize,
      },
      {
        id: "cta", type: "text",
        x: size.w * 0.12, y: isVertical ? size.h * 0.71 : size.h * 0.735,
        width: size.w * 0.32, height: ctaSize * 2,
        content: ctaText, fontSize: ctaSize, fontWeight: "bold",
        color: bgColor,
      },
      {
        id: "accent", type: "shape",
        x: size.w * 0.08, y: isVertical ? size.h * 0.6 : size.h * 0.64,
        width: size.w * 0.15, height: 4,
        backgroundColor: textColor,
      },
    ];

    const template: Template = {
      id: `wizard-${Date.now()}`,
      name: title.slice(0, 30),
      category: "custom" as any,
      thumbnailUrl: "",
      canvasWidth: size.w,
      canvasHeight: size.h,
      elements,
    };

    onComplete(template);
    onOpenChange(false);
    toast.success("🎨 Design created! Customize it your way.");
    
    // Reset
    setStep(0);
    setTitle("Your Title Here");
    setSubtitle("Add your message");
    setBgColor("#0f172a");
    setCtaText("Learn More →");
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-3">
            {SIZES.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSelectedSize(i)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  selectedSize === i
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                )}
              >
                <div className="text-xs font-bold text-muted-foreground mb-1">{s.icon}</div>
                <div className="font-semibold text-sm">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.w}×{s.h}</div>
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your Title Here"
                className="text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subtitle</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add your message"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium block">Background Color</label>
            <div className="grid grid-cols-8 gap-2">
              {BG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 transition-all",
                    bgColor === color ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border/30"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-full cursor-pointer"
            />
            {/* Preview */}
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: bgColor, color: getContrastTextColor(bgColor) }}
            >
              <p className="font-bold text-lg">{title}</p>
              <p className="text-sm opacity-80">{subtitle}</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium block">Call to Action</label>
            <Input
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Learn More →"
            />
            <div className="flex gap-2 flex-wrap">
              {["Learn More →", "Shop Now", "Get Started", "Contact Us", "Sign Up Free", "Download App"].map((t) => (
                <Button
                  key={t}
                  variant={ctaText === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCtaText(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
            <h3 className="font-bold text-lg">Ready to Generate!</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Size:</strong> {size.label} ({size.w}×{size.h})</p>
              <p><strong>Title:</strong> {title}</p>
              <p><strong>CTA:</strong> {ctaText}</p>
            </div>
            <div
              className="rounded-xl p-6 mx-auto max-w-xs"
              style={{ backgroundColor: bgColor, color: getContrastTextColor(bgColor) }}
            >
              <p className="font-bold">{title}</p>
              <p className="text-xs opacity-70 mt-1">{subtitle}</p>
              <div
                className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: getContrastTextColor(bgColor), color: bgColor }}
              >
                {ctaText}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Design Wizard — Step {step + 1}/{STEPS.length}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <Progress value={progress} className="h-2" />

        {/* Step Indicators */}
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                onClick={() => i <= step && setStep(i)}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs transition-all",
                  i <= step ? "text-primary" : "text-muted-foreground/40",
                  i < step && "cursor-pointer"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="py-4 min-h-[200px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="gap-1">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-1">
              <Sparkles className="h-4 w-4" />
              Generate Design
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
