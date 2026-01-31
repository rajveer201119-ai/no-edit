import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COLOR_PRESETS } from "./types";

interface BackgroundPanelProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

export const BackgroundPanel = ({ backgroundColor, onColorChange }: BackgroundPanelProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Preset Colors */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Preset Colors</Label>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 transition-all",
                  backgroundColor === color
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/50 hover:border-border"
                )}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>
        </div>

        {/* Custom Color */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Custom Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-12 w-20 cursor-pointer"
            />
            <Input
              type="text"
              value={backgroundColor}
              onChange={(e) => onColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 font-mono"
            />
          </div>
        </div>

        {/* Gradient Presets */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Gradient Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            ].map((gradient, i) => (
              <button
                key={i}
                className="h-16 rounded-lg border border-border/50 hover:border-primary transition-all"
                style={{ background: gradient }}
                onClick={() => onColorChange(gradient)}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
