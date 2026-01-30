import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  MousePointer2,
  Type,
  ImageIcon,
  Upload,
  Crop,
  Shapes,
  Sparkles,
  PaintBucket,
  Layers,
  Wand2,
} from "lucide-react";

export type ToolType =
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

interface WorkspaceToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  disabled?: boolean;
}

const tools = [
  { id: "select" as const, label: "Select / Move", icon: MousePointer2 },
  { id: "text" as const, label: "Text", icon: Type },
  { id: "image" as const, label: "Image", icon: ImageIcon },
  { id: "upload" as const, label: "Upload", icon: Upload },
  { id: "crop" as const, label: "Crop", icon: Crop },
  { id: "shapes" as const, label: "Shapes", icon: Shapes },
  { id: "elements" as const, label: "Elements / Icons", icon: Layers },
  { id: "background" as const, label: "Background", icon: PaintBucket },
  { id: "effects" as const, label: "Effects", icon: Sparkles },
  { id: "enhance" as const, label: "Enhance (AI)", icon: Wand2 },
];

export const WorkspaceToolbar = ({
  activeTool,
  onToolChange,
  disabled = false,
}: WorkspaceToolbarProps) => {
  const isMobile = useIsMobile();

  // Mobile: Horizontal scrollable strip at bottom
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/30 safe-area-pb">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-1 p-2 min-w-max">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;

              return (
                <Button
                  key={tool.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-12 min-w-[56px] flex-col gap-1 rounded-xl transition-all duration-200 px-2",
                    isActive
                      ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onToolChange(tool.id)}
                  disabled={disabled}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] leading-none whitespace-nowrap">
                    {tool.label.split(" ")[0]}
                  </span>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  // Desktop: Vertical fixed sidebar
  return (
    <TooltipProvider delayDuration={200}>
      <div className="fixed left-0 top-16 bottom-0 w-14 bg-background/90 backdrop-blur-xl border-r border-border/30 z-40">
        <div className="flex flex-col items-center gap-1 p-2 pt-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => onToolChange(tool.id)}
                    disabled={disabled}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {tool.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
