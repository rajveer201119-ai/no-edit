import { useCallback } from "react";
import { toast } from "sonner";
import { TextOverlay } from "@/components/TextToolPanel";
import { ImageOverlay } from "./CanvasOverlays";

// Gradient color parsing helper
const parseGradientColors = (gradient: string): { offset: number; color: string }[] => {
  // Common gradient patterns
  if (gradient.includes("#EB8530") && gradient.includes("#E04724")) {
    return [{ offset: 0, color: "#EB8530" }, { offset: 1, color: "#E04724" }];
  }
  if (gradient.includes("#8B5CF6") && gradient.includes("#EC4899")) {
    return [{ offset: 0, color: "#8B5CF6" }, { offset: 1, color: "#EC4899" }];
  }
  if (gradient.includes("#3B82F6") && gradient.includes("#06B6D4")) {
    return [{ offset: 0, color: "#3B82F6" }, { offset: 1, color: "#06B6D4" }];
  }
  if (gradient.includes("#10B981") && gradient.includes("#14B8A6")) {
    return [{ offset: 0, color: "#10B981" }, { offset: 1, color: "#14B8A6" }];
  }
  if (gradient.includes("#F59E0B") && gradient.includes("#FCD34D")) {
    return [{ offset: 0, color: "#F59E0B" }, { offset: 1, color: "#FCD34D" }];
  }
  // Rainbow gradient
  if (gradient.includes("90deg") || gradient.includes("#84CC16")) {
    return [
      { offset: 0, color: "#EF4444" },
      { offset: 0.25, color: "#F59E0B" },
      { offset: 0.5, color: "#84CC16" },
      { offset: 0.75, color: "#06B6D4" },
      { offset: 1, color: "#8B5CF6" },
    ];
  }
  // Default sunset gradient
  return [
    { offset: 0, color: "#F97316" },
    { offset: 0.5, color: "#EF4444" },
    { offset: 1, color: "#EC4899" },
  ];
};

interface UseFlattenLayersProps {
  imageContainerRef: React.RefObject<HTMLDivElement>;
  currentImageUrl: string;
  overlays: ImageOverlay[];
  textOverlays: TextOverlay[];
}

export const useFlattenLayers = ({
  imageContainerRef,
  currentImageUrl,
  overlays,
  textOverlays,
}: UseFlattenLayersProps) => {
  const flattenLayers = useCallback(async (): Promise<string> => {
    if (!imageContainerRef.current) {
      throw new Error("Image container not available");
    }

    const imgElement = imageContainerRef.current.querySelector("img");
    if (!imgElement) {
      throw new Error("Image element not found");
    }

    // Load base image
    const response = await fetch(currentImageUrl);
    const imageBlob = await response.blob();
    const blobUrl = URL.createObjectURL(imageBlob);

    const baseImg = new Image();
    await new Promise<void>((resolve, reject) => {
      baseImg.onload = () => resolve();
      baseImg.onerror = () => reject(new Error("Failed to load base image"));
      baseImg.src = blobUrl;
    });
    URL.revokeObjectURL(blobUrl);

    // Create canvas at base image size
    const canvas = document.createElement("canvas");
    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    // Draw base image
    ctx.drawImage(baseImg, 0, 0);

    // Calculate scale from display to natural size
    const imgRect = imgElement.getBoundingClientRect();
    const scaleX = baseImg.naturalWidth / imgRect.width;
    const scaleY = baseImg.naturalHeight / imgRect.height;

    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const imgOffsetX = imgRect.left - containerRect.left;
    const imgOffsetY = imgRect.top - containerRect.top;

    // Draw image overlays
    for (const overlay of overlays) {
      const overlayImg = new Image();
      await new Promise<void>((resolve) => {
        overlayImg.onload = () => resolve();
        overlayImg.onerror = () => resolve(); // Skip failed overlays
        overlayImg.src = overlay.src;
      });

      const overlayX = (overlay.x - imgOffsetX) * scaleX;
      const overlayY = (overlay.y - imgOffsetY) * scaleY;
      const overlayW = overlay.width * scaleX;
      const overlayH = overlay.height * scaleY;

      ctx.drawImage(overlayImg, overlayX, overlayY, overlayW, overlayH);
    }

    // Draw text overlays
    for (const text of textOverlays) {
      const textX = (text.x - imgOffsetX) * scaleX;
      const textY = (text.y - imgOffsetY) * scaleY;
      const scaledFontSize = text.fontSize * scaleX;

      ctx.save();
      ctx.globalAlpha = text.opacity;
      ctx.font = `${text.fontStyle} ${text.fontWeight} ${scaledFontSize}px ${text.fontFamily}`;
      ctx.textBaseline = "top";

      if (text.gradient) {
        const textWidth = ctx.measureText(text.text).width;
        const gradient = ctx.createLinearGradient(textX, textY, textX + textWidth, textY);
        const colors = parseGradientColors(text.gradient);
        colors.forEach(({ offset, color }) => gradient.addColorStop(offset, color));
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = text.color;
      }

      // Apply shadow
      if (!text.gradient && text.textShadow && text.textShadow !== "none") {
        const shadowMatch = text.textShadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px/);
        if (shadowMatch) {
          ctx.shadowOffsetX = parseInt(shadowMatch[1]) * scaleX;
          ctx.shadowOffsetY = parseInt(shadowMatch[2]) * scaleY;
          ctx.shadowBlur = parseInt(shadowMatch[3]) * scaleX;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
        }
      }

      ctx.fillText(text.text, textX, textY);
      ctx.restore();
    }

    return canvas.toDataURL("image/png");
  }, [imageContainerRef, currentImageUrl, overlays, textOverlays]);

  const hasOverlays = overlays.length > 0 || textOverlays.length > 0;

  return { flattenLayers, hasOverlays };
};
