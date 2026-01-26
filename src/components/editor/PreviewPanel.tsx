import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageVersion } from "./types";
import { VersionHistory } from "./VersionHistory";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2,
  Lock,
  Loader2
} from "lucide-react";

interface PreviewPanelProps {
  versions: ImageVersion[];
  currentVersion: ImageVersion;
  isPremium: boolean;
  isProcessing: boolean;
  onSelectVersion: (version: ImageVersion) => void;
  onDownload: () => void;
  onUpgradeClick: () => void;
}

export const PreviewPanel = ({
  versions,
  currentVersion,
  isPremium,
  isProcessing,
  onSelectVersion,
  onDownload,
  onUpgradeClick,
}: PreviewPanelProps) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const currentIndex = versions.findIndex(v => v.id === currentVersion.id) + 1;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/10 bg-background/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/20">
            <span className="text-xs font-mono text-muted-foreground">v{currentIndex}</span>
            <span className="text-border/50">|</span>
            <span className="text-xs font-mono text-primary">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted/50"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted/50"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted/50"
            onClick={handleResetZoom}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-5 bg-border/20 mx-1" />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted/50"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 rounded-lg text-xs font-medium border-border/30",
              !isPremium && "opacity-70"
            )}
            onClick={isPremium ? onDownload : onUpgradeClick}
          >
            {!isPremium && <Lock className="h-3 w-3 mr-1.5" />}
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-6">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm font-medium text-foreground">Creating new version...</p>
            </div>
          </div>
        )}

        {/* Image container */}
        <div
          className={cn(
            "relative transition-transform duration-300 ease-out",
            isProcessing && "opacity-50"
          )}
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={currentVersion.imageUrl}
            alt="Current version"
            className="max-w-full max-h-[60vh] rounded-lg shadow-2xl shadow-black/50 object-contain"
            draggable={false}
          />
          
          {/* Cinematic vignette */}
          <div className="absolute inset-0 rounded-lg pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
        </div>
      </div>

      {/* Version History */}
      <VersionHistory
        versions={versions}
        currentVersionId={currentVersion.id}
        onSelectVersion={onSelectVersion}
      />
    </div>
  );
};
