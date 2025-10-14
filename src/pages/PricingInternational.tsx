import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PricingInternational = () => {
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleUpgradeClick = () => {
    setShowPaymentDialog(true);
  };

  const handleEmailClick = () => {
    const email = "rajveer201119@gmail.com";
    const subject = encodeURIComponent("EPIC Pro Plan Upgrade Request (International - $1/month)");
    const body = encodeURIComponent("Hi,\n\nI would like to upgrade to EPIC Pro Plan (International - $1/month).\n\nPlease let me know the payment details.\n\nThank you!");
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          ← Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-epic-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg">
            International Pricing 🌍
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="glass-card p-8 border-2 border-white/10">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-4xl font-bold mb-4">$0</div>
                <p className="text-muted-foreground">Perfect to get started</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>2 images per day</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>All AI styles available</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Save to feed</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Download images</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="glass-card p-8 border-2 border-primary glow-purple relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="gradient-epic px-3 py-1 rounded-full text-sm font-semibold text-white">
                Popular
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 gradient-epic-text">Pro Plan</h3>
                <div className="text-4xl font-bold mb-1">$1</div>
                <p className="text-muted-foreground mb-4">per month</p>
                <p className="text-sm text-primary">12x more images!</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="font-semibold">25 images per day</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>All AI styles available</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Save to feed</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Download images</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Priority generation</span>
                </div>
              </div>

              <Button
                className="w-full gradient-epic hover:opacity-90"
                onClick={handleUpgradeClick}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            From India?{" "}
            <button
              onClick={() => navigate("/pricing-india")}
              className="text-primary underline hover:text-primary/80"
            >
              View India Pricing
            </button>
          </p>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md glass-card border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-epic-text">
              Upgrade to Pro - Contact Instructions
            </DialogTitle>
            <DialogDescription>
              Follow these steps to get premium access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="glass-card p-4 border border-primary/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Contact via Email</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Send an email to get payment instructions:
                    </p>
                    <div className="glass-card p-3 border border-white/10 rounded mb-3">
                      <code className="text-primary font-mono text-sm break-all">
                        rajveer201119@gmail.com
                      </code>
                    </div>
                    <Button
                      onClick={handleEmailClick}
                      className="w-full gradient-epic hover:opacity-90"
                    >
                      <span className="mr-2">📧</span>
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 border border-primary/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Get Premium Access</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive payment instructions via email. After payment confirmation, your account will be upgraded to Pro.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingInternational;
