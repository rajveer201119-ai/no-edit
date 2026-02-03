import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, X, Palette, Type, Layout, ChevronDown, ChevronUp } from "lucide-react";
import type { Layer, BackgroundLayer, TextLayer, ShapeLayer } from "./types";
import type { DesignIntent } from "./DesignIntentSelector";

interface AIReasoningOverlayProps {
  layers: Layer[];
  designIntent?: DesignIntent | null;
  prompt?: string;
  className?: string;
}

interface ReasoningPoint {
  category: "color" | "typography" | "layout";
  title: string;
  explanation: string;
}

// Generate reasoning based on the actual design elements
const generateReasoning = (
  layers: Layer[],
  intent?: DesignIntent | null,
  prompt?: string
): ReasoningPoint[] => {
  const reasoning: ReasoningPoint[] = [];
  
  const bgLayer = layers.find((l) => l.type === "background") as BackgroundLayer | undefined;
  const textLayers = layers.filter((l) => l.type === "text") as TextLayer[];
  const shapeLayers = layers.filter((l) => l.type === "shape") as ShapeLayer[];

  // Color reasoning
  if (bgLayer?.backgroundColor) {
    const color = bgLayer.backgroundColor.toLowerCase();
    let colorReason = "The background provides a foundation for the design.";
    
    if (color.includes("0a") || color.includes("0f") || color === "#000000" || color.includes("1a") || color.includes("18")) {
      colorReason = "Dark backgrounds create depth and make lighter elements pop, ideal for modern, dramatic designs.";
    } else if (color === "#ffffff" || color === "#fafafa" || color === "#f8fafc") {
      colorReason = "White/light backgrounds convey cleanliness and professionalism, letting content take center stage.";
    } else if (color.includes("3b82f6") || color.includes("1e40af")) {
      colorReason = "Blue tones evoke trust and reliability, commonly used in corporate and tech designs.";
    } else if (color.includes("dc2626") || color.includes("ef4444")) {
      colorReason = "Red backgrounds create urgency and energy, perfect for sales and action-oriented designs.";
    } else if (color.includes("7c3aed") || color.includes("8b5cf6")) {
      colorReason = "Purple suggests creativity and premium quality, often used in innovative brands.";
    }
    
    reasoning.push({
      category: "color",
      title: "Background Choice",
      explanation: colorReason,
    });
  }

  // Typography reasoning
  if (textLayers.length > 0) {
    const fontSizes = textLayers.map((t) => t.fontSize);
    const maxSize = Math.max(...fontSizes);
    const minSize = Math.min(...fontSizes);
    const hasHierarchy = maxSize / minSize > 1.5;

    if (hasHierarchy) {
      reasoning.push({
        category: "typography",
        title: "Type Hierarchy",
        explanation: `Clear size contrast (${minSize}px to ${maxSize}px) creates visual hierarchy, guiding the viewer's eye from headlines to details.`,
      });
    } else {
      reasoning.push({
        category: "typography",
        title: "Typography Scale",
        explanation: "Consistent text sizing creates unity. Consider varying sizes for more visual interest if appropriate.",
      });
    }

    // Font weight reasoning
    const hasBoldText = textLayers.some((t) => t.fontWeight === "bold" || t.fontWeight === "700");
    if (hasBoldText) {
      reasoning.push({
        category: "typography",
        title: "Bold Text Usage",
        explanation: "Bold typography adds emphasis and draws attention to key messages, improving scannability.",
      });
    }
  }

  // Layout reasoning
  const contentLayers = layers.filter((l) => l.type !== "background");
  if (contentLayers.length > 0) {
    // Check if elements are aligned
    const xPositions = contentLayers.map((l) => l.x);
    const hasVerticalAlignment = new Set(xPositions).size < contentLayers.length;
    
    if (hasVerticalAlignment) {
      reasoning.push({
        category: "layout",
        title: "Vertical Alignment",
        explanation: "Elements share common left edges, creating a clean visual line that improves readability and professional appearance.",
      });
    }

    // Check spacing
    if (shapeLayers.length > 0) {
      reasoning.push({
        category: "layout",
        title: "Shape Elements",
        explanation: "Decorative shapes add visual interest and can be used to highlight, contain, or separate content areas.",
      });
    }
  }

  // Intent-based reasoning
  if (intent) {
    const intentReasons: Record<DesignIntent, string> = {
      attention: "Design elements are optimized for maximum visual impact — bold colors and high contrast capture immediate attention.",
      trust: "Clean layouts and balanced compositions build credibility and professional appearance.",
      urgency: "Dynamic elements and warm colors create a sense of immediacy, motivating quick action.",
    };
    
    reasoning.push({
      category: "layout",
      title: `${intent.charAt(0).toUpperCase() + intent.slice(1)} Intent`,
      explanation: intentReasons[intent],
    });
  }

  return reasoning;
};

export const AIReasoningOverlay = ({
  layers,
  designIntent,
  prompt,
  className,
}: AIReasoningOverlayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const reasoning = generateReasoning(layers, designIntent, prompt);

  if (reasoning.length === 0) return null;

  const categoryIcons = {
    color: Palette,
    typography: Type,
    layout: Layout,
  };

  const categoryColors = {
    color: "text-purple-500 bg-purple-500/10",
    typography: "text-blue-500 bg-blue-500/10",
    layout: "text-green-500 bg-green-500/10",
  };

  return (
    <div className={cn("bg-card/80 backdrop-blur-sm rounded-lg border border-border overflow-hidden", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-sm font-medium">Why This Design Works</span>
          <Badge variant="outline" className="text-xs">AI Analysis</Badge>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {reasoning.map((point, index) => {
            const Icon = categoryIcons[point.category];
            
            return (
              <div key={index} className="flex gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  categoryColors[point.category]
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{point.title}</p>
                  <p className="text-xs text-muted-foreground">{point.explanation}</p>
                </div>
              </div>
            );
          })}

          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border/50">
            This analysis is based on design principles applied to your current canvas elements.
          </p>
        </div>
      )}
    </div>
  );
};

// Toggle component for enabling/disabling AI reasoning
interface AIReasoningToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export const AIReasoningToggle = ({ enabled, onChange, className }: AIReasoningToggleProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Switch
        id="ai-reasoning"
        checked={enabled}
        onCheckedChange={onChange}
      />
      <Label htmlFor="ai-reasoning" className="text-sm cursor-pointer">
        Show AI Reasoning
      </Label>
    </div>
  );
};
