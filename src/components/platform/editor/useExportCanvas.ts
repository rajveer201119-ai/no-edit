import { useCallback, useRef } from "react";
import { Layer, TextLayer, ShapeLayer, ImageLayer, BackgroundLayer } from "./types";
import { toast } from "sonner";

interface ExportOptions {
  format: "png" | "jpg" | "pdf";
  quality?: number;
  scale?: number;
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
        ctx.fillStyle = bgLayer.backgroundColor;
        ctx.fillRect(
          layer.x * scale,
          layer.y * scale,
          layer.width * scale,
          layer.height * scale
        );
        
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
