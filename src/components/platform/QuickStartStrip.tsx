import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileText, Instagram, Youtube, Hexagon } from "lucide-react";
import type { DesignCategory } from "./DesignTypeModal";

interface QuickStartStripProps {
  onSelect: (category: DesignCategory) => void;
  activeCategory?: DesignCategory;
}

const quickCategories = [
  { id: "poster" as const, label: "Poster", icon: FileText },
  { id: "instagram" as const, label: "Instagram", icon: Instagram },
  { id: "youtube" as const, label: "Thumbnail", icon: Youtube },
  { id: "logo" as const, label: "Logo", icon: Hexagon },
];

export const QuickStartStrip = ({ onSelect, activeCategory }: QuickStartStripProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "fixed top-28 right-0 h-12 bg-muted/30 backdrop-blur-sm border-b border-border/20 z-20",
      isMobile ? "left-0" : "left-14"
    )}>
      <ScrollArea className="w-full h-full">
        <div className="flex items-center gap-2 h-full px-4 min-w-max">
          <span className="text-xs text-muted-foreground whitespace-nowrap mr-2">
            Quick Start:
          </span>
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(cat.id)}
                className={cn(
                  "gap-2 min-h-[32px] whitespace-nowrap transition-all",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
