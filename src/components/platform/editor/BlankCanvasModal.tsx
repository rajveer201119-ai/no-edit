import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Instagram,
  Smartphone,
  FileText,
  Monitor,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";

interface BlankCanvasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSize: (width: number, height: number, label: string) => void;
}

const presets = [
  { label: "Instagram Post", w: 1080, h: 1080, icon: Instagram, color: "bg-gradient-to-br from-pink-500 to-orange-400" },
  { label: "Instagram Story", w: 1080, h: 1920, icon: Smartphone, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { label: "A4 Poster", w: 794, h: 1123, icon: FileText, color: "bg-gradient-to-br from-blue-500 to-cyan-400" },
  { label: "Presentation (16:9)", w: 1920, h: 1080, icon: Monitor, color: "bg-gradient-to-br from-green-500 to-emerald-400" },
  { label: "Website Banner", w: 1920, h: 600, icon: ImageIcon, color: "bg-gradient-to-br from-amber-500 to-yellow-400" },
  { label: "YouTube Thumbnail", w: 1280, h: 720, icon: Monitor, color: "bg-gradient-to-br from-red-500 to-rose-400" },
  { label: "Facebook Cover", w: 820, h: 312, icon: ImageIcon, color: "bg-gradient-to-br from-blue-600 to-blue-400" },
  { label: "Twitter Header", w: 1500, h: 500, icon: ImageIcon, color: "bg-gradient-to-br from-sky-500 to-cyan-300" },
];

export const BlankCanvasModal = ({ open, onOpenChange, onSelectSize }: BlankCanvasModalProps) => {
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(600);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Start with Blank Canvas</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {presets.map((p) => {
            const Icon = p.icon;
            return (
              <Button
                key={p.label}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-all"
                onClick={() => {
                  onSelectSize(p.w, p.h, p.label);
                  onOpenChange(false);
                }}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", p.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.w} × {p.h}</p>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Custom size */}
        <div className="mt-4 p-4 border border-border/50 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Custom Size</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Width (px)</Label>
              <Input
                type="number"
                value={customW}
                onChange={(e) => setCustomW(Math.max(100, parseInt(e.target.value) || 100))}
                min={100}
                max={4096}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Height (px)</Label>
              <Input
                type="number"
                value={customH}
                onChange={(e) => setCustomH(Math.max(100, parseInt(e.target.value) || 100))}
                min={100}
                max={4096}
                className="h-9"
              />
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              onSelectSize(customW, customH, `Custom (${customW}×${customH})`);
              onOpenChange(false);
            }}
          >
            Create Custom Canvas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
