import { cn } from "@/lib/utils";
import { DesignType } from "./ImageGenerator";
import { Palette, Share2, LayoutTemplate, FileImage } from "lucide-react";

interface DesignTypeSelectorProps {
  value: DesignType;
  onChange: (type: DesignType) => void;
  disabled?: boolean;
}

const designTypes: { value: DesignType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "logo", label: "Logo", icon: <Palette className="h-4 w-4" />, description: "Brand identity" },
  { value: "social", label: "Social Post", icon: <Share2 className="h-4 w-4" />, description: "Social media" },
  { value: "banner", label: "Banner", icon: <LayoutTemplate className="h-4 w-4" />, description: "Web headers" },
  { value: "poster", label: "Poster", icon: <FileImage className="h-4 w-4" />, description: "Print design" },
];

export const DesignTypeSelector = ({ value, onChange, disabled }: DesignTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium gradient-epic-text">Design Type</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {designTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5",
              value === type.value
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border/30 bg-card/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              value === type.value ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
            )}>
              {type.icon}
            </div>
            <span className={cn(
              "text-xs font-medium transition-colors",
              value === type.value ? "text-primary" : "text-foreground"
            )}>
              {type.label}
            </span>
            <span className="text-[10px] text-muted-foreground">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
