import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowRight, Network } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { pillarPages } from "@/data/pillarPages";

const baseUrl = "https://no-edit.lovable.app";

const Blog = () => {
  const navigate = useNavigate();
  const posts = Object.values(blogPosts).sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  const pillars = Object.values(pillarPages);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="EPIC Blog — Website Flow, UX Design & Design Tips"
        description="Learn about website user flows, visual sitemaps, UX navigation, SaaS design, and graphic design. Actionable guides and tutorials from EPIC."
        keywords="website flow blog, UX design blog, website planning guide, design tips, sitemap guide"
        canonicalUrl={`${baseUrl}/blog`}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold gradient-epic-text">EPIC</Link>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => navigate("/navigation-maker")} className="gap-1.5">
              <Network className="h-4 w-4" /> Try Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">EPIC Design Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Actionable guides on website flows, UX design, navigation planning, and graphic design.</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Pillar Pages Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">📚 In-Depth Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p) => (
              <Link
                key={p.slug}
                to={`/${p.slug}`}
                className="block p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{p.h1}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">📝 Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block rounded-xl border border-border hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{post.h1}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.metaDescription}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
