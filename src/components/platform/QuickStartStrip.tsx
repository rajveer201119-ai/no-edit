import { cn } from "@/lib/utils";
import { FileText, Instagram, Youtube, Hexagon } from "lucide-react";
import type { DesignCategory } from "./DesignTypeModal";

interface QuickStartStripProps {
  onSelect: (category: DesignCategory) => void;
  activeCategory?: DesignCategory;
}

const quickCategories = [
  { id: "poster" as const, label: "Poster", icon: FileText },
  { id: "instagram" as const, label: "Instagram Ad", icon: Instagram },
  { id: "youtube" as const, label: "Thumbnail", icon: Youtube },
  { id: "logo" as const, label: "Logo", icon: Hexagon },
];

export const QuickStartStrip = ({ onSelect, activeCategory }: QuickStartStripProps) => {
  return (
    <div className="fixed top-28 left-14 right-0 h-12 bg-muted/30 backdrop-blur-sm border-b border-border/20 z-20">
      <div className="flex items-center gap-2 h-full px-4 overflow-x-auto">
        <span className="text-xs text-muted-foreground whitespace-nowrap mr-2">Quick Start:</span>
        {quickCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                "transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground border border-border/30"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
