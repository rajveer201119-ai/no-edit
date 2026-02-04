import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Check, Zap, Crown } from "lucide-react";

interface CreatorModePaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerReason?: "export" | "limit" | "premium-feature" | "hd-export";
  remainingCredits?: number;
}

export const CreatorModePaywall = ({ 
  open, 
  onOpenChange,
  triggerReason = "limit",
  remainingCredits = 0,
}: CreatorModePaywallProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleViewPricing = (region: "india" | "international") => {
    onOpenChange(false);
    navigate(region === "india" ? "/pricing-india" : "/pricing-international");
  };

  // Dynamic headline based on trigger
  const getHeadline = () => {
    switch (triggerReason) {
      case "export":
        return "Ready to export your creation?";
      case "limit":
        return "You've reached today's free limit";
      case "hd-export":
        return "Unlock HD exports";
      case "premium-feature":
        return "This is a Creator Mode feature";
      default:
        return "Upgrade to Creator Mode";
    }
  };

  const getSubheadline = () => {
    switch (triggerReason) {
      case "export":
        return "Creators export unlimited HD designs without watermarks.";
      case "limit":
        return "Creators get unlimited designs every day.";
      case "hd-export":
        return "Free users get standard quality. Creators get crystal-clear HD.";
      case "premium-feature":
        return "Unlock premium features with Creator Mode.";
      default:
        return "Get the unfair advantage.";
    }
  };

  const freeFeatures = [
    { text: "2 designs per day", included: true },
    { text: "Standard resolution", included: true },
    { text: "Basic templates", included: true },
    { text: "HD export", included: false },
    { text: "Priority generation", included: false },
    { text: "No watermark", included: false },
  ];

  const creatorFeatures = [
    { text: "Unlimited designs", included: true },
    { text: "HD export", included: true },
    { text: "All premium templates", included: true },
    { text: "Priority generation", included: true },
    { text: "No watermarks", included: true },
    { text: "Early access to new features", included: true },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-2 border-primary/50 p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Creator Mode
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold">
              {getHeadline()}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {getSubheadline()}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Comparison Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Column */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Free
              </div>
              <div className="space-y-2">
                {freeFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/50 line-through"}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Creator Mode
                </span>
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                {creatorFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing CTAs */}
          <div className="space-y-3 pt-2">
            <p className="text-center text-sm text-muted-foreground">
              Choose your region:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleViewPricing("india")}
                className="gradient-epic hover:opacity-90 h-auto py-3"
              >
                <div className="text-center">
                  <span className="text-lg">🇮🇳</span>
                  <div className="font-semibold">₹10/month</div>
                  <div className="text-xs opacity-80">Less than ₹1/day</div>
                </div>
              </Button>
              <Button
                onClick={() => handleViewPricing("international")}
                className="gradient-epic hover:opacity-90 h-auto py-3"
              >
                <div className="text-center">
                  <span className="text-lg">🌍</span>
                  <div className="font-semibold">$1/month</div>
                  <div className="text-xs opacity-80">Less than $0.04/day</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Continue Free Option */}
          <Button
            variant="ghost"
            onClick={handleClose}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Continue with free plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
