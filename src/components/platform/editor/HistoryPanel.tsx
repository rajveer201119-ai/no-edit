import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  Trash2,
  Copy,
  Edit3,
  MoreVertical,
  FolderOpen,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { CanvasState } from "./types";

const HISTORY_STORAGE_KEY = "epic_design_history";
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  canvasState: CanvasState;
}

interface HistoryPanelProps {
  onLoadDesign: (state: CanvasState) => void;
  currentState?: CanvasState;
}

export const HistoryPanel = ({ onLoadDesign, currentState }: HistoryPanelProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; item: HistoryItem | null }>({
    open: false,
    item: null,
  });
  const [newName, setNewName] = useState("");

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  // Generate thumbnail from canvas state
  const generateThumbnail = useCallback(async (state: CanvasState): Promise<string> => {
    // Create a small canvas for thumbnail
    const canvas = document.createElement("canvas");
    const scale = 100 / Math.max(state.width, state.height);
    canvas.width = state.width * scale;
    canvas.height = state.height * scale;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return "";

    // Fill background
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw layers
    const sortedLayers = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);
    
    for (const layer of sortedLayers) {
      if (!layer.visible) continue;

      ctx.save();
      ctx.globalAlpha = layer.opacity;

      const x = layer.x * scale;
      const y = layer.y * scale;
      const w = layer.width * scale;
      const h = layer.height * scale;

      switch (layer.type) {
        case "background": {
          const bgLayer = layer as any;
          ctx.fillStyle = bgLayer.backgroundColor || "#ffffff";
          ctx.fillRect(x, y, w, h);
          break;
        }
        case "shape": {
          const shapeLayer = layer as any;
          ctx.fillStyle = shapeLayer.fillColor;
          if (shapeLayer.shapeType === "circle") {
            ctx.beginPath();
            ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, w, h);
          }
          break;
        }
        case "text": {
          const textLayer = layer as any;
          ctx.fillStyle = textLayer.color;
          ctx.font = `${Math.max(8, textLayer.fontSize * scale)}px sans-serif`;
          ctx.fillText(textLayer.content.slice(0, 20), x, y + h / 2);
          break;
        }
      }

      ctx.restore();
    }

    return canvas.toDataURL("image/png");
  }, []);

  // Save current design to history
  const saveToHistory = useCallback(async (state: CanvasState, name?: string) => {
    const thumbnail = await generateThumbnail(state);
    const now = new Date().toISOString();

    const newItem: HistoryItem = {
      id: `design-${Date.now()}`,
      name: name || `Design ${new Date().toLocaleDateString()}`,
      thumbnail,
      createdAt: now,
      updatedAt: now,
      canvasState: state,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast.success("Design saved to history!");
  }, [generateThumbnail]);

  // Expose save function
  useEffect(() => {
    if (currentState) {
      (window as any).__epicSaveToHistory = () => saveToHistory(currentState);
    }
    return () => {
      delete (window as any).__epicSaveToHistory;
    };
  }, [currentState, saveToHistory]);

  // Delete from history
  const deleteFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    toast.success("Design removed from history");
  };

  // Duplicate design
  const duplicateDesign = async (item: HistoryItem) => {
    const thumbnail = await generateThumbnail(item.canvasState);
    const now = new Date().toISOString();

    const newItem: HistoryItem = {
      id: `design-${Date.now()}`,
      name: `${item.name} (Copy)`,
      thumbnail,
      createdAt: now,
      updatedAt: now,
      canvasState: JSON.parse(JSON.stringify(item.canvasState)),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast.success("Design duplicated!");
  };

  // Rename design
  const handleRename = () => {
    if (!renameDialog.item || !newName.trim()) return;

    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === renameDialog.item?.id
          ? { ...item, name: newName.trim(), updatedAt: new Date().toISOString() }
          : item
      );
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setRenameDialog({ open: false, item: null });
    setNewName("");
    toast.success("Design renamed!");
  };

  // Filter history
  const filteredHistory = history.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/30 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Designs
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No designs found" : "No recent designs yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your designs will appear here
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative rounded-lg border border-border/50 overflow-hidden",
                  "hover:border-primary/30 hover:shadow-sm transition-all"
                )}
              >
                {/* Thumbnail */}
                <div
                  className="aspect-video bg-muted/30 cursor-pointer relative"
                  onClick={() => {
                    onLoadDesign(item.canvasState);
                    toast.success("Design loaded!");
                  }}
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" className="gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Open
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          onLoadDesign(item.canvasState);
                          toast.success("Design loaded!");
                        }}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateDesign(item)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRenameDialog({ open: true, item });
                          setNewName(item.name);
                        }}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteFromHistory(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Save Current Button */}
      {currentState && (
        <div className="p-4 border-t border-border/30">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => saveToHistory(currentState)}
          >
            Save Current Design
          </Button>
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onOpenChange={(open) => setRenameDialog({ open, item: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Design</DialogTitle>
            <DialogDescription>Enter a new name for your design</DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Design name"
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialog({ open: false, item: null })}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Hook to use history functions
export const useDesignHistory = () => {
  const saveCurrentDesign = () => {
    const fn = (window as any).__epicSaveToHistory;
    if (fn) fn();
  };

  return { saveCurrentDesign };
};
