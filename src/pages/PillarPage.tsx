import { useParams, useNavigate, Link } from "react-router-dom";
import { SEO, faqSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, ChevronDown, ChevronUp, Network, Sparkles } from "lucide-react";
import { pillarPages } from "@/data/pillarPages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TableOfContents, slugify } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";
import { useState } from "react";

const baseUrl = "https://no-edit.lovable.app";

const PillarPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const page = slug ? pillarPages[slug] : undefined;

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const faqSchemaData = faqSchema(page.faqs);

  // HowTo schema for actionable pillar pages
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use ${page.h1}`,
    description: page.metaDescription,
    step: page.sections.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.heading,
      text: s.content.substring(0, 200),
    })),
  };

  const combinedSchema = [page.schema, faqSchemaData, howToSchema];
  const headings = page.sections.map((s) => s.heading);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        structuredData={combinedSchema}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <div className="flex items-center gap-3">
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">Blog</Link>
            <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
              <Network className="h-4 w-4" /> Try Free
            </Button>
          </div>
        </div>
      </header>

      <Breadcrumbs items={[{ label: "Guides", href: "/blog" }, { label: page.h1 }]} />

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" /> Free Tool — No Sign-up Required
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{page.h1}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{page.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/navigation-maker")} className="gap-2 text-base">
                Start Building <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/")} className="text-base">
                Explore All Tools
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="container mx-auto px-4 max-w-4xl">
        <TableOfContents headings={headings} />

        {page.sections.map((section, i) => (
          <section key={i} id={slugify(section.heading)} className="mb-16 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.heading}</h2>
            {section.content.split("\n\n").map((para, j) => (
              <p key={j} className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg">{para}</p>
            ))}
          </section>
        ))}

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">EPIC vs Other Tools</h2>
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/30 p-4 font-semibold text-sm">
              <span>Feature</span>
              <span className="text-center text-primary">EPIC</span>
              <span className="text-center">Others</span>
            </div>
            {page.comparison.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-4 border-t border-border/50 text-sm">
                <span>{row.feature}</span>
                <span className="text-center">{row.epic ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />}</span>
                <span className="text-center">{row.others ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {page.faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/30 transition-colors"
                >
                  <h3 className="text-base pr-4">{faq.question}</h3>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Pillars */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Tools & Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {page.relatedPillars.map((rpSlug) => {
              const rp = pillarPages[rpSlug];
              if (!rp) return null;
              return (
                <Link key={rpSlug} to={`/${rpSlug}`} className="block p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <h3 className="font-semibold mb-1">{rp.h1}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{rp.metaDescription}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 text-center p-10 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{page.cta.title}</h2>
          <p className="text-muted-foreground mb-6">{page.cta.description}</p>
          <Button size="lg" onClick={() => navigate("/navigation-maker")} className="gap-2">
            Open Navigation Maker <ArrowRight className="h-5 w-5" />
          </Button>
        </section>
      </article>

      <Footer />
    </div>
  );
};

export default PillarPage;
