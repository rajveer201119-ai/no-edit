import { useState, useRef, useCallback } from "react";
import { Download, RotateCcw, Sparkles, ZoomIn, ZoomOut, Crop, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PreviewCanvasProps {
  imageUrl: string | null;
  isGenerating: boolean;
  onUpgrade: () => void;
  projectId?: string;
  projectName?: string;
  onImageUpdate?: (newUrl: string) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function PreviewCanvas({ 
  imageUrl, 
  isGenerating, 
  onUpgrade,
  projectId,
  projectName = "Design",
  onImageUpdate
}: PreviewCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      toast.loading("Preparing download...", { id: "download" });
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName.replace(/\s+/g, "-")}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch {
      toast.error("Failed to download");
    } finally {
      toast.dismiss("download");
    }
  };

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCropping || !containerRef.current) return;
    e.preventDefault();
    const { x, y } = getPointerPosition(e);
    setDragStart({ x, y });
    setIsDragging(true);
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isCropping || !containerRef.current) return;
    e.preventDefault();
    const { x: currentX, y: currentY } = getPointerPosition(e);
    setCropArea({
      x: Math.min(dragStart.x, currentX),
      y: Math.min(dragStart.y, currentY),
      width: Math.abs(currentX - dragStart.x),
      height: Math.abs(currentY - dragStart.y)
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  const applyCrop = useCallback(async () => {
    if (!cropArea || !containerRef.current || !imageUrl || cropArea.width < 10 || cropArea.height < 10) {
      toast.error("Please select a valid crop area");
      return;
    }

    toast.loading("Applying crop...", { id: "crop" });

    try {
      const imgElement = containerRef.current.querySelector('img');
      if (!imgElement) throw new Error("Image element not found");
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgElement.getBoundingClientRect();
      
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      const imageBlob = await response.blob();
      const blobUrl = URL.createObjectURL(imageBlob);
      
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = blobUrl;
      });
      
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      const offsetX = imgRect.left - containerRect.left;
      const offsetY = imgRect.top - containerRect.top;
      
      const cropX = Math.max(0, (cropArea.x - offsetX) * scaleX);
      const cropY = Math.max(0, (cropArea.y - offsetY) * scaleY);
      const cropWidth = Math.min(cropArea.width * scaleX, img.naturalWidth - cropX);
      const cropHeight = Math.min(cropArea.height * scaleY, img.naturalHeight - cropY);
      
      URL.revokeObjectURL(blobUrl);
      
      if (cropWidth < 10 || cropHeight < 10) throw new Error("Crop area too small");
      
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(cropWidth);
      canvas.height = Math.floor(cropHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to create canvas context");
      
      ctx.drawImage(img, Math.floor(cropX), Math.floor(cropY), Math.floor(cropWidth), Math.floor(cropHeight), 0, 0, Math.floor(cropWidth), Math.floor(cropHeight));
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Failed to create blob")), "image/png");
      });
      
      if (projectId) {
        const fileName = `${projectId}/${Date.now()}-cropped.png`;
        const { error: uploadError } = await supabase.storage.from("post-images").upload(fileName, blob, { contentType: "image/png" });
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(fileName);
        await supabase.from("projects").update({ image_url: publicUrl, updated_at: new Date().toISOString() }).eq("id", projectId);
        
        onImageUpdate?.(publicUrl);
      }
      
      setIsCropping(false);
      setCropArea(null);
      toast.success("Image cropped!");
    } catch (error: any) {
      console.error("Crop error:", error);
      toast.error(error?.message || "Failed to crop");
    } finally {
      toast.dismiss("crop");
    }
  }, [cropArea, imageUrl, projectId, onImageUpdate]);

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {/* Top Controls */}
      <div className="flex-shrink-0 p-3 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(1)}
              className="h-8 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>
            {imageUrl && (
              <>
                <Button
                  variant={isCropping ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => { setIsCropping(!isCropping); setCropArea(null); }}
                >
                  <Crop className="w-3.5 h-3.5 mr-1.5" />
                  Crop
                </Button>
                {isCropping && cropArea && cropArea.width > 10 && (
                  <>
                    <Button size="sm" className="h-8 text-xs" onClick={applyCrop}>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Apply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setIsCropping(false); setCropArea(null); }}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!imageUrl}
              className="h-8 text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download
            </Button>
            <Button
              size="sm"
              onClick={onUpgrade}
              className="h-8 text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto bg-gradient-to-br from-muted/10 via-transparent to-muted/10">
        <div
          ref={containerRef}
          className={cn(
            "relative rounded-2xl shadow-2xl border border-border/30",
            "bg-gradient-to-br from-background via-background to-muted/20",
            "transition-all duration-300",
            "w-full max-w-2xl aspect-square md:aspect-auto md:h-full md:max-h-[70vh]",
            "ring-1 ring-white/5",
            isCropping && "cursor-crosshair select-none touch-none"
          )}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 animate-gradient" />
                  <div className="absolute inset-0 backdrop-blur-3xl" />
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary/30"
                      animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                      }}
                      style={{
                        left: `${20 + i * 12}%`,
                        top: `${30 + (i % 3) * 20}%`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Loading spinner */}
                <div className="relative z-10">
                  <motion.div
                    className="w-20 h-20 rounded-full border-4 border-primary/20"
                    style={{ borderTopColor: "hsl(var(--primary))" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                
                <div className="text-center space-y-2 relative z-10">
                  <motion.p 
                    className="text-base font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Creating your design...
                  </motion.p>
                  <p className="text-xs text-muted-foreground">This usually takes 10-20 seconds</p>
                </div>
              </motion.div>
            ) : imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex items-center justify-center p-4"
              >
                <img
                  src={imageUrl}
                  alt="Generated design"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                  draggable={false}
                />
                
                {/* Crop overlay */}
                {isCropping && cropArea && (
                  <>
                    <div 
                      className="absolute inset-0 bg-black/50 pointer-events-none rounded-2xl"
                      style={{
                        clipPath: `polygon(
                          0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                          ${cropArea.x}px ${cropArea.y}px,
                          ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                          ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                          ${cropArea.x + cropArea.width}px ${cropArea.y}px,
                          ${cropArea.x}px ${cropArea.y}px
                        )`
                      }}
                    />
                    <div 
                      className="absolute border-2 border-primary border-dashed pointer-events-none"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height
                      }}
                    />
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Your design will appear here</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Describe what you want to create in the chat, and watch the magic happen
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="flex-shrink-0 p-3 border-t border-border/50 bg-background/50">
        <p className="text-xs text-muted-foreground text-center">
          {imageUrl 
            ? "Type instructions in the chat to edit this design, or download it"
            : "Start by describing your design in the chat panel"
          }
        </p>
      </div>
    </div>
  );
}
