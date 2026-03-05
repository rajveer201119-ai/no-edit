import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, Shield, MessageCircle, User, X, Star, Mail } from "lucide-react";
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

const PricingIndia = () => {
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"student" | "pro">("student");

  const handleUpgradeClick = (plan: "student" | "pro") => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "918638910252";
    const planLabel = selectedPlan === "pro" ? "Pro Lifetime (₹299)" : "Student Helper (₹10/month)";
    const message = encodeURIComponent(`Hi, I want to upgrade to EPIC ${planLabel}. I have made the payment.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleEmailClick = () => {
    const planLabel = selectedPlan === "pro" ? "Pro Lifetime (₹299)" : "Student Helper (₹10/month)";
    const subject = encodeURIComponent(`EPIC ${planLabel} Upgrade Request`);
    const body = encodeURIComponent(`Hi,\n\nI would like to upgrade to EPIC ${planLabel}.\n\nMy account email: [your EPIC account email]\n\nI have made the payment via UPI. Please activate my access.\n\nThank you!`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=rajveer201119@gmail.com&su=${subject}&body=${body}`, "_blank");
  };

  const paymentAmount = selectedPlan === "pro" ? "₹299" : "₹10";

  return (
    <>
      <SEO 
        title="Pricing India - EPIC Plans | ₹10/month & ₹299 Lifetime"
        description="EPIC pricing for India. Student Helper plan at ₹10/month or Pro Lifetime at ₹299 one-time. Free plan available."
        keywords="AI design generator India, EPIC pricing India, cheap AI design, Student plan, Pro plan India"
        canonicalUrl="https://no-edit.lovable.app/pricing-india"
        ogType="product"
        structuredData={pricingPageSchema("INR", 10)}
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
            <p className="text-muted-foreground text-lg">Pricing for India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {/* Free Plan */}
            <Card className="p-8 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Free Plan</h2>
                  <div className="text-4xl font-bold mb-4 text-foreground">₹0</div>
                  <p className="text-muted-foreground">Get started for free</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "2 designs per day",
                    "Limited templates",
                    "Standard export",
                    "Watermark on exports",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {[
                    "No JSON export",
                    "No premium templates",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-muted-foreground/50 mt-0.5" />
                      <span className="text-muted-foreground/50 line-through">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </div>
            </Card>

            {/* Student Helper Plan */}
            <Card className="p-8 border-2 border-primary/50 bg-background/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="gradient-epic px-3 py-1 rounded-full text-sm font-semibold text-primary-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Popular
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 gradient-epic-text flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Student Helper
                  </h2>
                  <div className="text-4xl font-bold mb-1 text-foreground">₹10</div>
                  <p className="text-muted-foreground mb-2">per month</p>
                  <p className="text-sm text-primary font-medium">Less than ₹1/day!</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "10 designs per day",
                    "No watermark",
                    "Increased export limits",
                    "Additional templates",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-foreground font-medium">{f}</span>
                    </li>
                  ))}
                  {[
                    "No JSON export",
                    "No premium nav templates",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-muted-foreground/50 mt-0.5" />
                      <span className="text-muted-foreground/50 line-through">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full gradient-epic hover:opacity-90" onClick={() => handleUpgradeClick("student")}>
                  <Zap className="mr-2 h-4 w-4" /> Get Student Plan
                </Button>
              </div>
            </Card>

            {/* Pro Lifetime Plan */}
            <Card className="p-8 border-2 border-yellow-500/50 bg-background/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold text-black flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Best Value
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-yellow-500 flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Pro Lifetime
                  </h2>
                  <div className="text-4xl font-bold mb-1 text-foreground">₹299</div>
                  <p className="text-muted-foreground mb-2">one-time payment</p>
                  <p className="text-sm text-yellow-500 font-medium">Pay once, use forever!</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Unlimited exports",
                    "No watermark",
                    "JSON sitemap export",
                    "All premium templates",
                    "All premium nav templates",
                    "Future feature updates",
                    "Pro badge in dashboard",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-foreground font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" onClick={() => handleUpgradeClick("pro")}>
                  <Crown className="mr-2 h-4 w-4" /> Get Pro Lifetime
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
                  EPIC is in early access. You pay via UPI, message the founder on WhatsApp, and your access is activated personally — usually within hours.
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
                Full refund if not activated within 24 hours. No questions asked.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Not from India?{" "}
              <button onClick={() => navigate("/pricing-international")} className="text-primary underline hover:text-primary/80">
                View International Pricing
              </button>
            </p>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md max-w-[95vw] border border-border/30 bg-background/90 backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl gradient-epic-text flex items-center gap-2">
                {selectedPlan === "pro" ? <Crown className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                {selectedPlan === "pro" ? "Unlock Pro Lifetime" : "Unlock Student Helper"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Two simple steps to activate
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 border border-border/30 rounded-lg bg-background/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 text-foreground">Pay {paymentAmount} via UPI</h4>
                    <p className="text-sm text-muted-foreground mb-3">Send {paymentAmount} to this UPI number:</p>
                    <div className="p-3 border border-border/30 rounded bg-background/30">
                      <code className="text-primary font-mono text-lg">8638910252</code>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-border/30 rounded-lg bg-background/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 text-foreground">Send Screenshot & Confirm</h4>
                    <p className="text-sm text-muted-foreground mb-3">Message the founder to activate your access:</p>
                    <div className="flex gap-2">
                      <Button onClick={handleWhatsAppClick} className="flex-1 gradient-epic hover:opacity-90">
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                      </Button>
                      <Button onClick={handleEmailClick} variant="outline" className="flex-1 border-border/50">
                        <Mail className="mr-2 h-4 w-4" /> Email
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">+91 8638910252</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-primary/30 rounded-lg bg-primary/5 text-center">
                <p className="text-sm text-foreground">
                  <Shield className="inline h-4 w-4 mr-1 text-primary" />
                  Full refund if not activated within 24 hours
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="w-full border-border/50">
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

export default PricingIndia;
