import { Link, useNavigate, useParams } from "react-router-dom";
import { SEO, faqSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Check, AlertTriangle, Sparkles, Copy } from "lucide-react";
import { sitemapTemplates, countPages, type TemplateNode } from "@/data/sitemapTemplates";
import { SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const TreeBranch = ({ nodes, depth = 0 }: { nodes: TemplateNode[]; depth?: number }) => (
  <ul className={depth === 0 ? "space-y-1.5" : "space-y-1.5 mt-1.5 ml-4 border-l border-border/60 pl-4"}>
    {nodes.map((node) => (
      <li key={node.slug + node.name}>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-medium text-sm">{node.name}</span>
          <code className="text-xs text-muted-foreground">{node.slug}</code>
          {node.note && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
              {node.note}
            </span>
          )}
        </div>
        {node.children?.length ? <TreeBranch nodes={node.children} depth={depth + 1} /> : null}
      </li>
    ))}
  </ul>
);

const SitemapTemplateDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const template = slug ? sitemapTemplates[slug] : undefined;

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center px-4">
        <div>
          <h1 className="text-3xl font-bold mb-3">Template not found</h1>
          <p className="text-muted-foreground mb-6">This sitemap template does not exist (yet).</p>
          <Button onClick={() => navigate("/sitemap-templates")}>Browse all templates</Button>
        </div>
      </div>
    );
  }

  const url = `${SITE_URL}/sitemap-templates/${template.slug}`;
  const pageCount = countPages(template.tree);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: template.h1,
      description: template.metaDescription,
      datePublished: template.published,
      dateModified: template.updated,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "EPIC" },
      publisher: { "@type": "Organization", name: "EPIC", url: SITE_URL },
    },
    faqSchema(template.faqs),
  ];

  const openInBuilder = () => {
    trackEvent("template_used", { template: template.slug, source: "detail_page" });
    navigate(`/navigation-maker?template=${template.slug}`);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(template.aiPrompt);
      toast.success("AI prompt copied");
    } catch {
      toast.error("Could not copy — select the text manually");
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <SEO
        title={template.metaTitle}
        description={template.metaDescription}
        keywords={template.keywords}
        canonicalUrl={url}
        ogType="article"
        structuredData={schema}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <Button size="sm" onClick={openInBuilder} className="gap-1.5">
            <Network className="h-4 w-4" /> Use this template
          </Button>
        </div>
      </header>

      <Breadcrumbs items={[{ label: "Sitemap Templates", href: "/sitemap-templates" }, { label: template.category }]} />

      <article className="container mx-auto px-4 max-w-4xl pb-20">
        <section className="pt-8 pb-10">
          <div className="text-sm text-muted-foreground mb-3">
            {template.category} · {pageCount} pages
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">{template.h1}</h1>
          {template.intro.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg">{p}</p>
          ))}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button size="lg" onClick={openInBuilder} className="gap-2">
              Open in the builder <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={copyPrompt} className="gap-2">
              <Copy className="h-4 w-4" /> Copy the AI prompt
            </Button>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">The structure</h2>
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-5 md:p-6 overflow-x-auto">
            <TreeBranch nodes={template.tree} />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Every node above becomes an editable card on the canvas. Nothing is locked.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What this kind of site is</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{template.siteTypeExplainer}</p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why this hierarchy works</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{template.whyItWorks}</p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Pages you should not skip</h2>
          <div className="space-y-3">
            {template.mustHavePages.map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl border border-border">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.page}</h3>
                  <p className="text-sm text-muted-foreground">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">SEO notes</h2>
            <ul className="space-y-2.5">
              {template.seoNotes.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed">• {n}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">UX notes</h2>
            <ul className="space-y-2.5">
              {template.uxNotes.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed">• {n}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Common mistakes</h2>
          <div className="space-y-3">
            {template.mistakes.map((m, i) => (
              <div key={i} className="p-4 rounded-xl border border-border">
                <div className="flex gap-2 items-start mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-sm">{m.mistake}</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{m.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Suggested navigation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-xl border border-border">
              <h3 className="font-semibold text-sm mb-2">Primary navigation</h3>
              <p className="text-sm text-muted-foreground">{template.navigation.primary.join(" · ")}</p>
            </div>
            <div className="p-5 rounded-xl border border-border">
              <h3 className="font-semibold text-sm mb-2">Footer</h3>
              <p className="text-sm text-muted-foreground">{template.navigation.footer.join(" · ")}</p>
            </div>
          </div>
        </section>

        <section className="mb-14 p-6 rounded-2xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl md:text-2xl font-bold mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Prefer a custom version?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Paste this into EPIC's AI sitemap generator and adjust it to your own product:
          </p>
          <p className="text-sm bg-background/60 border border-border rounded-xl p-4 mb-4 leading-relaxed">
            {template.aiPrompt}
          </p>
          <Button variant="outline" onClick={() => navigate("/ai-sitemap-generator")} className="gap-2">
            Open the AI sitemap generator <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Questions</h2>
          <div className="space-y-4">
            {template.faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">{f.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Related templates</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {template.relatedTemplates.map((rel) => {
              const r = sitemapTemplates[rel];
              if (!r) return null;
              return (
                <Link
                  key={rel}
                  to={`/sitemap-templates/${rel}`}
                  className="p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <h3 className="font-semibold mb-1 text-sm">{r.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="text-center p-10 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Start from this structure</h2>
          <p className="text-muted-foreground mb-6">
            It loads onto the canvas as {pageCount} editable pages. Free, no sign-up needed.
          </p>
          <Button size="lg" onClick={openInBuilder} className="gap-2">
            Use this template <ArrowRight className="h-5 w-5" />
          </Button>
        </section>
      </article>

      <Footer />
    </main>
  );
};

export default SitemapTemplateDetail;
