import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, RotateCcw } from "lucide-react";
import { ImageLayer } from "./types";

interface CropToolPanelProps {
  selectedLayer: ImageLayer | null;
  onApplyCrop: (cropData: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
}

export const CropToolPanel = ({ selectedLayer, onApplyCrop, onCancel }: CropToolPanelProps) => {
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);
  const [maintainAspect, setMaintainAspect] = useState(false);

  const handleApply = () => {
    if (!selectedLayer) return;
    
    const scaleX = selectedLayer.originalWidth / 100;
    const scaleY = selectedLayer.originalHeight / 100;
    
    onApplyCrop({
      x: cropX * scaleX,
      y: cropY * scaleY,
      width: cropWidth * scaleX,
      height: cropHeight * scaleY,
    });
  };

  const handleReset = () => {
    setCropX(0);
    setCropY(0);
    setCropWidth(100);
    setCropHeight(100);
  };

  if (!selectedLayer) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Select an image layer to crop
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Preview */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={selectedLayer.src}
            alt="Crop preview"
            className="w-full h-full object-contain"
          />
          {/* Crop overlay */}
          <div
            className="absolute border-2 border-primary bg-primary/10"
            style={{
              left: `${cropX}%`,
              top: `${cropY}%`,
              width: `${cropWidth}%`,
              height: `${cropHeight}%`,
            }}
          />
        </div>

        {/* Crop Position */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">X Position</Label>
              <span className="text-xs text-muted-foreground">{cropX}%</span>
            </div>
            <Slider
              value={[cropX]}
              min={0}
              max={100 - cropWidth}
              step={1}
              onValueChange={([value]) => setCropX(value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Y Position</Label>
              <span className="text-xs text-muted-foreground">{cropY}%</span>
            </div>
            <Slider
              value={[cropY]}
              min={0}
              max={100 - cropHeight}
              step={1}
              onValueChange={([value]) => setCropY(value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Width</Label>
              <span className="text-xs text-muted-foreground">{cropWidth}%</span>
            </div>
            <Slider
              value={[cropWidth]}
              min={10}
              max={100 - cropX}
              step={1}
              onValueChange={([value]) => {
                setCropWidth(value);
                if (maintainAspect) {
                  setCropHeight(value);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Height</Label>
              <span className="text-xs text-muted-foreground">{cropHeight}%</span>
            </div>
            <Slider
              value={[cropHeight]}
              min={10}
              max={100 - cropY}
              step={1}
              onValueChange={([value]) => {
                setCropHeight(value);
                if (maintainAspect) {
                  setCropWidth(value);
                }
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-2"
            onClick={handleApply}
          >
            <Check className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
