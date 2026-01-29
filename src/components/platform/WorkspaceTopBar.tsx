import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  return (
    <div className="fixed top-16 left-14 right-0 h-12 bg-background/80 backdrop-blur-xl border-b border-border/30 z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Project Name + Save Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {projectName}
          </span>
          {isSaving ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
        </div>

        {/* Center: Undo/Redo/Resize */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border/50 mx-2" />
          <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={onResize}>
            <Maximize className="h-4 w-4" />
            <span className="hidden sm:inline">Resize</span>
          </Button>
        </div>

        {/* Right: Export */}
        <Button
          onClick={onExport}
          className="h-8 gap-2 bg-primary hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          <span>Export Design</span>
        </Button>
      </div>
    </div>
  );
};
