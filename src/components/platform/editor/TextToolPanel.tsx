import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react";
import { TextLayer, FONT_OPTIONS, COLOR_PRESETS } from "./types";

interface TextToolPanelProps {
  selectedLayer: TextLayer | null;
  onAddText: () => void;
  onUpdateText: (updates: Partial<TextLayer>) => void;
}

export const TextToolPanel = ({ selectedLayer, onAddText, onUpdateText }: TextToolPanelProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Add Text Button */}
        <Button className="w-full gap-2" onClick={onAddText}>
          <Plus className="h-4 w-4" />
          Add Text
        </Button>

        {selectedLayer && (
          <>
            {/* Font Family */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Font Family</Label>
              <Select
                value={selectedLayer.fontFamily}
                onValueChange={(value) => onUpdateText({ fontFamily: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Size</Label>
                <span className="text-xs text-muted-foreground">{selectedLayer.fontSize}px</span>
              </div>
              <Slider
                value={[selectedLayer.fontSize]}
                min={8}
                max={200}
                step={1}
                onValueChange={([value]) => onUpdateText({ fontSize: value })}
              />
            </div>

            {/* Font Style Buttons */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Style</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedLayer.fontWeight === "bold" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    onUpdateText({
                      fontWeight: selectedLayer.fontWeight === "bold" ? "normal" : "bold",
                    })
                  }
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedLayer.fontStyle === "italic" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    onUpdateText({
                      fontStyle: selectedLayer.fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Alignment</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedLayer.textAlign === "left" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => onUpdateText({ textAlign: "left" })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedLayer.textAlign === "center" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => onUpdateText({ textAlign: "center" })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedLayer.textAlign === "right" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => onUpdateText({ textAlign: "right" })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all",
                      selectedLayer.color === color
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border/50 hover:border-border"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateText({ color })}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={selectedLayer.color}
                onChange={(e) => onUpdateText({ color: e.target.value })}
                className="h-10 w-full cursor-pointer"
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Letter Spacing</Label>
                <span className="text-xs text-muted-foreground">{selectedLayer.letterSpacing}px</span>
              </div>
              <Slider
                value={[selectedLayer.letterSpacing]}
                min={-5}
                max={20}
                step={0.5}
                onValueChange={([value]) => onUpdateText({ letterSpacing: value })}
              />
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Line Height</Label>
                <span className="text-xs text-muted-foreground">{selectedLayer.lineHeight.toFixed(1)}</span>
              </div>
              <Slider
                value={[selectedLayer.lineHeight]}
                min={0.8}
                max={3}
                step={0.1}
                onValueChange={([value]) => onUpdateText({ lineHeight: value })}
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Opacity</Label>
                <span className="text-xs text-muted-foreground">{Math.round(selectedLayer.opacity * 100)}%</span>
              </div>
              <Slider
                value={[selectedLayer.opacity * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) => onUpdateText({ opacity: value / 100 })}
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Rotation</Label>
                <span className="text-xs text-muted-foreground">{selectedLayer.rotation}°</span>
              </div>
              <Slider
                value={[selectedLayer.rotation]}
                min={-180}
                max={180}
                step={1}
                onValueChange={([value]) => onUpdateText({ rotation: value })}
              />
            </div>
          </>
        )}

        {!selectedLayer && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click on the canvas to add text, or select existing text to edit.
          </p>
        )}
      </div>
    </ScrollArea>
  );
};
