import { useState, useCallback, useRef, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  ArrowLeft, Download, Plus, Trash2, Search, GripVertical,
  Home, LogIn, User, Settings, ShoppingCart, FileText, 
  Mail, Phone, HelpCircle, CreditCard, BarChart3, Bell,
  Bookmark, Calendar, Camera, Database, Globe, Heart,
  Image, Key, Layers, LayoutGrid, Link2, Lock, 
  Map, MessageSquare, Monitor, Package, Palette, 
  PenTool, Play, Shield, Star, Tag, Target, 
  Tv, Upload, Video, Wifi, Zap, BookOpen,
  Building, Briefcase, Clock, Coffee, Compass,
  Flag, Gift, Headphones, Megaphone, Music,
  Newspaper, Rocket, Scale, Scissors, Send,
  FileJson, Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUserPlan } from "@/hooks/useUserPlan";
import { CreatorModePaywall } from "@/components/CreatorModePaywall";

// ====== STOCK PAGES ======
const stockPages = [
  // Authentication & User
  { id: "home", label: "Home", icon: Home, category: "Core" },
  { id: "login", label: "Login", icon: LogIn, category: "Auth" },
  { id: "signup", label: "Sign Up", icon: User, category: "Auth" },
  { id: "forgot-password", label: "Forgot Password", icon: Key, category: "Auth" },
  { id: "reset-password", label: "Reset Password", icon: Lock, category: "Auth" },
  { id: "profile", label: "Profile", icon: User, category: "Auth" },
  { id: "settings", label: "Settings", icon: Settings, category: "Core" },
  { id: "notifications", label: "Notifications", icon: Bell, category: "Core" },
  // E-commerce
  { id: "products", label: "Products", icon: Package, category: "E-commerce" },
  { id: "product-detail", label: "Product Detail", icon: Tag, category: "E-commerce" },
  { id: "cart", label: "Cart", icon: ShoppingCart, category: "E-commerce" },
  { id: "checkout", label: "Checkout", icon: CreditCard, category: "E-commerce" },
  { id: "order-history", label: "Order History", icon: FileText, category: "E-commerce" },
  { id: "wishlist", label: "Wishlist", icon: Heart, category: "E-commerce" },
  { id: "payment-success", label: "Payment Success", icon: Zap, category: "E-commerce" },
  { id: "payment-failed", label: "Payment Failed", icon: Shield, category: "E-commerce" },
  // Content
  { id: "blog", label: "Blog", icon: BookOpen, category: "Content" },
  { id: "blog-post", label: "Blog Post", icon: FileText, category: "Content" },
  { id: "about", label: "About Us", icon: Building, category: "Content" },
  { id: "contact", label: "Contact", icon: Mail, category: "Content" },
  { id: "faq", label: "FAQ", icon: HelpCircle, category: "Content" },
  { id: "terms", label: "Terms of Service", icon: FileText, category: "Content" },
  { id: "privacy", label: "Privacy Policy", icon: Shield, category: "Content" },
  { id: "careers", label: "Careers", icon: Briefcase, category: "Content" },
  { id: "press", label: "Press / Media", icon: Newspaper, category: "Content" },
  { id: "testimonials", label: "Testimonials", icon: Star, category: "Content" },
  // Dashboard
  { id: "dashboard", label: "Dashboard", icon: BarChart3, category: "Dashboard" },
  { id: "analytics", label: "Analytics", icon: Target, category: "Dashboard" },
  { id: "reports", label: "Reports", icon: FileText, category: "Dashboard" },
  { id: "admin", label: "Admin Panel", icon: Shield, category: "Dashboard" },
  { id: "user-management", label: "User Management", icon: User, category: "Dashboard" },
  { id: "database", label: "Database", icon: Database, category: "Dashboard" },
  // Media & Creative
  { id: "gallery", label: "Gallery", icon: Image, category: "Media" },
  { id: "video-player", label: "Video Player", icon: Play, category: "Media" },
  { id: "portfolio", label: "Portfolio", icon: Palette, category: "Media" },
  { id: "editor", label: "Editor", icon: PenTool, category: "Media" },
  { id: "upload", label: "Upload", icon: Upload, category: "Media" },
  { id: "camera", label: "Camera", icon: Camera, category: "Media" },
  { id: "music-player", label: "Music Player", icon: Music, category: "Media" },
  { id: "video-library", label: "Video Library", icon: Video, category: "Media" },
  // Communication
  { id: "chat", label: "Chat", icon: MessageSquare, category: "Communication" },
  { id: "inbox", label: "Inbox", icon: Mail, category: "Communication" },
  { id: "call", label: "Call", icon: Phone, category: "Communication" },
  { id: "forum", label: "Forum", icon: MessageSquare, category: "Communication" },
  { id: "feedback", label: "Feedback", icon: Send, category: "Communication" },
  // Utility
  { id: "search", label: "Search", icon: Search, category: "Utility" },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, category: "Utility" },
  { id: "calendar", label: "Calendar", icon: Calendar, category: "Utility" },
  { id: "map", label: "Map", icon: Map, category: "Utility" },
  { id: "file-manager", label: "File Manager", icon: Layers, category: "Utility" },
  { id: "pricing", label: "Pricing", icon: CreditCard, category: "Utility" },
  // Marketing & Landing
  { id: "landing", label: "Landing Page", icon: Rocket, category: "Marketing" },
  { id: "features", label: "Features", icon: LayoutGrid, category: "Marketing" },
  { id: "comparison", label: "Comparison", icon: Scale, category: "Marketing" },
  { id: "demo", label: "Demo / Trial", icon: Monitor, category: "Marketing" },
  { id: "referral", label: "Referral", icon: Gift, category: "Marketing" },
  { id: "newsletter", label: "Newsletter", icon: Megaphone, category: "Marketing" },
  // Misc
  { id: "404", label: "404 Not Found", icon: Compass, category: "Misc" },
  { id: "500", label: "500 Error", icon: Shield, category: "Misc" },
  { id: "maintenance", label: "Maintenance", icon: Clock, category: "Misc" },
  { id: "loading", label: "Loading", icon: Coffee, category: "Misc" },
  { id: "onboarding", label: "Onboarding", icon: Flag, category: "Misc" },
  { id: "live-stream", label: "Live Stream", icon: Tv, category: "Misc" },
  { id: "podcast", label: "Podcast", icon: Headphones, category: "Misc" },
  { id: "wifi-settings", label: "WiFi Settings", icon: Wifi, category: "Misc" },
  { id: "link-tree", label: "Link Tree", icon: Link2, category: "Misc" },
  { id: "qr-code", label: "QR Code", icon: Globe, category: "Misc" },
  { id: "coupon", label: "Coupon", icon: Scissors, category: "Misc" },
  { id: "survey", label: "Survey", icon: FileText, category: "Misc" },
];

