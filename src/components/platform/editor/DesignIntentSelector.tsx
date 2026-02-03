import { cn } from "@/lib/utils";
import { Eye, Shield, Zap, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DesignIntent = "attention" | "trust" | "urgency";

interface DesignIntentOption {
  id: DesignIntent;
  label: string;
  description: string;
  icon: React.ElementType;
  colorClasses: string;
  examples: string[];
}

const intents: DesignIntentOption[] = [
  {
    id: "attention",
    label: "Attention",
    description: "Eye-catching, bold, memorable",
    icon: Eye,
    colorClasses: "bg-purple-500/10 text-purple-600 border-purple-500/30 hover:bg-purple-500/20",
    examples: ["Bold colors", "Large typography", "High contrast"],
  },
  {
    id: "trust",
    label: "Trust",
    description: "Professional, credible, reliable",
    icon: Shield,
    colorClasses: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20",
    examples: ["Clean layout", "Balanced design", "Subtle colors"],
  },
  {
    id: "urgency",
    label: "Urgency",
    description: "Action-driven, time-sensitive",
    icon: Zap,
    colorClasses: "bg-orange-500/10 text-orange-600 border-orange-500/30 hover:bg-orange-500/20",
    examples: ["Red/Orange accents", "Bold CTAs", "Dynamic shapes"],
  },
];

interface DesignIntentSelectorProps {
  value: DesignIntent | null;
  onChange: (intent: DesignIntent | null) => void;
  locked?: boolean;
  onLockChange?: (locked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const DesignIntentSelector = ({
  value,
  onChange,
  locked = false,
  onLockChange,
  disabled = false,
  className,
}: DesignIntentSelectorProps) => {
  const selectedIntent = intents.find((i) => i.id === value);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Design Intent</span>
          {locked && value && (
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>
        
        {value && onLockChange && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onLockChange(!locked)}
                  disabled={disabled}
                >
                  {locked ? (
                    <Lock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {locked ? "Unlock intent (allows changes)" : "Lock intent (prevents changes)"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Choose one intent to guide your design decisions
      </p>

      <div className="grid grid-cols-3 gap-2">
        {intents.map((intent) => {
          const isSelected = value === intent.id;
          const Icon = intent.icon;

          return (
            <TooltipProvider key={intent.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex flex-col items-center gap-1.5 h-auto py-3 px-2 transition-all",
                      isSelected && intent.colorClasses,
                      isSelected && "ring-2 ring-offset-1",
                      locked && !isSelected && "opacity-50",
                      !isSelected && "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      if (locked && isSelected) return;
                      onChange(isSelected ? null : intent.id);
                    }}
                    disabled={disabled || (locked && !isSelected)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{intent.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-medium">{intent.label}</p>
                  <p className="text-xs text-muted-foreground mb-2">{intent.description}</p>
                  <ul className="text-xs space-y-0.5">
                    {intent.examples.map((ex) => (
                      <li key={ex}>• {ex}</li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {selectedIntent && (
        <div className={cn(
          "p-3 rounded-lg border text-sm",
          selectedIntent.colorClasses.replace("hover:bg-", "")
        )}>
          <div className="flex items-center gap-2 mb-1">
            <selectedIntent.icon className="h-4 w-4" />
            <span className="font-medium">{selectedIntent.label} Intent Active</span>
          </div>
          <p className="text-xs opacity-80">{selectedIntent.description}</p>
        </div>
      )}
    </div>
  );
};

// Get design recommendations based on intent
export const getIntentRecommendations = (intent: DesignIntent) => {
  const recommendations: Record<DesignIntent, {
    colors: string[];
    fontSizes: { headline: number; body: number };
    contrast: "high" | "medium" | "low";
    shapes: string[];
  }> = {
    attention: {
      colors: ["#7c3aed", "#ec4899", "#f97316", "#fbbf24"],
      fontSizes: { headline: 72, body: 20 },
      contrast: "high",
      shapes: ["circle", "triangle"],
    },
    trust: {
      colors: ["#1e40af", "#0f766e", "#374151", "#f8fafc"],
      fontSizes: { headline: 48, body: 16 },
      contrast: "medium",
      shapes: ["rectangle", "line"],
    },
    urgency: {
      colors: ["#dc2626", "#f97316", "#fbbf24", "#000000"],
      fontSizes: { headline: 64, body: 18 },
      contrast: "high",
      shapes: ["arrow", "triangle"],
    },
  };

  return recommendations[intent];
};
