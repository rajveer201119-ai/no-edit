import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Home, LogIn, User, Settings, ShoppingCart, 
  Mail, Phone, HelpCircle, CreditCard, BarChart3, Bell,
  Bookmark, Calendar, Camera, Database, Globe, Heart,
  Image, Key, Layers, LayoutGrid, Link2, Lock, 
  Map, MessageSquare, Monitor, Package, Palette, 
  PenTool, Play, Shield, Star, Tag, Target, 
  Upload, Video, Wifi, Zap, BookOpen,
  Building, Briefcase, Clock, Coffee, Compass,
  Flag, Gift, Headphones, Megaphone, Music,
  Newspaper, Rocket, Scale, Scissors, Send, ArrowRight,
  Layout, MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";

// Match the icon map from NavigationMaker
const iconMap: Record<string, any> = {
  home: Home, login: LogIn, signup: User, "forgot-password": Key, "reset-password": Lock,
  profile: User, settings: Settings, notifications: Bell, products: Package, "product-detail": Tag,
  cart: ShoppingCart, checkout: CreditCard, "order-history": FileText, wishlist: Heart,
  "payment-success": Zap, "payment-failed": Shield, blog: BookOpen, "blog-post": FileText,
  about: Building, contact: Mail, faq: HelpCircle, terms: FileText, privacy: Shield,
  careers: Briefcase, press: Newspaper, testimonials: Star, dashboard: BarChart3,
  analytics: Target, reports: FileText, admin: Shield, "user-management": User,
  database: Database, gallery: Image, "video-player": Play, portfolio: Palette,
  editor: PenTool, upload: Upload, camera: Camera, "music-player": Music,
  "video-library": Video, chat: MessageSquare, inbox: Mail, call: Phone,
  forum: MessageSquare, feedback: Send, search: Globe, bookmarks: Bookmark,
  calendar: Calendar, map: Map, "file-manager": Layers, pricing: CreditCard,
  landing: Rocket, features: LayoutGrid, comparison: Scale, demo: Monitor,
  referral: Gift, newsletter: Megaphone, "404": Compass, "500": Shield,
  maintenance: Clock, loading: Coffee, onboarding: Flag, "live-stream": Globe,
  podcast: Headphones, "wifi-settings": Wifi, "link-tree": Link2, "qr-code": Globe,
  coupon: Scissors, survey: FileText,
};

const pageTypeBadgeColors: Record<string, { bg: string; text: string }> = {
  Landing: { bg: "#dbeafe", text: "#1d4ed8" },
  Blog: { bg: "#fce7f3", text: "#be185d" },
  Product: { bg: "#d1fae5", text: "#065f46" },
  Dashboard: { bg: "#ede9fe", text: "#5b21b6" },
  Auth: { bg: "#fef3c7", text: "#92400e" },
  Utility: { bg: "#e5e7eb", text: "#374151" },
  Content: { bg: "#dbeafe", text: "#1d4ed8" },
  Marketing: { bg: "#fce7f3", text: "#be185d" },
};

interface PageSection {
  id: string;
  label: string;
  color: string;
}

