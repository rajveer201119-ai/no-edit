import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Crown, Lock, Zap } from "lucide-react";

interface CreatorModePaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerReason?: "export" | "limit" | "premium-feature" | "hd-export" | "json-export" | "pdf-export" | "png-export" | "ux-tester" | "analyzer" | "library";
  featureName?: string;
}

export const CreatorModePaywall = ({
  open,
  onOpenChange,
  triggerReason = "limit",
  featureName,
}: CreatorModePaywallProps) => {
  const navigate = useNavigate();

  const handleClose = () => onOpenChange(false);

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing-india");
  };

  const getHeadline = () => {
    if (featureName) return `${featureName} is a Pro feature`;
    switch (triggerReason) {
      case "pdf-export": return "PDF Export is a Pro feature";
      case "png-export": return "PNG Export is a Pro feature";
      case "ux-tester": return "UX Tester is a Pro feature";
      case "analyzer": return "Website Analyzer is a Pro feature";
      case "library": return "Structure Library is a Pro feature";
      case "json-export": return "JSON Export is a Pro feature";
      case "export": return "Ready to export your creation?";
      case "limit": return "You've reached the free plan limit";
      case "hd-export": return "Unlock HD exports";
      case "premium-feature": return "This is a Pro feature";
      default: return "Upgrade to EPIC Pro";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-2 border-primary/50 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-4">
          <button onClick={handleClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" /><span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Pro Feature
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold">{getHeadline()}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Upgrade to EPIC Pro to unlock this feature and more.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* What you get */}
          <div className="space-y-2">
            {[
              "Unlimited visual sitemaps",
              "Unlimited pages per sitemap",
              "PDF & PNG Export",
              "UX Tester & Analyzer",
              "Website Structure Library",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Zap className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg border border-border/30">
              <div className="text-lg font-bold text-foreground">₹299</div>
              <div className="text-xs text-muted-foreground">per month</div>
            </div>
            <div className="p-3 rounded-lg border-2 border-yellow-500">
              <div className="text-lg font-bold text-foreground">₹1,500</div>
              <div className="text-xs text-muted-foreground">lifetime</div>
            </div>
          </div>

          <Button onClick={handleUpgrade} className="w-full h-12 text-base font-semibold">
            <Crown className="mr-2 h-4 w-4" /> Upgrade to Pro
          </Button>

          <Button variant="ghost" onClick={handleClose} className="w-full text-muted-foreground hover:text-foreground">
            Continue with free plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
