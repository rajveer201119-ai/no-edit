import { useCallback, useRef } from "react";
import { Layer, TextLayer, ShapeLayer, ImageLayer, BackgroundLayer, IconLayer } from "./types";
import { toast } from "sonner";

interface ExportOptions {
  format: "png" | "jpg" | "pdf";
  quality?: number;
  scale?: number;
}

// Lucide icon SVG paths for export
const iconSvgPaths: Record<string, string> = {
  Star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  Heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  Circle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  Square: "M3 3h18v18H3z",
  Triangle: "M12 2L2 22h20L12 2z",
  ArrowRight: "M5 12h14M12 5l7 7-7 7",
  ArrowUp: "M12 19V5M5 12l7-7 7 7",
  ArrowDown: "M12 5v14M5 12l7 7 7-7",
  ArrowLeft: "M19 12H5M12 19l-7-7 7-7",
  Check: "M20 6L9 17l-5-5",
  X: "M18 6L6 18M6 6l12 12",
  Plus: "M12 5v14M5 12h14",
  Minus: "M5 12h14",
  AlertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  Info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01",
  HelpCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  Mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  Phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  MapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  Calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18",
  Clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  User: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  Users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  Home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  Settings: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",
  Search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  Bookmark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  Flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  Award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  Zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  Sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  Moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  Cloud: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  Flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  Droplet: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  Leaf: "M11 20A7 7 0 0 1 9.8 6.4C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  Music: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  Camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  Video: "M23 7l-7 5 7 5zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
  Mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
  Headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  Globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  Lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  Unlock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 9.9-1",
  Eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  Bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  Gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  ShoppingCart: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  CreditCard: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM1 10h22",
  DollarSign: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  TrendingUp: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  TrendingDown: "M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6",
  Activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  Target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  Download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  Upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  Send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  File: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM13 2v7h7",
  FileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  Folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  Image: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
  Type: "M4 7V4h16v3M9 20h6M12 4v16",
  Smile: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  ThumbsUp: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
  ThumbsDown: "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17",
  Coffee: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3",
  Briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  GraduationCap: "M22 10l-10-5L2 10l10 5 10-5v6M6 12v5c0 2 3 3 6 3s6-1 6-3v-5",
  Book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z",
  Lightbulb: "M9 18h6M12 2a7 7 0 0 0-5 11.9V15a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.1A7 7 0 0 0 12 2z",
  Rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  Sparkles: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0zM20 3v4M22 5h-4M4 17v2M5 18H3",
  Crown: "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18",
  Trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z",
  Hexagon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  Pentagon: "M12 2l9.5 7-3.6 11H6.1L2.5 9 12 2z",
  Octagon: "M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z",
};

// Parse CSS gradient string into canvas gradient
function parseGradientToCanvas(
  ctx: CanvasRenderingContext2D,
  gradientStr: string,
  x: number,
  y: number,
  w: number,
  h: number
): CanvasGradient | null {
  try {
    // Extract angle and color stops from linear-gradient
    const match = gradientStr.match(/linear-gradient\(\s*(\d+)deg\s*,\s*(.+)\)/);
    if (!match) {
      // Try without angle (default 180deg)
      const noAngle = gradientStr.match(/linear-gradient\(\s*(.+)\)/);
      if (!noAngle) return null;
      const stops = parseColorStops(noAngle[1]);
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      stops.forEach(s => grad.addColorStop(s.offset, s.color));
      return grad;
    }
    
    const angle = parseInt(match[1]);
    const stops = parseColorStops(match[2]);
    
    // Convert angle to gradient coordinates
    const rad = (angle - 90) * Math.PI / 180;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const len = Math.max(w, h);
    const grad = ctx.createLinearGradient(
      cx - Math.cos(rad) * len / 2,
      cy - Math.sin(rad) * len / 2,
      cx + Math.cos(rad) * len / 2,
      cy + Math.sin(rad) * len / 2
    );
    stops.forEach(s => grad.addColorStop(s.offset, s.color));
    return grad;
  } catch {
    return null;
  }
}

