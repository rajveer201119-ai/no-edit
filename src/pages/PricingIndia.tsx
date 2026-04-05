import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Crown, Shield, X, Lock, Zap } from "lucide-react";
import { SEO, pricingPageSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().trim().min(1, "Email is required").email("Enter a valid email");

const PricingIndia = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const amount = selectedPlan === "monthly" ? 299 : 1500;

  const handleUPIPay = async () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }
    setEmailError("");

    // Save lead to admin panel
    try {
      await supabase.from("payment_leads" as any).insert({
        email: email.trim(),
        plan_selected: selectedPlan,
        amount,
      } as any);
    } catch (e) {
      console.error("Failed to save payment lead:", e);
    }

    const upiId = "8638910252-2@ybl";
    const txnNote = encodeURIComponent("EPIC Pro Upgrade");
    const upiUrl = `upi://pay?pa=${upiId}&pn=EPIC%20Pro&am=${amount}&cu=INR&tn=${txnNote}`;
    window.location.href = upiUrl;
    toast.info("Opening your UPI app. Complete the payment to activate Pro.", { duration: 6000 });
  };

  return (
    <>
      <SEO
        title="EPIC Pro Pricing — ₹299/mo or ₹1500 Lifetime | Visual Sitemap Builder"
        description="Upgrade to EPIC Pro for unlimited visual sitemaps, PDF/PNG export, UX testing, website analyzer, and more. ₹299/month or ₹1500 lifetime."
        keywords="EPIC pricing, visual sitemap builder pricing, UX tool pricing, sitemap generator pro"
        canonicalUrl="https://no-edit.lovable.app/pricing-india"
        ogType="product"
        structuredData={pricingPageSchema("INR", 299)}
        hreflang={[
          { lang: "en-IN", href: "https://no-edit.lovable.app/pricing-india" },
          { lang: "en", href: "https://no-edit.lovable.app/pricing-international" },
          { lang: "x-default", href: "https://no-edit.lovable.app/pricing-international" },
        ]}
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
              EPIC Pro
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Unlock the full power of EPIC — Visual Sitemap Builder
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
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
                    "1 visual sitemap project",
                    "First 10 pages per sitemap",
                    "JSON Export",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {[
                    "PDF Export",
                    "PNG Export",
                    "UX Tester",
                    "Analyze Features",
                    "Website Structure Library",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground/50 mt-0.5" />
                      <span className="text-muted-foreground/50">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                  Get Started Free
                </Button>
              </div>
            </Card>

            {/* Pro Plan with UPI */}
            <Card className="p-8 border-2 border-yellow-500/50 bg-background/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold text-black flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Pro
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-yellow-500 flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    EPIC Pro
                  </h2>

                  {/* Plan toggle */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => setSelectedPlan("monthly")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === "monthly"
                          ? "border-yellow-500 bg-yellow-500/5"
                          : "border-border/30 hover:border-yellow-500/30"
                      }`}
                    >
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Monthly</div>
                      <div className="text-xl font-bold text-foreground">₹299</div>
                      <div className="text-[10px] text-muted-foreground">per month</div>
                    </button>
                    <button
                      onClick={() => setSelectedPlan("lifetime")}
                      className={`p-3 rounded-lg border-2 text-left transition-all relative ${
                        selectedPlan === "lifetime"
                          ? "border-yellow-500 bg-yellow-500/5"
                          : "border-border/30 hover:border-yellow-500/30"
                      }`}
                    >
                      <span className="absolute -top-2 right-2 text-[9px] font-bold bg-yellow-500 text-black px-1.5 py-0.5 rounded-full">
                        SAVE 58%
                      </span>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Lifetime</div>
                      <div className="text-xl font-bold text-foreground">₹1,500</div>
                      <div className="text-[10px] text-muted-foreground">one-time</div>
                    </button>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Unlimited visual sitemaps",
                    "Unlimited sitemap pages",
                    "PDF & PNG Export",
                    "JSON Export",
                    "UX Tester",
                    "Analyze Features",
                    "Website Structure Library",
                    "All advanced features",
                    "Future updates included",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-foreground font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Email + UPI Pay */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pricing-email" className="text-sm font-medium text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pricing-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={emailError ? "border-destructive" : ""}
                    />
                    {emailError && (
                      <p className="text-xs text-destructive">{emailError}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleUPIPay}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12 text-base"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Pay with UPI — {selectedPlan === "monthly" ? "₹299" : "₹1,500"}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Opens Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="p-6 md:p-8 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Secure UPI Payment</span>
                  <span className="text-xs text-muted-foreground">Direct bank transfer</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Lock className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Instant Activation</span>
                  <span className="text-xs text-muted-foreground">Access within hours</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Crown className="h-6 w-6 text-yellow-500 mb-2" />
                  <span className="text-sm text-foreground font-medium">Full Refund</span>
                  <span className="text-xs text-muted-foreground">If not activated in 24h</span>
                </div>
              </div>
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

        <Footer />
      </div>
    </>
  );
};

export default PricingIndia;
