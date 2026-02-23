import { 
  Sparkles, 
  Zap, 
  Download, 
  Smartphone, 
  Shield, 
  Star, 
  Users,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingCredibilityProps {
  onStartDesigning: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Generate stunning designs with simple text prompts",
  },
  {
    icon: Shield,
    title: "No Watermarks",
    description: "Download clean, professional designs every time",
  },
  {
    icon: Zap,
    title: "Instant Export",
    description: "Download in PNG, JPG, or PDF in seconds",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Design anywhere, on any device",
  },
];

const stats = [
  { value: "10K+", label: "Designs Created" },
  { value: "50+", label: "Templates" },
  { value: "Free", label: "To Start" },
  { value: "₹10", label: "Student Plan" },
];

const useCases = [
  "Instagram Posts",
  "YouTube Thumbnails",
  "Event Posters",
  "Logos & Branding",
  "Certificates",
  "Presentations",
];

export const LandingCredibility = ({ onStartDesigning }: LandingCredibilityProps) => {
  return (
    <div className="relative py-16 md:py-24">
      {/* Why EPIC */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
            Why EPIC?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Professional design tools, simplified. No learning curve, no expensive software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors duration-300"
              >
                <Icon className="h-5 w-5 text-foreground mb-4" strokeWidth={1.5} />
                <h3 className="font-medium text-sm mb-1.5">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 mb-20">
        <div className="rounded-xl p-8 md:p-10 border border-border bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
              Built for Creators, Founders &amp; Students
            </h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Whether you're launching a startup, growing your social media, or creating school projects — EPIC gives you the tools to look professional without the complexity.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {useCases.map((useCase) => (
                <span key={useCase} className="px-3 py-1.5 text-xs rounded-md bg-muted border border-border">
                  {useCase}
                </span>
              ))}
            </div>

            <Button onClick={onStartDesigning} size="lg" className="gap-2 rounded-lg">
              Start Creating Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Social Media" },
              { label: "Posters" },
              { label: "Logos" },
              { label: "Thumbnails" },
            ].map((item) => (
              <div
                key={item.label}
                className="aspect-square rounded-xl flex items-center justify-center bg-muted border border-border"
              >
                <span className="text-foreground font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
            Design Faster — No Skills Required
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Describe what you need, EPIC creates it. Edit with intuitive tools, export in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { step: "1", title: "Describe Your Vision", description: "Type what you need — a logo, poster, or social post", icon: Palette },
            { step: "2", title: "AI Creates Instantly", description: "Professional designs in seconds, customizable with easy tools", icon: Sparkles },
            { step: "3", title: "Export & Share", description: "Download HD. No watermarks. Use anywhere.", icon: Download },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative p-6 rounded-xl bg-card border border-border">
                <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-md bg-foreground text-background font-semibold text-xs flex items-center justify-center">
                  {item.step}
                </div>
                <Icon className="h-5 w-5 mb-4 text-foreground" strokeWidth={1.5} />
                <h3 className="font-medium text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4">
        <div className="text-center p-8 md:p-10 rounded-xl bg-muted/20 border border-border">
          <div className="flex justify-center gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
            ))}
          </div>
          <p className="text-base md:text-lg font-medium mb-4 max-w-xl mx-auto leading-relaxed">
            "EPIC made it so easy to create professional-looking graphics for my startup. 
            What used to take hours now takes minutes."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium text-xs">Thousands of creators</p>
              <p className="text-[10px] text-muted-foreground">Already using EPIC</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 mt-20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
          Ready to Create Something Great?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
          Start designing for free. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onStartDesigning} size="lg" className="min-h-[48px] gap-2 rounded-lg">
            <Sparkles className="h-4 w-4" />
            Start Designing Free
          </Button>
          <Button variant="outline" size="lg" className="min-h-[48px] rounded-lg">
            View Templates
          </Button>
        </div>
      </section>
    </div>
  );
};
