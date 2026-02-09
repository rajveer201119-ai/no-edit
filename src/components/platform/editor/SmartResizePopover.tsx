import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Scaling,
  Instagram,
  Youtube,
  FileText,
  Smartphone,
  Monitor,
  Square,
} from "lucide-react";

interface SmartResizePopoverProps {
  currentWidth: number;
  currentHeight: number;
  onResize: (width: number, height: number) => void;
}

const presets = [
  { label: "Instagram Post", icon: Instagram, w: 1080, h: 1080 },
  { label: "Instagram Story", icon: Smartphone, w: 1080, h: 1920 },
  { label: "YouTube Thumbnail", icon: Youtube, w: 1280, h: 720 },
  { label: "Facebook Cover", icon: Monitor, w: 820, h: 312 },
  { label: "A4 Poster", icon: FileText, w: 794, h: 1123 },
  { label: "Twitter/X Post", icon: Square, w: 1200, h: 675 },
  { label: "LinkedIn Banner", icon: Monitor, w: 1584, h: 396 },
  { label: "Pinterest Pin", icon: Smartphone, w: 1000, h: 1500 },
];

export const SmartResizePopover = ({
  currentWidth,
  currentHeight,
  onResize,
}: SmartResizePopoverProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs px-2">
          <Scaling className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Smart Resize</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="center">
        <p className="text-xs font-semibold mb-1">Smart Resize</p>
        <p className="text-[10px] text-muted-foreground mb-3">
          Resize canvas & scale all elements proportionally
        </p>
        <div className="text-[10px] text-muted-foreground mb-2">
          Current: {currentWidth} × {currentHeight}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isActive = currentWidth === preset.w && currentHeight === preset.h;

            return (
              <button
                key={preset.label}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-left transition-all",
                  "hover:bg-primary/10 border border-transparent",
                  isActive
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "hover:border-border/50"
                )}
                onClick={() => {
                  onResize(preset.w, preset.h);
                  setOpen(false);
                }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-medium leading-tight">{preset.label}</div>
                  <div className="text-[9px] text-muted-foreground">{preset.w}×{preset.h}</div>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
