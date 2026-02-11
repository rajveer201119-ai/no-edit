import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Package, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CanvasState } from "./types";
import { useExportCanvas } from "./useExportCanvas";

interface ExportSizePackProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasState: CanvasState;
  projectName?: string;
}

const SOCIAL_SIZES = [
  { id: "ig-post", label: "Instagram Post", w: 1080, h: 1080, icon: "📸" },
  { id: "ig-story", label: "Instagram Story", w: 1080, h: 1920, icon: "📱" },
  { id: "yt-thumb", label: "YouTube Thumbnail", w: 1280, h: 720, icon: "▶️" },
  { id: "fb-cover", label: "Facebook Cover", w: 1920, h: 1080, icon: "📘" },
  { id: "twitter", label: "Twitter/X Post", w: 1200, h: 675, icon: "🐦" },
  { id: "linkedin", label: "LinkedIn Post", w: 1200, h: 627, icon: "💼" },
  { id: "favicon", label: "Favicon / Icon", w: 512, h: 512, icon: "🌐" },
  { id: "whatsapp", label: "WhatsApp Status", w: 1080, h: 1920, icon: "💬" },
];

export const ExportSizePack = ({
  open,
  onOpenChange,
  canvasState,
  projectName = "design",
}: ExportSizePackProps) => {
  const [selected, setSelected] = useState<string[]>(["ig-post", "ig-story", "yt-thumb"]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { downloadExport } = useExportCanvas();

  const toggleSize = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const scaleLayersToSize = (targetW: number, targetH: number) => {
    const scaleX = targetW / canvasState.width;
    const scaleY = targetH / canvasState.height;

    return canvasState.layers.map((layer) => ({
      ...layer,
      x: layer.x * scaleX,
      y: layer.y * scaleY,
      width: layer.width * scaleX,
      height: layer.height * scaleY,
      ...(layer.type === "text"
        ? { fontSize: Math.round((layer as any).fontSize * Math.min(scaleX, scaleY)) }
        : {}),
    }));
  };

  const handleExportPack = async () => {
    if (selected.length === 0) {
      toast.error("Select at least one size");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    const sizes = SOCIAL_SIZES.filter((s) => selected.includes(s.id));

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      setExportProgress(((i + 1) / sizes.length) * 100);

      try {
        const scaledLayers = scaleLayersToSize(size.w, size.h);
        await downloadExport(
          scaledLayers as any,
          size.w,
          size.h,
          { format: "png", quality: 0.95, scale: 1 },
          `${projectName}-${size.id}`
        );
        // Small delay between downloads
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`Failed to export ${size.label}:`, err);
      }
    }

    setIsExporting(false);
    setExportProgress(0);
    onOpenChange(false);
    toast.success(`✅ Exported ${sizes.length} sizes!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Export Size Pack
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Export your design in multiple social media sizes at once.
        </p>

        <div className="space-y-2">
          {SOCIAL_SIZES.map((size) => (
            <label
              key={size.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                selected.includes(size.id)
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/20"
              )}
            >
              <Checkbox
                checked={selected.includes(size.id)}
                onCheckedChange={() => toggleSize(size.id)}
              />
              <span className="text-lg">{size.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{size.label}</p>
                <p className="text-xs text-muted-foreground">{size.w}×{size.h}px</p>
              </div>
            </label>
          ))}
        </div>

        {isExporting && (
          <div className="space-y-2">
            <Progress value={exportProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Exporting... {Math.round(exportProgress)}%
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected(SOCIAL_SIZES.map((s) => s.id))}
          >
            Select All
          </Button>
          <Button
            onClick={handleExportPack}
            disabled={isExporting || selected.length === 0}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export {selected.length} Sizes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
