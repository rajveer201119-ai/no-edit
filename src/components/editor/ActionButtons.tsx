import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ActionButton, ActionType } from "./types";
import { Sparkles, Palette, Wrench, Maximize, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonsProps {
  actions: ActionButton[];
  isPremium: boolean;
  isLoading: boolean;
  onAction: (action: ActionButton) => void;
  onUpgradeClick: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="h-4 w-4" />,
  palette: <Palette className="h-4 w-4" />,
  wrench: <Wrench className="h-4 w-4" />,
  maximize: <Maximize className="h-4 w-4" />,
};

export const ActionButtons = ({
  actions,
  isPremium,
  isLoading,
  onAction,
  onUpgradeClick,
}: ActionButtonsProps) => {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const isLocked = action.isPremium && !isPremium;
          
          return (
            <Tooltip key={action.type}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => isLocked ? onUpgradeClick() : onAction(action)}
                  className={cn(
                    "relative h-12 flex flex-col items-center justify-center gap-1 border-border/40 bg-card/50 hover:bg-card transition-all",
                    isLocked && "opacity-70 hover:opacity-90",
                    !isLocked && "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {iconMap[action.icon]}
                    {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    {action.label}
                  </span>
                  
                  {/* Premium glow effect */}
                  {isLocked && (
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {isLocked ? (
                  <p className="text-xs">
                    <span className="text-primary font-semibold">Pro Feature</span> — Upgrade to unlock {action.label.toLowerCase()}
                  </p>
                ) : (
                  <p className="text-xs">{action.prompt}</p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
