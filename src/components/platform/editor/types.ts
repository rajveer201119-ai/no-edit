// Layer-based canvas architecture types

export type LayerType = "background" | "image" | "text" | "shape" | "icon" | "graphic" | "overlay";

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

export interface BackgroundLayer extends BaseLayer {
  type: "background";
  backgroundColor: string;
  backgroundImage?: string;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  src: string;
  originalWidth: number;
  originalHeight: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  textAlign: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
}

export interface ShapeLayer extends BaseLayer {
  type: "shape";
  shapeType: "rectangle" | "circle" | "triangle" | "line" | "arrow";
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius?: number;
}

export type Layer = BackgroundLayer | ImageLayer | TextLayer | ShapeLayer;

export interface CanvasState {
  width: number;
  height: number;
  layers: Layer[];
  selectedLayerIds: string[];
  clipboard: Layer[];
}

export interface HistoryEntry {
  layers: Layer[];
  timestamp: number;
}

export interface ProjectFile {
  version: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  canvas: CanvasState;
}

// Tool types
export type EditorTool =
  | "select"
  | "text"
  | "image"
  | "upload"
  | "crop"
  | "shapes"
  | "elements"
  | "background"
  | "effects"
  | "enhance";

// Shape options for the shapes tool
export interface ShapeOption {
  id: ShapeLayer["shapeType"];
  name: string;
  icon: string;
}

// Font options
export interface FontOption {
  value: string;
  label: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Comic Sans MS, cursive", label: "Comic Sans" },
  { value: "Palatino, serif", label: "Palatino" },
];

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: "rectangle", name: "Rectangle", icon: "□" },
  { id: "circle", name: "Circle", icon: "○" },
  { id: "triangle", name: "Triangle", icon: "△" },
  { id: "line", name: "Line", icon: "—" },
  { id: "arrow", name: "Arrow", icon: "→" },
];

export const COLOR_PRESETS = [
  "#ffffff", "#000000", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#6b7280", "#1f2937", "#991b1b", "#9a3412", "#854d0e",
  "#166534", "#115e59", "#1e40af", "#5b21b6", "#9d174d",
];
