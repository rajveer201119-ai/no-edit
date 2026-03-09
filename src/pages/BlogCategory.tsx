import { useParams, Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, Network } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const baseUrl = "https://no-edit.lovable.app";

const categories: Record<string, { title: string; description: string; keywords: string }> = {
  "ux-design": { title: "UX Design", description: "Learn UX design best practices, user flow creation, and navigation patterns. Actionable guides from EPIC.", keywords: "UX design blog, user experience tips, UX best practices" },
  "web-planning": { title: "Web Planning", description: "Master website planning with guides on sitemaps, architecture, and structure. Plan better websites with EPIC.", keywords: "web planning guide, website architecture, sitemap planning" },
  "saas-design": { title: "SaaS Design", description: "SaaS design guides covering onboarding flows, navigation, and dashboard UX. Build better SaaS products with EPIC.", keywords: "SaaS design tips, SaaS onboarding, SaaS UX" },
  "design-tips": { title: "Design Tips", description: "Practical design tips for beginners and creators. Learn wireflows, landing page design, and visual planning.", keywords: "design tips, graphic design guide, beginner design" },
  "student-resources": { title: "Student Resources", description: "Free design resources and tools for student founders, projects, and portfolios. Get started with EPIC.", keywords: "student design tools, free design resources, student founder tools" },
};

const categoryMap: Record<string, string> = {
  "UX Design": "ux-design",
  "Web Planning": "web-planning",
  "SaaS Design": "saas-design",
  "Design Tips": "design-tips",
  "Student Resources": "student-resources",
};

const BlogCategory = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const cat = category ? categories[category] : undefined;

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate("/blog")}>Browse All Articles</Button>
        </div>
      </div>
    );
  }

  const posts = Object.values(blogPosts).filter((p) => categoryMap[p.category] === category);

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.title} Articles — EPIC Blog`,
    description: cat.description,
    url: `${baseUrl}/blog/category/${category}`,
    isPartOf: { "@type": "Blog", name: "EPIC Blog", url: `${baseUrl}/blog` },
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${cat.title} Articles — EPIC Blog`}
        description={cat.description}
        keywords={cat.keywords}
        canonicalUrl={`${baseUrl}/blog/category/${category}`}
        structuredData={categorySchema}
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

      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: cat.title }]} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{cat.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{cat.description}</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(categories).map(([slug, c]) => (
            <Link
              key={slug}
              to={`/blog/category/${slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${slug === category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mb-20">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No articles in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="block rounded-xl border border-border hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden group">
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogCategory;
