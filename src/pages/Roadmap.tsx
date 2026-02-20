import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Network, CheckCircle2, Clock, CircleDot } from "lucide-react";

const baseUrl = "https://no-edit.lovable.app";

const roadmapItems = [
  { status: "done", quarter: "Q1 2026", title: "Website Navigation Maker", description: "Visual drag-and-drop tool for planning website flows with 50+ templates" },
  { status: "done", quarter: "Q1 2026", title: "SEO Content Hub", description: "8 pillar pages + 12 blog articles building topical authority" },
  { status: "done", quarter: "Q1 2026", title: "15+ Tool Landing Pages", description: "Programmatic SEO pages for poster, logo, thumbnail, and more" },
  { status: "in-progress", quarter: "Q2 2026", title: "Collaborative Flows", description: "Real-time collaboration on navigation diagrams with team members" },
  { status: "in-progress", quarter: "Q2 2026", title: "Advanced Export Options", description: "SVG, PDF, and interactive HTML exports for flow diagrams" },
  { status: "planned", quarter: "Q2 2026", title: "Template Marketplace", description: "Community-contributed design templates and flow diagram starters" },
  { status: "planned", quarter: "Q3 2026", title: "AI Flow Suggestions", description: "AI analyzes your flow and suggests navigation improvements" },
  { status: "planned", quarter: "Q3 2026", title: "Figma Plugin", description: "Import EPIC flows directly into Figma for design iteration" },
  { status: "planned", quarter: "Q3 2026", title: "User Testing Integration", description: "Test your planned flows with real users before development" },
  { status: "planned", quarter: "Q4 2026", title: "Mobile App", description: "Native iOS and Android apps for design and flow planning on the go" },
];

const statusConfig = {
  done: { icon: CheckCircle2, label: "Shipped", color: "text-green-500 bg-green-500/10" },
  "in-progress": { icon: Clock, label: "In Progress", color: "text-amber-500 bg-amber-500/10" },
  planned: { icon: CircleDot, label: "Planned", color: "text-muted-foreground bg-muted/30" },
};

const Roadmap = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Roadmap — EPIC Design Platform Future Plans"
        description="See what's coming next for EPIC. Our product roadmap includes collaborative flows, AI suggestions, Figma plugin, and more."
        canonicalUrl={`${baseUrl}/roadmap`}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
            <Network className="h-4 w-4" /> Try Free
          </Button>
        </div>
      </header>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Product Roadmap</h1>
          <p className="text-muted-foreground text-center mb-12">Where EPIC is headed — transparency in what we're building next</p>

          <div className="space-y-4">
            {roadmapItems.map((item, i) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              const Icon = config.icon;
              return (
                <div key={i} className="p-5 rounded-xl border border-border hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.color}`}>
                      <Icon className="h-3.5 w-3.5" /> {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.quarter}</span>
                  </div>
                  <h2 className="font-bold mb-1">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Roadmap;
