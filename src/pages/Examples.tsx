import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Network, ArrowRight, Layout, ShoppingCart, BookOpen, Briefcase, GraduationCap, Smartphone } from "lucide-react";

const baseUrl = "https://no-edit.lovable.app";

const examples = [
  { title: "E-commerce Website Flow", description: "Complete flow from homepage → product listing → product detail → cart → checkout → confirmation. Includes guest checkout and account paths.", icon: ShoppingCart, category: "E-commerce", pages: 12 },
  { title: "SaaS Marketing + Product Flow", description: "Landing page → features → pricing → sign-up → onboarding → dashboard. Covers both marketing and product navigation zones.", icon: Briefcase, category: "SaaS", pages: 15 },
  { title: "Blog & Content Site Architecture", description: "Homepage → categories → articles → author pages → newsletter signup. Optimized for content discovery and reader engagement.", icon: BookOpen, category: "Content", pages: 8 },
  { title: "Portfolio Website Structure", description: "Homepage → work gallery → case studies → about → contact. Designed to convert visitors into clients.", icon: Layout, category: "Portfolio", pages: 6 },
  { title: "EdTech Course Platform Flow", description: "Course catalog → course detail → enrollment → payment → dashboard → lessons → quiz → certificate.", icon: GraduationCap, category: "Education", pages: 14 },
  { title: "Mobile App Navigation Map", description: "Tab-based navigation with home feed, search/explore, create, notifications, and profile sections. Includes nested screens.", icon: Smartphone, category: "Mobile App", pages: 20 },
];

const examplesSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Website Flow Examples — Navigation Diagrams & Templates",
  description: "Browse real-world website flow examples for e-commerce, SaaS, blogs, portfolios, and more. Get inspired and create your own flow with EPIC.",
  url: `${baseUrl}/examples`,
  publisher: { "@type": "Organization", name: "EPIC Design", url: baseUrl },
};

const Examples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Website Flow Examples — Navigation Diagrams & Templates"
        description="Browse real-world website flow examples for e-commerce, SaaS, blogs, portfolios, and more. Get inspired and create your own flow with EPIC."
        canonicalUrl={`${baseUrl}/examples`}
        structuredData={examplesSchema}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
            <Network className="h-4 w-4" /> Try Free
          </Button>
        </div>
      </header>

      <Breadcrumbs items={[{ label: "Examples" }]} />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Website Flow Examples</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Real-world navigation diagrams and flow templates. Get inspired, then build your own with EPIC's free drag-and-drop maker.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {examples.map((ex, i) => {
              const Icon = ex.icon;
              return (
                <div key={i} className="p-6 rounded-xl border border-border hover:border-primary/40 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">{ex.category}</span>
                      <span className="text-xs text-muted-foreground ml-2">· {ex.pages} pages</span>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2">{ex.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{ex.description}</p>
                  <Button size="sm" variant="outline" onClick={() => navigate("/navigation-maker")} className="gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Build This Flow <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
            <h2 className="text-2xl font-bold mb-3">Build Your Own Website Flow</h2>
            <p className="text-muted-foreground mb-6">50+ page templates, drag-and-drop connections, free PNG export.</p>
            <Button size="lg" onClick={() => navigate("/navigation-maker")} className="gap-2">
              Open Navigation Maker <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Examples;
