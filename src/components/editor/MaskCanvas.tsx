import { useRef, useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Eraser, 
  Paintbrush, 
  Undo2, 
  RotateCcw, 
  Check, 
  X,
  Circle
} from "lucide-react";

interface MaskCanvasProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  onMaskComplete: (maskDataUrl: string) => void;
  onCancel: () => void;
}

export const MaskCanvas = ({
  imageUrl,
  imageWidth,
  imageHeight,
  onMaskComplete,
  onCancel,
}: MaskCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Start with transparent canvas (mask area)
    ctx.clearRect(0, 0, imageWidth, imageHeight);

    // Save initial state
    const initialState = ctx.getImageData(0, 0, imageWidth, imageHeight);
    setHistory([initialState]);
    setHistoryIndex(0);
  }, [imageWidth, imageHeight]);

  // Save state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Truncate history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Keep only last 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  // Clear all
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, [saveToHistory]);

  // Get position from event
  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Draw on canvas
  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    
    if (tool === "brush") {
      // Draw mask (semi-transparent red to show masked area)
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();
    } else {
      // Eraser - clear the area
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  }, [brushSize, tool]);

  // Pointer handlers
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPosition(e);
    if (!pos) return;

    setIsDrawing(true);
    draw(pos.x, pos.y);
  }, [getPosition, draw]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getPosition(e);
    if (!pos) return;

    draw(pos.x, pos.y);
  }, [isDrawing, getPosition, draw]);

  const handlePointerUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  }, [isDrawing, saveToHistory]);

  // Apply mask
  const handleApply = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Create a black and white mask
    // White = areas to inpaint, Black = areas to preserve
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    // Start with black (preserve)
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Get the drawn mask data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

    // Convert red overlay to white mask
    for (let i = 0; i < imageData.data.length; i += 4) {
      const alpha = imageData.data[i + 3];
      if (alpha > 0) {
        // This pixel was drawn on, make it white in the mask
        maskImageData.data[i] = 255;     // R
        maskImageData.data[i + 1] = 255; // G
        maskImageData.data[i + 2] = 255; // B
        maskImageData.data[i + 3] = 255; // A
      }
    }

    maskCtx.putImageData(maskImageData, 0, 0);

    const maskDataUrl = maskCanvas.toDataURL("image/png");
    onMaskComplete(maskDataUrl);
  }, [onMaskComplete]);

  return (
    <div className="absolute inset-0 z-50">
      {/* Floating UI (Portal)
          Fixes mobile/zoom clipping: the editor scales the image container, which can cut off
          absolutely-positioned toolbars. Portaling to <body> keeps this UI fully visible. */}
      {mounted &&
        createPortal(
          <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+88px)] z-[100] pointer-events-none">
            <div className="mx-auto w-fit max-w-[95vw] px-2">
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 p-2 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                {/* Tool selection */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                  <Button
                    size="icon"
                    variant={tool === "brush" ? "default" : "ghost"}
                    className="h-8 w-8"
                    onClick={() => setTool("brush")}
                  >
                    <Paintbrush className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={tool === "eraser" ? "default" : "ghost"}
                    className="h-8 w-8"
                    onClick={() => setTool("eraser")}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border/50" />

                {/* Brush size */}
                <div className="flex items-center gap-2">
                  <Circle className="h-3 w-3 text-muted-foreground" />
                  <Slider
                    value={[brushSize]}
                    onValueChange={([value]) => setBrushSize(value)}
                    min={5}
                    max={100}
                    step={5}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground w-8">{brushSize}px</span>
                </div>

                <div className="w-px h-6 bg-border/50" />

                {/* Actions */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleClear}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border/50" />

                {/* Apply/Cancel */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" className="h-8" onClick={handleApply}>
                  <Check className="h-4 w-4 mr-1" />
                  Apply Mask
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {mounted &&
        createPortal(
          <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+16px)] z-[100] pointer-events-none">
            <div className="mx-auto w-fit max-w-[95vw] px-2">
              <div className="pointer-events-none px-4 py-2 rounded-lg bg-background/95 backdrop-blur-sm border border-border/50 text-sm text-muted-foreground text-center">
                Draw over areas you want to{" "}
                <span className="text-primary font-medium">modify or remove</span>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Canvas overlay - ensure it captures all pointer events */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 w-full h-full z-10",
          tool === "brush" ? "cursor-crosshair" : "cursor-cell"
        )}
        style={{ touchAction: "none" }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
    </div>
  );
};