function parseColorStops(stopsStr: string): { offset: number; color: string }[] {
  const parts = stopsStr.split(/,(?![^(]*\))/);
  return parts.map((part, i) => {
    const trimmed = part.trim();
    const percentMatch = trimmed.match(/(.+?)\s+(\d+)%/);
    if (percentMatch) {
      return { color: percentMatch[1].trim(), offset: parseInt(percentMatch[2]) / 100 };
    }
    return { color: trimmed, offset: i / Math.max(parts.length - 1, 1) };
  });
}

export function useExportCanvas() {
  const exportingRef = useRef(false);

  const renderLayerToCanvas = async (
    ctx: CanvasRenderingContext2D,
    layer: Layer,
    scale: number = 1
  ) => {
    if (!layer.visible) return;

    ctx.save();
    ctx.globalAlpha = layer.opacity;

    // Apply rotation if any
    if (layer.rotation !== 0) {
      const centerX = (layer.x + layer.width / 2) * scale;
      const centerY = (layer.y + layer.height / 2) * scale;
      ctx.translate(centerX, centerY);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    switch (layer.type) {
      case "background": {
        const bgLayer = layer as BackgroundLayer;
        const x = layer.x * scale;
        const y = layer.y * scale;
        const w = layer.width * scale;
        const h = layer.height * scale;
        
        // Handle gradient backgrounds
        if (bgLayer.backgroundColor && bgLayer.backgroundColor.includes("gradient")) {
          const gradientFill = parseGradientToCanvas(ctx, bgLayer.backgroundColor, x, y, w, h);
          if (gradientFill) {
            ctx.fillStyle = gradientFill;
          } else {
            ctx.fillStyle = "#ffffff";
          }
        } else {
          ctx.fillStyle = bgLayer.backgroundColor || "#ffffff";
        }
        ctx.fillRect(x, y, w, h);
        
        if (bgLayer.backgroundImage) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              ctx.drawImage(
                img,
                layer.x * scale,
                layer.y * scale,
                layer.width * scale,
                layer.height * scale
              );
              resolve();
            };
            img.onerror = () => resolve();
            img.src = bgLayer.backgroundImage;
          });
        }
        break;
      }

      case "image": {
        const imgLayer = layer as ImageLayer;
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(
              img,
              layer.x * scale,
              layer.y * scale,
              layer.width * scale,
              layer.height * scale
            );
            resolve();
          };
          img.onerror = () => {
            console.error("Failed to load image:", imgLayer.src);
            resolve();
          };
          img.src = imgLayer.src;
        });
        break;
      }

      case "text": {
        const textLayer = layer as TextLayer;
        ctx.fillStyle = textLayer.color;
        ctx.font = `${textLayer.fontStyle} ${textLayer.fontWeight} ${textLayer.fontSize * scale}px ${textLayer.fontFamily}`;
        ctx.textAlign = textLayer.textAlign;
        ctx.textBaseline = "top";
        
        const x = textLayer.textAlign === "center"
          ? (layer.x + layer.width / 2) * scale
          : textLayer.textAlign === "right"
          ? (layer.x + layer.width) * scale
          : layer.x * scale;
        
        // Handle multiline text
        const lines = textLayer.content.split("\n");
        const lineHeightPx = textLayer.fontSize * textLayer.lineHeight * scale;
        
        lines.forEach((line, i) => {
          ctx.fillText(line, x, layer.y * scale + i * lineHeightPx);
        });
        break;
      }

      case "shape": {
        const shapeLayer = layer as ShapeLayer;
        ctx.fillStyle = shapeLayer.fillColor;
        ctx.strokeStyle = shapeLayer.strokeColor;
        ctx.lineWidth = shapeLayer.strokeWidth * scale;

        const x = layer.x * scale;
        const y = layer.y * scale;
        const w = layer.width * scale;
        const h = layer.height * scale;

        switch (shapeLayer.shapeType) {
          case "rectangle":
            if (shapeLayer.borderRadius) {
              const r = shapeLayer.borderRadius * scale;
              ctx.beginPath();
              ctx.roundRect(x, y, w, h, r);
              ctx.fill();
              if (shapeLayer.strokeWidth > 0) ctx.stroke();
            } else {
              ctx.fillRect(x, y, w, h);
              if (shapeLayer.strokeWidth > 0) ctx.strokeRect(x, y, w, h);
            }
            break;

          case "circle":
            ctx.beginPath();
            ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            if (shapeLayer.strokeWidth > 0) ctx.stroke();
            break;

          case "triangle":
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.closePath();
            ctx.fill();
            if (shapeLayer.strokeWidth > 0) ctx.stroke();
            break;

          case "line":
            ctx.beginPath();
            ctx.moveTo(x, y + h / 2);
            ctx.lineTo(x + w, y + h / 2);
            ctx.stroke();
            break;

          case "arrow":
            const arrowSize = Math.min(w, h) * 0.3;
            ctx.beginPath();
            ctx.moveTo(x, y + h / 2);
            ctx.lineTo(x + w - arrowSize, y + h / 2);
            ctx.stroke();
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(x + w, y + h / 2);
            ctx.lineTo(x + w - arrowSize, y + h / 2 - arrowSize / 2);
            ctx.lineTo(x + w - arrowSize, y + h / 2 + arrowSize / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }
        break;
      }

      case "icon": {
        const iconLayer = layer as IconLayer;
        const x = layer.x * scale;
        const y = layer.y * scale;
        const w = layer.width * scale;
        const h = layer.height * scale;
        
        // Render the icon using SVG path
        const svgPath = iconSvgPaths[iconLayer.iconName];
        
        if (svgPath) {
          // Create an SVG element and render to canvas via Image
          const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${iconLayer.color}" stroke-width="${iconLayer.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
              <path d="${svgPath}"/>
            </svg>
          `;
          
          await new Promise<void>((resolve) => {
            const img = new Image();
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
              ctx.drawImage(img, x, y, w, h);
              URL.revokeObjectURL(url);
              resolve();
            };
            img.onerror = () => {
              // Fallback: draw a circle with icon name
              ctx.strokeStyle = iconLayer.color;
              ctx.lineWidth = iconLayer.strokeWidth * scale;
              ctx.beginPath();
              ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2 * 0.8, 0, Math.PI * 2);
              ctx.stroke();
              
              ctx.fillStyle = iconLayer.color;
              ctx.font = `bold ${Math.min(w, h) * 0.3}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(iconLayer.iconName[0].toUpperCase(), x + w / 2, y + h / 2);
              
              URL.revokeObjectURL(url);
              resolve();
            };
            img.src = url;
          });
        } else {
          // For unknown icons, draw a placeholder with the icon name
          const iconSize = Math.min(w, h) * 0.8;
          const centerX = x + w / 2;
          const centerY = y + h / 2;
          
          ctx.strokeStyle = iconLayer.color;
          ctx.lineWidth = iconLayer.strokeWidth * scale;
          ctx.beginPath();
          ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.fillStyle = iconLayer.color;
          ctx.font = `bold ${iconSize * 0.4}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(iconLayer.iconName[0].toUpperCase(), centerX, centerY);
        }
        break;
      }
    }

    ctx.restore();
  };

  const exportCanvas = useCallback(
    async (
      layers: Layer[],
      canvasWidth: number,
      canvasHeight: number,
      options: ExportOptions
    ): Promise<Blob | null> => {
      if (exportingRef.current) {
        toast.error("Export already in progress");
        return null;
      }

      exportingRef.current = true;

      try {
        const scale = options.scale || 2; // 2x for high resolution
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth * scale;
        canvas.height = canvasHeight * scale;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        // Set white background for JPG
        if (options.format === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Sort layers by zIndex and render
        const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

        for (const layer of sortedLayers) {
          await renderLayerToCanvas(ctx, layer, scale);
        }

        // Convert to blob
        const mimeType = options.format === "jpg" ? "image/jpeg" : "image/png";
        const quality = options.quality || 0.95;

        return new Promise((resolve) => {
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            mimeType,
            quality
          );
        });
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Export failed. Please try again.");
        return null;
      } finally {
        exportingRef.current = false;
      }
    },
    []
  );

  const downloadExport = useCallback(
    async (
      layers: Layer[],
      canvasWidth: number,
      canvasHeight: number,
      options: ExportOptions,
      filename: string = "design"
    ) => {
      toast.info("Preparing your design...");

      const blob = await exportCanvas(layers, canvasWidth, canvasHeight, options);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${options.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${options.format.toUpperCase()}!`);
    },
    [exportCanvas]
  );

  return {
    exportCanvas,
    downloadExport,
  };
}
