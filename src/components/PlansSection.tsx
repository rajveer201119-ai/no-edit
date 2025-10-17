import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export const PlansSection = () => {
  const navigate = useNavigate();

  return (
    <section id="plans" className="scroll-mt-20 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-4">
            Choose Your{" "}
            <span className="inline-block bg-yellow-400 text-black px-3 py-1.5 md:px-4 md:py-2 -rotate-1">
              PLAN
            </span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground">
            Start free, upgrade anytime for unlimited creativity
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Free Plan */}
          <Card className="glass-card p-6 md:p-8 border-2 border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl md:rounded-3xl hover:scale-[1.02] transition-transform">
            <div className="space-y-5 md:space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-2">Free</h3>
                <div className="text-3xl md:text-4xl font-black mb-3 md:mb-4">₹0</div>
                <p className="text-sm md:text-base text-muted-foreground">Perfect to get started</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">2 images per day</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">All AI styles</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">Save & download</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 md:h-12 text-sm md:text-base"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
              </Button>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="glass-card p-6 md:p-8 border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-card/80 to-secondary/10 backdrop-blur-xl rounded-2xl md:rounded-3xl relative overflow-hidden hover:scale-[1.02] transition-transform glow-orange">
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>

            <div className="space-y-5 md:space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black gradient-epic-text mb-2">Pro</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl md:text-4xl font-black">₹10</span>
                  <span className="text-sm md:text-base text-muted-foreground">/month</span>
                </div>
                <p className="text-xs md:text-sm font-semibold text-primary mb-3 md:mb-4">
                  12x more images daily! 🚀
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-semibold">25 images per day</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm md:text-base">All AI styles</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm md:text-base">Priority generation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm md:text-base">Save & download</span>
                </div>
              </div>

              <Button
                className="w-full h-11 md:h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm md:text-base"
                onClick={() => navigate("/pricing-india")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-xs md:text-sm text-muted-foreground">
            Not from India?{" "}
            <button
              onClick={() => navigate("/pricing-international")}
              className="text-primary underline hover:text-primary/80 font-medium"
            >
              View International Pricing
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};
