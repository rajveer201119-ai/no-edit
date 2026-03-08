import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { seedSitemaps } from "@/data/seedSitemaps";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Globe, Search, ArrowRight, FileText, Layers } from "lucide-react";
import { MainNavigation } from "@/components/platform/MainNavigation";

const SitemapLibrary = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dbSitemaps, setDbSitemaps] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("published_sitemaps")
      .select("domain, slug, total_pages, max_depth, top_level_sections")
      .then(({ data }) => {
        if (data) setDbSitemaps(data);
      });
  }, []);

  // Merge seed + db, deduplicate by domain
  const allSitemaps = [
    ...seedSitemaps.map(s => ({
      domain: s.domain,
      slug: s.slug,
      totalPages: s.totalPages,
      maxDepth: s.maxDepth,
      topLevelSections: s.topLevelSections,
    })),
    ...dbSitemaps.map(s => ({
      domain: s.domain,
      slug: s.slug,
      totalPages: s.total_pages,
      maxDepth: s.max_depth,
      topLevelSections: s.top_level_sections,
    })),
  ].filter((v, i, a) => a.findIndex(x => x.domain === v.domain) === i);

  const filtered = search
    ? allSitemaps.filter(s => s.domain.toLowerCase().includes(search.toLowerCase()))
    : allSitemaps;

  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Website Structure Library — Visual Sitemaps",
    description: "Browse visual sitemaps of popular websites and explore their architecture. Discover how top sites structure their content.",
    url: "https://no-edit.lovable.app/sitemaps",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allSitemaps.length,
      itemListElement: allSitemaps.slice(0, 30).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${s.domain} Visual Sitemap`,
        url: `https://no-edit.lovable.app/sitemap/${s.slug}`,
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://no-edit.lovable.app/" },
        { "@type": "ListItem", position: 2, name: "Sitemap Library", item: "https://no-edit.lovable.app/sitemaps" },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Website Structure Library — Visual Sitemaps of 30+ Sites | EPIC"
        description="Browse visual sitemaps of Stripe, Figma, Notion, Airbnb, and 25+ popular websites. Explore real website architectures and page hierarchies."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <MainNavigation
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/");
        }}
      />
      <main className="min-h-screen bg-background pt-14">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Sitemap Library</span>
          </nav>

          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Website Structure Library</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse visual sitemaps of {allSitemaps.length}+ popular websites. Explore real architectures built by top companies.
            </p>
          </header>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search websites (e.g., stripe, figma)..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {filtered.map(s => (
              <Link key={s.slug} to={`/sitemap/${s.slug}`}>
                <Card className="p-4 hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{s.domain}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <FileText className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-bold">{s.totalPages}</div>
                      <div className="text-[10px] text-muted-foreground">Pages</div>
                    </div>
                    <div>
                      <Layers className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-bold">{s.maxDepth}</div>
                      <div className="text-[10px] text-muted-foreground">Depth</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{s.topLevelSections}</div>
                      <div className="text-[10px] text-muted-foreground">Sections</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No websites found matching "{search}".</p>
              <Button asChild>
                <Link to="/analyzer">Analyze this domain instead →</Link>
              </Button>
            </div>
          )}

          {/* CTA */}
          <div className="text-center py-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-2">Analyze Any Website</h2>
            <p className="text-muted-foreground mb-4">Enter any domain and get a visual sitemap with real crawl data, instantly.</p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/analyzer">
                Start Analyzing <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default SitemapLibrary;
