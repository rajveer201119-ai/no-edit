import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UsageCounterProps {
  type?: "generate" | "edit";
  className?: string;
  showUpgrade?: boolean;
  onUpgradeClick?: () => void;
}

export const UsageCounter = ({
  type = "generate",
  className,
  showUpgrade = true,
  onUpgradeClick,
}: UsageCounterProps) => {
  const [usage, setUsage] = useState<{
    used: number;
    limit: number;
    isPremium: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Guest user defaults
          setUsage({ used: 0, limit: 1, isPremium: false });
          setIsLoading(false);
          return;
        }

        if (type === "edit") {
          const { data, error } = await supabase.rpc("check_edit_limit", {
            user_id_param: user.id,
          });

          if (error) throw error;

          if (data && data.length > 0) {
            const result = data[0];
            const limit = result.is_premium ? 50 : 1;
            const used = limit - result.remaining_edits;
            
            setUsage({
              used: Math.max(0, used),
              limit,
              isPremium: result.is_premium,
            });
          }
        } else {
          const { data, error } = await supabase.rpc("check_generation_limit", {
            user_id_param: user.id,
          });

          if (error) throw error;

          if (data && data.length > 0) {
            const result = data[0];
            const limit = result.is_premium ? 25 : 2;
            const used = limit - result.remaining_prompts;
            
            setUsage({
              used: Math.max(0, used),
              limit,
              isPremium: result.is_premium,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch usage:", err);
        setUsage({ used: 0, limit: 2, isPremium: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();

    // Refresh on auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUsage();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [type]);

  if (isLoading || !usage) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const percentUsed = (usage.used / usage.limit) * 100;
  const isNearLimit = percentUsed >= 75;
  const isAtLimit = usage.used >= usage.limit;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Usage indicator */}
      <div className="flex items-center gap-2">
        {usage.isPremium ? (
          <Crown className="h-4 w-4 text-primary" />
        ) : (
          <Zap className={cn(
            "h-4 w-4",
            isAtLimit ? "text-destructive" : isNearLimit ? "text-accent" : "text-muted-foreground"
          )} />
        )}
        
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-sm font-medium",
            isAtLimit ? "text-destructive" : isNearLimit ? "text-accent" : "text-foreground"
          )}>
            {usage.used}/{usage.limit}
          </span>
          <span className="text-xs text-muted-foreground">
            {type === "edit" ? "edits" : "designs"} today
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isAtLimit ? "bg-destructive" : isNearLimit ? "bg-accent" : "bg-primary"
          )}
          style={{ width: `${Math.min(100, percentUsed)}%` }}
        />
      </div>

      {/* Upgrade CTA */}
      {showUpgrade && !usage.isPremium && (
        <button
          onClick={onUpgradeClick}
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full transition-colors",
            isAtLimit 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "text-primary hover:bg-primary/10"
          )}
        >
          {isAtLimit ? "Upgrade" : "Go Pro"}
        </button>
      )}
    </div>
  );
};
