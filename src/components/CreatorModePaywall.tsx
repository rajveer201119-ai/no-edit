import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Check, Zap, Crown } from "lucide-react";

interface CreatorModePaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerReason?: "export" | "limit" | "premium-feature" | "hd-export" | "json-export";
  remainingCredits?: number;
  requiredPlan?: "student" | "pro";
}

export const CreatorModePaywall = ({ 
  open, 
  onOpenChange,
  triggerReason = "limit",
  remainingCredits = 0,
  requiredPlan = "student",
}: CreatorModePaywallProps) => {
  const navigate = useNavigate();

  const handleClose = () => onOpenChange(false);

  const handleViewPricing = (region: "india" | "international") => {
    onOpenChange(false);
    navigate(region === "india" ? "/pricing-india" : "/pricing-international");
  };

  const getHeadline = () => {
    switch (triggerReason) {
      case "json-export": return "JSON Export is a Pro feature";
      case "export": return "Ready to export your creation?";
      case "limit": return "You've reached today's free limit";
      case "hd-export": return "Unlock HD exports";
      case "premium-feature": return "This is a premium feature";
      default: return "Upgrade your plan";
    }
  };

  const getSubheadline = () => {
    switch (triggerReason) {
      case "json-export": return "Upgrade to Pro Lifetime to export structured JSON sitemaps.";
      case "export": return "Paid users export unlimited HD designs without watermarks.";
      case "limit": return "Upgrade for more daily designs.";
      case "hd-export": return "Free users get standard quality. Paid users get HD.";
      case "premium-feature": return "Unlock premium features with an upgrade.";
      default: return "Get the unfair advantage.";
    }
  };

  const isProRequired = requiredPlan === "pro" || triggerReason === "json-export";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-2 border-primary/50 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-4">
          <button onClick={handleClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" /><span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              {isProRequired ? <Crown className="h-6 w-6 text-yellow-500" /> : <Zap className="h-6 w-6 text-primary" />}
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {isProRequired ? "Pro Feature" : "Upgrade Required"}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold">{getHeadline()}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">{getSubheadline()}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick comparison */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-2 p-3 rounded-lg border border-border/30">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Free</div>
              <div className="text-lg font-bold">₹0</div>
              <div className="text-xs text-muted-foreground">2/day, watermark</div>
            </div>
            <div className={`space-y-2 p-3 rounded-lg border-2 ${!isProRequired ? 'border-primary' : 'border-border/30'}`}>
              <div className="text-xs font-semibold text-primary uppercase">Student</div>
              <div className="text-lg font-bold">₹10</div>
              <div className="text-xs text-muted-foreground">10/day, no watermark</div>
            </div>
            <div className={`space-y-2 p-3 rounded-lg border-2 ${isProRequired ? 'border-yellow-500' : 'border-border/30'}`}>
              <div className="text-xs font-semibold text-yellow-500 uppercase">Pro</div>
              <div className="text-lg font-bold">₹299</div>
              <div className="text-xs text-muted-foreground">Unlimited, JSON</div>
            </div>
          </div>

          {/* Pricing CTAs */}
          <div className="space-y-3 pt-2">
            <p className="text-center text-sm text-muted-foreground">Choose your region:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => handleViewPricing("india")} className="gradient-epic hover:opacity-90 h-auto py-3">
                <div className="text-center">
                  <span className="text-lg">🇮🇳</span>
                  <div className="font-semibold">India</div>
                  <div className="text-xs opacity-80">₹10/mo or ₹299</div>
                </div>
              </Button>
              <Button onClick={() => handleViewPricing("international")} className="gradient-epic hover:opacity-90 h-auto py-3">
                <div className="text-center">
                  <span className="text-lg">🌍</span>
                  <div className="font-semibold">International</div>
                  <div className="text-xs opacity-80">$1/mo or $5</div>
                </div>
              </Button>
            </div>
          </div>

          <Button variant="ghost" onClick={handleClose} className="w-full text-muted-foreground hover:text-foreground">
            Continue with free plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
