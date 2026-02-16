import { useCallback, useRef } from "react";
import { Layer, TextLayer, ShapeLayer, ImageLayer, BackgroundLayer, IconLayer } from "./types";
import { toast } from "sonner";
import { getIconComponent } from "./IconRenderer";
import * as ReactDOMServer from "react-dom/server";
import React from "react";

interface ExportOptions {
  format: "png" | "jpg" | "pdf";
  quality?: number;
  scale?: number;
}

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
    const match = gradientStr.match(/linear-gradient\(\s*(\d+)deg\s*,\s*(.+)\)/);
    if (!match) {
      const noAngle = gradientStr.match(/linear-gradient\(\s*(.+)\)/);
      if (!noAngle) return null;
      const stops = parseColorStops(noAngle[1]);
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      stops.forEach(s => grad.addColorStop(s.offset, s.color));
      return grad;
    }
    
    const angle = parseInt(match[1]);
    const stops = parseColorStops(match[2]);
    
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

/**
 * Generate a proper SVG data URI from a Lucide icon component.
 * This avoids blob URLs which can fail due to timing/CORS issues.
 */
function generateIconSvgDataUri(iconName: string, color: string, strokeWidth: number, size: number): string {
  const IconComp = getIconComponent(iconName);
  if (!IconComp) {
    // Fallback: simple circle with letter
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" fill="${color}" font-size="12">${iconName[0]}</text></svg>`)}`;
  }
  
  try {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      React.createElement(IconComp, {
        width: size,
        height: size,
        color: color,
        strokeWidth: strokeWidth,
      })
    );
    return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
  } catch {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}"><circle cx="12" cy="12" r="10"/></svg>`)}`;
  }
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
              ctx.drawImage(img, x, y, w, h);
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

          case "arrow": {
            const arrowSize = Math.min(w, h) * 0.3;
            ctx.beginPath();
            ctx.moveTo(x, y + h / 2);
            ctx.lineTo(x + w - arrowSize, y + h / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w, y + h / 2);
            ctx.lineTo(x + w - arrowSize, y + h / 2 - arrowSize / 2);
            ctx.lineTo(x + w - arrowSize, y + h / 2 + arrowSize / 2);
            ctx.closePath();
            ctx.fill();
            break;
          }
        }
        break;
      }

      case "icon": {
        const iconLayer = layer as IconLayer;
        const x = layer.x * scale;
        const y = layer.y * scale;
        const w = layer.width * scale;
        const h = layer.height * scale;
        
        // Use data URI (inline SVG) instead of blob URL for reliable rendering
        const svgSize = Math.max(w, h) * 2; // 2x for crisp rendering
        const dataUri = generateIconSvgDataUri(
          iconLayer.iconName,
          iconLayer.color,
          iconLayer.strokeWidth,
          svgSize
        );
        
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, x, y, w, h);
            resolve();
          };
          img.onerror = () => {
            // Ultimate fallback: draw colored circle
            ctx.strokeStyle = iconLayer.color;
            ctx.lineWidth = iconLayer.strokeWidth * scale;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2 * 0.8, 0, Math.PI * 2);
            ctx.stroke();
            resolve();
          };
          img.src = dataUri;
        });
        break;
      }

      // Sketch layer type
      case "sketch" as any: {
        const sketchLayer = layer as any;
        if (sketchLayer.dataUrl) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, layer.x * scale, layer.y * scale, layer.width * scale, layer.height * scale);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = sketchLayer.dataUrl;
          });
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
      options: ExportOptions,
      addWatermark: boolean = false
    ): Promise<Blob | null> => {
      if (exportingRef.current) {
        toast.error("Export already in progress");
        return null;
      }

      exportingRef.current = true;

      try {
        const scale = options.scale || 2;
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth * scale;
        canvas.height = canvasHeight * scale;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        if (options.format === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

        for (const layer of sortedLayers) {
          await renderLayerToCanvas(ctx, layer, scale);
        }

        // Add "Made with EPIC" watermark for free-tier users
        if (addWatermark) {
          const fontSize = Math.max(12, Math.round(canvas.width * 0.018));
          ctx.save();
          ctx.globalAlpha = 0.45;
          ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "rgba(0,0,0,0.5)";
          ctx.lineWidth = 2;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          const text = "Made with EPIC • no-edit.lovable.app";
          const xPos = canvas.width - fontSize * 0.8;
          const yPos = canvas.height - fontSize * 0.6;
          ctx.strokeText(text, xPos, yPos);
          ctx.fillText(text, xPos, yPos);
          ctx.restore();
        }

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
      filename: string = "design",
      isPremium: boolean = false
    ) => {
      toast.info("Preparing your design...");

      const addWatermark = !isPremium;
      const blob = await exportCanvas(layers, canvasWidth, canvasHeight, options, addWatermark);
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
