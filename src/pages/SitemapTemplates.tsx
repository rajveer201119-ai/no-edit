import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Network, ArrowRight, LayoutTemplate, Sparkles } from "lucide-react";
import { templateList, countPages } from "@/data/sitemapTemplates";
import { SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const SitemapTemplates = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const templates = templateList();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q),
    );
  }, [query, templates]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sitemap Templates",
    description:
      "Free website sitemap templates for SaaS, ecommerce, agency, blog, school and more. Open any template in EPIC and edit it visually.",
    url: `${SITE_URL}/sitemap-templates`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: templates.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: `${SITE_URL}/sitemap-templates/${t.slug}`,
      })),
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <SEO
        title="Sitemap Templates — Free Website Structure Templates | EPIC"
        description="Free sitemap templates for SaaS, ecommerce, agency, blog, portfolio, school and more. Open any template in the visual builder and edit it in seconds."
        keywords="sitemap template, website sitemap template, website structure template, free sitemap templates, site architecture template"
        canonicalUrl={`${SITE_URL}/sitemap-templates`}
        structuredData={schema}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
            <Network className="h-4 w-4" /> Open Builder
          </Button>
        </div>
      </header>

      <Breadcrumbs items={[{ label: "Sitemap Templates" }]} />

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap Templates</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Ready-made website structures for the most common kinds of site. Every template opens
              directly in EPIC's visual builder as editable nodes — rename pages, drag them around,
              delete what you do not need, and export when it looks right.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates (SaaS, store, agency…)"
                aria-label="Search sitemap templates"
                className="sm:max-w-sm"
              />
              <Button variant="outline" onClick={() => navigate("/ai-sitemap-generator")} className="gap-2">
                <Sparkles className="h-4 w-4" /> Generate a custom one with AI
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => (
              <Link
                key={t.slug}
                to={`/sitemap-templates/${t.slug}`}
                onClick={() => trackEvent("template_opened", { template: t.slug })}
                className="group p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <LayoutTemplate className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.category} · {countPages(t.tree)} pages
                  </div>
                </div>
                <h2 className="font-semibold mb-2 group-hover:text-primary transition-colors">{t.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t.summary}</p>
                <span className="text-sm text-primary inline-flex items-center gap-1.5">
                  View template <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-muted-foreground py-10 text-center">
              No template matches “{query}”. Try the AI generator instead — it builds a structure from
              a plain description.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SitemapTemplates;
