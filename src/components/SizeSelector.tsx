import { ImageSize } from "./ImageGenerator";
import { Card } from "@/components/ui/card";
import { Square, RectangleVertical, RectangleHorizontal } from "lucide-react";

interface SizeSelectorProps {
  value: ImageSize;
  onChange: (size: ImageSize) => void;
  disabled?: boolean;
}

const sizes: { value: ImageSize; label: string; icon: typeof Square; dimensions: string }[] = [
  { value: "square", label: "Square", icon: Square, dimensions: "1024×1024" },
  { value: "portrait", label: "Portrait", icon: RectangleVertical, dimensions: "768×1024" },
  { value: "landscape", label: "Landscape", icon: RectangleHorizontal, dimensions: "1024×768" },
];

export const SizeSelector = ({ value, onChange, disabled }: SizeSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium gradient-epic-text">
        Image Size
      </label>
      <div className="grid grid-cols-3 gap-3">
        {sizes.map((size) => {
          const Icon = size.icon;
          const isSelected = value === size.value;
          
          return (
            <Card
              key={size.value}
              onClick={() => !disabled && onChange(size.value)}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "glass-card border-secondary glow-pink scale-105"
                  : "glass-card border-white/10 hover:border-white/30 hover:scale-102"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Icon className={`h-6 w-6 ${isSelected ? "text-secondary" : "text-muted-foreground"}`} />
                <div>
                  <div className={`font-medium text-sm ${isSelected ? "text-secondary" : ""}`}>
                    {size.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {size.dimensions}
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
