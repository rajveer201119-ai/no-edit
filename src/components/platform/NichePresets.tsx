import { cn } from "@/lib/utils";
import { Youtube, Instagram, GraduationCap, FileText, Presentation, Image } from "lucide-react";
import type { DesignCategory } from "./DesignTypeModal";

interface NichePreset {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: DesignCategory;
  defaultPrompt: string;
  colorClasses: string;
}

const presets: NichePreset[] = [
  {
    id: "youtube-thumbnail",
    label: "YouTube Thumbnail",
    description: "Eye-catching thumbnails",
    icon: Youtube,
    category: "youtube",
    defaultPrompt: "Bold YouTube thumbnail with high contrast text, dynamic background, face placeholder area, click-worthy design",
    colorClasses: "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20",
  },
  {
    id: "instagram-post",
    label: "Instagram Post",
    description: "Engaging square posts",
    icon: Instagram,
    category: "instagram",
    defaultPrompt: "Modern Instagram post with gradient background, bold headline, clean typography, social media optimized",
    colorClasses: "bg-pink-500/10 text-pink-600 border-pink-500/30 hover:bg-pink-500/20",
  },
  {
    id: "school-poster",
    label: "School Poster",
    description: "Educational designs",
    icon: GraduationCap,
    category: "poster",
    defaultPrompt: "School event poster with bright colors, clear hierarchy, educational theme, student-friendly design",
    colorClasses: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20",
  },
  {
    id: "certificate",
    label: "Certificate",
    description: "Professional awards",
    icon: FileText,
    category: "certificate",
    defaultPrompt: "Professional certificate with elegant borders, formal typography, achievement text, signature area",
    colorClasses: "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20",
  },
  {
    id: "presentation",
    label: "Pitch Deck",
    description: "Startup slides",
    icon: Presentation,
    category: "presentation",
    defaultPrompt: "Modern pitch deck slide with clean layout, bold headline, minimal design, startup aesthetic",
    colorClasses: "bg-purple-500/10 text-purple-600 border-purple-500/30 hover:bg-purple-500/20",
  },
  {
    id: "logo",
    label: "Logo Design",
    description: "Brand identity",
    icon: Image,
    category: "logo",
    defaultPrompt: "Minimalist logo design, geometric shapes, clean lines, professional brand identity, scalable vector style",
    colorClasses: "bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20",
  },
];

interface NichePresetsProps {
  onSelect: (preset: NichePreset) => void;
  orientation?: "horizontal" | "vertical";
  compact?: boolean;
  className?: string;
}

export const NichePresets = ({
  onSelect,
  orientation = "horizontal",
  compact = false,
  className,
}: NichePresetsProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-sm font-semibold mb-1">Quick Start</h3>
        <p className="text-xs text-muted-foreground">
          Skip the setup — start with a preset
        </p>
      </div>

      <div className={cn(
        "gap-2",
        orientation === "horizontal" 
          ? "flex flex-wrap" 
          : "grid grid-cols-2 sm:grid-cols-3"
      )}>
        {presets.map((preset) => {
          const Icon = preset.icon;

          if (compact) {
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                  "min-h-[44px]",
                  preset.colorClasses
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{preset.label}</span>
              </button>
            );
          }

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left",
                "min-h-[80px] hover:shadow-md",
                preset.colorClasses
              )}
            >
              <Icon className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">{preset.label}</p>
                <p className="text-xs opacity-70">{preset.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Preset for homepage hero section
interface HomePresetButtonsProps {
  onSelect: (category: DesignCategory, prompt: string) => void;
  className?: string;
}

export const HomePresetButtons = ({ onSelect, className }: HomePresetButtonsProps) => {
  const quickPresets = presets.slice(0, 3); // YouTube, Instagram, School Poster

  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {quickPresets.map((preset) => {
        const Icon = preset.icon;

        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.category, preset.defaultPrompt)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all",
              "bg-background/50 backdrop-blur-sm hover:bg-background/80",
              "min-h-[44px] text-sm font-medium"
            )}
          >
            <Icon className="h-4 w-4" />
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};

// Export preset type
export { presets };
export type { NichePreset };
