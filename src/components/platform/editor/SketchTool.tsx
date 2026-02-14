import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Eraser, Undo2, Redo2, Trash2 } from "lucide-react";

interface SketchToolPanelProps {
  onAddSketchLayer: (dataUrl: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const SketchToolPanel = ({ onAddSketchLayer, canvasWidth, canvasHeight }: SketchToolPanelProps) => {
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState("#000000");
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const presetColors = [
    "#000000", "#ffffff", "#ef4444", "#f97316", "#eab308",
    "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(dataUrl);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ("touches" in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    if ("clientX" in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const point = getCanvasPoint(e);
    lastPoint.current = point;
    
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? "rgba(0,0,0,0)" : brushColor;
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPoint.current) return;
    
    const point = getCanvasPoint(e);
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    
    lastPoint.current = point;
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPoint.current = null;
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) ctx.globalCompositeOperation = "source-over";
      saveToHistory();
    }
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[newIndex];
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[newIndex];
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onAddSketchLayer(dataUrl);
  };

  // Internal preview canvas size (aspect-ratio preserved, fits in panel)
  const maxPreview = 220;
  const aspect = canvasWidth / canvasHeight;
  const previewW = aspect >= 1 ? maxPreview : Math.round(maxPreview * aspect);
  const previewH = aspect >= 1 ? Math.round(maxPreview / aspect) : maxPreview;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Label className="text-xs font-medium">Sketch Tool</Label>

        {/* Canvas preview */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="border border-border rounded-lg bg-white cursor-crosshair touch-none"
            style={{ width: previewW, height: previewH }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          <Button
            variant={!isEraser ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => setIsEraser(false)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Draw
          </Button>
          <Button
            variant={isEraser ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => setIsEraser(true)}
          >
            <Eraser className="h-3.5 w-3.5" />
            Erase
          </Button>
        </div>

        {/* Brush size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Brush Size</Label>
            <span className="text-xs text-muted-foreground">{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            min={1}
            max={40}
            step={1}
            onValueChange={([v]) => setBrushSize(v)}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((c) => (
              <button
                key={c}
                className={cn(
                  "w-8 h-8 rounded-lg border-2 transition-all",
                  brushColor === c
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/50 hover:border-border"
                )}
                style={{ backgroundColor: c }}
                onClick={() => { setBrushColor(c); setIsEraser(false); }}
              />
            ))}
          </div>
          <Input
            type="color"
            value={brushColor}
            onChange={(e) => { setBrushColor(e.target.value); setIsEraser(false); }}
            className="h-10 w-full cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleClear} title="Clear">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Button className="w-full" onClick={handleApply}>
          Add Sketch to Canvas
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Draw freely, then click "Add Sketch" to place it as a layer on your canvas.
        </p>
      </div>
    </ScrollArea>
  );
};
