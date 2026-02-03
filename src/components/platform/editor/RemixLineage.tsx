import { cn } from "@/lib/utils";
import { ArrowRight, Shuffle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface RemixNode {
  id: string;
  thumbnailUrl?: string;
  prompt?: string;
  creatorName?: string;
  createdAt?: string;
  isOriginal?: boolean;
  isCurrent?: boolean;
}

interface RemixLineageProps {
  chain: RemixNode[];
  onViewPrompt?: (node: RemixNode) => void;
  onRemix?: (node: RemixNode) => void;
  className?: string;
}

export const RemixLineage = ({
  chain,
  onViewPrompt,
  onRemix,
  className,
}: RemixLineageProps) => {
  if (chain.length <= 1) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Shuffle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Remix History</span>
        <Badge variant="outline" className="text-xs">
          {chain.length} version{chain.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Chain visualization */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {chain.map((node, index) => (
          <div key={node.id} className="flex items-center gap-2">
            {/* Node */}
            <div
              className={cn(
                "relative flex-shrink-0 rounded-lg border transition-all cursor-pointer hover:border-primary/50",
                node.isCurrent
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-border/50"
              )}
              onClick={() => onViewPrompt?.(node)}
            >
              {/* Thumbnail or placeholder */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30">
                {node.thumbnailUrl ? (
                  <img
                    src={node.thumbnailUrl}
                    alt={`Version ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Shuffle className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Labels */}
              <div className="absolute -top-2 -right-2 flex gap-1">
                {node.isOriginal && (
                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-green-500">
                    Original
                  </Badge>
                )}
                {node.isCurrent && (
                  <Badge className="text-[10px] px-1.5 py-0 h-4">
                    Current
                  </Badge>
                )}
              </div>

              {/* Version number */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-background">
                  v{index + 1}
                </Badge>
              </div>
            </div>

            {/* Arrow between nodes */}
            {index < chain.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Remix button for current */}
      {onRemix && chain.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => onRemix(chain[chain.length - 1])}
        >
          <Shuffle className="h-4 w-4" />
          Create New Remix
        </Button>
      )}
    </div>
  );
};

// Compact inline version for cards
interface RemixBadgeProps {
  parentCount: number;
  className?: string;
}

export const RemixBadge = ({ parentCount, className }: RemixBadgeProps) => {
  if (parentCount === 0) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs bg-purple-500/10 text-purple-600 border-purple-500/20",
        className
      )}
    >
      <Shuffle className="h-3 w-3 mr-1" />
      Remixed {parentCount}x
    </Badge>
  );
};

// Hook to track remix history
export interface RemixHistoryEntry {
  nodeId: string;
  parentId: string | null;
  prompt: string;
  thumbnailUrl?: string;
  createdAt: string;
}

const REMIX_HISTORY_KEY = "epic_remix_history";
const MAX_REMIX_HISTORY = 100;

export const useRemixHistory = () => {
  const getHistory = (): RemixHistoryEntry[] => {
    try {
      const saved = localStorage.getItem(REMIX_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const addToHistory = (entry: RemixHistoryEntry) => {
    const history = getHistory();
    const updated = [entry, ...history.filter((h) => h.nodeId !== entry.nodeId)].slice(0, MAX_REMIX_HISTORY);
    localStorage.setItem(REMIX_HISTORY_KEY, JSON.stringify(updated));
  };

  const getLineage = (nodeId: string): RemixHistoryEntry[] => {
    const history = getHistory();
    const chain: RemixHistoryEntry[] = [];
    let currentId: string | null = nodeId;

    while (currentId) {
      const node = history.find((h) => h.nodeId === currentId);
      if (node) {
        chain.unshift(node);
        currentId = node.parentId;
      } else {
        break;
      }
    }

    return chain;
  };

  const getRemixCount = (nodeId: string): number => {
    const history = getHistory();
    return history.filter((h) => h.parentId === nodeId).length;
  };

  return {
    getHistory,
    addToHistory,
    getLineage,
    getRemixCount,
  };
};
