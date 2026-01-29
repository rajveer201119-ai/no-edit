import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Template, TemplateElement, getRandomTemplate } from "./templates";
import type { DesignCategory } from "./DesignTypeModal";
import type { ToolType } from "./WorkspaceToolbar";

interface CanvasWorkspaceProps {
  template: Template | null;
  activeTool: ToolType;
  onElementSelect?: (element: TemplateElement | null) => void;
}

export const CanvasWorkspace = ({
  template,
  activeTool,
  onElementSelect,
}: CanvasWorkspaceProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [hasEdited, setHasEdited] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Load template elements
  useEffect(() => {
    if (template) {
      setElements(template.elements);
      setSelectedElement(null);
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
      onElementSelect?.(element || null);
      
      // If text element and text tool, enable editing
      if (element?.type === "text" && (activeTool === "text" || activeTool === "select")) {
        setEditingText(elementId);
      }
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
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

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Start with a template or create freely.</p>
          <p className="text-sm">Select a design type from the Quick Start strip above.</p>
        </div>
      </div>
    );
  }

  // Calculate scale to fit canvas in viewport
  const maxWidth = 600;
  const maxHeight = 500;
  const scaleX = maxWidth / template.canvasWidth;
  const scaleY = maxHeight / template.canvasHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  return (
    <div
      className="flex-1 flex items-center justify-center bg-muted/10 p-4 overflow-auto"
      onClick={handleCanvasClick}
    >
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              👆 Tap text to edit
            </div>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: template.canvasWidth * scale,
            height: template.canvasHeight * scale,
          }}
        >
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
        </div>
      </div>
    </div>
  );
};
