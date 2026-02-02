import { 
  Sparkles, 
  Zap, 
  Download, 
  Smartphone, 
  Shield, 
  Star, 
  Users,
  Palette,
  Clock,
  CheckCircle,
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
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "No Watermarks",
    description: "Download clean, professional designs every time",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Instant Export",
    description: "Download in PNG, JPG, or PDF in seconds",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Design anywhere, on any device",
    color: "from-blue-500 to-cyan-500",
  },
];

const stats = [
  { value: "10K+", label: "Designs Created" },
  { value: "50+", label: "Templates" },
  { value: "Free", label: "To Start" },
  { value: "₹10", label: "Pro Monthly" },
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
      {/* Why EPIC Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Why <span className="gradient-epic-text">EPIC</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional design tools, simplified. No learning curve, no expensive software, no design skills required.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-6 rounded-2xl border border-border/50",
                  "bg-gradient-to-br from-muted/30 to-muted/10",
                  "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-300"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                  "bg-gradient-to-br",
                  feature.color
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-epic-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Built for Creators, Founders & Students
            </h2>
            <p className="text-muted-foreground mb-6">
              Whether you're launching a startup, growing your social media, or creating school projects — EPIC gives you the tools to look professional without the complexity.
            </p>
            
            {/* Use Cases */}
            <div className="flex flex-wrap gap-2 mb-8">
              {useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="px-3 py-1.5 text-sm rounded-full bg-muted/50 border border-border/50"
                >
                  {useCase}
                </span>
              ))}
            </div>

            <Button onClick={onStartDesigning} size="lg" className="gap-2">
              Start Creating Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { bg: "from-blue-500 to-purple-600", label: "Social Media" },
              { bg: "from-amber-500 to-red-500", label: "Posters" },
              { bg: "from-green-500 to-teal-500", label: "Logos" },
              { bg: "from-pink-500 to-rose-500", label: "Thumbnails" },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "aspect-square rounded-2xl flex items-center justify-center",
                  "bg-gradient-to-br",
                  item.bg
                )}
              >
                <span className="text-white font-semibold text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speed & Simplicity Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Design Faster with AI — No Skills Required
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simply describe what you need, and EPIC creates it. Edit with intuitive tools, export in seconds.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Describe Your Vision",
              description: "Type what you need: 'A modern tech startup logo' or 'Instagram post for a sale'",
              icon: Palette,
            },
            {
              step: "2",
              title: "AI Creates Instantly",
              description: "Get professional designs in seconds, then customize with easy-to-use tools",
              icon: Sparkles,
            },
            {
              step: "3",
              title: "Export & Share",
              description: "Download in high quality. No watermarks. Use anywhere.",
              icon: Download,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-muted/30 border border-border/50"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                
                <Icon className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4">
        <div className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-lg md:text-xl font-medium mb-4 max-w-2xl mx-auto">
            "EPIC made it so easy to create professional-looking graphics for my startup. 
            What used to take hours now takes minutes."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Thousands of creators</p>
              <p className="text-xs text-muted-foreground">Already using EPIC</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 mt-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Ready to Create Something <span className="gradient-epic-text">EPIC</span>?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Start designing for free. No credit card required. Upgrade to Pro for unlimited access at just ₹10/month.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onStartDesigning} size="lg" className="min-h-[48px] gap-2">
            <Sparkles className="h-4 w-4" />
            Start Designing Free
          </Button>
          <Button variant="outline" size="lg" className="min-h-[48px]">
            View Templates
          </Button>
        </div>
      </section>
    </div>
  );
};
