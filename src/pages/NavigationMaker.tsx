import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
  FileJson, Crown, Undo2, Redo2, FileUp, Minimize2,
  ChevronDown, Circle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUserPlan } from "@/hooks/useUserPlan";
import { CreatorModePaywall } from "@/components/CreatorModePaywall";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ====== STOCK PAGES ======
const stockPages = [
  { id: "home", label: "Home", icon: Home, category: "Core" },
  { id: "login", label: "Login", icon: LogIn, category: "Auth" },
  { id: "signup", label: "Sign Up", icon: User, category: "Auth" },
  { id: "forgot-password", label: "Forgot Password", icon: Key, category: "Auth" },
  { id: "reset-password", label: "Reset Password", icon: Lock, category: "Auth" },
  { id: "profile", label: "Profile", icon: User, category: "Auth" },
  { id: "settings", label: "Settings", icon: Settings, category: "Core" },
  { id: "notifications", label: "Notifications", icon: Bell, category: "Core" },
  { id: "products", label: "Products", icon: Package, category: "E-commerce" },
  { id: "product-detail", label: "Product Detail", icon: Tag, category: "E-commerce" },
  { id: "cart", label: "Cart", icon: ShoppingCart, category: "E-commerce" },
  { id: "checkout", label: "Checkout", icon: CreditCard, category: "E-commerce" },
  { id: "order-history", label: "Order History", icon: FileText, category: "E-commerce" },
  { id: "wishlist", label: "Wishlist", icon: Heart, category: "E-commerce" },
  { id: "payment-success", label: "Payment Success", icon: Zap, category: "E-commerce" },
  { id: "payment-failed", label: "Payment Failed", icon: Shield, category: "E-commerce" },
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
  { id: "dashboard", label: "Dashboard", icon: BarChart3, category: "Dashboard" },
  { id: "analytics", label: "Analytics", icon: Target, category: "Dashboard" },
  { id: "reports", label: "Reports", icon: FileText, category: "Dashboard" },
  { id: "admin", label: "Admin Panel", icon: Shield, category: "Dashboard" },
  { id: "user-management", label: "User Management", icon: User, category: "Dashboard" },
  { id: "database", label: "Database", icon: Database, category: "Dashboard" },
  { id: "gallery", label: "Gallery", icon: Image, category: "Media" },
  { id: "video-player", label: "Video Player", icon: Play, category: "Media" },
  { id: "portfolio", label: "Portfolio", icon: Palette, category: "Media" },
  { id: "editor", label: "Editor", icon: PenTool, category: "Media" },
  { id: "upload", label: "Upload", icon: Upload, category: "Media" },
  { id: "camera", label: "Camera", icon: Camera, category: "Media" },
  { id: "music-player", label: "Music Player", icon: Music, category: "Media" },
  { id: "video-library", label: "Video Library", icon: Video, category: "Media" },
  { id: "chat", label: "Chat", icon: MessageSquare, category: "Communication" },
  { id: "inbox", label: "Inbox", icon: Mail, category: "Communication" },
  { id: "call", label: "Call", icon: Phone, category: "Communication" },
  { id: "forum", label: "Forum", icon: MessageSquare, category: "Communication" },
  { id: "feedback", label: "Feedback", icon: Send, category: "Communication" },
  { id: "search", label: "Search", icon: Search, category: "Utility" },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, category: "Utility" },
  { id: "calendar", label: "Calendar", icon: Calendar, category: "Utility" },
  { id: "map", label: "Map", icon: Map, category: "Utility" },
  { id: "file-manager", label: "File Manager", icon: Layers, category: "Utility" },
  { id: "pricing", label: "Pricing", icon: CreditCard, category: "Utility" },
  { id: "landing", label: "Landing Page", icon: Rocket, category: "Marketing" },
  { id: "features", label: "Features", icon: LayoutGrid, category: "Marketing" },
  { id: "comparison", label: "Comparison", icon: Scale, category: "Marketing" },
  { id: "demo", label: "Demo / Trial", icon: Monitor, category: "Marketing" },
  { id: "referral", label: "Referral", icon: Gift, category: "Marketing" },
  { id: "newsletter", label: "Newsletter", icon: Megaphone, category: "Marketing" },
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

