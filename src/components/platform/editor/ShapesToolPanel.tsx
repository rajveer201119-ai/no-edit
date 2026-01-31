import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Square, Circle, Triangle, Minus, ArrowRight } from "lucide-react";
import { ShapeLayer, SHAPE_OPTIONS, COLOR_PRESETS } from "./types";

interface ShapesToolPanelProps {
  selectedLayer: ShapeLayer | null;
  onAddShape: (shapeType: ShapeLayer["shapeType"]) => void;
  onUpdateShape: (updates: Partial<ShapeLayer>) => void;
}

const getShapeIcon = (type: ShapeLayer["shapeType"]) => {
  switch (type) {
    case "rectangle":
      return Square;
    case "circle":
      return Circle;
    case "triangle":
      return Triangle;
    case "line":
      return Minus;
    case "arrow":
      return ArrowRight;
    default:
      return Square;
  }
};

export const ShapesToolPanel = ({ selectedLayer, onAddShape, onUpdateShape }: ShapesToolPanelProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Shape Options */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Add Shape</Label>
          <div className="grid grid-cols-5 gap-2">
            {SHAPE_OPTIONS.map((shape) => {
              const Icon = getShapeIcon(shape.id);
              return (
                <Button
                  key={shape.id}
                  variant="outline"
                  size="icon"
                  className="h-12 w-full"
                  onClick={() => onAddShape(shape.id)}
                  title={shape.name}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
            })}
          </div>
        </div>

        {selectedLayer && (
          <>
            {/* Fill Color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Fill Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all",
                      selectedLayer.fillColor === color
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border/50 hover:border-border"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateShape({ fillColor: color })}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={selectedLayer.fillColor}
                onChange={(e) => onUpdateShape({ fillColor: e.target.value })}
                className="h-10 w-full cursor-pointer"
              />
            </div>

            {/* Stroke Color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Stroke Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all",
                      selectedLayer.strokeColor === color
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border/50 hover:border-border"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateShape({ strokeColor: color })}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={selectedLayer.strokeColor}
                onChange={(e) => onUpdateShape({ strokeColor: e.target.value })}
                className="h-10 w-full cursor-pointer"
              />
            </div>

            {/* Stroke Width */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Stroke Width</Label>
                <span className="text-xs text-muted-foreground">{selectedLayer.strokeWidth}px</span>
              </div>
              <Slider
                value={[selectedLayer.strokeWidth]}
                min={0}
                max={20}
                step={1}
                onValueChange={([value]) => onUpdateShape({ strokeWidth: value })}
              />
            </div>

            {/* Border Radius (for rectangles) */}
            {selectedLayer.shapeType === "rectangle" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Corner Radius</Label>
                  <span className="text-xs text-muted-foreground">{selectedLayer.borderRadius || 0}px</span>
                </div>
                <Slider
                  value={[selectedLayer.borderRadius || 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => onUpdateShape({ borderRadius: value })}
                />
              </div>
            )}

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
                onValueChange={([value]) => onUpdateShape({ opacity: value / 100 })}
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
                onValueChange={([value]) => onUpdateShape({ rotation: value })}
              />
            </div>

            {/* Size */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Size</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Width</Label>
                  <Input
                    type="number"
                    value={selectedLayer.width}
                    onChange={(e) => onUpdateShape({ width: parseInt(e.target.value) || 0 })}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Height</Label>
                  <Input
                    type="number"
                    value={selectedLayer.height}
                    onChange={(e) => onUpdateShape({ height: parseInt(e.target.value) || 0 })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {!selectedLayer && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click a shape above to add it to the canvas, or select an existing shape to edit.
          </p>
        )}
      </div>
    </ScrollArea>
  );
};
