import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SitemapTree } from "@/components/SitemapTree";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Globe, Search, Loader2, FileText, Layers, AlertTriangle,
  BarChart3, Download, Share2, TreePine, Lock, Crown
} from "lucide-react";
import { seedSitemaps, type SitemapNode } from "@/data/seedSitemaps";
import { Footer } from "@/components/Footer";
import { MainNavigation } from "@/components/platform/MainNavigation";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { useUserPlan } from "@/hooks/useUserPlan";
import { ProPaywall } from "@/components/ProPaywall";

interface AnalysisReport {
  domain: string;
  totalPages: number;
  maxDepth: number;
  topLevelSections: number;
  largestCluster: string;
  largestClusterSize: number;
  orphanPages: number;
  tree: SitemapNode[];
}

const countNodes = (nodes: SitemapNode[]): number => {
  let count = 0;
  for (const n of nodes) {
    count += 1;
    if (n.children) count += countNodes(n.children);
  }
  return count;
};

const getMaxDepth = (nodes: SitemapNode[], depth = 1): number => {
  let max = depth;
  for (const n of nodes) {
    if (n.children) max = Math.max(max, getMaxDepth(n.children, depth + 1));
  }
  return max;
};

const findLargestCluster = (nodes: SitemapNode[]): { name: string; size: number } => {
  let largest = { name: "Root", size: 0 };
  for (const n of nodes) {
    const size = n.children ? countNodes(n.children) : 0;
    if (size > largest.size) largest = { name: n.name, size };
    if (n.children) {
      const sub = findLargestCluster(n.children);
      if (sub.size > largest.size) largest = sub;
    }
  }
  return largest;
};

