import { Link, useNavigate, useParams } from "react-router-dom";
import { SEO, faqSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Check, Minus } from "lucide-react";
import { comparisonPages } from "@/data/comparisonPages";
import { SITE_URL } from "@/lib/site";

const ComparisonPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const page = slug ? comparisonPages[slug] : undefined;

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center px-4">
        <div>
          <h1 className="text-3xl font-bold mb-3">Comparison not found</h1>
          <Button onClick={() => navigate("/sitemap-templates")}>Browse templates</Button>
        </div>
      </div>
    );
  }

  const url = `${SITE_URL}/compare/${page.slug}`;

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalUrl={url}
        ogType="article"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page.h1,
            description: page.metaDescription,
            dateModified: page.checkedDate,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "EPIC" },
            publisher: { "@type": "Organization", name: "EPIC", url: SITE_URL },
          },
          faqSchema(page.faqs),
        ]}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
            <Network className="h-4 w-4" /> Try EPIC free
          </Button>
        </div>
      </header>

      <Breadcrumbs items={[{ label: "Comparisons" }, { label: `EPIC vs ${page.competitor}` }]} />

      <article className="container mx-auto px-4 max-w-4xl pb-20">
        <section className="pt-8 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.h1}</h1>
          <p className="text-lg text-muted-foreground mb-4">{page.heroSubtitle}</p>
          <p className="text-sm text-muted-foreground mb-6">Information checked {page.checkedDate}.</p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{page.summary}</p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Side by side</h2>
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/30 p-4 font-semibold text-sm">
              <span>Feature</span>
              <span className="text-primary">EPIC</span>
              <span>{page.competitor}</span>
            </div>
            {page.table.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-4 border-t border-border/50 text-sm gap-2">
                <span className="font-medium">{row.feature}</span>
                <span className="text-muted-foreground">{row.epic}</span>
                <span className="text-muted-foreground">{row.competitor}</span>
              </div>
            ))}
          </div>
        </section>

        {page.sections.map((s, i) => (
          <section key={i} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{s.heading}</h2>
            {s.content.split("\n\n").map((para, j) => (
              <p key={j} className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg">{para}</p>
            ))}
          </section>
        ))}

        <section className="mb-14 grid gap-5 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-border">
            <h2 className="text-lg font-bold mb-3">Where EPIC is strong</h2>
            <ul className="space-y-2 mb-5">
              {page.epicStrengths.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold mb-2">Where it falls short</h3>
            <ul className="space-y-2">
              {page.epicLimitations.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <Minus className="h-4 w-4 shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-border">
            <h2 className="text-lg font-bold mb-3">Where {page.competitor} is strong</h2>
            <ul className="space-y-2">
              {page.competitorStrengths.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 grid gap-5 sm:grid-cols-2">
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
            <h2 className="font-semibold mb-2">Choose EPIC if…</h2>
            <p className="text-sm text-muted-foreground">{page.bestFor.epic}</p>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h2 className="font-semibold mb-2">Choose {page.competitor} if…</h2>
            <p className="text-sm text-muted-foreground">{page.bestFor.competitor}</p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Questions</h2>
          <div className="space-y-4">
            {page.faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">{f.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {page.relatedComparisons.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold mb-4">Other comparisons</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.relatedComparisons.map((rel) => {
                const r = comparisonPages[rel];
                if (!r) return null;
                return (
                  <Link key={rel} to={`/compare/${rel}`} className="p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <h3 className="font-semibold text-sm mb-1">{r.h1}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.metaDescription}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="text-center p-10 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Try EPIC before you decide</h2>
          <p className="text-muted-foreground mb-6">Describe your website, get an editable sitemap. Free, no install.</p>
          <Button size="lg" onClick={() => navigate("/navigation-maker")} className="gap-2">
            Open the builder <ArrowRight className="h-5 w-5" />
          </Button>
        </section>
      </article>

      <Footer />
    </main>
  );
};

export default ComparisonPage;
