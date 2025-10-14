import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const PricingIndia = () => {
  const navigate = useNavigate();

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
            Pricing for India 🇮🇳
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="glass-card p-8 border-2 border-white/10">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-4xl font-bold mb-4">₹0</div>
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
                <div className="text-4xl font-bold mb-1">₹10</div>
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
                onClick={() => navigate("/auth")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Not from India?{" "}
            <button
              onClick={() => navigate("/pricing-international")}
              className="text-primary underline hover:text-primary/80"
            >
              View International Pricing
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingIndia;
