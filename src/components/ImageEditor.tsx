import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, 
  Crop, 
  Move, 
  Send, 
  Loader2, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  projectId: string;
  projectName: string;
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  onClose: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageEditor = ({ 
  projectId, 
  projectName, 
  imageUrl, 
  onImageUpdate,
  onClose 
}: ImageEditorProps) => {
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update current image when prop changes
  useEffect(() => {
    setCurrentImage(imageUrl);
  }, [imageUrl]);

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = imageContainerRef.current!.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCropping || !imageContainerRef.current) return;
    e.preventDefault();
    
    const { x, y } = getPointerPosition(e);
    setDragStart({ x, y });
    setIsDragging(true);
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isCropping || !imageContainerRef.current) return;
    e.preventDefault();
    
    const { x: currentX, y: currentY } = getPointerPosition(e);
    setCropArea({
      x: Math.min(dragStart.x, currentX),
      y: Math.min(dragStart.y, currentY),
      width: Math.abs(currentX - dragStart.x),
      height: Math.abs(currentY - dragStart.y)
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const applyCrop = useCallback(async () => {
    if (!cropArea || !imageContainerRef.current || cropArea.width < 10 || cropArea.height < 10) {
      toast.error("Please select a valid crop area");
      return;
    }

    toast.loading("Applying crop...", { id: "crop" });

    try {
      const imgElement = imageContainerRef.current!.querySelector('img');
      if (!imgElement) {
        throw new Error("Image element not found");
      }
      
      const containerRect = imageContainerRef.current!.getBoundingClientRect();
      const imgRect = imgElement.getBoundingClientRect();
      
      // Fetch the image as blob to bypass CORS issues
      const response = await fetch(currentImage);
      if (!response.ok) throw new Error("Failed to fetch image");
      const imageBlob = await response.blob();
      
      // Create image from blob
      const blobUrl = URL.createObjectURL(imageBlob);
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = blobUrl;
      });
      
      // Calculate scale between display and actual image size
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      // Calculate crop coordinates relative to image
      const offsetX = imgRect.left - containerRect.left;
      const offsetY = imgRect.top - containerRect.top;
      
      const cropX = Math.max(0, (cropArea.x - offsetX) * scaleX);
      const cropY = Math.max(0, (cropArea.y - offsetY) * scaleY);
      const cropWidth = Math.min(cropArea.width * scaleX, img.naturalWidth - cropX);
      const cropHeight = Math.min(cropArea.height * scaleY, img.naturalHeight - cropY);
      
      // Cleanup blob URL
      URL.revokeObjectURL(blobUrl);
      
      if (cropWidth < 10 || cropHeight < 10) {
        throw new Error("Crop area too small");
      }
      
      // Create canvas and crop
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(cropWidth);
      canvas.height = Math.floor(cropHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Failed to create canvas context");
      }
      
      ctx.drawImage(
        img, 
        Math.floor(cropX), 
        Math.floor(cropY), 
        Math.floor(cropWidth), 
        Math.floor(cropHeight), 
        0, 
        0, 
        Math.floor(cropWidth), 
        Math.floor(cropHeight)
      );
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to create blob"));
        }, "image/png");
      });
      
      // Get current user ID for storage path (RLS requires userId as folder)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to crop images");
      }
      
      const fileName = `${user.id}/${Date.now()}-cropped.png`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, blob, { contentType: "image/png" });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);
      
      // Update project
      await supabase
        .from("projects")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", projectId);
      
      setCurrentImage(publicUrl);
      onImageUpdate(publicUrl);
      setIsCropping(false);
      setCropArea(null);
      toast.success("Image cropped successfully!");
    } catch (error: any) {
      console.error("Crop error:", error);
      toast.error(error?.message || "Failed to apply crop");
    } finally {
      toast.dismiss("crop");
    }
  }, [cropArea, currentImage, projectId, onImageUpdate]);

  const handleAIEdit = async () => {
    if (!editPrompt.trim()) {
      toast.error("Please describe what you want to change");
      return;
    }

    setIsEditing(true);
    toast.loading("AI is editing your image...", { id: "ai-edit", duration: 120000 });

    try {
      // Get current user ID for storage path (RLS requires userId as folder)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to edit images");
      }
      
      const { data, error } = await supabase.functions.invoke("edit-image", {
        body: {
          imageUrl: currentImage,
          prompt: editPrompt,
          projectId,
          userId: user.id
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image returned");

      setCurrentImage(data.imageUrl);
      onImageUpdate(data.imageUrl);
      setEditPrompt("");
      toast.success("Image edited successfully!");
    } catch (error: any) {
      console.error("AI edit error:", error);
      toast.error(error?.message || "Failed to edit image");
    } finally {
      toast.dismiss("ai-edit");
      setIsEditing(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading("Preparing download...", { id: "download" });
      
      const response = await fetch(currentImage);
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
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      toast.dismiss("download");
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 md:p-4 border-b border-white/10 flex-shrink-0">
        <h2 className="text-sm md:text-lg font-semibold truncate max-w-[120px] md:max-w-none">{projectName}</h2>
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs md:text-sm text-muted-foreground w-10 md:w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetZoom} title="Reset Zoom">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 md:gap-2 p-2 md:p-3 border-b border-white/10 bg-background/50 flex-shrink-0 overflow-x-auto">
        <Button
          variant={isCropping ? "default" : "outline"}
          size="sm"
          className="text-xs md:text-sm h-8"
          onClick={() => {
            setIsCropping(!isCropping);
            setCropArea(null);
          }}
        >
          <Crop className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          Crop
        </Button>
        {isCropping && cropArea && cropArea.width > 10 && (
          <Button size="sm" className="text-xs md:text-sm h-8" onClick={applyCrop}>
            Apply
          </Button>
        )}
        {isCropping && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs md:text-sm h-8"
            onClick={() => {
              setIsCropping(false);
              setCropArea(null);
            }}
          >
            Cancel
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="text-xs md:text-sm h-8" onClick={handleDownload}>
          <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>

      {/* Image Area */}
      <div className="flex-1 overflow-auto p-2 md:p-4 bg-muted/20 min-h-0">
        <div 
          ref={imageContainerRef}
          className={cn(
            "relative mx-auto inline-block max-w-full",
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
          <img
            src={currentImage}
            alt={projectName}
            className="max-w-full max-h-[40vh] md:max-h-[50vh] h-auto rounded-lg shadow-xl transition-transform object-contain"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            draggable={false}
          />
          
          {/* Crop overlay */}
          {isCropping && cropArea && (
            <>
              <div 
                className="absolute inset-0 bg-black/50 pointer-events-none"
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
        </div>
      </div>

      {/* AI Edit Input */}
      <div className="p-2 md:p-4 border-t border-white/10 bg-background/80 backdrop-blur-xl flex-shrink-0">
        <Card className="p-2 md:p-3 bg-background/50 border-white/10">
          <div className="flex gap-2">
            <Textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="Describe edit... (e.g., 'make darker')"
              className="min-h-[50px] md:min-h-[60px] resize-none bg-transparent border-none focus-visible:ring-0 text-sm"
              disabled={isEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAIEdit();
                }
              }}
            />
            <Button 
              onClick={handleAIEdit} 
              disabled={isEditing || !editPrompt.trim()}
              className="self-end h-10 w-10"
              size="icon"
            >
              {isEditing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">
            Enter to send • Shift+Enter for new line
          </p>
        </Card>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