interface CanvasNode {
  id: string;
  pageId: string;
  label: string;
  x: number;
  y: number;
  color: string;
  pageType?: string;
  slug?: string;
  sections?: PageSection[];
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

const SharedSitemap = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ title: string; nodes: CanvasNode[]; connections: Connection[] } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!id) { setLoading(false); return; }
      const { data: row } = await supabase
        .from("shared_sitemaps" as any)
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (row) {
        const r = row as any;
        setData({
          title: r.title || "Untitled Sitemap",
          nodes: Array.isArray(r.nodes) ? r.nodes : [],
          connections: Array.isArray(r.connections) ? r.connections : [],
        });
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const nodeW = 180;
  const getNodeHeight = (node: CanvasNode) => 60 + (node.sections?.length || 0) * 32;

  // Calculate canvas bounds
  const bounds = useMemo(() => {
    if (!data || data.nodes.length === 0) return { width: 800, height: 600 };
    let maxX = 0, maxY = 0;
    data.nodes.forEach(n => {
      maxX = Math.max(maxX, n.x + nodeW + 40);
      maxY = Math.max(maxY, n.y + getNodeHeight(n) + 40);
    });
    return { width: Math.max(800, maxX), height: Math.max(600, maxY) };
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sitemap Not Found</h1>
          <p className="text-muted-foreground mb-4">This shared sitemap link is invalid or has been removed.</p>
          <Button asChild>
            <Link to="/navigation-maker">Create Your Own</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={`Visual Sitemap – Created with EPIC`}
        description={`View this visual sitemap with ${data.nodes.length} pages, created with EPIC — the free sitemap builder and design tool.`}
        noIndex
      />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/90 dark:bg-card/90 backdrop-blur-xl border-b border-border/40 flex items-center px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">EPIC</span>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold text-foreground truncate">{data.title}</h1>
          <p className="text-[10px] text-muted-foreground">View Only · {data.nodes.length} pages</p>
        </div>
        <Button size="sm" asChild className="gap-1.5 h-8 text-xs rounded-lg">
          <Link to="/navigation-maker">
            Create Your Own <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      {/* Canvas */}
      <main className="pt-14 min-h-screen bg-[#f8f9fb] dark:bg-background overflow-auto">
        <div
          className="relative"
          style={{
            width: bounds.width,
            height: bounds.height,
            minWidth: "100%",
            minHeight: "calc(100vh - 3.5rem - 3rem)",
            background: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="shared-conn-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
            {data.connections.map(conn => {
              const from = data.nodes.find(n => n.id === conn.fromId);
              const to = data.nodes.find(n => n.id === conn.toId);
              if (!from || !to) return null;
              const fromH = getNodeHeight(from);
              const fx = from.x + nodeW / 2;
              const fy = from.y + fromH;
              const tx = to.x + nodeW / 2;
              const ty = to.y;
              const midY = (fy + ty) / 2;
              return (
                <g key={conn.id}>
                  <path
                    d={`M ${fx} ${fy} C ${fx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`}
                    fill="none"
                    stroke="url(#shared-conn-gradient)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  <circle cx={tx} cy={ty} r={4} fill="#93c5fd" />
                  <circle cx={fx} cy={fy} r={4} fill="#c4b5fd" />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {data.nodes.map(node => {
            const Icon = iconMap[node.pageId] || FileText;
            const sections = node.sections || [];
            const badgeColor = pageTypeBadgeColors[node.pageType || "Content"] || { bg: "#e5e7eb", text: "#374151" };

            return (
              <div
                key={node.id}
                className="absolute z-10"
                style={{ left: node.x, top: node.y, width: nodeW }}
              >
                <div className={cn(
                  "rounded-xl bg-white dark:bg-card border border-neutral-200 dark:border-border",
                  "shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none"
                )}>
                  {/* Title */}
                  <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground truncate">{node.label}</span>
                    </div>
                    {node.pageType && (
                      <span
                        className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-medium"
                        style={{ backgroundColor: badgeColor.bg, color: badgeColor.text }}
                      >
                        {node.pageType}
                      </span>
                    )}
                  </div>
                  {/* Sections */}
                  {sections.length > 0 && (
                    <div className="px-3 pb-2 mt-1 space-y-1">
                      {sections.map(section => (
                        <div key={section.id} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                          <span className="text-[10px] text-muted-foreground truncate">{section.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="h-12 flex items-center justify-center text-xs text-muted-foreground border-t border-border bg-background">
          Created with <Link to="/" className="text-primary font-medium mx-1 hover:underline">EPIC</Link> – Visual Sitemap Builder
        </div>
      </main>
    </>
  );
};

export default SharedSitemap;
