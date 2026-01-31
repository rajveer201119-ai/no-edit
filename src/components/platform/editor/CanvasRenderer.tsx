import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Layer, TextLayer, ShapeLayer, ImageLayer } from "./types";

interface CanvasRendererProps {
  width: number;
  height: number;
  layers: Layer[];
  selectedLayerIds: string[];
  zoom: number;
  activeTool: string;
  onLayerSelect: (id: string, multiSelect?: boolean) => void;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
  onLayerCommit: () => void;
  onCanvasClick: (x: number, y: number) => void;
  onClearSelection: () => void;
}

interface DragState {
  isDragging: boolean;
  layerId: string | null;
  startX: number;
  startY: number;
  startLayerX: number;
  startLayerY: number;
}

interface ResizeState {
  isResizing: boolean;
  layerId: string | null;
  handle: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLayerX: number;
  startLayerY: number;
}

export const CanvasRenderer = ({
  width,
  height,
  layers,
  selectedLayerIds,
  zoom,
  activeTool,
  onLayerSelect,
  onLayerUpdate,
  onLayerCommit,
  onCanvasClick,
  onClearSelection,
}: CanvasRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    layerId: null,
    startX: 0,
    startY: 0,
    startLayerX: 0,
    startLayerY: 0,
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    layerId: null,
    handle: "",
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLayerX: 0,
    startLayerY: 0,
  });

  const scale = zoom / 100;

  // Get position from event
  const getEventPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ("changedTouches" in e && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    if ("clientX" in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  // Handle layer drag start
  const handleDragStart = (layerId: string, e: React.MouseEvent | React.TouchEvent) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer || layer.locked || activeTool !== "select") return;

    e.stopPropagation();
    e.preventDefault();

    const pos = getEventPos(e);
    setDragState({
      isDragging: true,
      layerId,
      startX: pos.x,
      startY: pos.y,
      startLayerX: layer.x,
      startLayerY: layer.y,
    });
  };

  // Handle resize start
  const handleResizeStart = (
    layerId: string,
    handle: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer || layer.locked || activeTool !== "select") return;

    e.stopPropagation();
    e.preventDefault();

    const pos = getEventPos(e);
    setResizeState({
      isResizing: true,
      layerId,
      handle,
      startX: pos.x,
      startY: pos.y,
      startWidth: layer.width,
      startHeight: layer.height,
      startLayerX: layer.x,
      startLayerY: layer.y,
    });
  };

  // Handle mouse/touch move
  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const pos = getEventPos(e);

      if (dragState.isDragging && dragState.layerId) {
        e.preventDefault();
        const deltaX = (pos.x - dragState.startX) / scale;
        const deltaY = (pos.y - dragState.startY) / scale;
        onLayerUpdate(dragState.layerId, {
          x: dragState.startLayerX + deltaX,
          y: dragState.startLayerY + deltaY,
        });
      }

      if (resizeState.isResizing && resizeState.layerId) {
        e.preventDefault();
        const deltaX = (pos.x - resizeState.startX) / scale;
        const deltaY = (pos.y - resizeState.startY) / scale;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startLayerX;
        let newY = resizeState.startLayerY;

        // Handle different resize handles
        if (resizeState.handle.includes("e")) {
          newWidth = Math.max(20, resizeState.startWidth + deltaX);
        }
        if (resizeState.handle.includes("w")) {
          newWidth = Math.max(20, resizeState.startWidth - deltaX);
          newX = resizeState.startLayerX + deltaX;
        }
        if (resizeState.handle.includes("s")) {
          newHeight = Math.max(20, resizeState.startHeight + deltaY);
        }
        if (resizeState.handle.includes("n")) {
          newHeight = Math.max(20, resizeState.startHeight - deltaY);
          newY = resizeState.startLayerY + deltaY;
        }

        onLayerUpdate(resizeState.layerId, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }
    },
    [dragState, resizeState, scale, onLayerUpdate]
  );

  // Handle mouse/touch up
  const handleUp = useCallback(() => {
    if (dragState.isDragging || resizeState.isResizing) {
      onLayerCommit();
    }
    setDragState((prev) => ({ ...prev, isDragging: false, layerId: null }));
    setResizeState((prev) => ({ ...prev, isResizing: false, layerId: null }));
  }, [dragState.isDragging, resizeState.isResizing, onLayerCommit]);

  // Attach global listeners for drag/resize
  useEffect(() => {
    if (dragState.isDragging || resizeState.isResizing) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);

      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
      };
    }
  }, [dragState.isDragging, resizeState.isResizing, handleMove, handleUp]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (dragState.isDragging || resizeState.isResizing) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Check if clicked on any layer
    const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
    for (const layer of sortedLayers) {
      if (!layer.visible) continue;
      if (
        x >= layer.x &&
        x <= layer.x + layer.width &&
        y >= layer.y &&
        y <= layer.y + layer.height
      ) {
        onLayerSelect(layer.id, e.shiftKey);
        return;
      }
    }

    // Clicked on empty space
    if (activeTool === "text") {
      onCanvasClick(x, y);
    } else {
      onClearSelection();
    }
    setEditingTextId(null);
  };

  // Handle text double click for editing
  const handleTextDoubleClick = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId) as TextLayer | undefined;
    if (!layer || layer.locked) return;

    setEditingTextId(layerId);
    setEditingContent(layer.content);
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
    if (editingTextId) {
      onLayerUpdate(editingTextId, { content: e.target.value });
    }
  };

  // Handle text blur
  const handleTextBlur = () => {
    if (editingTextId) {
      onLayerCommit();
    }
    setEditingTextId(null);
  };

  // Render resize handles
  const renderResizeHandles = (layer: Layer) => {
    const handles = ["nw", "ne", "sw", "se", "n", "s", "e", "w"];
    const size = 10;

    return handles.map((handle) => {
      let left = 0;
      let top = 0;
      let cursor = "default";

      switch (handle) {
        case "nw":
          left = -size / 2;
          top = -size / 2;
          cursor = "nwse-resize";
          break;
        case "ne":
          left = layer.width * scale - size / 2;
          top = -size / 2;
          cursor = "nesw-resize";
          break;
        case "sw":
          left = -size / 2;
          top = layer.height * scale - size / 2;
          cursor = "nesw-resize";
          break;
        case "se":
          left = layer.width * scale - size / 2;
          top = layer.height * scale - size / 2;
          cursor = "nwse-resize";
          break;
        case "n":
          left = (layer.width * scale) / 2 - size / 2;
          top = -size / 2;
          cursor = "ns-resize";
          break;
        case "s":
          left = (layer.width * scale) / 2 - size / 2;
          top = layer.height * scale - size / 2;
          cursor = "ns-resize";
          break;
        case "e":
          left = layer.width * scale - size / 2;
          top = (layer.height * scale) / 2 - size / 2;
          cursor = "ew-resize";
          break;
        case "w":
          left = -size / 2;
          top = (layer.height * scale) / 2 - size / 2;
          cursor = "ew-resize";
          break;
      }

      return (
        <div
          key={handle}
          className="absolute bg-white border-2 border-primary rounded-sm z-50"
          style={{
            left,
            top,
            width: size,
            height: size,
            cursor,
          }}
          onMouseDown={(e) => handleResizeStart(layer.id, handle, e)}
          onTouchStart={(e) => handleResizeStart(layer.id, handle, e)}
        />
      );
    });
  };

  // Render a single layer
  const renderLayer = (layer: Layer) => {
    const isSelected = selectedLayerIds.includes(layer.id);
    const isEditing = editingTextId === layer.id;

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: layer.x * scale,
      top: layer.y * scale,
      width: layer.width * scale,
      height: layer.height * scale,
      opacity: layer.opacity,
      transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
      transformOrigin: "center center",
      pointerEvents: layer.locked ? "none" : "auto",
      zIndex: layer.zIndex,
    };

    switch (layer.type) {
      case "background": {
        const bgLayer = layer as any;
        return (
          <div
            key={layer.id}
            style={{
              ...baseStyle,
              backgroundColor: bgLayer.backgroundColor,
              backgroundImage: bgLayer.backgroundImage ? `url(${bgLayer.backgroundImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onLayerSelect(layer.id);
            }}
          />
        );
      }

      case "image": {
        const imgLayer = layer as ImageLayer;
        return (
          <div
            key={layer.id}
            className={cn(
              "cursor-move",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            style={baseStyle}
            onClick={(e) => {
              e.stopPropagation();
              onLayerSelect(layer.id);
            }}
            onMouseDown={(e) => handleDragStart(layer.id, e)}
            onTouchStart={(e) => handleDragStart(layer.id, e)}
          >
            <img
              src={imgLayer.src}
              alt={layer.name}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
            {isSelected && !layer.locked && renderResizeHandles(layer)}
          </div>
        );
      }

      case "text": {
        const textLayer = layer as TextLayer;
        return (
          <div
            key={layer.id}
            className={cn(
              "cursor-move",
              isSelected && "ring-2 ring-primary ring-offset-1"
            )}
            style={baseStyle}
            onClick={(e) => {
              e.stopPropagation();
              onLayerSelect(layer.id);
            }}
            onDoubleClick={() => handleTextDoubleClick(layer.id)}
            onMouseDown={(e) => !isEditing && handleDragStart(layer.id, e)}
            onTouchStart={(e) => !isEditing && handleDragStart(layer.id, e)}
          >
            {isEditing ? (
              <textarea
                autoFocus
                value={editingContent}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                className="w-full h-full bg-transparent border-none outline-none resize-none p-0"
                style={{
                  color: textLayer.color,
                  fontSize: textLayer.fontSize * scale,
                  fontFamily: textLayer.fontFamily,
                  fontWeight: textLayer.fontWeight,
                  fontStyle: textLayer.fontStyle,
                  textAlign: textLayer.textAlign,
                  letterSpacing: textLayer.letterSpacing * scale,
                  lineHeight: textLayer.lineHeight,
                  caretColor: textLayer.color,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                style={{
                  color: textLayer.color,
                  fontSize: textLayer.fontSize * scale,
                  fontFamily: textLayer.fontFamily,
                  fontWeight: textLayer.fontWeight,
                  fontStyle: textLayer.fontStyle,
                  textAlign: textLayer.textAlign,
                  letterSpacing: textLayer.letterSpacing * scale,
                  lineHeight: textLayer.lineHeight,
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                }}
              >
                {textLayer.content}
              </div>
            )}
            {isSelected && !layer.locked && !isEditing && renderResizeHandles(layer)}
          </div>
        );
      }

      case "shape": {
        const shapeLayer = layer as ShapeLayer;
        return (
          <div
            key={layer.id}
            className={cn(
              "cursor-move",
              isSelected && "ring-2 ring-primary ring-offset-1"
            )}
            style={baseStyle}
            onClick={(e) => {
              e.stopPropagation();
              onLayerSelect(layer.id);
            }}
            onMouseDown={(e) => handleDragStart(layer.id, e)}
            onTouchStart={(e) => handleDragStart(layer.id, e)}
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${layer.width} ${layer.height}`}
              preserveAspectRatio="none"
            >
              {shapeLayer.shapeType === "rectangle" && (
                <rect
                  x={shapeLayer.strokeWidth / 2}
                  y={shapeLayer.strokeWidth / 2}
                  width={layer.width - shapeLayer.strokeWidth}
                  height={layer.height - shapeLayer.strokeWidth}
                  rx={shapeLayer.borderRadius || 0}
                  fill={shapeLayer.fillColor}
                  stroke={shapeLayer.strokeColor}
                  strokeWidth={shapeLayer.strokeWidth}
                />
              )}
              {shapeLayer.shapeType === "circle" && (
                <ellipse
                  cx={layer.width / 2}
                  cy={layer.height / 2}
                  rx={(layer.width - shapeLayer.strokeWidth) / 2}
                  ry={(layer.height - shapeLayer.strokeWidth) / 2}
                  fill={shapeLayer.fillColor}
                  stroke={shapeLayer.strokeColor}
                  strokeWidth={shapeLayer.strokeWidth}
                />
              )}
              {shapeLayer.shapeType === "triangle" && (
                <polygon
                  points={`${layer.width / 2},${shapeLayer.strokeWidth / 2} ${layer.width - shapeLayer.strokeWidth / 2},${layer.height - shapeLayer.strokeWidth / 2} ${shapeLayer.strokeWidth / 2},${layer.height - shapeLayer.strokeWidth / 2}`}
                  fill={shapeLayer.fillColor}
                  stroke={shapeLayer.strokeColor}
                  strokeWidth={shapeLayer.strokeWidth}
                />
              )}
              {shapeLayer.shapeType === "line" && (
                <line
                  x1={0}
                  y1={layer.height / 2}
                  x2={layer.width}
                  y2={layer.height / 2}
                  stroke={shapeLayer.strokeColor}
                  strokeWidth={Math.max(shapeLayer.strokeWidth, 2)}
                />
              )}
              {shapeLayer.shapeType === "arrow" && (
                <g>
                  <line
                    x1={0}
                    y1={layer.height / 2}
                    x2={layer.width - 15}
                    y2={layer.height / 2}
                    stroke={shapeLayer.strokeColor}
                    strokeWidth={Math.max(shapeLayer.strokeWidth, 2)}
                  />
                  <polygon
                    points={`${layer.width},${layer.height / 2} ${layer.width - 15},${layer.height / 2 - 8} ${layer.width - 15},${layer.height / 2 + 8}`}
                    fill={shapeLayer.fillColor}
                  />
                </g>
              )}
            </svg>
            {isSelected && !layer.locked && renderResizeHandles(layer)}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Sort layers by zIndex for rendering
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
      style={{
        width: width * scale,
        height: height * scale,
        cursor: activeTool === "text" ? "text" : "default",
      }}
      onClick={handleCanvasClick}
    >
      {/* Checkerboard pattern for transparency */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
            linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
            linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          opacity: 0.3,
        }}
      />

      {/* Render all layers */}
      {sortedLayers.map(renderLayer)}
    </div>
  );
};
