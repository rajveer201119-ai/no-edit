import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Save, Undo, Redo, Maximize, Download, Check, Loader2 } from "lucide-react";

interface WorkspaceTopBarProps {
  projectName?: string;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onResize?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const WorkspaceTopBar = ({
  projectName = "Untitled Design",
  onSave,
  onUndo,
  onRedo,
  onResize,
  onExport,
  isSaving = false,
  canUndo = false,
  canRedo = false,
}: WorkspaceTopBarProps) => {
  const isMobile = useIsMobile();
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      setShowSaved(true);
      toast.success("Design saved!");
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    } else {
      toast.info("Undo - Coming soon!");
    }
  };

  const handleRedo = () => {
    if (onRedo) {
      onRedo();
    } else {
      toast.info("Redo - Coming soon!");
    }
  };

  const handleResize = () => {
    if (onResize) {
      onResize();
    } else {
      toast.info("Resize canvas - Coming soon!");
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn(
        "fixed top-16 right-0 h-12 bg-background/80 backdrop-blur-xl border-b border-border/30 z-30",
        isMobile ? "left-0" : "left-14"
      )}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Project Name + Save Status */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-foreground truncate max-w-[100px] md:max-w-[200px]">
              {projectName}
            </span>
            {isSaving ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </span>
            ) : showSaved ? (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            ) : null}
          </div>

          {/* Center: Actions (desktop only) */}
          {!isMobile && (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-border/30 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleUndo}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRedo}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-border/30 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-2" 
                    onClick={handleResize}
                  >
                    <Maximize className="h-4 w-4" />
                    <span className="hidden sm:inline">Resize</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Resize Canvas</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Right: Export */}
          <Button
            onClick={onExport}
            className="h-8 gap-2 bg-primary hover:bg-primary/90 min-h-[36px]"
          >
            <Download className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Export</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
