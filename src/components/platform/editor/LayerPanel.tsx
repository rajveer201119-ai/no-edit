import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Image,
  Type,
  Square,
  Layers,
} from "lucide-react";
import { Layer } from "./types";

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerIds: string[];
  onSelectLayer: (id: string, multiSelect?: boolean) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
}

const getLayerIcon = (type: Layer["type"]) => {
  switch (type) {
    case "image":
      return Image;
    case "text":
      return Type;
    case "shape":
      return Square;
    case "background":
      return Layers;
    default:
      return Square;
  }
};

export const LayerPanel = ({
  layers,
  selectedLayerIds,
  onSelectLayer,
  onToggleLock,
  onToggleVisibility,
  onDeleteLayer,
  onDuplicateLayer,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
}: LayerPanelProps) => {
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
  const selectedLayer = layers.find((l) => selectedLayerIds.includes(l.id));

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full bg-background border-l border-border/30">
        {/* Header */}
        <div className="p-3 border-b border-border/30">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Layers
          </h3>
        </div>

        {/* Layer Actions */}
        {selectedLayer && (
          <div className="p-2 border-b border-border/30 flex flex-wrap gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onBringToFront(selectedLayer.id)}
                >
                  <ChevronsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bring to Front</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onBringForward(selectedLayer.id)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bring Forward</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onSendBackward(selectedLayer.id)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send Backward</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onSendToBack(selectedLayer.id)}
                >
                  <ChevronsDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send to Back</TooltipContent>
            </Tooltip>

            <div className="w-px h-8 bg-border/50 mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDuplicateLayer(selectedLayer.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDeleteLayer(selectedLayer.id)}
                  disabled={selectedLayer.type === "background"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Layer List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sortedLayers.map((layer) => {
              const Icon = getLayerIcon(layer.type);
              const isSelected = selectedLayerIds.includes(layer.id);

              return (
                <div
                  key={layer.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    isSelected && "bg-primary/10 ring-1 ring-primary/30",
                    !layer.visible && "opacity-50"
                  )}
                  onClick={(e) => onSelectLayer(layer.id, e.shiftKey)}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm truncate">{layer.name}</span>

                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 hover:bg-muted rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(layer.id);
                      }}
                    >
                      {layer.visible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      className="p-1 hover:bg-muted rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(layer.id);
                      }}
                    >
                      {layer.locked ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {layers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No layers yet
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};
