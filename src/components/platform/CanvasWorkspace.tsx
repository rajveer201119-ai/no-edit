import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Template, TemplateElement } from "./templates";
import type { DesignCategory } from "./DesignTypeModal";
import type { ToolType } from "./WorkspaceToolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Upload, X, Move } from "lucide-react";

interface CanvasWorkspaceProps {
  template: Template | null;
  activeTool: ToolType;
  onElementSelect?: (element: TemplateElement | null) => void;
  onExportCanvas?: () => HTMLCanvasElement | null;
}

interface ImportedImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CanvasWorkspace = ({
  template,
  activeTool,
  onElementSelect,
}: CanvasWorkspaceProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [importedImages, setImportedImages] = useState<ImportedImage[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [hasEdited, setHasEdited] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Drag state for imported images
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load template elements
  useEffect(() => {
    if (template) {
      setElements(template.elements);
      setSelectedElement(null);
      setImportedImages([]);
      setHasEdited(false);
      setShowTooltip(true);
    }
  }, [template]);

  // Hide tooltip after first edit
  useEffect(() => {
    if (hasEdited) {
      setShowTooltip(false);
    }
  }, [hasEdited]);

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === elementId);
    
    if (activeTool === "select" || activeTool === "text") {
      setSelectedElement(elementId);
      setSelectedImage(null);
      onElementSelect?.(element || null);
      
      // If text element and text tool, enable editing
      if (element?.type === "text" && (activeTool === "text" || activeTool === "select")) {
        setEditingText(elementId);
      }
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
    setSelectedImage(null);
    setEditingText(null);
    onElementSelect?.(null);
  };

  const handleTextChange = (elementId: string, newContent: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, content: newContent } : el))
    );
    if (!hasEdited) {
      setHasEdited(true);
      toast.success("Design saved automatically!", { duration: 2000 });
    }
  };

  const handleTextBlur = () => {
    setEditingText(null);
  };

  // Handle image import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpe?g|webp)$/)) {
      toast.error("Please upload PNG, JPG, or WEBP files only");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate size to fit within canvas while maintaining aspect ratio
        const maxSize = 300;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = width * ratio;
          height = height * ratio;
        }

        const newImage: ImportedImage = {
          id: `img-${Date.now()}`,
          src: event.target?.result as string,
          x: 50,
          y: 50,
          width,
          height,
        };
        
        setImportedImages((prev) => [...prev, newImage]);
        setSelectedImage(newImage.id);
        
        if (!hasEdited) {
          setHasEdited(true);
        }
        toast.success("Image imported! Drag to position.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image selection
  const handleImageClick = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(imageId);
    setSelectedElement(null);
  };

  // Handle image drag start
  const handleImageMouseDown = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const image = importedImages.find((img) => img.id === imageId);
    if (!image || activeTool !== "select") return;

    setIsDragging(true);
    setSelectedImage(imageId);
    setDragOffset({
      x: e.clientX - image.x,
      y: e.clientY - image.y,
    });
  };

  // Handle image drag
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedImage) return;

      setImportedImages((prev) =>
        prev.map((img) =>
          img.id === selectedImage
            ? { ...img, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : img
        )
      );
    },
    [isDragging, selectedImage, dragOffset]
  );

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (!hasEdited) {
        setHasEdited(true);
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = (imageId: string) => {
    setImportedImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImage(null);
  };

  // Handle tool-specific actions
  useEffect(() => {
    if (activeTool === "upload") {
      handleImportClick();
    } else if (activeTool === "enhance") {
      toast.info("AI Enhance - Feature coming soon!", { duration: 3000 });
    } else if (activeTool === "effects") {
      toast.info("Effects panel - Feature coming soon!", { duration: 2000 });
    } else if (activeTool === "background") {
      toast.info("Background tool - Feature coming soon!", { duration: 2000 });
    } else if (activeTool === "shapes") {
      toast.info("Shapes tool - Feature coming soon!", { duration: 2000 });
    } else if (activeTool === "elements") {
      toast.info("Elements library - Feature coming soon!", { duration: 2000 });
    } else if (activeTool === "image") {
      handleImportClick();
    }
  }, [activeTool]);

  if (!template) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 min-h-[60vh] p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Start with a template or create freely.</p>
          <p className="text-sm mb-6">Select a design type from the Quick Start strip above.</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button variant="outline" className="gap-2" onClick={handleImportClick}>
            <Upload className="h-4 w-4" />
            Import Your Design
          </Button>
        </div>
      </div>
    );
  }

  // Calculate scale to fit canvas in viewport
  const maxWidth = isMobile ? window.innerWidth - 32 : 600;
  const maxHeight = isMobile ? window.innerHeight * 0.6 : 500;
  const scaleX = maxWidth / template.canvasWidth;
  const scaleY = maxHeight / template.canvasHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  return (
    <div
      className={cn(
        "flex-1 flex items-center justify-center bg-muted/10 p-4 overflow-auto",
        isMobile && "pb-20" // Account for bottom toolbar
      )}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="relative">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
              👆 Tap text to edit
            </div>
          </div>
        )}

        {/* Import Button (visible in top-right of canvas) */}
        <Button
          variant="outline"
          size="sm"
          className="absolute -top-10 right-0 z-10 gap-1 text-xs"
          onClick={handleImportClick}
        >
          <Plus className="h-3 w-3" />
          Import Image
        </Button>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: template.canvasWidth * scale,
            height: template.canvasHeight * scale,
          }}
        >
          {/* Template Elements */}
          {elements.map((element) => {
            const isSelected = selectedElement === element.id;
            const isEditing = editingText === element.id;

            const style: React.CSSProperties = {
              position: "absolute",
              left: element.x * scale,
              top: element.y * scale,
              width: element.width * scale,
              height: element.height * scale,
              backgroundColor: element.backgroundColor,
              borderRadius: element.borderRadius ? element.borderRadius * scale : undefined,
            };

            if (element.type === "shape") {
              return (
                <div
                  key={element.id}
                  style={style}
                  className={cn(
                    "cursor-pointer transition-all",
                    isSelected && "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={(e) => handleElementClick(element.id, e)}
                />
              );
            }

            if (element.type === "text") {
              return (
                <div
                  key={element.id}
                  style={style}
                  className={cn(
                    "cursor-pointer transition-all flex items-start",
                    isSelected && "ring-2 ring-primary ring-offset-1"
                  )}
                  onClick={(e) => handleElementClick(element.id, e)}
                >
                  {isEditing ? (
                    <textarea
                      autoFocus
                      value={element.content || ""}
                      onChange={(e) => handleTextChange(element.id, e.target.value)}
                      onBlur={handleTextBlur}
                      className="w-full h-full bg-transparent border-none outline-none resize-none"
                      style={{
                        color: element.color,
                        fontSize: (element.fontSize || 16) * scale,
                        fontWeight: element.fontWeight || "normal",
                        lineHeight: 1.2,
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: element.color,
                        fontSize: (element.fontSize || 16) * scale,
                        fontWeight: element.fontWeight || "normal",
                        lineHeight: 1.2,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {element.content}
                    </span>
                  )}
                </div>
              );
            }

            return null;
          })}

          {/* Imported Images */}
          {importedImages.map((img) => {
            const isSelected = selectedImage === img.id;

            return (
              <div
                key={img.id}
                className={cn(
                  "absolute cursor-move group",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
                style={{
                  left: img.x,
                  top: img.y,
                  width: img.width,
                  height: img.height,
                }}
                onClick={(e) => handleImageClick(img.id, e)}
                onMouseDown={(e) => handleImageMouseDown(img.id, e)}
              >
                <img
                  src={img.src}
                  alt="Imported"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
                
                {/* Remove button */}
                {isSelected && (
                  <button
                    className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}

                {/* Move indicator */}
                {isSelected && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Move className="h-3 w-3 inline mr-1" />
                    Drag to move
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Export function to get canvas as image - will be wired to top bar
export const exportCanvasAsImage = (
  canvasRef: React.RefObject<HTMLDivElement>,
  format: "png" | "jpg" = "png"
): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!canvasRef.current) {
      resolve(null);
      return;
    }

    // Use html2canvas or similar library in production
    // For now, return a simple implementation
    resolve(null);
  });
};
