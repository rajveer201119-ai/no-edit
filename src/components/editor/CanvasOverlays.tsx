import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Move } from "lucide-react";
import { TextOverlay } from "@/components/TextToolPanel";

export interface ImageOverlay {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasOverlaysProps {
  overlays: ImageOverlay[];
  textOverlays: TextOverlay[];
  activeOverlayId: string | null;
  activeTextId: string | null;
  cropArea: CropArea | null;
  isCropping: boolean;
  onOverlayPointerDown: (e: React.MouseEvent | React.TouchEvent, overlayId: string) => void;
  onTextPointerDown: (e: React.MouseEvent | React.TouchEvent, textId: string) => void;
  onResizeOverlay: (overlayId: string, delta: number) => void;
  onRemoveOverlay: (overlayId: string) => void;
  onResizeText: (textId: string, delta: number) => void;
  onRemoveText: (textId: string) => void;
}

export const CanvasOverlays = ({
  overlays,
  textOverlays,
  activeOverlayId,
  activeTextId,
  cropArea,
  isCropping,
  onOverlayPointerDown,
  onTextPointerDown,
  onResizeOverlay,
  onRemoveOverlay,
  onResizeText,
  onRemoveText,
}: CanvasOverlaysProps) => {
  return (
    <>
      {/* Image Overlays */}
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className={cn(
            "absolute cursor-move select-none touch-none",
            activeOverlayId === overlay.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          style={{
            left: overlay.x,
            top: overlay.y,
            width: overlay.width,
            height: overlay.height,
          }}
          onMouseDown={(e) => onOverlayPointerDown(e, overlay.id)}
          onTouchStart={(e) => onOverlayPointerDown(e, overlay.id)}
        >
          <img
            src={overlay.src}
            alt="Overlay"
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
          
          {/* Controls */}
          {activeOverlayId === overlay.id && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onResizeOverlay(overlay.id, -20); }}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Move className="h-3 w-3 text-muted-foreground" />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onResizeOverlay(overlay.id, 20); }}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <div className="w-px h-4 bg-border/50" />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onRemoveOverlay(overlay.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Text Overlays */}
      {textOverlays.map((text) => (
        <div
          key={text.id}
          className={cn(
            "absolute cursor-move select-none touch-none",
            activeTextId === text.id && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded"
          )}
          style={{
            left: text.x,
            top: text.y,
            fontFamily: text.fontFamily,
            fontSize: text.fontSize,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            color: text.gradient ? "transparent" : text.color,
            background: text.gradient || "transparent",
            backgroundClip: text.gradient ? "text" : "unset",
            WebkitBackgroundClip: text.gradient ? "text" : "unset",
            textShadow: text.gradient ? "none" : text.textShadow,
            opacity: text.opacity,
          }}
          onMouseDown={(e) => onTextPointerDown(e, text.id)}
          onTouchStart={(e) => onTextPointerDown(e, text.id)}
        >
          {text.text}
          
          {/* Text Controls */}
          {activeTextId === text.id && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onResizeText(text.id, -4); }}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Move className="h-3 w-3 text-muted-foreground" />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onResizeText(text.id, 4); }}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <div className="w-px h-4 bg-border/50" />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onRemoveText(text.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Crop Overlay */}
      {isCropping && cropArea && cropArea.width > 0 && cropArea.height > 0 && (
        <>
          {/* Darkened areas around crop */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          {/* Crop selection */}
          <div
            className="absolute border-2 border-primary bg-transparent pointer-events-none"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            }}
          >
            {/* Corner handles */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
              <div
                key={pos}
                className={cn(
                  "absolute w-3 h-3 bg-primary rounded-sm",
                  pos === "top-left" && "-top-1.5 -left-1.5",
                  pos === "top-right" && "-top-1.5 -right-1.5",
                  pos === "bottom-left" && "-bottom-1.5 -left-1.5",
                  pos === "bottom-right" && "-bottom-1.5 -right-1.5"
                )}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};
