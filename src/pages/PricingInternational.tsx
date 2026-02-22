import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, Shield, MessageCircle, User, Mail, X } from "lucide-react";
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
  const [selectedPlan, setSelectedPlan] = useState<"student" | "pro">("student");

  const handleUpgradeClick = (plan: "student" | "pro") => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handleEmailClick = () => {
    const email = "rajveer201119@gmail.com";
    const planLabel = selectedPlan === "pro" ? "Pro Lifetime ($5)" : "Student Helper ($1/month)";
    const subject = encodeURIComponent(`EPIC ${planLabel} Upgrade Request`);
    const body = encodeURIComponent(`Hi,\n\nI would like to upgrade to EPIC ${planLabel}.\n\nPlease let me know the payment details.\n\nThank you!`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <>
      <SEO 
        title="Pricing - EPIC Plans | $1/month & $5 Lifetime"
        description="EPIC pricing. Student Helper plan at $1/month or Pro Lifetime at $5 one-time. Free plan available."
        keywords="AI design generator pricing, EPIC pricing, cheap AI design, Student plan, Pro plan"
        canonicalUrl="https://no-edit.lovable.app/pricing-international"
        ogType="product"
        structuredData={pricingPageSchema("USD", 1)}
      />
      <div className="min-h-screen bg-background relative">
        <WebGLShader />
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <Button variant="outline" onClick={() => navigate("/")} className="mb-8 backdrop-blur-sm bg-background/20 border-border/50">
            ← Back to Home
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Plan</h1>
            <p className="text-muted-foreground text-lg">International Pricing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {/* Free Plan */}
            <Card className="p-8 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Free Plan</h2>
                  <div className="text-4xl font-bold mb-4 text-foreground">$0</div>
                  <p className="text-muted-foreground">Get started for free</p>
                </div>
                <ul className="space-y-3">
                  {["2 designs per day", "Limited templates", "Standard export", "Watermark on exports"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {["No JSON export", "No premium templates"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-muted-foreground/50 mt-0.5" />
                      <span className="text-muted-foreground/50 line-through">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>Get Started</Button>
              </div>
            </Card>

            {/* Student Helper */}
            <Card className="p-8 border-2 border-primary/50 bg-background/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="gradient-epic px-3 py-1 rounded-full text-sm font-semibold text-primary-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Popular
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 gradient-epic-text flex items-center gap-2">
                    <Zap className="h-5 w-5" /> Student Helper
                  </h2>
                  <div className="text-4xl font-bold mb-1 text-foreground">$1</div>
                  <p className="text-muted-foreground mb-2">per month</p>
                  <p className="text-sm text-primary font-medium">Less than $0.04/day!</p>
                </div>
                <ul className="space-y-3">
                  {["10 designs per day", "No watermark", "Increased export limits", "Additional templates"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-foreground font-medium">{f}</span>
                    </li>
                  ))}
                  {["No JSON export", "No premium nav templates"].map((f, i) => (
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

            {/* Pro Lifetime */}
            <Card className="p-8 border-2 border-yellow-500/50 bg-background/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold text-black flex items-center gap-1">
                  <Crown className="h-3 w-3" /> Best Value
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-yellow-500 flex items-center gap-2">
                    <Crown className="h-5 w-5" /> Pro Lifetime
                  </h2>
                  <div className="text-4xl font-bold mb-1 text-foreground">$5</div>
                  <p className="text-muted-foreground mb-2">one-time payment</p>
                  <p className="text-sm text-yellow-500 font-medium">Pay once, use forever!</p>
                </div>
                <ul className="space-y-3">
                  {["Unlimited exports", "No watermark", "JSON sitemap export", "All premium templates", "All premium nav templates", "Future feature updates", "Pro badge in dashboard"].map((f, i) => (
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
                  Contact the founder via email, receive payment instructions, and your access is activated personally.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Shield, title: "Refund Guaranteed", sub: "If not activated" },
                  { icon: User, title: "Founder Activates", sub: "Personal service" },
                  { icon: MessageCircle, title: "No Auto-Renewals", sub: "Cancel anytime" },
                ].map(({ icon: Icon, title, sub }, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                    <Icon className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-foreground font-medium">{title}</span>
                    <span className="text-xs text-muted-foreground">{sub}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Full refund if not activated within 24 hours. No questions asked.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              From India?{" "}
              <button onClick={() => navigate("/pricing-india")} className="text-primary underline hover:text-primary/80">
                View India Pricing
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
              <DialogDescription className="text-sm text-muted-foreground">Contact the founder to get started</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 border border-border/30 rounded-lg bg-background/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 text-foreground">Send an Email</h4>
                    <p className="text-sm text-muted-foreground mb-3">Contact the founder for payment instructions:</p>
                    <div className="p-3 border border-border/30 rounded bg-background/30 mb-3">
                      <code className="text-primary font-mono text-sm break-all">rajveer201119@gmail.com</code>
                    </div>
                    <Button onClick={handleEmailClick} className="w-full gradient-epic hover:opacity-90">
                      <Mail className="mr-2 h-4 w-4" /> Send Email
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-border/30 rounded-lg bg-background/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 text-foreground">Get Access</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive payment instructions via email. After confirmation, your access is activated personally.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-primary/30 rounded-lg bg-primary/5 text-center">
                <p className="text-sm text-foreground">
                  <Shield className="inline h-4 w-4 mr-1 text-primary" />
                  Full refund if not activated within 24 hours
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="w-full border-border/50">Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default PricingInternational;
