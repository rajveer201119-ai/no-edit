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
        "fixed h-12 bg-background/90 backdrop-blur-xl border-b border-border/30 z-40",
        isMobile ? "top-16 left-0 right-0" : "top-16 left-14 right-0"
      )}>
        <div className="flex items-center justify-between h-full px-3 md:px-4 gap-2">
          {/* Left: Project Name + Save Status */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink">
            <span className="text-sm font-medium text-foreground truncate max-w-[80px] sm:max-w-[150px] md:max-w-[200px]">
              {projectName}
            </span>
            {isSaving ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </span>
            ) : showSaved ? (
              <span className="flex items-center gap-1 text-xs text-primary shrink-0">
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            ) : null}
          </div>

          {/* Center: Actions */}
          <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
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

            <div className="w-px h-4 bg-border/30 mx-0.5 hidden sm:block" />

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

            {!isMobile && (
              <>
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
                      <span className="hidden lg:inline">Resize</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resize Canvas</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>

          {/* Right: Export */}
          <Button
            onClick={onExport}
            className="h-8 gap-1.5 bg-primary hover:bg-primary/90 min-h-[36px] shrink-0 px-3"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
