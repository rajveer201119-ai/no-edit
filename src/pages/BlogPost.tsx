import { useParams, useNavigate, Link } from "react-router-dom";
import { SEO, faqSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, Calendar, Clock, Tag, Network } from "lucide-react";
import { SocialShare } from "@/components/SocialShare";
import { BackToTop } from "@/components/BackToTop";
import { blogPosts } from "@/data/blogPosts";
import { pillarPages } from "@/data/pillarPages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TableOfContents, slugify } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";
import { useState } from "react";

const baseUrl = "https://no-edit.lovable.app";
const epicLogoUrl = "https://storage.googleapis.com/gpt-engineer-file-uploads/kG5hIp7FM3biSpv5njI7csuUQ6O2/uploads/1759212272541-file_00000000100c61faa64c1df9bb0aebc8.png";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const post = slug ? blogPosts[slug] : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <Button onClick={() => navigate("/blog")}>Browse Articles</Button>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.h1,
    datePublished: post.publishDate,
    dateModified: post.lastModified || post.publishDate,
    image: epicLogoUrl,
    author: { "@type": "Organization", name: "EPIC Design" },
    publisher: { "@type": "Organization", name: "EPIC Design", logo: { "@type": "ImageObject", url: epicLogoUrl } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
  };

  const combinedSchema = [articleSchema, faqSchema(post.faqs)];
  const headings = post.sections.map((s) => s.heading);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        keywords={post.keywords}
        structuredData={combinedSchema}
      />

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <div className="flex items-center gap-3">
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
              <Network className="h-4 w-4" /> Try Free
            </Button>
          </div>
        </div>
      </header>

      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.h1 }]} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Tag className="h-4 w-4" /> {post.category}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.publishDate}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.h1}</h1>
            <p className="text-lg text-muted-foreground">{post.metaDescription}</p>
            {post.lastModified && (
              <p className="text-xs text-muted-foreground mt-3">Last updated: {post.lastModified}</p>
            )}
            <div className="mt-4">
              <SocialShare url={`${baseUrl}/blog/${post.slug}`} title={post.h1} />
            </div>
          </motion.div>
        </div>
      </section>

      <article className="container mx-auto px-4 max-w-3xl">
        <TableOfContents headings={headings} />

        {post.sections.map((section, i) => (
          <section key={i} id={slugify(section.heading)} className="mb-12 scroll-mt-20">
            <h2 className="text-xl md:text-2xl font-bold mb-4">{section.heading}</h2>
            {section.content.split("\n\n").map((para, j) => (
              <p key={j} className="text-muted-foreground leading-relaxed mb-4">{para}</p>
            ))}
          </section>
        ))}

        {/* Pillar Links */}
        <section className="mb-12 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h3 className="font-bold mb-4">📖 Explore In-Depth Guides</h3>
          <div className="space-y-3">
            {post.pillarLinks.map((pSlug) => {
              const p = pillarPages[pSlug];
              if (!p) return null;
              return (
                <Link key={pSlug} to={`/${pSlug}`} className="block text-primary hover:underline font-medium">
                  → {p.h1}
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-3">
            {post.faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/30 transition-colors"
                >
                  <h3 className="text-sm pr-4">{faq.question}</h3>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Related Articles</h2>
          <div className="grid gap-3">
            {post.relatedArticles.map((rSlug) => {
              const r = blogPosts[rSlug];
              if (!r) return null;
              return (
                <Link key={rSlug} to={`/blog/${rSlug}`} className="block p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <h3 className="font-semibold text-sm mb-1">{r.h1}</h3>
                  <p className="text-xs text-muted-foreground">{r.readTime} · {r.category}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <h2 className="text-xl font-bold mb-2">Ready to Plan Your Website Flow?</h2>
          <p className="text-muted-foreground text-sm mb-5">Try EPIC's free drag-and-drop navigation maker — no sign-up required.</p>
          <Button onClick={() => navigate("/navigation-maker")} className="gap-2">
            Open Navigation Maker <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
