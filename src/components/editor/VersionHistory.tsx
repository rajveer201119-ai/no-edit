import { cn } from "@/lib/utils";
import { ImageVersion } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock, Check } from "lucide-react";

interface VersionHistoryProps {
  versions: ImageVersion[];
  currentVersionId: string;
  onSelectVersion: (version: ImageVersion) => void;
}

export const VersionHistory = ({
  versions,
  currentVersionId,
  onSelectVersion,
}: VersionHistoryProps) => {
  if (versions.length <= 1) return null;

  return (
    <div className="border-t border-border/20 bg-background/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/10">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Version History
        </span>
        <span className="text-xs text-muted-foreground/60">
          ({versions.length} versions)
        </span>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3 p-4">
          {versions.map((version, index) => (
            <button
              key={version.id}
              onClick={() => onSelectVersion(version)}
              className={cn(
                "group relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200",
                "w-20 h-20 border-2",
                currentVersionId === version.id
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-border/30 hover:border-primary/50 hover:scale-102"
              )}
            >
              <img
                src={version.imageUrl}
                alt={`Version ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Version badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1">
                <span className="text-[10px] font-mono font-bold text-white">
                  v{index + 1}
                </span>
              </div>
              
              {/* Selected indicator */}
              {currentVersionId === version.id && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
