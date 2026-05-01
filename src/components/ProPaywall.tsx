import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Shield, Zap, X } from "lucide-react";
import { UPIPaymentDialog } from "@/components/UPIPaymentDialog";

interface ProPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export const ProPaywall = ({ open, onOpenChange, featureName }: ProPaywallProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [payOpen, setPayOpen] = useState(false);

  const amount = selectedPlan === "monthly" ? 299 : 1500;
  const planLabel = selectedPlan === "monthly" ? "₹299/month" : "₹1,500 lifetime";

  return (
    <>
    <Dialog open={open && !payOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-2 border-primary/30">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Upgrade to Pro
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {featureName
                ? `Unlock ${featureName}`
                : "Upgrade to EPIC Pro"}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {featureName
                ? `${featureName} is a Pro feature. Upgrade to unlock it.`
                : "Unlimited sitemaps, exports, and all premium features."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Plan selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedPlan === "monthly"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Monthly</div>
              <div className="text-2xl font-bold text-foreground">₹299</div>
              <div className="text-xs text-muted-foreground">per month</div>
            </button>
            <button
              onClick={() => setSelectedPlan("lifetime")}
              className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                selectedPlan === "lifetime"
                  ? "border-yellow-500 bg-yellow-500/5"
                  : "border-border hover:border-yellow-500/30"
              }`}
            >
              <span className="absolute -top-2 right-2 text-[10px] font-bold bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                BEST VALUE
              </span>
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Lifetime</div>
              <div className="text-2xl font-bold text-foreground">₹1,500</div>
              <div className="text-xs text-muted-foreground">one-time payment</div>
            </button>
          </div>

          {/* Pro features */}
          <div className="space-y-2">
            {[
              "Unlimited visual sitemaps",
              "Unlimited sitemap pages",
              "PDF & PNG Export",
              "UX Tester & Analyzer",
              "Website Structure Library",
              "All advanced features",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Zap className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          {/* UPI Pay button */}
          <Button
            onClick={() => setPayOpen(true)}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            Pay {planLabel} with UPI
          </Button>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Secure UPI
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> Refund guaranteed
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Continue with Free plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <UPIPaymentDialog
      open={payOpen}
      onOpenChange={(o) => {
        setPayOpen(o);
        if (!o) onOpenChange(false);
      }}
      plan={selectedPlan}
      amount={amount}
      featureName={featureName}
    />
    </>
  );
};
