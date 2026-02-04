import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, Shield, MessageCircle, User, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SEO, pricingPageSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { WebGLShader } from "@/components/ui/web-gl-shader";

const PricingInternational = () => {
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleUpgradeClick = () => {
    setShowPaymentDialog(true);
  };

  const handleEmailClick = () => {
    const email = "rajveer201119@gmail.com";
    const subject = encodeURIComponent("EPIC Creator Mode Upgrade Request (International - $1/month)");
    const body = encodeURIComponent("Hi,\n\nI would like to upgrade to EPIC Creator Mode (International - $1/month).\n\nPlease let me know the payment details.\n\nThank you!");
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <>
      <SEO 
        title="Pricing - EPIC Creator Mode | $1/month"
        description="Get EPIC Creator Mode for just $1/month. Generate 25 designs per day with HD export. Free plan available with 2 designs daily."
        keywords="AI design generator pricing, EPIC pricing, cheap AI design, Creator Mode, affordable AI design"
        canonicalUrl="https://no-edit.lovable.app/pricing-international"
        ogType="product"
        structuredData={pricingPageSchema("USD", 1)}
      />
      <div className="min-h-screen bg-background relative">
        <WebGLShader />
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-8 backdrop-blur-sm bg-background/20 border-border/50"
          >
            ← Back to Home
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground text-lg">
              International Pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Free Plan */}
            <Card className="p-8 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Free Plan</h2>
                  <div className="text-4xl font-bold mb-4 text-foreground">$0</div>
                  <p className="text-muted-foreground">Perfect to get started</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">2 images per day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">All AI styles available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Save to feed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Download images</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-border/50 bg-background/20 backdrop-blur-sm"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            </Card>

            {/* Creator Mode */}
            <Card className="p-8 border-2 border-primary/50 bg-background/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="gradient-epic px-3 py-1 rounded-full text-sm font-semibold text-primary-foreground flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Popular
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 gradient-epic-text flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Creator Mode
                  </h2>
                  <div className="text-4xl font-bold mb-1 text-foreground">$1</div>
                  <p className="text-muted-foreground mb-2">per month</p>
                  <p className="text-sm text-primary font-medium">Less than $0.04/day!</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="font-semibold text-foreground">25 designs per day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">HD export quality</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">All premium templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Priority generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Early access to features</span>
                  </li>
                </ul>

                <Button
                  className="w-full gradient-epic hover:opacity-90"
                  onClick={handleUpgradeClick}
                >
                  <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
                  Unlock Creator Mode
                </Button>
              </div>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="p-6 md:p-8 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">How Payment Works</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  EPIC is in early access. To keep pricing at just $1, we use a simple manual process. 
                  You contact the founder via email, receive payment instructions, and your Pro access is activated personally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Refund Guaranteed</span>
                  <span className="text-xs text-muted-foreground">If not activated</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <User className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Founder Activates</span>
                  <span className="text-xs text-muted-foreground">Personal service</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <MessageCircle className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">No Auto-Renewals</span>
                  <span className="text-xs text-muted-foreground">Cancel anytime</span>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                If your Pro access is not activated within 24 hours, you will receive a full refund. No questions asked.
              </p>
            </Card>
          </div>

          <div className="text-center">
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
          <DialogContent className="sm:max-w-md max-w-[95vw] border border-border/30 bg-background/90 backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl gradient-epic-text flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Unlock Creator Mode
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Contact the founder to get started
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-5 py-4">
              <div className="space-y-3 sm:space-y-4">
                {/* Step 1 */}
                <div className="p-4 border border-border/30 rounded-lg bg-background/20 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-foreground">Send an Email</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Contact the founder to get payment instructions:
                      </p>
                      <div className="p-3 border border-border/30 rounded bg-background/30 mb-3">
                        <code className="text-primary font-mono text-sm break-all">rajveer201119@gmail.com</code>
                      </div>
                      <Button
                        onClick={handleEmailClick}
                        className="w-full gradient-epic hover:opacity-90"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 border border-border/30 rounded-lg bg-background/20 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-foreground">Get Pro Access</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive payment instructions via email. After payment confirmation, the founder will personally activate your Pro access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="p-3 border border-primary/30 rounded-lg bg-primary/5 text-center">
                <p className="text-sm text-foreground">
                  <Shield className="inline h-4 w-4 mr-1 text-primary" />
                  Full refund if Pro is not activated within 24 hours
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                className="w-full border-border/50"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default PricingInternational;