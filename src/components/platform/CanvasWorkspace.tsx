import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Template, TemplateElement } from "./templates";
import type { ToolType } from "./WorkspaceToolbar";
import {
  Layer,
  TextLayer,
  ShapeLayer,
  ImageLayer,
  BackgroundLayer,
  IconLayer as IconLayerType,
  useLayerManager,
  useExportCanvas,
  useKeyboardShortcuts,
  LayerPanel,
  TextToolPanel,
  ShapesToolPanel,
  CropToolPanel,
  BackgroundPanel,
  CanvasRenderer,
  ElementsToolPanel,
  UploadModal,
} from "./editor";
import { LucideIcon } from "lucide-react";

interface CanvasWorkspaceProps {
  template: Template | null;
  activeTool: ToolType;
  onElementSelect?: (element: TemplateElement | null) => void;
  onTemplateChange?: (template: Template) => void;
  initialImportedImage?: string | null;
  onSaveStatusChange?: (status: "saved" | "saving" | "unsaved") => void;
  onCanUndo?: (canUndo: boolean) => void;
  onCanRedo?: (canRedo: boolean) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
}

export const CanvasWorkspace = ({
  template,
  activeTool,
  onElementSelect,
  onTemplateChange,
  initialImportedImage,
  onSaveStatusChange,
  onCanUndo,
  onCanRedo,
}: CanvasWorkspaceProps) => {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(100);
  const [showLayerPanel, setShowLayerPanel] = useState(!isMobile);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Layer manager hook
  const {
    canvasState,
    setCanvasState,
    isSaving,
    saveStatus,
    canUndo,
    canRedo,
    undo,
    redo,
    addLayer,
    updateLayer,
    commitLayerChanges,
    deleteLayer,
    duplicateLayer,
    toggleLayerLock,
    toggleLayerVisibility,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    selectLayer,
    clearSelection,
    copySelectedLayers,
    pasteFromClipboard,
    setBackgroundColor,
  } = useLayerManager();

  // Export hook
  const { downloadExport } = useExportCanvas();

  // Notify parent of save status changes
  useEffect(() => {
    onSaveStatusChange?.(saveStatus);
  }, [saveStatus, onSaveStatusChange]);

  useEffect(() => {
    onCanUndo?.(canUndo);
    onCanRedo?.(canRedo);
  }, [canUndo, canRedo, onCanUndo, onCanRedo]);

  // Convert template to layers on load
  useEffect(() => {
    if (template) {
      setIsLoading(true);
      
      const layers: Layer[] = template.elements.map((el, index) => {
        const baseProps = {
          id: el.id,
          name: el.type === "text" ? (el.content?.slice(0, 20) || "Text") : el.type.charAt(0).toUpperCase() + el.type.slice(1),
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: index,
        };

        if (el.type === "shape") {
          return {
            ...baseProps,
            type: el.id === "bg" ? "background" : "shape",
            shapeType: "rectangle",
            fillColor: el.backgroundColor || "#cccccc",
            strokeColor: "transparent",
            strokeWidth: 0,
            borderRadius: el.borderRadius,
            backgroundColor: el.backgroundColor,
          } as ShapeLayer | BackgroundLayer;
        }

        if (el.type === "text") {
          return {
            ...baseProps,
            type: "text",
            content: el.content || "",
            fontFamily: "Inter, sans-serif",
            fontSize: el.fontSize || 16,
            fontWeight: el.fontWeight || "normal",
            fontStyle: "normal",
            color: el.color || "#000000",
            textAlign: "left",
            letterSpacing: 0,
            lineHeight: 1.2,
          } as TextLayer;
        }

        return baseProps as Layer;
      });

      setCanvasState((prev) => ({
        ...prev,
        width: template.canvasWidth,
        height: template.canvasHeight,
        layers,
        selectedLayerIds: [],
      }));

      setTimeout(() => setIsLoading(false), 300);
    }
  }, [template]);

  // Handle initial imported image
  useEffect(() => {
    if (initialImportedImage) {
      const img = new Image();
      img.onload = () => {
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = width * ratio;
          height = height * ratio;
        }

        const newLayer: ImageLayer = {
          id: `image-${Date.now()}`,
          type: "image",
          name: "Imported Image",
          x: (canvasState.width - width) / 2,
          y: (canvasState.height - height) / 2,
          width,
          height,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: canvasState.layers.length,
          src: initialImportedImage,
          originalWidth: img.width,
          originalHeight: img.height,
        };

        addLayer(newLayer);
        selectLayer(newLayer.id);
        toast.success("Image imported! Drag to position.");
      };
      img.src = initialImportedImage;
    }
  }, [initialImportedImage]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onCopy: copySelectedLayers,
    onPaste: pasteFromClipboard,
    onDelete: () => {
      canvasState.selectedLayerIds.forEach((id) => {
        const layer = canvasState.layers.find((l) => l.id === id);
        if (layer && layer.type !== "background") {
          deleteLayer(id);
        }
      });
    },
    onDuplicate: () => {
      canvasState.selectedLayerIds.forEach((id) => duplicateLayer(id));
    },
    onSelectAll: () => {
      setCanvasState((prev) => ({
        ...prev,
        selectedLayerIds: prev.layers.filter((l) => l.type !== "background").map((l) => l.id),
      }));
    },
    onDeselect: clearSelection,
    onBringForward: () => {
      if (canvasState.selectedLayerIds.length === 1) {
        bringForward(canvasState.selectedLayerIds[0]);
      }
    },
    onSendBackward: () => {
      if (canvasState.selectedLayerIds.length === 1) {
        sendBackward(canvasState.selectedLayerIds[0]);
      }
    },
    onSave: () => toast.success("Project saved!"),
    onZoomIn: () => setZoom((prev) => Math.min(prev + 10, 200)),
    onZoomOut: () => setZoom((prev) => Math.max(prev - 10, 25)),
    onZoomReset: () => setZoom(100),
  });

  // Handle file upload from modal
  const handleImageUpload = useCallback((imageData: string, fileName: string, dimensions: { width: number; height: number }) => {
    const maxSize = 400;
    let width = dimensions.width;
    let height = dimensions.height;
    
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = width * ratio;
      height = height * ratio;
    }

    const newLayer: ImageLayer = {
      id: `image-${Date.now()}`,
      type: "image",
      name: fileName.slice(0, 20),
      x: (canvasState.width - width) / 2,
      y: (canvasState.height - height) / 2,
      width,
      height,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: canvasState.layers.length,
      src: imageData,
      originalWidth: dimensions.width,
      originalHeight: dimensions.height,
    };

    addLayer(newLayer);
    selectLayer(newLayer.id);
  }, [canvasState, addLayer, selectLayer]);

  // Add text layer
  const handleAddText = useCallback((x?: number, y?: number) => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type: "text",
      name: "New Text",
      x: x ?? canvasState.width / 2 - 100,
      y: y ?? canvasState.height / 2 - 20,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: canvasState.layers.length,
      content: "Double-click to edit",
      fontFamily: "Inter, sans-serif",
      fontSize: 24,
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#000000",
      textAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.2,
    };

    addLayer(newLayer);
    selectLayer(newLayer.id);
    toast.success("Text added! Double-click to edit.");
  }, [canvasState, addLayer, selectLayer]);

  // Add shape layer
  const handleAddShape = useCallback((shapeType: ShapeLayer["shapeType"]) => {
    const size = shapeType === "line" || shapeType === "arrow" ? { w: 200, h: 10 } : { w: 100, h: 100 };
    
    const newLayer: ShapeLayer = {
      id: `shape-${Date.now()}`,
      type: "shape",
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      x: canvasState.width / 2 - size.w / 2,
      y: canvasState.height / 2 - size.h / 2,
      width: size.w,
      height: size.h,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: canvasState.layers.length,
      shapeType,
      fillColor: "#3b82f6",
      strokeColor: "#1e40af",
      strokeWidth: 2,
      borderRadius: shapeType === "rectangle" ? 8 : 0,
    };

    addLayer(newLayer);
    selectLayer(newLayer.id);
    toast.success(`${newLayer.name} added!`);
  }, [canvasState, addLayer, selectLayer]);

  // Add icon as proper icon layer
  const handleAddIcon = useCallback((iconName: string, _svgPath: string, _IconComponent?: LucideIcon) => {
    const newLayer: IconLayerType = {
      id: `icon-${Date.now()}`,
      type: "icon",
      name: iconName,
      x: canvasState.width / 2 - 40,
      y: canvasState.height / 2 - 40,
      width: 80,
      height: 80,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: canvasState.layers.length,
      iconName: iconName,
      color: "#3b82f6",
      strokeWidth: 2,
    };

    addLayer(newLayer);
    selectLayer(newLayer.id);
  }, [canvasState, addLayer, selectLayer]);

  // Add graphic
  const handleAddGraphic = useCallback((graphicType: string) => {
    const isCircle = graphicType.includes("circle") || graphicType.includes("blob");
    const colors: Record<string, string> = {
      "badge-circle": "#3b82f6",
      "badge-ribbon": "#ef4444",
      "banner-wave": "#10b981",
      "divider-line": "#6b7280",
      "divider-dots": "#6b7280",
      "frame-simple": "#1f2937",
      "frame-rounded": "#1f2937",
      "callout-arrow": "#f59e0b",
      "blob-1": "#8b5cf6",
      "blob-2": "#ec4899",
      "gradient-circle": "#6366f1",
      "gradient-rect": "#14b8a6",
    };

    const newLayer: ShapeLayer = {
      id: `graphic-${Date.now()}`,
      type: "shape",
      name: graphicType,
      x: canvasState.width / 2 - 60,
      y: canvasState.height / 2 - 60,
      width: 120,
      height: 120,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: canvasState.layers.length,
      shapeType: isCircle ? "circle" : "rectangle",
      fillColor: colors[graphicType] || "#3b82f6",
      strokeColor: "transparent",
      strokeWidth: 0,
      borderRadius: isCircle ? 60 : 16,
    };

    addLayer(newLayer);
    selectLayer(newLayer.id);
  }, [canvasState, addLayer, selectLayer]);

  // Handle canvas click for text tool
  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (activeTool === "text") {
      handleAddText(x, y);
    }
  }, [activeTool, handleAddText]);

  // Get selected layer for tool panels
  const selectedLayer = canvasState.layers.find((l) =>
    canvasState.selectedLayerIds.includes(l.id)
  );

  // Get background color
  const bgLayer = canvasState.layers.find((l) => l.type === "background") as BackgroundLayer | undefined;
  const backgroundColor = bgLayer?.backgroundColor || "#ffffff";

  // Trigger tool-specific actions
  useEffect(() => {
    if (activeTool === "upload" || activeTool === "image") {
      setShowUploadModal(true);
    } else if (activeTool === "enhance") {
      toast.info("AI Enhance - Feature coming soon!", { duration: 3000 });
    } else if (activeTool === "effects") {
      toast.info("Effects panel - Feature coming soon!", { duration: 2000 });
    }
    
    // Show tool panel for relevant tools
    if (["text", "shapes", "crop", "background", "elements"].includes(activeTool)) {
      setShowToolPanel(true);
    } else {
      setShowToolPanel(false);
    }
  }, [activeTool]);

  // Render tool panel content
  const renderToolPanel = () => {
    switch (activeTool) {
      case "text":
        return (
          <TextToolPanel
            selectedLayer={selectedLayer?.type === "text" ? (selectedLayer as TextLayer) : null}
            onAddText={() => handleAddText()}
            onUpdateText={(updates) => {
              if (selectedLayer) {
                updateLayer(selectedLayer.id, updates);
              }
            }}
          />
        );
      case "shapes":
        return (
          <ShapesToolPanel
            selectedLayer={selectedLayer?.type === "shape" ? (selectedLayer as ShapeLayer) : null}
            onAddShape={handleAddShape}
            onUpdateShape={(updates) => {
              if (selectedLayer) {
                updateLayer(selectedLayer.id, updates);
              }
            }}
          />
        );
      case "elements":
        return (
          <ElementsToolPanel
            onAddIcon={handleAddIcon}
            onAddGraphic={handleAddGraphic}
          />
        );
      case "crop":
        return (
          <CropToolPanel
            selectedLayer={selectedLayer?.type === "image" ? (selectedLayer as ImageLayer) : null}
            onApplyCrop={(cropData) => {
              if (selectedLayer) {
                updateLayer(selectedLayer.id, {
                  cropX: cropData.x,
                  cropY: cropData.y,
                  cropWidth: cropData.width,
                  cropHeight: cropData.height,
                });
                commitLayerChanges();
                toast.success("Crop applied!");
              }
            }}
            onCancel={() => setShowToolPanel(false)}
          />
        );
      case "background":
        return (
          <BackgroundPanel
            backgroundColor={backgroundColor}
            onColorChange={(color) => {
              setBackgroundColor(color);
              toast.success("Background updated!");
            }}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (!template) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 min-h-[50vh] p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Start with a template or create freely.</p>
          <p className="text-sm mb-6">Select a design type from the Quick Start strip above.</p>
          
          <Button variant="outline" className="gap-2 min-h-[44px]" onClick={() => setShowUploadModal(true)}>
            <Layers className="h-4 w-4" />
            Import Your Design
          </Button>
        </div>

        <UploadModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          onImageUpload={handleImageUpload}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", isMobile && "pb-24")}>
      {/* Upload Modal */}
      <UploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onImageUpload={handleImageUpload}
      />

      {/* Zoom Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom((prev) => Math.max(prev - 10, 25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-14 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(100)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Layers toggle */}
          <Button
            variant={showLayerPanel ? "default" : "ghost"}
            size="sm"
            className="gap-2 h-8"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
          >
            <Layers className="h-4 w-4" />
            <span className="hidden md:inline">Layers</span>
          </Button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tool Panel (Desktop) */}
        {showToolPanel && !isMobile && (
          <div className="w-64 border-r border-border/30 bg-background/50 backdrop-blur-sm">
            <div className="h-full">
              {renderToolPanel()}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/10 p-4 overflow-auto">
          {isLoading ? (
            <Skeleton className="w-[400px] h-[400px] rounded-lg" />
          ) : (
            <CanvasRenderer
              width={canvasState.width}
              height={canvasState.height}
              layers={canvasState.layers}
              selectedLayerIds={canvasState.selectedLayerIds}
              zoom={zoom}
              activeTool={activeTool}
              onLayerSelect={selectLayer}
              onLayerUpdate={updateLayer}
              onLayerCommit={commitLayerChanges}
              onCanvasClick={handleCanvasClick}
              onClearSelection={clearSelection}
            />
          )}
        </div>

        {/* Layer Panel (Desktop) */}
        {showLayerPanel && !isMobile && (
          <div className="w-64">
            <LayerPanel
              layers={canvasState.layers}
              selectedLayerIds={canvasState.selectedLayerIds}
              onSelectLayer={selectLayer}
              onToggleLock={toggleLayerLock}
              onToggleVisibility={toggleLayerVisibility}
              onDeleteLayer={deleteLayer}
              onDuplicateLayer={duplicateLayer}
              onBringForward={bringForward}
              onSendBackward={sendBackward}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
            />
          </div>
        )}
      </div>

      {/* Mobile Tool Panel (Sheet) */}
      {isMobile && showToolPanel && (
        <Sheet open={showToolPanel} onOpenChange={setShowToolPanel}>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle className="capitalize">{activeTool} Tool</SheetTitle>
            </SheetHeader>
            <div className="h-full pt-4">
              {renderToolPanel()}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Layer Panel (Sheet) */}
      {isMobile && (
        <Sheet open={showLayerPanel} onOpenChange={setShowLayerPanel}>
          <SheetContent side="right" className="w-[280px] p-0">
            <LayerPanel
              layers={canvasState.layers}
              selectedLayerIds={canvasState.selectedLayerIds}
              onSelectLayer={selectLayer}
              onToggleLock={toggleLayerLock}
              onToggleVisibility={toggleLayerVisibility}
              onDeleteLayer={deleteLayer}
              onDuplicateLayer={duplicateLayer}
              onBringForward={bringForward}
              onSendBackward={sendBackward}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
