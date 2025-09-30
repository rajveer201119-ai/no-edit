import { ImageStyle } from "./ImageGenerator";
import { Card } from "@/components/ui/card";
import { Palette, Box, Film, Camera, Clock, Zap } from "lucide-react";

interface StyleSelectorProps {
  value: ImageStyle;
  onChange: (style: ImageStyle) => void;
  disabled?: boolean;
}

const styles: { value: ImageStyle; label: string; icon: typeof Palette; description: string }[] = [
  { value: "realistic", label: "Realistic", icon: Camera, description: "Photo-realistic imagery" },
  { value: "ghibli", label: "Ghibli", icon: Palette, description: "Studio Ghibli anime style" },
  { value: "3d", label: "3D Render", icon: Box, description: "3D rendered graphics" },
  { value: "animated", label: "Animated", icon: Film, description: "Cartoon animation style" },
  { value: "vintage", label: "Vintage", icon: Clock, description: "Retro artistic style" },
  { value: "cyberpunk", label: "Cyberpunk", icon: Zap, description: "Futuristic neon aesthetic" },
];

export const StyleSelector = ({ value, onChange, disabled }: StyleSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium gradient-epic-text">
        Choose Style
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = value === style.value;
          
          return (
            <Card
              key={style.value}
              onClick={() => !disabled && onChange(style.value)}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "glass-card border-primary glow-purple scale-105"
                  : "glass-card border-white/10 hover:border-white/30 hover:scale-102"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className={`font-medium text-sm ${isSelected ? "gradient-epic-text" : ""}`}>
                    {style.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {style.description}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
