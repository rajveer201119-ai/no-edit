import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Shield, X, Lock, Zap, Star, Users, Clock, Sparkles, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SEO, pricingPageSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { UPIPaymentDialog } from "@/components/UPIPaymentDialog";

const PricingIndia = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [payOpen, setPayOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "applied" | "invalid">("idle");
  const [validating, setValidating] = useState(false);

  const amount = selectedPlan === "monthly" ? 299 : 1500;
  const anchorPrice = selectedPlan === "monthly" ? 799 : 3500;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setValidating(true);
    try {
      const { data, error } = await supabase.rpc("validate_coupon", { code_input: coupon.trim() });
      if (error) throw error;
      const r = data as { valid: boolean; message?: string };
      if (r?.valid) {
        setCouponState("applied");
        toast.success("Code valid — redeem it after sign-in to unlock Pro free.");
      } else {
        setCouponState("invalid");
        toast.error(r?.message || "Invalid code");
      }
    } catch {
      toast.error("Could not validate code");
    } finally {
      setValidating(false);
    }
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

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-foreground mb-4">
              <Clock className="h-3 w-3 text-yellow-600" />
              Launch pricing — Lifetime jumps to ₹2,500 after 500 users
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Plan a website in a weekend.
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Less than ₹5 a day. One coffee. Unlimited sitemaps, exports, and every premium feature — forever.
            </p>
            {/* Social proof bar */}
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-border/40 bg-background/30 backdrop-blur-md px-4 py-2 text-xs text-foreground">
              <span className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}
                <strong className="ml-1">4.8</strong>
                <span className="text-muted-foreground">/ 280+ reviews</span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3 w-3" /> Used by founders in 15+ countries
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-12">
            {/* Pro Plan — Pro-first, dominant */}
            <Card className="md:col-span-3 md:order-2 p-8 border-2 border-yellow-500/60 bg-background/15 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-yellow-500/10 md:scale-[1.02]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-500 px-3 py-1 rounded-full text-xs font-bold text-black flex items-center gap-1 shadow-md">
                  <Sparkles className="h-3 w-3" /> MOST POPULAR
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
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs line-through text-muted-foreground">₹799</span>
                        <span className="text-xl font-bold text-foreground">₹299</span>
                      </div>
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
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs line-through text-muted-foreground">₹3,500</span>
                        <span className="text-xl font-bold text-foreground">₹1,500</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">pay once · own forever</div>
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
                    "Priority support",
                    "Future updates included",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-foreground font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Coupon */}
                <div className="rounded-lg border border-border/30 bg-background/30 p-3">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1 mb-2">
                    <Tag className="h-3 w-3" /> Have a discount code?
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponState("idle"); }}
                      placeholder="e.g. FOUNDER100"
                      className="h-9 text-sm bg-background/50"
                      disabled={couponState === "applied"}
                    />
                    <Button
                      size="sm"
                      variant={couponState === "applied" ? "secondary" : "outline"}
                      onClick={applyCoupon}
                      disabled={validating || couponState === "applied"}
                      className="h-9 shrink-0"
                    >
                      {couponState === "applied" ? <><Check className="h-3.5 w-3.5 mr-1" /> Applied</> : validating ? "..." : "Apply"}
                    </Button>
                  </div>
                </div>

                {/* Email + UPI Pay */}
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => setPayOpen(true)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-base shadow-lg shadow-yellow-500/30"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Unlock Pro — {selectedPlan === "monthly" ? "₹299" : "₹1,500"} via UPI
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    GPay · PhonePe · Paytm · BHIM — verified within hours · 7-day money-back
                  </p>
                </div>
              </div>
            </Card>

            {/* Free Plan — secondary, narrower */}
            <Card className="md:col-span-2 md:order-1 p-6 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-foreground">Free</h2>
                  <div className="text-3xl font-bold mb-2 text-foreground">₹0</div>
                  <p className="text-sm text-muted-foreground">Try the basics, hit limits fast</p>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {["1 sitemap project", "10 pages max", "JSON export only"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {["No PDF / PNG", "No UX Tester", "No Analyzer", "No template library"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground/60 line-through">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                  Start free
                </Button>
              </div>
            </Card>
          </div>

          {/* Testimonials strip */}
          <div className="max-w-5xl mx-auto mb-12 grid md:grid-cols-3 gap-4">
            {[
              { q: "Mapped my entire SaaS in 20 minutes — paid for itself before the trial ended.", a: "Aarav S.", r: "Founder, Bangalore" },
              { q: "The lifetime deal is a steal. I've already exported 40+ sitemaps for clients.", a: "Priya M.", r: "UX Consultant" },
              { q: "Replaced three tools we were paying monthly for. Worth every rupee.", a: "Rohan K.", r: "Product Lead" },
            ].map((t) => (
              <Card key={t.a} className="p-4 bg-background/10 backdrop-blur-xl border border-border/30">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}
                </div>
                <blockquote className="text-sm text-foreground/90 italic mb-2">"{t.q}"</blockquote>
                <div className="text-xs text-muted-foreground">— {t.a} · {t.r}</div>
              </Card>
            ))}
          </div>

          {/* Trust Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <Card className="p-6 md:p-8 border border-border/30 bg-background/10 backdrop-blur-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Secure UPI Payment</span>
                  <span className="text-xs text-muted-foreground">Direct bank transfer</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Lock className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Instant Activation</span>
                  <span className="text-xs text-muted-foreground">Verified within hours</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Crown className="h-6 w-6 text-yellow-500 mb-2" />
                  <span className="text-sm text-foreground font-medium">7-Day Money Back</span>
                  <span className="text-xs text-muted-foreground">No questions asked</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/20 border border-border/20">
                  <Sparkles className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-foreground font-medium">Lifetime Updates</span>
                  <span className="text-xs text-muted-foreground">Every future feature</span>
                </div>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-center text-xl font-bold text-foreground mb-4">Questions before you buy?</h2>
            {[
              { q: "Is the lifetime deal really lifetime?", a: "Yes. One payment of ₹1,500 and you own EPIC Pro forever — including every future update. No renewals, no surprises." },
              { q: "How fast is activation?", a: "Most UPI payments are verified and activated within 1–4 hours. You'll get an email the moment Pro is live on your account." },
              { q: "What if I don't like it?", a: "Email us within 7 days at hello@epic.tools and we'll refund 100% — no questions, no forms." },
              { q: "Can I switch from monthly to lifetime later?", a: "Yes. Pay the difference and we'll upgrade your account manually." },
            ].map((f) => (
              <details key={f.q} className="group rounded-lg border border-border/30 bg-background/10 backdrop-blur-xl p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground flex justify-between items-center list-none">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
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

      <UPIPaymentDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        plan={selectedPlan}
        amount={amount}
      />
    </>
  );
};

export default PricingIndia;