interface CanvasNode {
  id: string;
  pageId: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

const nodeColors = [
  "hsl(var(--primary))",
  "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", 
  "#3B82F6", "#EF4444", "#06B6D4", "#6366F1",
];

const NavigationMaker = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectionLabel, setConnectionLabel] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const { isPro, canExportJSON } = useUserPlan();

  const categories = [...new Set(stockPages.map(p => p.category))];
  const filteredPages = stockPages.filter(p => 
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addPageToCanvas = (page: typeof stockPages[0]) => {
    const existing = nodes.find(n => n.pageId === page.id);
    if (existing) { toast.info(`${page.label} already on canvas`); return; }
    const newNode: CanvasNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      pageId: page.id,
      label: page.label,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
      color: nodeColors[nodes.length % nodeColors.length],
    };
    setNodes(prev => [...prev, newNode]);
    toast.success(`Added ${page.label}`);
  };

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.fromId !== nodeId && c.toId !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNode(nodeId);
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 160, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - dragOffset.y));
    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
  }, [draggingNode, dragOffset]);

  const handleMouseUp = useCallback(() => { setDraggingNode(null); }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleNodeClick = (nodeId: string) => {
    if (connectingFrom) {
      if (connectingFrom === nodeId) { setConnectingFrom(null); return; }
      const exists = connections.find(c => 
        (c.fromId === connectingFrom && c.toId === nodeId) || 
        (c.fromId === nodeId && c.toId === connectingFrom)
      );
      if (exists) { toast.info("Connection already exists"); setConnectingFrom(null); return; }
      setConnections(prev => [...prev, {
        id: `conn-${Date.now()}`,
        fromId: connectingFrom,
        toId: nodeId,
        label: connectionLabel || "navigates to",
      }]);
      setConnectingFrom(null);
      setConnectionLabel("");
      toast.success("Connected!");
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  // Export as PNG
  const exportNavigation = async () => {
    if (nodes.length === 0) { toast.error("Add some pages first!"); return; }

    const canvas = document.createElement("canvas");
    const padding = 60;
    const nodeW = 160;
    const nodeH = 56;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + nodeW); maxY = Math.max(maxY, n.y + nodeH);
    });

    canvas.width = (maxX - minX) + padding * 2;
    canvas.height = (maxY - minY) + padding * 2;
    const ctx = canvas.getContext("2d")!;
    
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px system-ui";
    ctx.fillText("Website Navigation — Made with EPIC", 20, 30);

    const offsetX = padding - minX;
    const offsetY = padding - minY + 20;

    ctx.strokeStyle = "#6366F1";
    ctx.lineWidth = 2;
    connections.forEach(conn => {
      const from = nodes.find(n => n.id === conn.fromId);
      const to = nodes.find(n => n.id === conn.toId);
      if (!from || !to) return;
      const fx = from.x + offsetX + nodeW / 2;
      const fy = from.y + offsetY + nodeH / 2;
      const tx = to.x + offsetX + nodeW / 2;
      const ty = to.y + offsetY + nodeH / 2;
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke();
      const angle = Math.atan2(ty - fy, tx - fx);
      const arrowLen = 12;
      ctx.beginPath(); ctx.moveTo(tx, ty);
      ctx.lineTo(tx - arrowLen * Math.cos(angle - 0.3), ty - arrowLen * Math.sin(angle - 0.3));
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - arrowLen * Math.cos(angle + 0.3), ty - arrowLen * Math.sin(angle + 0.3));
      ctx.stroke();
      ctx.fillStyle = "#a5b4fc"; ctx.font = "11px system-ui";
      ctx.fillText(conn.label, (fx + tx) / 2 - 20, (fy + ty) / 2 - 8);
    });

    nodes.forEach(node => {
      const nx = node.x + offsetX;
      const ny = node.y + offsetY;
      ctx.fillStyle = node.color;
      ctx.beginPath(); ctx.roundRect(nx, ny, nodeW, nodeH, 12); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center"; ctx.fillText(node.label, nx + nodeW / 2, ny + nodeH / 2 + 5);
      ctx.textAlign = "start";
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "website-navigation.png";
    link.href = dataUrl;
    link.click();
    toast.success("Navigation map downloaded!");
  };

  // Export as JSON (Pro only)
  const exportJSON = () => {
    if (!canExportJSON) {
      setShowPaywall(true);
      return;
    }
    if (nodes.length === 0) { toast.error("Add some pages first!"); return; }

    // Build structured nested JSON
    const pageMap: Record<string, any> = {};
    nodes.forEach(n => {
      pageMap[n.id] = {
        id: n.pageId,
        label: n.label,
        children: [] as any[],
      };
    });

    // Add connections as children
    connections.forEach(conn => {
      const from = nodes.find(n => n.id === conn.fromId);
      const to = nodes.find(n => n.id === conn.toId);
      if (from && to && pageMap[from.id]) {
        pageMap[from.id].children.push({
          id: to.pageId,
          label: to.label,
          relationship: conn.label,
        });
      }
    });

    // Find root pages (pages with no incoming connections)
    const hasIncoming = new Set(connections.map(c => c.toId));
    const roots = nodes.filter(n => !hasIncoming.has(n.id));
    
    const sitemap = {
      name: "Website Navigation",
      generatedAt: new Date().toISOString(),
      generatedBy: "EPIC Navigation Maker",
      pages: (roots.length > 0 ? roots : nodes).map(n => pageMap[n.id]),
      allConnections: connections.map(c => {
        const from = nodes.find(n => n.id === c.fromId);
        const to = nodes.find(n => n.id === c.toId);
        return {
          from: from?.pageId || c.fromId,
          to: to?.pageId || c.toId,
          label: c.label,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(sitemap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "website-navigation.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON sitemap downloaded!");
  };

  return (
    <>
      <SEO
        title="Website Navigation Maker — Plan Your Site Structure | EPIC"
        description="Drag-and-drop website navigation builder. Plan your site's page flow, create sitemaps, and download navigation maps. 50+ stock page templates."
        keywords="website navigation maker, sitemap builder, page flow designer, website structure planner, drag and drop navigation"
        canonicalUrl="https://no-edit.lovable.app/navigation-maker"
      />

      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-2xl saturate-150 border-b border-border/20 flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Website Navigation Maker</h1>
          <div className="flex-1" />
          {connectingFrom && (
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Link label..." 
                value={connectionLabel}
                onChange={e => setConnectionLabel(e.target.value)}
                className="w-32 h-8 text-xs"
              />
              <span className="text-xs text-primary animate-pulse">Click target page...</span>
              <Button size="sm" variant="ghost" onClick={() => setConnectingFrom(null)} className="h-7 text-xs">Cancel</Button>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={exportJSON} className="gap-1.5 h-8">
            <FileJson className="h-3.5 w-3.5" /> 
            Export JSON
            {!canExportJSON && <Crown className="h-3 w-3 text-yellow-500" />}
          </Button>
          <Button variant="outline" size="sm" onClick={exportNavigation} className="gap-1.5 h-8">
            <Download className="h-3.5 w-3.5" /> Export PNG
          </Button>
        </header>

        <div className="flex pt-14 h-screen">
          {/* Sidebar — Stock Pages */}
          <aside className="w-64 border-r border-border/20 bg-card/50 backdrop-blur-xl flex flex-col shrink-0 hidden md:flex">
            <div className="p-3 border-b border-border/20">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search pages..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {categories.map(cat => {
                  const pages = filteredPages.filter(p => p.category === cat);
                  if (pages.length === 0) return null;
                  return (
                    <div key={cat}>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">{cat}</p>
                      <div className="space-y-0.5">
                        {pages.map(page => {
                          const Icon = page.icon;
                          const onCanvas = nodes.some(n => n.pageId === page.id);
                          return (
                            <button
                              key={page.id}
                              onClick={() => addPageToCanvas(page)}
                              className={cn(
                                "flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs transition-all",
                                "hover:bg-muted/60 active:scale-[0.97]",
                                onCanvas ? "text-primary bg-primary/10" : "text-foreground"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{page.label}</span>
                              {onCanvas && <span className="ml-auto text-[9px] text-primary">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-border/20 text-center">
              <p className="text-[10px] text-muted-foreground">{stockPages.length} pages available</p>
            </div>
          </aside>

          {/* Canvas */}
          <div className="flex-1 relative overflow-auto bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border)/0.3)_1px,transparent_0)] bg-[size:24px_24px]">
            <div ref={canvasRef} className="relative w-full h-full min-w-[1200px] min-h-[800px]">
              {/* SVG Connections */}
              <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                  </marker>
                </defs>
                {connections.map(conn => {
                  const from = nodes.find(n => n.id === conn.fromId);
                  const to = nodes.find(n => n.id === conn.toId);
                  if (!from || !to) return null;
                  const fx = from.x + 80; const fy = from.y + 28;
                  const tx = to.x + 80; const ty = to.y + 28;
                  return (
                    <g key={conn.id}>
                      <line x1={fx} y1={fy} x2={tx} y2={ty} stroke="hsl(var(--primary))" strokeWidth={2} markerEnd="url(#arrowhead)" opacity={0.7} />
                      <text x={(fx + tx) / 2} y={(fy + ty) / 2 - 6} fill="hsl(var(--primary))" fontSize={10} textAnchor="middle" className="select-none">
                        {conn.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              <AnimatePresence>
                {nodes.map(node => {
                  const page = stockPages.find(p => p.id === node.pageId);
                  const Icon = page?.icon || FileText;
                  const isSelected = selectedNode === node.id;
                  const isConnecting = connectingFrom === node.id;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={cn(
                        "absolute w-40 select-none z-10 group",
                        draggingNode === node.id && "z-30"
                      )}
                      style={{ left: node.x, top: node.y }}
                    >
                      <div
                        onMouseDown={e => handleMouseDown(e, node.id)}
                        onClick={() => handleNodeClick(node.id)}
                        className={cn(
                          "rounded-xl p-3 flex items-center gap-2 cursor-grab active:cursor-grabbing transition-all",
                          "bg-card/90 backdrop-blur-xl border shadow-lg",
                          isSelected ? "border-primary ring-2 ring-primary/30 shadow-primary/20" : "border-border/40",
                          isConnecting && "border-green-500 ring-2 ring-green-500/30"
                        )}
                        style={{ borderLeftColor: node.color, borderLeftWidth: 4 }}
                      >
                        <Icon className="h-4 w-4 shrink-0" style={{ color: node.color }} />
                        <span className="text-xs font-medium text-foreground truncate">{node.label}</span>
                      </div>

                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); setConnectingFrom(node.id); }}
                          className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] hover:scale-110 transition-transform"
                          title="Connect to another page"
                        >
                          <Link2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); removeNode(node.id); }}
                          className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] hover:scale-110 transition-transform"
                          title="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty State */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-sm">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Build Your Website Navigation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click pages from the sidebar to add them to your canvas. 
                      Drag to arrange, click the link icon to connect pages.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stockPages.length}+ stock pages available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile page list */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/20 z-40">
            <ScrollArea className="h-48">
              <div className="p-3 grid grid-cols-3 gap-2">
                {stockPages.slice(0, 30).map(page => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.id}
                      onClick={() => addPageToCanvas(page)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] bg-muted/30 hover:bg-muted/60 active:scale-95 transition-all"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate w-full text-center">{page.label}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <CreatorModePaywall 
        open={showPaywall} 
        onOpenChange={setShowPaywall} 
        triggerReason="json-export"
        requiredPlan="pro"
      />
    </>
  );
};

export default NavigationMaker;
