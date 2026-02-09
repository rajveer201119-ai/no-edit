import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  Palette,
  Wand2,
  LayoutGrid,
} from "lucide-react";
import { Layer, TextLayer, ShapeLayer, BackgroundLayer } from "./types";
import { toast } from "sonner";

interface QuickActionsProps {
  layers: Layer[];
  selectedLayerIds: string[];
  canvasWidth: number;
  canvasHeight: number;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onSetBackground: (color: string) => void;
}

// Color palettes for one-click styling
const colorPalettes = [
  { name: "Sunset", colors: ["#FF6B6B", "#FFA07A", "#FFD700", "#FFF8DC"], bg: "#1a1a2e" },
  { name: "Ocean", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"], bg: "#03045e" },
  { name: "Forest", colors: ["#2D6A4F", "#40916C", "#52B788", "#D8F3DC"], bg: "#1B4332" },
  { name: "Neon", colors: ["#FF006E", "#8338EC", "#3A86FF", "#FFBE0B"], bg: "#0a0a0a" },
  { name: "Pastel", colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9DCC4"], bg: "#ffffff" },
  { name: "Mono", colors: ["#FFFFFF", "#D4D4D4", "#737373", "#262626"], bg: "#171717" },
];

export const QuickActions = ({
  layers,
  selectedLayerIds,
  canvasWidth,
  canvasHeight,
  onUpdateLayer,
  onSetBackground,
}: QuickActionsProps) => {
  const [showPalettes, setShowPalettes] = useState(false);

  const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id) && l.type !== "background");

  // Alignment actions
  const alignLayers = (alignment: string) => {
    if (selectedLayers.length === 0) {
      toast.info("Select elements to align");
      return;
    }

    selectedLayers.forEach((layer) => {
      let updates: Partial<Layer> = {};
      switch (alignment) {
        case "left":
          updates = { x: 0 };
          break;
        case "center-h":
          updates = { x: (canvasWidth - layer.width) / 2 };
          break;
        case "right":
          updates = { x: canvasWidth - layer.width };
          break;
        case "top":
          updates = { y: 0 };
          break;
        case "center-v":
          updates = { y: (canvasHeight - layer.height) / 2 };
          break;
        case "bottom":
          updates = { y: canvasHeight - layer.height };
          break;
      }
      onUpdateLayer(layer.id, updates);
    });
    toast.success("Aligned!");
  };

  // Apply color palette
  const applyPalette = (palette: typeof colorPalettes[0]) => {
    onSetBackground(palette.bg);

    const textLayers = layers.filter((l) => l.type === "text") as TextLayer[];
    const shapeLayers = layers.filter((l) => l.type === "shape") as ShapeLayer[];

    textLayers.forEach((layer, i) => {
      const color = palette.colors[i % palette.colors.length];
      onUpdateLayer(layer.id, { color });
    });

    shapeLayers.forEach((layer, i) => {
      const color = palette.colors[(i + 1) % palette.colors.length];
      onUpdateLayer(layer.id, { fillColor: color } as Partial<ShapeLayer>);
    });

    toast.success(`${palette.name} palette applied!`);
    setShowPalettes(false);
  };

  // Auto-layout: distribute elements evenly
  const autoLayout = () => {
    const movableLayers = layers.filter((l) => l.type !== "background");
    if (movableLayers.length < 2) {
      toast.info("Add more elements to auto-layout");
      return;
    }

    const padding = 40;
    const totalHeight = canvasHeight - padding * 2;
    const gap = totalHeight / (movableLayers.length + 1);

    movableLayers.forEach((layer, i) => {
      onUpdateLayer(layer.id, {
        x: (canvasWidth - layer.width) / 2,
        y: padding + gap * (i + 1) - layer.height / 2,
      });
    });

    toast.success("Elements auto-arranged!");
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Alignment buttons */}
      <div className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alignLayers("left")} title="Align Left">
          <AlignStartHorizontal className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alignLayers("center-h")} title="Center Horizontally">
          <AlignHorizontalJustifyCenter className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alignLayers("right")} title="Align Right">
          <AlignEndHorizontal className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-5 bg-border/30" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alignLayers("top")} title="Align Top">
          <AlignStartVertical className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alignLayers("center-v")} title="Center Vertically">
          <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alignLayers("bottom")} title="Align Bottom">
          <AlignEndVertical className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Auto Layout */}
      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs px-2" onClick={autoLayout}>
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Auto</span>
      </Button>

      {/* Color Palette */}
      <Popover open={showPalettes} onOpenChange={setShowPalettes}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs px-2">
            <Palette className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Palette</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <p className="text-xs font-medium mb-2">One-Click Color Palettes</p>
          <div className="space-y-2">
            {colorPalettes.map((palette) => (
              <button
                key={palette.name}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => applyPalette(palette)}
              >
                <div className="flex gap-1">
                  {palette.colors.map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-border/30" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-xs font-medium">{palette.name}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
