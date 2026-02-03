import { useEffect, useState, useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import type { Template } from "./templates";

interface TemplatePreviewProps {
  template: Template;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Generate a visual preview of a template as a canvas-rendered image
const generatePreview = (template: Template, scale: number): string => {
  const canvas = document.createElement("canvas");
  canvas.width = template.canvasWidth * scale;
  canvas.height = template.canvasHeight * scale;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // Render elements
  const sortedElements = [...template.elements];

  for (const el of sortedElements) {
    ctx.save();

    const x = el.x * scale;
    const y = el.y * scale;
    const w = el.width * scale;
    const h = el.height * scale;

    if (el.type === "shape" && el.backgroundColor) {
      ctx.fillStyle = el.backgroundColor;
      
      if (el.borderRadius && el.borderRadius > 0) {
        const r = Math.min(el.borderRadius * scale, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(x, y, w, h);
      }
    }

    if (el.type === "text" && el.content) {
      const fontSize = Math.max(8, (el.fontSize || 16) * scale);
      ctx.font = `${el.fontWeight || "normal"} ${fontSize}px sans-serif`;
      ctx.fillStyle = el.color || "#000000";
      ctx.textBaseline = "top";
      
      // Handle multi-line text
      const lines = el.content.split("\n");
      const lineHeight = fontSize * 1.2;
      lines.forEach((line, i) => {
        ctx.fillText(line, x, y + i * lineHeight);
      });
    }

    ctx.restore();
  }

  return canvas.toDataURL("image/png");
};

export const TemplatePreview = memo(({ template, size = "md", className }: TemplatePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState(false);

  // Scale based on size
  const scale = useMemo(() => {
    switch (size) {
      case "sm": return 0.08;
      case "md": return 0.12;
      case "lg": return 0.2;
      default: return 0.12;
    }
  }, [size]);

  useEffect(() => {
    try {
      const preview = generatePreview(template, scale);
      if (preview) {
        setPreviewUrl(preview);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error("Failed to generate preview:", e);
      setError(true);
    }
  }, [template, scale]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Fallback if preview fails
  if (error || !previewUrl) {
    const bgColor = template.elements.find((e) => e.type === "shape")?.backgroundColor || "#1a1a2e";
    
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg text-xs font-medium text-center p-2",
          sizeClasses[size],
          className
        )}
        style={{ backgroundColor: bgColor, color: "#ffffff" }}
      >
        <span className="line-clamp-2">{template.name}</span>
      </div>
    );
  }

  return (
    <img
      src={previewUrl}
      alt={template.name}
      className={cn(
        "object-contain rounded-lg bg-muted/30",
        sizeClasses[size],
        className
      )}
      loading="lazy"
    />
  );
});

TemplatePreview.displayName = "TemplatePreview";

// Full-size template card with preview
interface TemplateCardProps {
  template: Template;
  onUse: () => void;
  className?: string;
}

export const TemplateCard = memo(({ template, onUse, className }: TemplateCardProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    try {
      const preview = generatePreview(template, 0.15);
      if (preview) setPreviewUrl(preview);
    } catch (e) {
      console.error("Failed to generate preview:", e);
    }
  }, [template]);

  const bgColor = template.elements.find((e) => e.id === "bg")?.backgroundColor || "#1a1a2e";

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden border border-border/30",
        "hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer",
        className
      )}
      onClick={onUse}
    >
      {/* Preview */}
      <div
        className="aspect-square flex items-center justify-center p-2"
        style={{ backgroundColor: bgColor }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={template.name}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-white/80 text-sm font-medium text-center px-2">
            {template.name}
          </span>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onUse();
          }}
        >
          Use Template
        </button>
      </div>

      {/* Info */}
      <div className="p-3 bg-card">
        <p className="text-sm font-medium truncate">{template.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{template.category}</p>
      </div>
    </div>
  );
});

TemplateCard.displayName = "TemplateCard";

// Export the generator function for external use
export { generatePreview };
