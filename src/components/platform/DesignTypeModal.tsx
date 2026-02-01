import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileText, Instagram, Youtube, Hexagon, Maximize, Award, Presentation } from "lucide-react";

export type DesignCategory = "poster" | "instagram" | "youtube" | "logo" | "certificate" | "presentation" | "custom";

interface DesignTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: DesignCategory) => void;
}

const designTypes = [
  {
    id: "poster" as const,
    label: "Poster",
    description: "Print-ready A4/A3 designs",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "instagram" as const,
    label: "Instagram Ad",
    description: "1080x1080 social graphics",
    icon: Instagram,
    color: "from-pink-500 to-orange-500",
  },
  {
    id: "youtube" as const,
    label: "YouTube Thumbnail",
    description: "1280x720 click-worthy thumbnails",
    icon: Youtube,
    color: "from-red-500 to-red-600",
  },
  {
    id: "logo" as const,
    label: "Logo",
    description: "Brand identity designs",
    icon: Hexagon,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "certificate" as const,
    label: "Certificate",
    description: "Professional achievements & awards",
    icon: Award,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "presentation" as const,
    label: "Presentation",
    description: "Slides & pitch decks",
    icon: Presentation,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "custom" as const,
    label: "Custom Size",
    description: "Start with custom dimensions",
    icon: Maximize,
    color: "from-gray-500 to-gray-600",
  },
];

export const DesignTypeModal = ({ open, onOpenChange, onSelect }: DesignTypeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            What do you want to create today?
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto">
          {designTypes.map((type) => {
            const Icon = type.icon;

            return (
              <button
                key={type.id}
                onClick={() => {
                  onSelect(type.id);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl",
                  "bg-muted/30 hover:bg-muted/50 border border-border/30 hover:border-primary/50",
                  "transition-all duration-300 group text-left"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br",
                    type.color
                  )}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
