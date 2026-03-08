import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Network, Sparkles, Zap, Palette, Layout, Image } from "lucide-react";

const baseUrl = "https://no-edit.lovable.app";

const changelog = [
  { date: "Feb 2026", version: "2.4", title: "Website Navigation Maker", description: "Drag-and-drop website flow builder with 50+ page templates, SVG connections, and PNG export. Plan your site's navigation visually.", icon: Network, tag: "New Feature" },
  { date: "Feb 2026", version: "2.3", title: "SEO Pillar Pages", description: "Comprehensive guides on website flow generators, visual sitemaps, user flow diagrams, and more. Built for topical authority.", icon: Layout, tag: "Content" },
  { date: "Jan 2026", version: "2.2", title: "Blog & Knowledge Base", description: "12+ in-depth articles covering UX design, website architecture, SaaS navigation, and student design tools.", icon: Sparkles, tag: "Content" },
  { date: "Jan 2026", version: "2.1", title: "15+ Tool Landing Pages", description: "Dedicated SEO-optimized pages for poster maker, logo maker, thumbnail maker, and 12 more design tools.", icon: Palette, tag: "SEO" },
  { date: "Dec 2025", version: "2.0", title: "AI Design Editor V2", description: "Complete editor redesign with layers, text tools, shapes, crop, backgrounds, and real-time AI assistance.", icon: Image, tag: "Major Update" },
  { date: "Nov 2025", version: "1.8", title: "Creator Mode & Pro Plan", description: "Premium features including unlimited generations, HD export, priority support, and exclusive templates.", icon: Zap, tag: "Monetization" },
  { date: "Oct 2025", version: "1.5", title: "Community Feed & Favorites", description: "Share designs with the community, like and favorite posts, and get inspired by other creators.", icon: Sparkles, tag: "Feature" },
  { date: "Sep 2025", version: "1.0", title: "EPIC Launch", description: "Initial launch with AI image generation, basic editing tools, and PWA support. Zero-edit design philosophy.", icon: Zap, tag: "Launch" },
];

const Changelog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Changelog — EPIC Design Updates & New Features"
        description="See what's new in EPIC. Latest features, improvements, and updates to the AI design generator and website navigation maker."
        canonicalUrl={`${baseUrl}/changelog`}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Changelog</h1>
          <p className="text-muted-foreground text-center mb-12">What's new and improved in EPIC</p>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {changelog.map((entry, i) => {
                const Icon = entry.icon;
                return (
                  <div key={i} className="relative pl-16">
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm text-muted-foreground">{entry.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{entry.tag}</span>
                        <span className="text-xs text-muted-foreground">v{entry.version}</span>
                      </div>
                      <h2 className="text-lg font-bold mb-1">{entry.title}</h2>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Changelog;
