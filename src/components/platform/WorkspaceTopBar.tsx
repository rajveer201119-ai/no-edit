import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Save,
  Undo2,
  Redo2,
  Download,
  Loader2,
  Check,
  FileDown,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkspaceTopBarProps {
  projectName?: string;
  isSaving?: boolean;
  saveStatus?: "saved" | "saving" | "unsaved";
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSaveProject?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const WorkspaceTopBar = ({
  projectName = "Untitled Design",
  isSaving = false,
  saveStatus = "saved",
  onExport,
  onUndo,
  onRedo,
  onSaveProject,
  canUndo = false,
  canRedo = false,
}: WorkspaceTopBarProps) => {
  const isMobile = useIsMobile();

  const SaveStatusIndicator = () => {
    if (saveStatus === "saving" || isSaving) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="hidden sm:inline">Saving...</span>
        </span>
      );
    }
    if (saveStatus === "saved") {
      return (
        <span className="flex items-center gap-1.5 text-xs text-primary">
          <Check className="h-3 w-3" />
          <span className="hidden sm:inline">Saved</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="w-2 h-2 bg-accent rounded-full" />
        <span className="hidden sm:inline">Unsaved</span>
      </span>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn(
        "fixed h-12 bg-background/90 backdrop-blur-xl border-b border-border/30 z-40",
        isMobile ? "top-16 left-0 right-0" : "top-16 left-0 right-0"
      )}>
        <div className="h-full px-3 md:px-4 flex items-center justify-between gap-3">
          {/* Left: Project Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="font-medium text-sm truncate max-w-[100px] md:max-w-[200px]">
              {projectName}
            </span>
            <SaveStatusIndicator />
          </div>

          {/* Center: Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {onSaveProject && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={onSaveProject}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Project (.epic)</TooltipContent>
              </Tooltip>
            )}

            <Button
              onClick={onExport}
              className={cn(
                "gap-2 h-9 px-3 md:px-4 min-h-[40px]",
                "bg-primary hover:bg-primary/90"
              )}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Export</span>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
