import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Download, Shuffle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ZeroEditModeProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const ZeroEditMode = ({
  enabled,
  onChange,
  disabled = false,
  className,
}: ZeroEditModeProps) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border transition-all",
      enabled 
        ? "bg-amber-500/10 border-amber-500/30" 
        : "bg-muted/30 border-border/50",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          enabled ? "bg-amber-500/20 text-amber-600" : "bg-muted text-muted-foreground"
        )}>
          <Lock className="h-4 w-4" />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor="zero-edit" className="text-sm font-medium cursor-pointer">
              Zero-Edit Mode
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    When enabled, the generated design is final. 
                    No editor tools will be shown — you can only download or remix.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Skip editing — output is final
          </p>
        </div>
      </div>

      <Switch
        id="zero-edit"
        checked={enabled}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

// Component shown when zero-edit mode is active (instead of editor)
interface ZeroEditOutputProps {
  imageUrl: string;
  prompt: string;
  onDownload: () => void;
  onRemix: () => void;
  className?: string;
}

export const ZeroEditOutput = ({
  imageUrl,
  prompt,
  onDownload,
  onRemix,
  className,
}: ZeroEditOutputProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode indicator */}
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <Lock className="h-3 w-3 mr-1.5" />
          Zero-Edit Mode — Output is Final
        </Badge>
      </div>

      {/* Image */}
      <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
        <img
          src={imageUrl}
          alt="Generated design"
          className="w-full h-auto"
        />
      </div>

      {/* Prompt display */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
          Generated from prompt
        </p>
        <p className="text-sm">{prompt}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="h-5 w-5" />
          Download
        </button>
        
        <button
          onClick={onRemix}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
        >
          <Shuffle className="h-5 w-5" />
          Remix
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-center text-muted-foreground">
        Zero-Edit Mode is active. To make changes, click Remix to create a new version.
      </p>
    </div>
  );
};
