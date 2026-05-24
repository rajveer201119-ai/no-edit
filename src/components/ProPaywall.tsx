import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Shield, Zap, X, Star, Users, Clock, Tag, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UPIPaymentDialog } from "@/components/UPIPaymentDialog";

interface ProPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export const ProPaywall = ({ open, onOpenChange, featureName }: ProPaywallProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [payOpen, setPayOpen] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [validating, setValidating] = useState(false);

  const amount = selectedPlan === "monthly" ? 299 : 1500;
  const planLabel = selectedPlan === "monthly" ? "₹299/month" : "₹1,500 lifetime";
  const anchorPrice = selectedPlan === "monthly" ? 799 : 3500;

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setValidating(true);
    try {
      const { data, error } = await supabase.rpc("validate_coupon", { code_input: coupon.trim() });
      if (error) throw error;
      const result = data as { valid: boolean; message?: string };
      if (result?.valid) {
        setCouponApplied(true);
        toast.success("Coupon valid — apply it after payment to unlock Pro for free.");
      } else {
        toast.error(result?.message || "Invalid code");
      }
    } catch {
      toast.error("Could not validate code");
    } finally {
      setValidating(false);
    }
  };

  return (
    <>
    <Dialog open={open && !payOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-2 border-primary/30">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            aria-label="Close paywall"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                EPIC Pro · Founder pricing
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {featureName
                ? `Unlock ${featureName}`
                : "Upgrade to EPIC Pro"}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {featureName
                ? `${featureName} is a Pro feature. Unlock it plus everything else below.`
                : "Unlimited sitemaps, exports, and every premium feature — for the price of one coffee."}
            </DialogDescription>
            {/* Social proof */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-xs font-semibold text-foreground ml-1">4.8</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Joined by 280+ founders
              </span>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Scarcity banner */}
          <div className="flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-foreground">
            <Clock className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
            <span>
              <strong>Launch pricing</strong> — Lifetime jumps to ₹2,500 once we hit 500 users.
            </span>
          </div>

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
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs line-through text-muted-foreground">₹799</span>
                <span className="text-2xl font-bold text-foreground">₹299</span>
              </div>
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
                SAVE 58%
              </span>
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Lifetime</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs line-through text-muted-foreground">₹3,500</span>
                <span className="text-2xl font-bold text-foreground">₹1,500</span>
              </div>
              <div className="text-xs text-muted-foreground">pay once, own forever</div>
            </button>
          </div>

          {/* Pro features */}
          <div className="space-y-1.5">
            {[
              "Unlimited sitemaps & pages",
              "PDF, PNG & JSON export (no watermark)",
              "UX Tester + Website Analyzer",
              "200+ structure library templates",
              "Priority support · all future updates",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" strokeWidth={3} />
                {f}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <figure className="rounded-lg border border-border/40 bg-muted/30 p-3">
            <blockquote className="text-xs italic text-foreground/90">
              “Mapped my entire SaaS in 20 minutes — paid for itself before the trial ended.”
            </blockquote>
            <figcaption className="mt-1.5 text-[11px] text-muted-foreground">
              — Aarav S., Founder · verified Pro user
            </figcaption>
          </figure>

          {/* Coupon */}
          {showCoupon ? (
            <div className="flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="h-9 text-sm"
                disabled={couponApplied}
              />
              <Button
                size="sm"
                variant={couponApplied ? "secondary" : "outline"}
                onClick={handleApplyCoupon}
                disabled={validating || couponApplied}
                className="h-9 shrink-0"
              >
                {couponApplied ? <><Check className="h-3.5 w-3.5 mr-1" /> Applied</> : validating ? "..." : "Apply"}
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowCoupon(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Tag className="h-3 w-3" /> Have a discount code?
            </button>
          )}

          {/* UPI Pay button */}
          <Button
            onClick={() => setPayOpen(true)}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            Pay {planLabel} with UPI
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Secure UPI
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> 7-day money back
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" /> Instant activation
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs text-muted-foreground hover:text-foreground h-8"
          >
            No thanks, continue with limited free plan
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
