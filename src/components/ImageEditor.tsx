import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Crop, 
  Send, 
  Loader2, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  MessageSquare,
  Image as ImageIcon,
  Sparkles
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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("preview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to the editor! Describe any changes you'd like to make to "${projectName}". For example: "make it darker", "add a border", or "change the background to blue".`,
      timestamp: new Date()
    }
  ]);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
      
      const response = await fetch(currentImage);
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
      
      if (cropWidth < 10 || cropHeight < 10) {
        throw new Error("Crop area too small");
      }
      
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
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to create blob"));
        }, "image/png");
      });
      
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
      
      await supabase
        .from("projects")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", projectId);
      
      setCurrentImage(publicUrl);
      onImageUpdate(publicUrl);
      setIsCropping(false);
      setCropArea(null);
      
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "✅ Image cropped successfully!",
        timestamp: new Date()
      }]);
      
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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: editPrompt,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    const processingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "✨ Processing your edit...",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, processingMessage]);
    
    setIsEditing(true);
    const prompt = editPrompt;
    setEditPrompt("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to edit images");
      }
      
      const { data, error } = await supabase.functions.invoke("edit-image", {
        body: {
          imageUrl: currentImage,
          prompt: prompt,
          projectId,
          userId: user.id
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image returned");

      setCurrentImage(data.imageUrl);
      onImageUpdate(data.imageUrl);
      
      setChatMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat({
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ Done! I've applied "${prompt}" to your design. Want any more changes?`,
        timestamp: new Date()
      }));
      
      toast.success("Image edited successfully!");
    } catch (error: any) {
      console.error("AI edit error:", error);
      setChatMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat({
        id: Date.now().toString(),
        role: "assistant",
        content: `❌ Sorry, I couldn't apply that edit: ${error?.message || "Unknown error"}. Please try again.`,
        timestamp: new Date()
      }));
      toast.error(error?.message || "Failed to edit image");
    } finally {
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
    <div className="h-[calc(100vh-3.5rem)] md:h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-border/50 bg-background/95 backdrop-blur-xl flex-shrink-0">
        <h2 className="text-sm md:text-base font-semibold truncate max-w-[180px] md:max-w-none flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-primary" />
          {projectName}
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="md:hidden flex border-b border-border/50 bg-background/95">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            activeTab === "chat" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            activeTab === "preview" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground"
          )}
        >
          <ImageIcon className="h-4 w-4" />
          Preview
        </button>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Panel - Desktop always visible, Mobile conditional */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 md:border-r border-border/50 flex-shrink-0 flex flex-col",
          activeTab === "chat" ? "flex" : "hidden md:flex"
        )}>
          <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">
            {/* Chat Header */}
            <div className="flex items-center gap-2 p-3 border-b border-border/50">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Editor</span>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3" ref={chatScrollRef}>
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-3 border-t border-border/50">
              <div className="flex gap-2">
                <Textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Describe your edit..."
                  className="min-h-[44px] max-h-[120px] resize-none bg-muted/50 border-border/50 text-sm rounded-xl"
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
                  size="icon"
                  className="h-11 w-11 rounded-xl shrink-0"
                >
                  {isEditing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                Press Enter to send
              </p>
            </div>
          </div>
        </div>

        {/* Preview Panel - Desktop always visible, Mobile conditional */}
        <div className={cn(
          "flex-1 min-w-0 flex flex-col",
          activeTab === "preview" ? "flex" : "hidden md:flex"
        )}>
          <div className="flex flex-col h-full bg-card/50">
            {/* Preview Header with Tools */}
            <div className="flex items-center justify-between p-2 md:p-3 border-b border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="flex items-center gap-1 md:gap-2 overflow-x-auto">
                <Button
                  variant={isCropping ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-8 shrink-0"
                  onClick={() => {
                    setIsCropping(!isCropping);
                    setCropArea(null);
                  }}
                >
                  <Crop className="h-3 w-3 mr-1" />
                  Crop
                </Button>
                {isCropping && cropArea && cropArea.width > 10 && (
                  <Button size="sm" className="text-xs h-8 shrink-0" onClick={applyCrop}>
                    Apply
                  </Button>
                )}
                {isCropping && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8 shrink-0"
                    onClick={() => {
                      setIsCropping(false);
                      setCropArea(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleResetZoom}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 ml-1" onClick={handleDownload}>
                  <Download className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </div>
            </div>

            {/* Image Canvas */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#0a0a0a]">
              <div 
                ref={imageContainerRef}
                className={cn(
                  "relative inline-block",
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
                  className="max-w-full max-h-[60vh] md:max-h-[70vh] h-auto rounded-lg shadow-2xl transition-transform object-contain"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                  draggable={false}
                />
                
                {/* Crop overlay */}
                {isCropping && cropArea && (
                  <>
                    <div 
                      className="absolute inset-0 bg-black/60 pointer-events-none"
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
          </div>
        </div>
      </div>
    </div>
  );
};
