import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PremiumModal = ({ open, onOpenChange, onSuccess }: PremiumModalProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if coupon exists and is unused
      const { data: coupon, error: couponError } = await supabase
        .from("coupon_codes")
        .select("*")
        .eq("code", couponCode.trim())
        .eq("is_used", false)
        .single();

      if (couponError || !coupon) {
        toast({
          title: "Invalid Code",
          description: "This coupon code is invalid or has already been used.",
          variant: "destructive",
        });
        return;
      }

      // Mark coupon as used
      const { error: updateCouponError } = await supabase
        .from("coupon_codes")
        .update({
          is_used: true,
          used_by_user_id: user.id,
          used_at: new Date().toISOString(),
        })
        .eq("code", couponCode.trim());

      if (updateCouponError) throw updateCouponError;

      // Update user subscription to premium
      const { error: subError } = await supabase
        .from("user_subscriptions")
        .upsert({
          user_id: user.id,
          is_premium: true,
          coupon_code_used: couponCode.trim(),
          premium_until: null, // Lifetime access
        });

      if (subError) throw subError;

      toast({
        title: "🎉 Premium Activated!",
        description: "You now have unlimited access to EPIC AI Image Generator!",
      });

      setCouponCode("");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Coupon redemption error:", error);
      toast({
        title: "Error",
        description: "Failed to redeem coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-epic-text flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Unlock unlimited image generation with premium access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-gradient-purple" />
              <span>Unlimited image generations</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-gradient-pink" />
              <span>All style options available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-gradient-orange" />
              <span>Priority processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-gradient-yellow" />
              <span>Lifetime access</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-epic/10 border border-white/10">
            <p className="text-center font-semibold text-lg">₹10 only</p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Pay cash offline to Rajveer and get your premium code
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon">Enter Coupon Code</Label>
            <Input
              id="coupon"
              type="text"
              placeholder="Enter your premium code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="bg-card/80 backdrop-blur-sm border-white/10"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleRedeemCoupon}
            className="w-full gradient-epic hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Redeem Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