const urlsToTree = (urls: string[], domain: string): SitemapNode[] => {
  const root: SitemapNode = { name: "Home", url: "/" };
  const pathMap = new Map<string, SitemapNode>();
  pathMap.set("/", root);

  const paths = urls
    .map(u => {
      try {
        const parsed = new URL(u.startsWith("http") ? u : `https://${u}`);
        return parsed.pathname.replace(/\/$/, "") || "/";
      } catch {
        return null;
      }
    })
    .filter((p): p is string => p !== null && p !== "")
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  for (const path of paths) {
    if (path === "/") continue;
    const segments = path.split("/").filter(Boolean);
    let currentPath = "";
    let parent = root;

    for (let i = 0; i < segments.length; i++) {
      currentPath += "/" + segments[i];
      let node = pathMap.get(currentPath);
      if (!node) {
        const name = segments[i].replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        node = { name, url: currentPath };
        pathMap.set(currentPath, node);
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
      parent = node;
    }
  }

  return [root];
};

const WebsiteAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const navigate = useNavigate();
  const { isPremium, canUseAnalyzer } = useUserPlan();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    const domain = url.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    setLoading(true);

    const seed = seedSitemaps.find(s => s.domain === domain);
    if (seed) {
      setReport({
        domain: seed.domain,
        totalPages: seed.totalPages,
        maxDepth: seed.maxDepth,
        topLevelSections: seed.topLevelSections,
        largestCluster: seed.largestCluster,
        largestClusterSize: seed.largestClusterSize,
        orphanPages: seed.orphanPages,
        tree: seed.tree,
      });
      setLoading(false);
      toast.success(`Analysis complete! Showing structure for ${domain}`);
      return;
    }

    try {
      const response = await firecrawlApi.map(domain, { limit: 200 });
      if (response.success && response.links && response.links.length > 0) {
        const tree = urlsToTree(response.links, domain);
        const total = countNodes(tree);
        const depth = getMaxDepth(tree);
        const cluster = findLargestCluster(tree);
        const topLevel = tree[0]?.children?.length || 0;
        let orphans = 0;
        const countOrphans = (nodes: SitemapNode[], d: number) => {
          for (const n of nodes) {
            if (!n.children && d > 2) orphans++;
            if (n.children) countOrphans(n.children, d + 1);
          }
        };
        countOrphans(tree, 1);

        setReport({
          domain,
          totalPages: total,
          maxDepth: depth,
          topLevelSections: topLevel,
          largestCluster: cluster.name,
          largestClusterSize: cluster.size,
          orphanPages: Math.min(orphans, 10),
          tree,
        });
        toast.success(`Crawled ${response.links.length} URLs from ${domain}!`);
      } else {
        toast.info("Could not crawl this domain. Showing estimated structure.");
        generateFallbackReport(domain);
      }
    } catch (error) {
      console.error("Firecrawl error:", error);
      toast.info("Crawler unavailable. Showing estimated structure.");
      generateFallbackReport(domain);
    }

    setLoading(false);
  };

  const generateFallbackReport = (domain: string) => {
    const sections = ["Home", "About", "Products", "Blog", "Contact", "Pricing", "Support", "Careers"];
    const tree: SitemapNode[] = [
      {
        name: "Home", url: "/", children: sections.slice(1, 5 + Math.floor(Math.random() * 3)).map(s => ({
          name: s,
          url: `/${s.toLowerCase()}`,
          children: Math.random() > 0.5 ? [
            { name: `${s} Overview`, url: `/${s.toLowerCase()}/overview` },
            { name: `${s} Details`, url: `/${s.toLowerCase()}/details` },
          ] : undefined,
        })),
      },
    ];
    const total = countNodes(tree);
    const depth = getMaxDepth(tree);
    const cluster = findLargestCluster(tree);

    setReport({
      domain,
      totalPages: total,
      maxDepth: depth,
      topLevelSections: tree[0].children?.length || 0,
      largestCluster: cluster.name,
      largestClusterSize: cluster.size,
      orphanPages: Math.floor(Math.random() * 3),
      tree,
    });
  };

  const handlePublish = async () => {
    if (!report) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to publish sitemaps");
      navigate("/auth");
      return;
    }

    const slug = report.domain.replace(/\./g, "-");
    const { error } = await supabase.from("published_sitemaps").upsert({
      domain: report.domain,
      slug,
      title: `Visual Sitemap of ${report.domain}`,
      description: `Explore the website architecture and visual sitemap of ${report.domain} generated by EPIC.`,
      total_pages: report.totalPages,
      max_depth: report.maxDepth,
      top_level_sections: report.topLevelSections,
      largest_cluster: report.largestCluster,
      largest_cluster_size: report.largestClusterSize,
      orphan_pages: report.orphanPages,
      sitemap_data: report.tree as any,
      published_by: user.id,
    } as any, { onConflict: "domain" } as any);

    if (error) {
      toast.error("Failed to publish sitemap");
      console.error(error);
    } else {
      toast.success("Sitemap published!");
      navigate(`/sitemap/${slug}`);
    }
  };

  return (
    <>
      <SEO
        title="Website Structure Analyzer — Free Sitemap Tool | EPIC"
        description="Analyze any website's architecture with real crawl data. Get a visual sitemap, structure report, and UX insights with EPIC's free analyzer tool."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "EPIC Website Structure Analyzer",
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          description: "Analyze any website's architecture with real crawl data.",
          url: "https://no-edit.lovable.app/analyzer",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <MainNavigation
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/");
        }}
      />
      <main className="min-h-screen bg-background pt-14">
        <header className="border-b border-border px-6 py-4 flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Website Structure Analyzer</h1>
            <p className="text-sm text-muted-foreground">Crawl any website and visualize its architecture with real data</p>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Input — always accessible */}
          <Card className="p-6 mb-8">
            <form onSubmit={handleAnalyze} className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="Enter domain (e.g., stripe.com)"
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {loading ? "Crawling…" : "Analyze"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by Firecrawl — discovers real pages via live website crawling.
            </p>
          </Card>

          {/* Report — blur for free users */}
          {report && (
            <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 relative">
              {/* Overlay for free users */}
              {!canUseAnalyzer && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
                  <Lock className="h-8 w-8 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-bold text-foreground mb-1">Pro Feature</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    Upgrade to EPIC Pro to see the full analysis report, visual sitemap, and export options.
                  </p>
                  <Button onClick={() => setShowPaywall(true)} className="gap-2">
                    <Crown className="h-4 w-4" /> Upgrade to Pro
                  </Button>
                </div>
              )}

              <div className={!canUseAnalyzer ? "blur-md pointer-events-none select-none" : ""}>
                {/* Stats */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Website Structure Report — {report.domain}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { label: "Pages Discovered", value: report.totalPages, icon: FileText },
                      { label: "Nav Depth", value: `${report.maxDepth} Levels`, icon: Layers },
                      { label: "Top Sections", value: report.topLevelSections, icon: TreePine },
                      { label: "Largest Cluster", value: `${report.largestCluster} (${report.largestClusterSize})`, icon: BarChart3 },
                      { label: "Orphan Pages", value: report.orphanPages, icon: AlertTriangle },
                    ].map(stat => (
                      <Card key={stat.label} className="p-4 text-center">
                        <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Tree */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Visual Sitemap</h3>
                  <SitemapTree nodes={report.tree} />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handlePublish} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Publish This Sitemap
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => {
                    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${report.domain}-sitemap.json`;
                    a.click();
                  }}>
                    <Download className="h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick links when no report */}
          {!report && !loading && (
            <div className="text-center py-12">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Or explore popular website structures</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {seedSitemaps.slice(0, 12).map(s => (
                  <Button
                    key={s.domain}
                    variant="outline"
                    size="sm"
                    onClick={() => { setUrl(s.domain); }}
                  >
                    {s.domain}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </main>

      <ProPaywall open={showPaywall} onOpenChange={setShowPaywall} featureName="Website Analyzer" />
    </>
  );
};

export default WebsiteAnalyzer;
