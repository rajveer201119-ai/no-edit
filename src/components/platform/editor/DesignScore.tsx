import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Eye, Contrast, Layout, Palette, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Layer, TextLayer, ShapeLayer, BackgroundLayer } from "./types";

interface DesignScoreProps {
  layers: Layer[];
  canvasWidth: number;
  canvasHeight: number;
  className?: string;
}

interface ScoreBreakdown {
  readability: number;
  contrast: number;
  balance: number;
  harmony: number;
  overall: number;
}

// Utility to parse color to RGB
const parseColor = (color: string): { r: number; g: number; b: number } | null => {
  if (!color) return null;
  
  // Handle hex colors
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }
  
  // Handle rgb/rgba
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
  }
  
  return null;
};

// Calculate relative luminance for WCAG contrast
const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Calculate contrast ratio between two colors
const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  if (!rgb1 || !rgb2) return 4.5; // Default to passing
  
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Calculate design score
const calculateScore = (
  layers: Layer[],
  canvasWidth: number,
  canvasHeight: number
): ScoreBreakdown | null => {
  if (layers.length === 0) return null;

  const textLayers = layers.filter((l) => l.type === "text") as TextLayer[];
  const shapeLayers = layers.filter((l) => l.type === "shape") as ShapeLayer[];
  const bgLayer = layers.find((l) => l.type === "background") as BackgroundLayer | undefined;
  
  const bgColor = bgLayer?.backgroundColor || "#ffffff";
  const canvasArea = canvasWidth * canvasHeight;

  // 1. Readability Score (based on font sizes)
  let readabilityScore = 100;
  if (textLayers.length > 0) {
    const fontSizes = textLayers.map((t) => t.fontSize);
    const avgFontSize = fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length;
    const minFontSize = Math.min(...fontSizes);
    
    // Penalize very small fonts
    if (minFontSize < 12) readabilityScore -= 30;
    else if (minFontSize < 14) readabilityScore -= 15;
    
    // Penalize if average is too small for the canvas size
    const expectedMinFont = Math.max(14, canvasWidth / 80);
    if (avgFontSize < expectedMinFont) {
      readabilityScore -= 20;
    }
  } else {
    readabilityScore = 80; // No text is neutral
  }

  // 2. Contrast Score (WCAG-based)
  let contrastScore = 100;
  if (textLayers.length > 0) {
    const contrastRatios = textLayers.map((t) => getContrastRatio(t.color, bgColor));
    const avgContrast = contrastRatios.reduce((a, b) => a + b, 0) / contrastRatios.length;
    const minContrast = Math.min(...contrastRatios);
    
    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    if (minContrast < 3) contrastScore -= 40;
    else if (minContrast < 4.5) contrastScore -= 20;
    else if (avgContrast >= 7) contrastScore = 100; // AAA level
  }

  // 3. Balance Score (layout distribution)
  let balanceScore = 100;
  const contentLayers = layers.filter((l) => l.type !== "background" && l.visible);
  
  if (contentLayers.length > 0) {
    // Calculate center of mass
    let totalWeight = 0;
    let weightedX = 0;
    let weightedY = 0;
    
    contentLayers.forEach((layer) => {
      const area = layer.width * layer.height;
      const centerX = layer.x + layer.width / 2;
      const centerY = layer.y + layer.height / 2;
      
      weightedX += centerX * area;
      weightedY += centerY * area;
      totalWeight += area;
    });
    
    if (totalWeight > 0) {
      const comX = weightedX / totalWeight;
      const comY = weightedY / totalWeight;
      
      // Ideal center
      const idealX = canvasWidth / 2;
      const idealY = canvasHeight / 2;
      
      // Calculate offset from center (normalized)
      const offsetX = Math.abs(comX - idealX) / idealX;
      const offsetY = Math.abs(comY - idealY) / idealY;
      
      // Some offset is fine (asymmetry can be good)
      if (offsetX > 0.4 || offsetY > 0.4) balanceScore -= 30;
      else if (offsetX > 0.25 || offsetY > 0.25) balanceScore -= 15;
    }
    
    // Check for overcrowding
    const totalContentArea = contentLayers.reduce((sum, l) => sum + l.width * l.height, 0);
    const coverageRatio = totalContentArea / canvasArea;
    
    if (coverageRatio > 0.9) balanceScore -= 25; // Too crowded
    else if (coverageRatio < 0.1) balanceScore -= 15; // Too empty
  }

  // 4. Color Harmony Score
  let harmonyScore = 100;
  const allColors: string[] = [];
  
  if (bgLayer?.backgroundColor) allColors.push(bgLayer.backgroundColor);
  textLayers.forEach((t) => allColors.push(t.color));
  shapeLayers.forEach((s) => {
    if (s.fillColor && s.fillColor !== "transparent") allColors.push(s.fillColor);
  });
  
  // Penalize too many colors (chaos)
  const uniqueColors = new Set(allColors.map((c) => c.toLowerCase()));
  if (uniqueColors.size > 6) harmonyScore -= 20;
  else if (uniqueColors.size > 8) harmonyScore -= 40;
  
  // Calculate overall score (weighted average)
  const overall = Math.round(
    readabilityScore * 0.25 +
    contrastScore * 0.30 +
    balanceScore * 0.25 +
    harmonyScore * 0.20
  );

  return {
    readability: Math.max(0, Math.min(100, Math.round(readabilityScore))),
    contrast: Math.max(0, Math.min(100, Math.round(contrastScore))),
    balance: Math.max(0, Math.min(100, Math.round(balanceScore))),
    harmony: Math.max(0, Math.min(100, Math.round(harmonyScore))),
    overall: Math.max(0, Math.min(100, overall)),
  };
};

// Get score color based on value
const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
};

// Get score label
const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Poor";
};

export const DesignScore = ({ layers, canvasWidth, canvasHeight, className }: DesignScoreProps) => {
  const score = useMemo(
    () => calculateScore(layers, canvasWidth, canvasHeight),
    [layers, canvasWidth, canvasHeight]
  );

  // Don't show if no score can be calculated
  if (!score || score.overall === 0) return null;

  const metrics = [
    { label: "Readability", value: score.readability, icon: Eye },
    { label: "Contrast", value: score.contrast, icon: Contrast },
    { label: "Balance", value: score.balance, icon: Layout },
    { label: "Harmony", value: score.harmony, icon: Palette },
  ];

  return (
    <div className={cn("bg-card/80 backdrop-blur-sm rounded-lg border border-border p-4 space-y-4", className)}>
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Design Score</p>
          <p className={cn("text-3xl font-bold", getScoreColor(score.overall))}>
            {score.overall}
            <span className="text-base font-normal text-muted-foreground">/100</span>
          </p>
          <p className="text-sm text-muted-foreground">{getScoreLabel(score.overall)}</p>
        </div>
        
        <div className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center",
          score.overall >= 70 
            ? "bg-green-500/10 text-green-500" 
            : score.overall >= 50 
              ? "bg-amber-500/10 text-amber-500"
              : "bg-red-500/10 text-red-500"
        )}>
          {score.overall >= 70 ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <AlertTriangle className="h-7 w-7" />
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3">
            <metric.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{metric.label}</span>
                <span className={cn("text-xs font-bold", getScoreColor(metric.value))}>
                  {metric.value}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    metric.value >= 80 ? "bg-green-500" : metric.value >= 60 ? "bg-amber-500" : "bg-red-500"
                  )}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export calculation function for external use
export { calculateScore };
export type { ScoreBreakdown };