const pageTypes = ["Landing", "Blog", "Product", "Dashboard", "Auth", "Utility", "Content", "Marketing"] as const;
type PageType = typeof pageTypes[number];

const colorTags = [
  { label: "None", value: "none", color: "hsl(var(--foreground))" },
  { label: "Blue", value: "blue", color: "#3b82f6" },
  { label: "Green", value: "green", color: "#22c55e" },
  { label: "Red", value: "red", color: "#ef4444" },
  { label: "Amber", value: "amber", color: "#f59e0b" },
  { label: "Purple", value: "purple", color: "#a855f7" },
  { label: "Teal", value: "teal", color: "#14b8a6" },
];

interface CanvasNode {
  id: string;
  pageId: string;
  label: string;
  x: number;
  y: number;
  color: string;
  pageType?: PageType;
  slug?: string;
  description?: string;
  tags?: string[];
  colorTag?: string;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

interface HistoryState {
  nodes: CanvasNode[];
  connections: Connection[];
}

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
  const [showMinimap, setShowMinimap] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const { canExportJSON } = useUserPlan();

  // Undo/Redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: [], connections: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((newNodes: CanvasNode[], newConns: Connection[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { nodes: newNodes, connections: newConns }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    setNodes(prev.nodes);
    setConnections(prev.connections);
    setHistoryIndex(i => i - 1);
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setNodes(next.nodes);
    setConnections(next.connections);
    setHistoryIndex(i => i + 1);
  }, [historyIndex, history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

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
      color: "hsl(var(--foreground))",
      pageType: page.category === "Auth" ? "Auth" : page.category === "Dashboard" ? "Dashboard" : "Content",
      slug: `/${page.id}`,
      colorTag: "none",
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    pushHistory(newNodes, connections);
    toast.success(`Added ${page.label}`);
  };

  const removeNode = (nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newConns = connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId);
    setNodes(newNodes);
    setConnections(newConns);
    pushHistory(newNodes, newConns);
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const updateNodeMeta = (nodeId: string, updates: Partial<CanvasNode>) => {
    const newNodes = nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n);
    setNodes(newNodes);
    pushHistory(newNodes, connections);
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

  const handleMouseUp = useCallback(() => {
    if (draggingNode) {
      pushHistory(nodes, connections);
    }
    setDraggingNode(null);
  }, [draggingNode, nodes, connections, pushHistory]);

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
      const newConns = [...connections, {
        id: `conn-${Date.now()}`,
        fromId: connectingFrom,
        toId: nodeId,
        label: connectionLabel || "navigates to",
      }];
      setConnections(newConns);
      pushHistory(nodes, newConns);
      setConnectingFrom(null);
      setConnectionLabel("");
      toast.success("Connected!");
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  // Export PNG
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
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1.5;
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
      ctx.fillStyle = "#888"; ctx.font = "11px system-ui";
      ctx.fillText(conn.label, (fx + tx) / 2 - 20, (fy + ty) / 2 - 8);
    });
    nodes.forEach(node => {
      const nx = node.x + offsetX;
      const ny = node.y + offsetY;
      const tagColor = colorTags.find(c => c.value === node.colorTag);
      ctx.fillStyle = tagColor && tagColor.value !== "none" ? tagColor.color : "#1a1a1a";
      ctx.beginPath(); ctx.roundRect(nx, ny, nodeW, nodeH, 8); ctx.fill();
      ctx.strokeStyle = "#333"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(nx, ny, nodeW, nodeH, 8); ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px system-ui";
      ctx.textAlign = "center"; ctx.fillText(node.label, nx + nodeW / 2, ny + nodeH / 2 + 1);
      if (node.pageType) {
        ctx.fillStyle = "#888"; ctx.font = "9px system-ui";
        ctx.fillText(node.pageType, nx + nodeW / 2, ny + nodeH / 2 + 14);
      }
      ctx.textAlign = "start";
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a"); link.download = "website-navigation.png"; link.href = dataUrl; link.click();
    toast.success("Navigation map downloaded!");
  };

  // Export JSON
  const exportJSON = (format: "generic" | "cms" | "nocode" = "generic") => {
    if (!canExportJSON) { setShowPaywall(true); return; }
    if (nodes.length === 0) { toast.error("Add some pages first!"); return; }

    const pageMap: Record<string, any> = {};
    nodes.forEach(n => {
      pageMap[n.id] = {
        id: n.pageId,
        label: n.label,
        slug: n.slug || `/${n.pageId}`,
        pageType: n.pageType || "Content",
        description: n.description || "",
        tags: n.tags || [],
        colorTag: n.colorTag || "none",
        children: [] as any[],
      };
    });

    connections.forEach(conn => {
      const from = nodes.find(n => n.id === conn.fromId);
      const to = nodes.find(n => n.id === conn.toId);
      if (from && to && pageMap[from.id]) {
        pageMap[from.id].children.push({
          id: to.pageId,
          label: to.label,
          slug: to.slug || `/${to.pageId}`,
          relationship: conn.label,
        });
      }
    });

    const hasIncoming = new Set(connections.map(c => c.toId));
    const roots = nodes.filter(n => !hasIncoming.has(n.id));

    const sitemap = {
      name: "Website Navigation",
      format,
      generatedAt: new Date().toISOString(),
      generatedBy: "EPIC Navigation Maker",
      pages: (roots.length > 0 ? roots : nodes).map(n => pageMap[n.id]),
      allConnections: connections.map(c => {
        const from = nodes.find(n => n.id === c.fromId);
        const to = nodes.find(n => n.id === c.toId);
        return { from: from?.pageId || c.fromId, to: to?.pageId || c.toId, label: c.label };
      }),
    };

    const blob = new Blob([JSON.stringify(sitemap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.download = "website-navigation.json"; link.href = url; link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON sitemap downloaded!");
  };

  // Import JSON
  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (!data.pages || !Array.isArray(data.pages)) {
            toast.error("Invalid navigation JSON format");
            return;
          }
          const newNodes: CanvasNode[] = [];
          const newConns: Connection[] = [];
          let globalIndex = 0;
          const processPage = (page: any, depth: number): string => {
            const nodeId = `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            const currentIndex = globalIndex++;
            newNodes.push({
              id: nodeId,
              pageId: page.id || page.label?.toLowerCase().replace(/\s+/g, "-") || `page-${currentIndex}`,
              label: page.label || page.id || `Page ${currentIndex + 1}`,
              x: 100 + depth * 240,
              y: 80 + currentIndex * 90,
              color: "hsl(var(--foreground))",
              pageType: page.pageType || "Content",
              slug: page.slug || "",
              description: page.description || "",
              tags: page.tags || [],
              colorTag: page.colorTag || "none",
            });
            if (page.children && Array.isArray(page.children)) {
              page.children.forEach((child: any) => {
                const childId = processPage(child, depth + 1);
                newConns.push({
                  id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`,
                  fromId: nodeId,
                  toId: childId,
                  label: child.relationship || "navigates to",
                });
              });
            }
            return nodeId;
          };
          data.pages.forEach((page: any) => processPage(page, 0));
          setNodes(newNodes);
          setConnections(newConns);
          pushHistory(newNodes, newConns);
          toast.success(`Imported ${newNodes.length} pages`);
        } catch {
          toast.error("Failed to parse JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Selected node details
  const selectedNodeData = useMemo(() => nodes.find(n => n.id === selectedNode), [nodes, selectedNode]);

  // Minimap calculations
  const minimapScale = 0.08;
  const minimapNodes = useMemo(() => {
    if (nodes.length === 0) return [];
    return nodes.map(n => ({
      x: n.x * minimapScale,
      y: n.y * minimapScale,
      w: 160 * minimapScale,
      h: 56 * minimapScale,
      color: colorTags.find(c => c.value === n.colorTag)?.color || "hsl(var(--foreground))",
      isNone: !n.colorTag || n.colorTag === "none",
    }));
  }, [nodes]);

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
        <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-background/80 backdrop-blur-xl border-b border-border/40 flex items-center px-4 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-medium text-foreground">Navigation Maker</h1>
          
          <div className="flex-1" />

          {/* Undo/Redo */}
          <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} className="h-8 w-8" title="Undo (⌘Z)">
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className="h-8 w-8" title="Redo (⌘⇧Z)">
            <Redo2 className="h-3.5 w-3.5" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {connectingFrom && (
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Link label..." 
                value={connectionLabel}
                onChange={e => setConnectionLabel(e.target.value)}
                className="w-28 h-7 text-xs"
              />
              <span className="text-xs text-muted-foreground animate-pulse">Click target...</span>
              <Button size="sm" variant="ghost" onClick={() => setConnectingFrom(null)} className="h-7 text-xs">Cancel</Button>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={importJSON} className="gap-1.5 h-8 text-xs">
            <FileUp className="h-3.5 w-3.5" /> Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportJSON("generic")} className="gap-1.5 h-8 text-xs">
            <FileJson className="h-3.5 w-3.5" /> JSON
            {!canExportJSON && <Crown className="h-3 w-3 text-muted-foreground" />}
          </Button>
          <Button variant="outline" size="sm" onClick={exportNavigation} className="gap-1.5 h-8 text-xs">
            <Download className="h-3.5 w-3.5" /> PNG
          </Button>
        </header>

        <div className="flex pt-12 h-screen">
          {/* Sidebar — Stock Pages */}
          <aside className="w-56 border-r border-border/40 bg-card/50 flex flex-col shrink-0 hidden md:flex">
            <div className="p-3 border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search pages..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-7 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {categories.map(cat => {
                  const pages = filteredPages.filter(p => p.category === cat);
                  if (pages.length === 0) return null;
                  return (
                    <div key={cat}>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">{cat}</p>
                      <div className="space-y-0.5">
                        {pages.map(page => {
                          const Icon = page.icon;
                          const onCanvas = nodes.some(n => n.pageId === page.id);
                          return (
                            <button
                              key={page.id}
                              onClick={() => addPageToCanvas(page)}
                              className={cn(
                                "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs transition-all duration-150",
                                "hover:bg-muted active:scale-[0.97]",
                                onCanvas ? "text-foreground bg-muted" : "text-muted-foreground"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{page.label}</span>
                              {onCanvas && <span className="ml-auto text-[9px] text-foreground">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-border/40 text-center">
              <p className="text-[10px] text-muted-foreground">{nodes.length} on canvas · {stockPages.length} available</p>
            </div>
          </aside>

          {/* Canvas */}
          <div className="flex-1 relative overflow-auto bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border)/0.2)_1px,transparent_0)] bg-[size:24px_24px]">
            <div ref={canvasRef} className="relative w-full h-full min-w-[1200px] min-h-[800px]">
              {/* SVG Connections */}
              <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
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
                      <line x1={fx} y1={fy} x2={tx} y2={ty} stroke="hsl(var(--border))" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
                      <text x={(fx + tx) / 2} y={(fy + ty) / 2 - 6} fill="hsl(var(--muted-foreground))" fontSize={10} textAnchor="middle" className="select-none">
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
                  const tagColor = colorTags.find(c => c.value === node.colorTag);

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={cn("absolute w-40 select-none z-10 group", draggingNode === node.id && "z-30")}
                      style={{ left: node.x, top: node.y }}
                    >
                      <div
                        onMouseDown={e => handleMouseDown(e, node.id)}
                        onClick={() => handleNodeClick(node.id)}
                        className={cn(
                          "rounded-lg p-3 flex items-center gap-2 cursor-grab active:cursor-grabbing transition-all duration-150",
                          "bg-card border shadow-sm",
                          isSelected ? "border-foreground ring-1 ring-foreground/20" : "border-border",
                          isConnecting && "border-foreground ring-1 ring-foreground/20"
                        )}
                        style={{
                          borderLeftColor: tagColor && tagColor.value !== "none" ? tagColor.color : undefined,
                          borderLeftWidth: tagColor && tagColor.value !== "none" ? 3 : undefined,
                        }}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-foreground truncate block">{node.label}</span>
                          {node.pageType && (
                            <span className="text-[9px] text-muted-foreground">{node.pageType}</span>
                          )}
                        </div>
                      </div>

                      <div className="absolute -top-1.5 -right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={e => { e.stopPropagation(); setConnectingFrom(node.id); }}
                          className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform"
                          title="Connect"
                        >
                          <Link2 className="h-2.5 w-2.5" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); removeNode(node.id); }}
                          className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                          title="Remove"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
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
                    <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                    <h3 className="text-base font-medium text-foreground mb-2">Build Your Website Navigation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click pages from the sidebar to add them. Drag to arrange, use the link icon to connect pages.
                    </p>
                    <Button variant="outline" size="sm" onClick={importJSON} className="gap-1.5">
                      <FileUp className="h-3.5 w-3.5" /> Import Existing JSON
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Minimap */}
            {showMinimap && nodes.length > 0 && (
              <div className="absolute bottom-3 left-3 w-40 h-24 bg-card/90 backdrop-blur border border-border rounded-lg overflow-hidden z-20">
                <div className="absolute top-1 right-1">
                  <button onClick={() => setShowMinimap(false)} className="text-muted-foreground hover:text-foreground">
                    <Minimize2 className="h-3 w-3" />
                  </button>
                </div>
                <svg className="w-full h-full" viewBox={`0 0 ${1200 * minimapScale} ${800 * minimapScale}`}>
                  {minimapNodes.map((n, i) => (
                    <rect key={i} x={n.x} y={n.y} width={n.w} height={n.h} rx={1} fill={n.isNone ? "hsl(var(--muted-foreground))" : n.color} opacity={0.6} />
                  ))}
                </svg>
              </div>
            )}
            {!showMinimap && nodes.length > 0 && (
              <button onClick={() => setShowMinimap(true)} className="absolute bottom-3 left-3 z-20 px-2 py-1 text-[10px] bg-card border border-border rounded-md text-muted-foreground hover:text-foreground">
                Minimap
              </button>
            )}
          </div>

          {/* Right Panel — Node Details */}
          {selectedNodeData && (
            <aside className="w-64 border-l border-border/40 bg-card/50 flex flex-col shrink-0 hidden lg:flex">
              <div className="p-4 border-b border-border/40">
                <p className="text-xs font-medium text-foreground mb-1">Page Details</p>
                <p className="text-[10px] text-muted-foreground">{selectedNodeData.label}</p>
              </div>
              <div className="p-4 space-y-4 flex-1 overflow-auto">
                {/* Label */}
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Label</label>
                  <Input value={selectedNodeData.label} onChange={e => updateNodeMeta(selectedNodeData.id, { label: e.target.value })} className="h-8 text-xs mt-1" />
                </div>

                {/* Page Type */}
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Page Type</label>
                  <Select value={selectedNodeData.pageType || "Content"} onValueChange={(v) => updateNodeMeta(selectedNodeData.id, { pageType: v as PageType })}>
                    <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {pageTypes.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Slug */}
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Slug</label>
                  <Input value={selectedNodeData.slug || ""} onChange={e => updateNodeMeta(selectedNodeData.id, { slug: e.target.value })} className="h-8 text-xs mt-1 font-mono" placeholder="/page-slug" />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Description</label>
                  <textarea
                    value={selectedNodeData.description || ""}
                    onChange={e => updateNodeMeta(selectedNodeData.id, { description: e.target.value })}
                    className="w-full h-16 mt-1 px-2 py-1.5 text-xs bg-background border border-input rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Brief page description..."
                  />
                </div>

                {/* Color Tag */}
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Color Tag</label>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {colorTags.map(ct => (
                      <button
                        key={ct.value}
                        onClick={() => updateNodeMeta(selectedNodeData.id, { colorTag: ct.value })}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                          selectedNodeData.colorTag === ct.value ? "border-foreground scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: ct.value === "none" ? "hsl(var(--muted))" : ct.color }}
                        title={ct.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Tags</label>
                  <Input
                    value={(selectedNodeData.tags || []).join(", ")}
                    onChange={e => updateNodeMeta(selectedNodeData.id, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    className="h-8 text-xs mt-1"
                    placeholder="tag1, tag2, ..."
                  />
                </div>
              </div>
            </aside>
          )}

          {/* Mobile page list */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border z-40">
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
