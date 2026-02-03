import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Layer, TextLayer, ShapeLayer, BackgroundLayer } from "./types";

interface DesignMistake {
  id: string;
  severity: "warning" | "error";
  title: string;
  description: string;
  suggestion: string;
}

interface DesignMistakeDetectorProps {
  layers: Layer[];
  canvasWidth: number;
  canvasHeight: number;
  onDismiss?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

// Detect common design mistakes
const detectMistakes = (
  layers: Layer[],
  canvasWidth: number,
  canvasHeight: number
): DesignMistake[] => {
  const mistakes: DesignMistake[] = [];
  
  const textLayers = layers.filter((l) => l.type === "text" && l.visible) as TextLayer[];
  const shapeLayers = layers.filter((l) => l.type === "shape" && l.visible) as ShapeLayer[];
  const bgLayer = layers.find((l) => l.type === "background") as BackgroundLayer | undefined;
  const contentLayers = layers.filter((l) => l.type !== "background" && l.visible);
  
  const canvasArea = canvasWidth * canvasHeight;

  // 1. Check for elements outside canvas bounds
  contentLayers.forEach((layer) => {
    if (layer.x + layer.width < 0 || layer.x > canvasWidth ||
        layer.y + layer.height < 0 || layer.y > canvasHeight) {
      mistakes.push({
        id: `offscreen-${layer.id}`,
        severity: "warning",
        title: "Element off canvas",
        description: `"${layer.name}" is completely outside the visible area`,
        suggestion: "Move or delete this element, or resize your canvas",
      });
    }
  });

  // 2. Check for very small text
  textLayers.forEach((text) => {
    if (text.fontSize < 10) {
      mistakes.push({
        id: `small-text-${text.id}`,
        severity: "warning",
        title: "Text too small",
        description: `"${text.content.slice(0, 20)}..." is ${text.fontSize}px which may be unreadable`,
        suggestion: "Increase font size to at least 12px for readability",
      });
    }
  });

  // 3. Check for low contrast
  if (bgLayer && textLayers.length > 0) {
    const bgColor = bgLayer.backgroundColor?.toLowerCase();
    textLayers.forEach((text) => {
      const textColor = text.color.toLowerCase();
      
      // Simple contrast check (very light text on light bg or dark on dark)
      const isBgLight = bgColor?.includes("fff") || bgColor?.includes("faf") || bgColor?.includes("f8f");
      const isTextLight = textColor.includes("fff") || textColor.includes("faf") || textColor.includes("f8f");
      const isBgDark = bgColor?.includes("000") || bgColor?.includes("0a0") || bgColor?.includes("0f0") || bgColor?.includes("1a1");
      const isTextDark = textColor.includes("000") || textColor.includes("111") || textColor.includes("1a1");

      if ((isBgLight && isTextLight) || (isBgDark && isTextDark)) {
        mistakes.push({
          id: `contrast-${text.id}`,
          severity: "error",
          title: "Low contrast text",
          description: `"${text.content.slice(0, 20)}..." may be hard to read`,
          suggestion: "Use contrasting colors for text and background",
        });
      }
    });
  }

  // 4. Check for overcrowding
  const totalContentArea = contentLayers.reduce((sum, l) => sum + l.width * l.height, 0);
  const coverageRatio = totalContentArea / canvasArea;
  
  if (coverageRatio > 0.85) {
    mistakes.push({
      id: "overcrowded",
      severity: "warning",
      title: "Design may be overcrowded",
      description: `Content covers ${Math.round(coverageRatio * 100)}% of the canvas`,
      suggestion: "Add more whitespace or remove some elements",
    });
  }

  // 5. Check for empty canvas
  if (contentLayers.length === 0) {
    mistakes.push({
      id: "empty",
      severity: "warning",
      title: "Canvas is empty",
      description: "No content has been added to the design",
      suggestion: "Add text, shapes, or images to create your design",
    });
  }

  // 6. Check for overlapping text
  for (let i = 0; i < textLayers.length; i++) {
    for (let j = i + 1; j < textLayers.length; j++) {
      const a = textLayers[i];
      const b = textLayers[j];
      
      // Simple overlap check
      const overlap = !(
        a.x + a.width < b.x ||
        b.x + b.width < a.x ||
        a.y + a.height < b.y ||
        b.y + b.height < a.y
      );
      
      if (overlap) {
        mistakes.push({
          id: `overlap-${a.id}-${b.id}`,
          severity: "warning",
          title: "Overlapping text",
          description: `"${a.content.slice(0, 15)}..." overlaps with "${b.content.slice(0, 15)}..."`,
          suggestion: "Separate text elements to improve readability",
        });
      }
    }
  }

  // 7. Check for missing call-to-action (heuristic)
  const hasButton = shapeLayers.some((s) => 
    s.borderRadius && s.borderRadius > 0 && s.height < 80 && s.width < 300
  );
  const hasCtaText = textLayers.some((t) => 
    /^(get|buy|shop|start|try|sign|learn|download|subscribe|join)/i.test(t.content)
  );
  
  if (contentLayers.length > 5 && !hasButton && !hasCtaText) {
    mistakes.push({
      id: "no-cta",
      severity: "warning",
      title: "Consider adding a CTA",
      description: "Design has multiple elements but no clear call-to-action",
      suggestion: "Add a button or action-oriented text if this is promotional",
    });
  }

  return mistakes;
};

export const DesignMistakeDetector = ({
  layers,
  canvasWidth,
  canvasHeight,
  onDismiss,
  expanded = false,
  onToggleExpand,
  className,
}: DesignMistakeDetectorProps) => {
  const mistakes = useMemo(
    () => detectMistakes(layers, canvasWidth, canvasHeight),
    [layers, canvasWidth, canvasHeight]
  );

  const errorCount = mistakes.filter((m) => m.severity === "error").length;
  const warningCount = mistakes.filter((m) => m.severity === "warning").length;

  // Don't show if no mistakes
  if (mistakes.length === 0) {
    return (
      <div className={cn(
        "flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20",
        className
      )}>
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-sm font-medium text-green-600">No issues detected</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      errorCount > 0 
        ? "bg-destructive/5 border-destructive/20" 
        : "bg-amber-500/5 border-amber-500/20",
      className
    )}>
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn(
            "h-5 w-5",
            errorCount > 0 ? "text-destructive" : "text-amber-500"
          )} />
          <span className="text-sm font-medium">
            {mistakes.length} issue{mistakes.length > 1 ? "s" : ""} found
          </span>
          {errorCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {errorCount} error{errorCount > 1 ? "s" : ""}
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
              {warningCount} warning{warningCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Mistakes list */}
      {expanded && (
        <div className="p-3 pt-0 space-y-2">
          {mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className={cn(
                "p-3 rounded-md",
                mistake.severity === "error" 
                  ? "bg-destructive/10" 
                  : "bg-amber-500/10"
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0",
                  mistake.severity === "error" ? "text-destructive" : "text-amber-500"
                )} />
                <div>
                  <p className="text-sm font-medium">{mistake.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{mistake.description}</p>
                  <p className="text-xs mt-1 font-medium">
                    💡 {mistake.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <p className="text-xs text-muted-foreground text-center pt-2">
            These are suggestions only — you can still export your design
          </p>
        </div>
      )}
    </div>
  );
};

// Export detection function
export { detectMistakes };
export type { DesignMistake };
