import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
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
  ChevronDown, Circle, X, MoreHorizontal, Type, Layout, Code, Paintbrush, 
  MousePointer, Eye, TrendingUp, Share2, Save, FolderOpen, Menu,
  Copy, ZoomIn, ZoomOut, LayoutTemplate, StickyNote
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUserPlan } from "@/hooks/useUserPlan";
import { UXScorePanel } from "@/components/UXScorePanel";
import { ProPaywall } from "@/components/ProPaywall";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AISitemapModal } from "@/components/AISitemapModal";
import { sitemapToCanvas } from "@/lib/sitemap/toCanvas";
import type { AiSitemap } from "@/lib/sitemap/schema";

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
  // ===== User Flow node types (drag onto canvas to build user flows) =====
  { id: "flow-page", label: "Flow: Page", icon: FileText, category: "User Flow" },
  { id: "flow-action", label: "Flow: User Action", icon: MousePointer, category: "User Flow" },
  { id: "flow-decision", label: "Flow: Decision", icon: HelpCircle, category: "User Flow" },
  { id: "flow-api", label: "Flow: API / Backend", icon: Database, category: "User Flow" },
  { id: "flow-success", label: "Flow: Success", icon: Star, category: "User Flow" },
  { id: "flow-error", label: "Flow: Error", icon: Shield, category: "User Flow" },
];

const pageTypes = ["Landing", "Blog", "Product", "Dashboard", "Auth", "Utility", "Content", "Marketing"] as const;
type PageType = typeof pageTypes[number];

// Section types that can be added to each page card (like in the reference image)
const sectionPresets = [
  { id: "header", label: "Header", icon: Layout, color: "#3b82f6" },
  { id: "hero", label: "Hero", icon: Star, color: "#8b5cf6" },
  { id: "cta", label: "CTA", icon: MousePointer, color: "#f59e0b" },
  { id: "feature", label: "Feature", icon: Zap, color: "#22c55e" },
  { id: "pricing", label: "Pricing", icon: CreditCard, color: "#ec4899" },
  { id: "footer", label: "Footer", icon: Layout, color: "#6b7280" },
  { id: "contact", label: "Contact", icon: Mail, color: "#14b8a6" },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare, color: "#f97316" },
  { id: "our-mission", label: "Our Mission", icon: Target, color: "#8b5cf6" },
  { id: "our-investors", label: "Our Investors", icon: Building, color: "#3b82f6" },
  { id: "join-us", label: "Join Us", icon: User, color: "#22c55e" },
  { id: "our-values", label: "Our Values", icon: Heart, color: "#ef4444" },
  { id: "our-openings", label: "Our Openings", icon: Briefcase, color: "#f59e0b" },
  { id: "join-the-journey", label: "Join the Journey", icon: Rocket, color: "#8b5cf6" },
  { id: "why-choose-us", label: "Why Choose Us", icon: Star, color: "#f59e0b" },
];

interface PageSection {
  id: string;
  label: string;
  color: string;
}

const colorTags = [
  { label: "None", value: "none", color: "hsl(var(--foreground))" },
  { label: "Blue", value: "blue", color: "#3b82f6" },
  { label: "Green", value: "green", color: "#22c55e" },
  { label: "Red", value: "red", color: "#ef4444" },
  { label: "Amber", value: "amber", color: "#f59e0b" },
  { label: "Purple", value: "purple", color: "#a855f7" },
  { label: "Teal", value: "teal", color: "#14b8a6" },
];

// Badge colors for page type
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
  sections?: PageSection[];
  notes?: string;
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

// Default sections for different page types
const getDefaultSections = (pageId: string): PageSection[] => {
  const defaults: Record<string, PageSection[]> = {
    home: [
      { id: "header", label: "Header", color: "#3b82f6" },
      { id: "hero", label: "Hero", color: "#8b5cf6" },
      { id: "why-choose-us", label: "Why Choose Us", color: "#f59e0b" },
      { id: "footer", label: "Footer", color: "#6b7280" },
    ],
    about: [
      { id: "header", label: "Header", color: "#3b82f6" },
      { id: "our-mission", label: "Our Mission", color: "#8b5cf6" },
      { id: "our-investors", label: "Our Investors", color: "#3b82f6" },
      { id: "footer", label: "Footer", color: "#6b7280" },
      { id: "join-the-journey", label: "Join the Journey", color: "#8b5cf6" },
    ],
    products: [
      { id: "header", label: "Header", color: "#3b82f6" },
      { id: "cta", label: "CTA", color: "#f59e0b" },
      { id: "feature", label: "Feature", color: "#22c55e" },
      { id: "pricing", label: "Pricing", color: "#ec4899" },
      { id: "footer", label: "Footer", color: "#6b7280" },
    ],
    contact: [
      { id: "header", label: "Header", color: "#3b82f6" },
      { id: "header-2", label: "Header", color: "#3b82f6" },
      { id: "contact", label: "Contact", color: "#14b8a6" },
      { id: "footer", label: "Footer", color: "#6b7280" },
    ],
    careers: [
      { id: "header", label: "Header", color: "#3b82f6" },
      { id: "our-values", label: "Our Values", color: "#ef4444" },
      { id: "join-us", label: "Join Us", color: "#22c55e" },
      { id: "our-openings", label: "Our Openings", color: "#f59e0b" },
      { id: "footer", label: "Footer", color: "#6b7280" },
    ],
    features: [
      { id: "header", label: "Header", color: "#3b82f6" },
      { id: "feature", label: "Feature", color: "#22c55e" },
      { id: "testimonials", label: "Testimonials", color: "#f97316" },
      { id: "footer", label: "Footer", color: "#6b7280" },
    ],
  };
  return defaults[pageId] || [
    { id: "header", label: "Header", color: "#3b82f6" },
    { id: "footer", label: "Footer", color: "#6b7280" },
  ];
};

const NavigationMaker = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [addingSectionTo, setAddingSectionTo] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [showUXScore, setShowUXScore] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState("AI Product Sitemap");
  const [savingProject, setSavingProject] = useState(false);
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);
  const [mobileNodeEditId, setMobileNodeEditId] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState<"sitemap" | "flow">(() => {
    if (typeof window === "undefined") return "sitemap";
    return (localStorage.getItem("epic.builderMode") as "sitemap" | "flow") || "sitemap";
  });
  useEffect(() => {
    try { localStorage.setItem("epic.builderMode", builderMode); } catch {}
  }, [builderMode]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobileRef = useRef(false);
  
  // Track if device is mobile for touch vs click differentiation
  useEffect(() => {
    const checkMobile = () => { isMobileRef.current = window.innerWidth < 768; };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const { canExportJSON, isPremium, userId, canExportPNG, maxProjects, maxPages } = useUserPlan();

  // Check auth state for download gating
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load project from URL param
  useEffect(() => {
    const projectId = searchParams.get("project");
    if (!projectId) return;
    const loadProject = async () => {
      const { data } = await supabase
        .from("sitemap_projects" as any)
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (data) {
        const d = data as any;
        const loadedNodes = Array.isArray(d.nodes) ? d.nodes : [];
        const loadedConns = Array.isArray(d.connections) ? d.connections : [];
        setNodes(loadedNodes);
        setConnections(loadedConns);
        setCurrentProjectId(d.id);
        setCurrentProjectName(d.name || "Untitled Project");
        setHistory([{ nodes: loadedNodes, connections: loadedConns }]);
        setHistoryIndex(0);
        toast.success(`Loaded "${d.name}"`);
      }
    };
    loadProject();
  }, [searchParams]);

  // Save project handler
  const saveProject = async () => {
    if (!isAuthed || !userId) { toast.error("Please sign in to save projects"); navigate("/auth"); return; }
    if (nodes.length === 0) { toast.error("Add some pages first!"); return; }
    setSavingProject(true);
    try {
      if (currentProjectId) {
        // Update existing
        const { error } = await supabase.from("sitemap_projects" as any).update({
          nodes: JSON.parse(JSON.stringify(nodes)),
          connections: JSON.parse(JSON.stringify(connections)),
          name: currentProjectName,
        } as any).eq("id", currentProjectId);
        if (error) throw error;
        toast.success("Project saved!");
      } else {
        // Check limit
        const { count } = await supabase.from("sitemap_projects" as any).select("id", { count: "exact", head: true }).eq("user_id", userId);
        const limit = isPremium ? 999 : maxProjects;
        if ((count || 0) >= limit) {
          toast.error(isPremium ? "Project limit reached" : `Free plan: ${maxProjects} project max. Upgrade to Pro for unlimited.`);
          setShowPaywall(true);
          setSavingProject(false);
          return;
        }
        const name = prompt("Project name:", currentProjectName) || currentProjectName;
        const { data, error } = await supabase.from("sitemap_projects" as any).insert({
          user_id: userId,
          name,
          nodes: JSON.parse(JSON.stringify(nodes)),
          connections: JSON.parse(JSON.stringify(connections)),
        } as any).select().single();
        if (error) throw error;
        const d = data as any;
        setCurrentProjectId(d.id);
        setCurrentProjectName(name);
        toast.success(`Project "${name}" saved!`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save project");
    } finally {
      setSavingProject(false);
    }
  };

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

  // Apply an AI-generated sitemap to the canvas. Replaces current nodes/connections
  // with a single history entry so the whole generation can be undone with Ctrl/Cmd+Z.
  const applyGeneratedSitemap = useCallback((sitemap: AiSitemap) => {
    const { nodes: aiNodes, connections: aiConns } = sitemapToCanvas(sitemap);
    const newNodes: CanvasNode[] = aiNodes.map((n) => ({
      id: n.id,
      pageId: n.pageId,
      label: n.label,
      x: n.x,
      y: n.y,
      color: n.color,
      pageType: (n.pageType as PageType) || "Content",
      slug: n.slug,
      description: n.description,
      colorTag: n.colorTag || "none",
      sections: getDefaultSections(n.pageId),
    }));
    const newConns: Connection[] = aiConns.map((c) => ({
      id: c.id,
      fromId: c.fromId,
      toId: c.toId,
      label: c.label,
    }));
    setNodes(newNodes);
    setConnections(newConns);
    setSelectedNode(null);
    setSelectedNodes(new Set());
    pushHistory(newNodes, newConns);
    setIsAiGenerated(true);
    if (sitemap.projectName && !currentProjectId) {
      setCurrentProjectName(sitemap.projectName);
    }
    // Reset zoom so the fresh layout is visible.
    setZoomLevel(1);
  }, [pushHistory, currentProjectId]);

  // (Keyboard shortcuts effect declared later, after duplicateNode/deleteSelected exist.)

  // Builder mode filters the palette: Sitemap hides "User Flow", Flow shows only it.
  const modeFilteredPages = stockPages.filter(p =>
    builderMode === "flow" ? p.category === "User Flow" : p.category !== "User Flow"
  );
  const categories = [...new Set(modeFilteredPages.map(p => p.category))];
  const filteredPages = modeFilteredPages.filter(p =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const primaryEmptyStatePage = builderMode === "flow"
    ? stockPages.find((page) => page.id === "flow-page") ?? stockPages[0]
    : stockPages[0];

  const addPageToCanvas = (page: typeof stockPages[0]) => {
    // Allow the same page/flow-step type to be added multiple times.
    // Sitemap pages get a numeric suffix when duplicated; flow steps are always
    // treated as fresh instances (a real user flow often has many "Page" or "Action" nodes).
    const sameTypeCount = nodes.filter(n => n.pageId === page.id).length;
    const suffix = sameTypeCount > 0 ? ` ${sameTypeCount + 1}` : "";
    // Enforce page limit for free users
    if (!isPremium && nodes.length >= maxPages) {
      toast.error(`Free plan: ${maxPages} pages max. Upgrade to Pro for unlimited pages.`);
      setShowPaywall(true);
      return;
    }
    const newNode: CanvasNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      pageId: page.id,
      label: `${page.label}${suffix}`,
      // Stack new nodes in a neat cascade instead of random scatter
      x: 120 + (nodes.length % 6) * 40,
      y: 100 + (nodes.length % 6) * 40,
      color: "hsl(var(--foreground))",
      pageType: page.category === "Auth" ? "Auth" : page.category === "Dashboard" ? "Dashboard" : "Content",
      slug: sameTypeCount > 0 ? `/${page.id}-${sameTypeCount + 1}` : `/${page.id}`,
      colorTag: "none",
      sections: getDefaultSections(page.id),
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    pushHistory(newNodes, connections);
    toast.success(`Added ${page.label}${suffix}`);
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

  const addSectionToNode = (nodeId: string, section: typeof sectionPresets[0]) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const newSection: PageSection = {
      id: `${section.id}-${Date.now()}`,
      label: section.label,
      color: section.color,
    };
    const newSections = [...(node.sections || []), newSection];
    updateNodeMeta(nodeId, { sections: newSections });
    setAddingSectionTo(null);
  };

  const removeSectionFromNode = (nodeId: string, sectionId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const newSections = (node.sections || []).filter(s => s.id !== sectionId);
    updateNodeMeta(nodeId, { sections: newSections });
  };

  // ====== AUTO-LAYOUT (BFS tree) ======
  const autoLayout = useCallback(() => {
    if (nodes.length === 0) return;
    const childrenMap: Record<string, string[]> = {};
    const hasIncoming = new Set<string>();
    connections.forEach(c => {
      hasIncoming.add(c.toId);
      if (!childrenMap[c.fromId]) childrenMap[c.fromId] = [];
      childrenMap[c.fromId].push(c.toId);
    });
    const roots = nodes.filter(n => !hasIncoming.has(n.id));
    if (roots.length === 0) roots.push(nodes[0]);
    
    const levels: Record<string, { level: number; index: number }> = {};
    const levelCounts: Record<number, number> = {};
    const queue = roots.map((r) => ({ id: r.id, level: 0 }));
    const visited = new Set<string>();
    
    // BFS
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const idx = levelCounts[level] || 0;
      levelCounts[level] = idx + 1;
      levels[id] = { level, index: idx };
      const children = childrenMap[id] || [];
      children.forEach(cid => { if (!visited.has(cid)) queue.push({ id: cid, level: level + 1 }); });
    }
    // Place unvisited nodes
    nodes.forEach(n => {
      if (!visited.has(n.id)) {
        const level = Object.keys(levelCounts).length;
        const idx = levelCounts[level] || 0;
        levelCounts[level] = idx + 1;
        levels[n.id] = { level, index: idx };
      }
    });
    
    const hGap = 240;
    const vGap = 180;
    const newNodes = nodes.map(n => {
      const pos = levels[n.id];
      if (!pos) return n;
      const totalAtLevel = levelCounts[pos.level] || 1;
      const startX = (totalAtLevel - 1) * hGap / -2 + 600;
      return { ...n, x: startX + pos.index * hGap, y: 60 + pos.level * vGap };
    });
    setNodes(newNodes);
    pushHistory(newNodes, connections);
    toast.success("Auto-layout applied!");
  }, [nodes, connections, pushHistory]);

  // ====== DUPLICATE NODE ======
  const duplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const newNode: CanvasNode = {
      ...node,
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: node.x + 30,
      y: node.y + 30,
      label: `${node.label} (copy)`,
      sections: node.sections?.map(s => ({ ...s, id: `${s.id}-${Date.now()}` })),
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    pushHistory(newNodes, connections);
    toast.success(`Duplicated ${node.label}`);
  }, [nodes, connections, pushHistory]);

  // ====== MULTI-SELECT ======
  const toggleMultiSelect = useCallback((nodeId: string) => {
    setSelectedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedNodes.size === 0) return;
    const newNodes = nodes.filter(n => !selectedNodes.has(n.id));
    const newConns = connections.filter(c => !selectedNodes.has(c.fromId) && !selectedNodes.has(c.toId));
    setNodes(newNodes);
    setConnections(newConns);
    pushHistory(newNodes, newConns);
    setSelectedNodes(new Set());
    if (selectedNode && selectedNodes.has(selectedNode)) setSelectedNode(null);
    toast.success(`Deleted ${selectedNodes.size} nodes`);
  }, [selectedNodes, nodes, connections, pushHistory, selectedNode]);

  // ====== ZOOM ======
  const zoomIn = useCallback(() => setZoomLevel(z => Math.min(2, z + 0.15)), []);
  const zoomOut = useCallback(() => setZoomLevel(z => Math.max(0.3, z - 0.15)), []);
  const zoomReset = useCallback(() => setZoomLevel(1), []);

  // Delete a connection by id
  const removeConnection = useCallback((connId: string) => {
    const newConns = connections.filter(c => c.id !== connId);
    setConnections(newConns);
    pushHistory(nodes, newConns);
    toast.success("Connection removed");
  }, [connections, nodes, pushHistory]);

  // Keyboard shortcuts (declared here so duplicateNode/deleteSelected are in scope)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        (target?.isContentEditable ?? false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (typing) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        if (selectedNode) { e.preventDefault(); duplicateNode(selectedNode); }
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodes.size > 0) { e.preventDefault(); deleteSelected(); return; }
        if (selectedNode) { e.preventDefault(); removeNode(selectedNode); setSelectedNode(null); return; }
      }
      if (e.key === "Escape") {
        if (connectingFrom) { setConnectingFrom(null); setConnectionLabel(""); return; }
        if (selectedNode) { setSelectedNode(null); return; }
        if (selectedNodes.size > 0) { setSelectedNodes(new Set()); return; }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, selectedNode, selectedNodes, connectingFrom, duplicateNode, deleteSelected]);

  // Track if a touch was a drag or a tap
  const touchDraggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNode(nodeId);
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y });
  };

  const handleTouchStart = (e: React.TouchEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNode(nodeId);
    setDragOffset({ x: touch.clientX - rect.left - node.x, y: touch.clientY - rect.top - node.y });
    touchDraggedRef.current = false;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 180, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - dragOffset.y));
    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
  }, [draggingNode, dragOffset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!draggingNode || !canvasRef.current) return;
    e.preventDefault(); // Prevent scrolling while dragging
    touchDraggedRef.current = true;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 180, touch.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 60, touch.clientY - rect.top - dragOffset.y));
    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
  }, [draggingNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (draggingNode) {
      pushHistory(nodes, connections);
    }
    setDraggingNode(null);
  }, [draggingNode, nodes, connections, pushHistory]);

  const handleTouchEnd = useCallback(() => {
    if (draggingNode) {
      pushHistory(nodes, connections);
      // If it was a tap (not dragged), open mobile edit sheet
      if (!touchDraggedRef.current && isMobileRef.current) {
        setMobileNodeEditId(draggingNode);
      }
    }
    setDraggingNode(null);
  }, [draggingNode, nodes, connections, pushHistory]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleNodeClick = (nodeId: string, e?: React.MouseEvent) => {
    // Multi-select with Shift+Click
    if (e?.shiftKey) {
      toggleMultiSelect(nodeId);
      return;
    }
    if (connectingFrom) {
      if (connectingFrom === nodeId) { setConnectingFrom(null); return; }
      const exists = connections.find(c => 
        (c.fromId === connectingFrom && c.toId === nodeId) || 
        (c.fromId === nodeId && c.toId === connectingFrom)
      );
      if (exists) { toast.info("Connection already exists"); setConnectingFrom(null); return; }
      const newConns = [...connections, {
        id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
      setSelectedNodes(new Set());
      // On desktop, toggle right panel; on mobile, open bottom sheet
      if (isMobileRef.current) {
        setMobileNodeEditId(nodeId);
      } else {
        setSelectedNode(nodeId === selectedNode ? null : nodeId);
      }
    }
  };

  // Export PNG
  const exportNavigation = async () => {
    if (!isAuthed) { toast.error("Please sign up to download your design"); navigate("/auth"); return; }
    if (!canExportPNG) { setShowPaywall(true); toast.error("Upgrade to EPIC Pro to unlock PNG export."); return; }
    if (nodes.length === 0) { toast.error("Add some pages first!"); return; }
    const canvas = document.createElement("canvas");
    const padding = 80;
    const nodeW = 180;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      const nodeH = 60 + (n.sections?.length || 0) * 32;
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + nodeW); maxY = Math.max(maxY, n.y + nodeH);
    });
    canvas.width = (maxX - minX) + padding * 2;
    canvas.height = (maxY - minY) + padding * 2;
    const ctx = canvas.getContext("2d")!;
    
    // Light background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dot grid
    ctx.fillStyle = "#e5e7eb";
    for (let x = 0; x < canvas.width; x += 20) {
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Title
    ctx.fillStyle = "#374151";
    ctx.font = "600 16px system-ui";
    ctx.fillText("🏗 AI Product Sitemap", 24, 36);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px system-ui";
    ctx.fillText("Made with EPIC", 24, 54);

    const offsetX = padding - minX;
    const offsetY = padding - minY + 30;

    // Draw connections as curved lines
    connections.forEach(conn => {
      const from = nodes.find(n => n.id === conn.fromId);
      const to = nodes.find(n => n.id === conn.toId);
      if (!from || !to) return;
      const fromH = 60 + (from.sections?.length || 0) * 32;
      const fx = from.x + offsetX + nodeW / 2;
      const fy = from.y + offsetY + fromH;
      const tx = to.x + offsetX + nodeW / 2;
      const ty = to.y + offsetY;
      
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      const midY = (fy + ty) / 2;
      ctx.bezierCurveTo(fx, midY, tx, midY, tx, ty);
      ctx.stroke();
      
      // Arrow dot at end
      ctx.fillStyle = "#93c5fd";
      ctx.beginPath();
      ctx.arc(tx, ty, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw nodes as cards
    nodes.forEach(node => {
      const nx = node.x + offsetX;
      const ny = node.y + offsetY;
      const sections = node.sections || [];
      const nodeH = 60 + sections.length * 32;
      
      // Card shadow
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.beginPath(); ctx.roundRect(nx + 2, ny + 2, nodeW, nodeH, 12); ctx.fill();
      
      // Card body
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.roundRect(nx, ny, nodeW, nodeH, 12); ctx.fill();
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(nx, ny, nodeW, nodeH, 12); ctx.stroke();
      
      // Title area
      ctx.fillStyle = "#111827";
      ctx.font = "600 13px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(node.label, nx + 14, ny + 24);
      
      // Page type badge
      if (node.pageType) {
        const badgeColors = pageTypeBadgeColors[node.pageType] || { bg: "#e5e7eb", text: "#374151" };
        const badgeText = node.pageType;
        const badgeW = ctx.measureText(badgeText).width + 12;
        ctx.fillStyle = badgeColors.bg;
        ctx.beginPath(); ctx.roundRect(nx + 14, ny + 32, badgeW, 18, 4); ctx.fill();
        ctx.fillStyle = badgeColors.text;
        ctx.font = "500 9px system-ui";
        ctx.fillText(badgeText, nx + 20, ny + 44);
      }
      
      // Sections
      sections.forEach((section, i) => {
        const sy = ny + 58 + i * 32;
        // Section dot
        ctx.fillStyle = section.color;
        ctx.beginPath();
        ctx.arc(nx + 22, sy + 8, 4, 0, Math.PI * 2);
        ctx.fill();
        // Section label
        ctx.fillStyle = "#374151";
        ctx.font = "400 11px system-ui";
        ctx.fillText(section.label, nx + 34, sy + 12);
      });
      
      ctx.textAlign = "start";
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a"); link.download = "website-navigation.png"; link.href = dataUrl; link.click();
    toast.success("Navigation map downloaded!");
  };

  // Export JSON
  const exportJSON = (format: "generic" | "cms" | "nocode" = "generic") => {
    if (!isAuthed) { toast.error("Please sign up to download your design"); navigate("/auth"); return; }
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
        sections: (n.sections || []).map(s => ({ label: s.label, color: s.color })),
        notes: n.notes || "",
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
              x: 100 + depth * 260,
              y: 80 + currentIndex * 120,
              color: "hsl(var(--foreground))",
              pageType: page.pageType || "Content",
              slug: page.slug || "",
              description: page.description || "",
              tags: page.tags || [],
              colorTag: page.colorTag || "none",
              sections: page.sections?.map((s: any) => ({
                id: `${s.label?.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
                label: s.label || "Section",
                color: s.color || "#3b82f6",
              })) || getDefaultSections(page.id || ""),
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
  const mobileEditNodeData = useMemo(() => nodes.find(n => n.id === mobileNodeEditId), [nodes, mobileNodeEditId]);

  // Minimap calculations
  const minimapScale = 0.06;
  const minimapNodes = useMemo(() => {
    if (nodes.length === 0) return [];
    return nodes.map(n => ({
      x: n.x * minimapScale,
      y: n.y * minimapScale,
      w: 180 * minimapScale,
      h: (60 + (n.sections?.length || 0) * 32) * minimapScale,
      color: colorTags.find(c => c.value === n.colorTag)?.color || "#6366f1",
      isNone: !n.colorTag || n.colorTag === "none",
    }));
  }, [nodes]);

  // Compute node heights for SVG connections
  const getNodeHeight = (node: CanvasNode) => 60 + (node.sections?.length || 0) * 32;
  const nodeW = 180;

  return (
    <>
      <SEO
        title="Website Navigation Maker — Plan Site Structure | EPIC"
        description="Drag-and-drop navigation builder. Plan page flow, create sitemaps, and export navigation maps. 50+ page templates."
        keywords="website navigation maker, sitemap builder, page flow designer, website structure planner, drag and drop navigation"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "EPIC Website Navigation Maker",
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          description: "Drag-and-drop navigation builder. Plan page flow, create sitemaps, and export navigation maps. 50+ page templates.",
          url: "https://no-edit.lovable.app/navigation-maker",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <div className="min-h-screen bg-[#f8f9fb] dark:bg-background">
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/90 dark:bg-card/90 backdrop-blur-xl border-b border-neutral-200 dark:border-border/40 flex items-center px-3 md:px-5 gap-2 md:gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-lg shrink-0" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">🏗</span>
            <h1 className="text-sm font-semibold text-foreground truncate max-w-[100px] md:max-w-[180px]">{currentProjectName}</h1>
          </div>
          
          <div className="flex-1" />

          {/* Undo/Redo — always visible */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-muted/50 rounded-lg p-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} className="h-7 w-7 rounded-md" title="Undo (⌘Z)" aria-label="Undo">
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className="h-7 w-7 rounded-md" title="Redo (⌘⇧Z)" aria-label="Redo">
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {builderMode === "sitemap" && (
            <Button
              size="sm"
              onClick={() => setAiModalOpen(true)}
              className="gap-1.5 h-8 text-xs rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-95 shadow-sm shrink-0"
              title="Generate sitemap with AI"
              aria-label="Generate sitemap with AI"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Generate with AI</span>
              <span className="sm:hidden">AI</span>
            </Button>
          )}
          {isAiGenerated && (
            <span
              className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              title="This sitemap was generated by AI — fully editable"
            >
              <Sparkles className="h-3 w-3" /> AI Generated
            </span>
          )}

          {connectingFrom && (
            <div className="hidden md:flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg">
              <Input 
                placeholder="Link label (optional)…"
                value={connectionLabel}
                onChange={e => setConnectionLabel(e.target.value)}
                className="w-28 h-7 text-xs border-blue-200 dark:border-blue-500/30"
              />
              <span className="text-xs text-blue-600 dark:text-blue-400 animate-pulse whitespace-nowrap">Click target node… (Esc to cancel)</span>
              <Button size="sm" variant="ghost" onClick={() => { setConnectingFrom(null); setConnectionLabel(""); }} className="h-7 text-xs">Cancel</Button>
            </div>
          )}

          {/* Desktop action buttons — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-muted/50 rounded-lg p-1">
              <Button variant="ghost" size="icon" onClick={zoomOut} className="h-7 w-7 rounded-md" title="Zoom Out" aria-label="Zoom out">
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <button onClick={zoomReset} aria-label="Reset zoom" className="text-[10px] text-muted-foreground font-mono w-10 text-center hover:text-foreground">{Math.round(zoomLevel * 100)}%</button>
              <Button variant="ghost" size="icon" onClick={zoomIn} className="h-7 w-7 rounded-md" title="Zoom In" aria-label="Zoom in">
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={autoLayout} className="gap-1.5 h-8 text-xs rounded-lg" title="Auto Layout">
              <LayoutTemplate className="h-3.5 w-3.5" /> Auto Layout
            </Button>
            {selectedNodes.size > 0 && (
              <Button variant="destructive" size="sm" onClick={deleteSelected} className="gap-1.5 h-8 text-xs rounded-lg">
                <Trash2 className="h-3.5 w-3.5" /> Delete {selectedNodes.size}
              </Button>
            )}
            <Button
              variant={showUXScore ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowUXScore(!showUXScore)}
              className="gap-1.5 h-8 text-xs rounded-lg"
              title="UX Score"
            >
              <TrendingUp className="h-3.5 w-3.5" /> UX Score
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/my-projects")} className="gap-1.5 h-8 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-muted/50">
              <FolderOpen className="h-3.5 w-3.5" /> Projects
            </Button>
            <Button variant="ghost" size="sm" onClick={saveProject} disabled={savingProject} className="gap-1.5 h-8 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-muted/50">
              <Save className="h-3.5 w-3.5" /> {savingProject ? "Saving..." : currentProjectId ? "Save" : "Save As"}
            </Button>
            <Button variant="ghost" size="sm" onClick={importJSON} className="gap-1.5 h-8 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-muted/50">
              <FileUp className="h-3.5 w-3.5" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (!isAuthed) { toast.error("Please sign in to share your sitemap"); navigate("/auth"); return; }
                if (nodes.length === 0) { toast.error("Add some pages first!"); return; }
                const shareId = Math.random().toString(36).slice(2, 9).toUpperCase();
                const { error } = await supabase.from("shared_sitemaps" as any).insert({
                  id: shareId,
                  title: "AI Product Sitemap",
                  nodes: JSON.parse(JSON.stringify(nodes)),
                  connections: JSON.parse(JSON.stringify(connections)),
                  created_by: (await supabase.auth.getUser()).data.user?.id,
                } as any);
                if (error) { toast.error("Failed to share sitemap"); console.error(error); return; }
                const url = `${window.location.origin}/shared/${shareId}`;
                await navigator.clipboard.writeText(url);
                toast.success("Share link copied to clipboard!", { description: url });
              }}
              className="gap-1.5 h-8 text-xs rounded-lg border-neutral-200 dark:border-border"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportJSON("generic")} className="gap-1.5 h-8 text-xs rounded-lg border-neutral-200 dark:border-border">
              <FileJson className="h-3.5 w-3.5" /> JSON
              {!isAuthed ? <Lock className="h-3 w-3 text-muted-foreground" /> : !canExportJSON ? <Crown className="h-3 w-3 text-amber-500" /> : null}
            </Button>
            <Button size="sm" onClick={exportNavigation} className="gap-1.5 h-8 text-xs rounded-lg bg-foreground text-background hover:bg-foreground/90">
              <Download className="h-3.5 w-3.5" /> Export PNG
              {!isAuthed ? <Lock className="h-3 w-3" /> : !canExportPNG ? <Crown className="h-3 w-3 text-amber-500" /> : null}
            </Button>
          </div>

          {/* Mobile action menu — visible only on mobile */}
          <div className="flex md:hidden items-center gap-1 shrink-0">
            <div className="inline-flex items-center rounded-xl border border-border/60 bg-background/85 p-0.5 shadow-sm backdrop-blur">
              <button
                onClick={() => setBuilderMode("sitemap")}
                className={cn(
                  "min-w-[64px] rounded-[10px] px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                  builderMode === "sitemap"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Site
              </button>
              <button
                onClick={() => setBuilderMode("flow")}
                className={cn(
                  "min-w-[64px] rounded-[10px] px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                  builderMode === "flow"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Flow
              </button>
            </div>
            <Button size="sm" onClick={exportNavigation} className="gap-1 h-8 text-xs rounded-lg bg-foreground text-background hover:bg-foreground/90 px-2.5">
              <Download className="h-3.5 w-3.5" /> PNG
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="More actions">
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowUXScore(!showUXScore)}>
                  <TrendingUp className="h-4 w-4 mr-2" /> UX Score
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={saveProject} disabled={savingProject}>
                  <Save className="h-4 w-4 mr-2" /> {savingProject ? "Saving..." : currentProjectId ? "Save" : "Save As"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-projects")}>
                  <FolderOpen className="h-4 w-4 mr-2" /> Projects
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={autoLayout}>
                  <LayoutTemplate className="h-4 w-4 mr-2" /> Auto Layout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={importJSON}>
                  <FileUp className="h-4 w-4 mr-2" /> Import JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportJSON("generic")}>
                  <FileJson className="h-4 w-4 mr-2" /> Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  if (!isAuthed) { toast.error("Please sign in to share your sitemap"); navigate("/auth"); return; }
                  if (nodes.length === 0) { toast.error("Add some pages first!"); return; }
                  const shareId = Math.random().toString(36).slice(2, 9).toUpperCase();
                  const { error } = await supabase.from("shared_sitemaps" as any).insert({
                    id: shareId,
                    title: "AI Product Sitemap",
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    connections: JSON.parse(JSON.stringify(connections)),
                    created_by: (await supabase.auth.getUser()).data.user?.id,
                  } as any);
                  if (error) { toast.error("Failed to share sitemap"); console.error(error); return; }
                  const url = `${window.location.origin}/shared/${shareId}`;
                  await navigator.clipboard.writeText(url);
                  toast.success("Share link copied to clipboard!", { description: url });
                }}>
                  <Share2 className="h-4 w-4 mr-2" /> Share Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex pt-14 h-screen">
          {/* Sidebar — Stock Pages */}
          <aside className="w-60 border-r border-neutral-200 dark:border-border/40 bg-white dark:bg-card/50 flex flex-col shrink-0 hidden md:flex">
            <div className="p-4 border-b border-neutral-100 dark:border-border/40">
              <p className="text-xs font-semibold text-foreground mb-3">📦 {builderMode === "flow" ? "Flow Steps" : "Page Library"}</p>
              <div className="mb-3 inline-flex w-full p-0.5 rounded-xl bg-muted/60 border border-border/60">
                <button
                  onClick={() => setBuilderMode("sitemap")}
                  className={cn(
                    "flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all duration-200",
                    builderMode === "sitemap" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >Sitemap</button>
                <button
                  onClick={() => setBuilderMode("flow")}
                  className={cn(
                    "flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all duration-200",
                    builderMode === "flow" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >User Flow</button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder={builderMode === "flow" ? "Search steps..." : "Search pages..."}
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs rounded-lg bg-neutral-50 dark:bg-muted/30 border-neutral-200 dark:border-border/40"
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
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">{cat}</p>
                      <div className="space-y-0.5">
                        {pages.map(page => {
                          const Icon = page.icon;
                          const onCanvas = nodes.some(n => n.pageId === page.id);
                          return (
                            <button
                              key={page.id}
                              onClick={() => addPageToCanvas(page)}
                              className={cn(
                                "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs transition-all duration-150",
                                "hover:bg-neutral-100 dark:hover:bg-muted active:scale-[0.97]",
                                onCanvas ? "text-foreground bg-neutral-100 dark:bg-muted" : "text-muted-foreground"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{page.label}</span>
                              {onCanvas && <span className="ml-auto text-[9px] text-green-500 font-semibold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-neutral-100 dark:border-border/40 text-center">
              <p className="text-[10px] text-muted-foreground">{nodes.length} on canvas · {stockPages.length} available</p>
            </div>
          </aside>

          {/* Mobile Page Library — Bottom Sheet */}
          <Sheet open={mobileLibraryOpen} onOpenChange={setMobileLibraryOpen}>
            <SheetContent side="bottom" className="md:hidden h-[70vh] rounded-t-2xl p-0">
              <SheetHeader className="p-4 pb-2 border-b border-border/40">
                <SheetTitle className="text-sm font-semibold">📦 {builderMode === "flow" ? "Flow Steps" : "Page Library"}</SheetTitle>
                <SheetDescription className="text-xs">
                  {builderMode === "flow" ? "Choose user flow steps to map the journey." : "Choose pages to build your sitemap visually."}
                </SheetDescription>
                <div className="mt-2 inline-flex w-full p-0.5 rounded-xl bg-muted/60 border border-border/60">
                  <button
                    onClick={() => setBuilderMode("sitemap")}
                    className={cn(
                      "flex-1 text-xs font-medium py-1.5 rounded-lg transition-all",
                      builderMode === "sitemap" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    )}
                  >Sitemap</button>
                  <button
                    onClick={() => setBuilderMode("flow")}
                    className={cn(
                      "flex-1 text-xs font-medium py-1.5 rounded-lg transition-all",
                      builderMode === "flow" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    )}
                  >User Flow</button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    placeholder={builderMode === "flow" ? "Search steps..." : "Search pages..."}
                    value={search} 
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs rounded-lg bg-muted/30 border-border/40"
                  />
                </div>
              </SheetHeader>
              <div className="overflow-y-auto overscroll-contain flex-1 p-3 space-y-4" style={{ maxHeight: "calc(70vh - 100px)" }}>
                {categories.map(cat => {
                  const pages = filteredPages.filter(p => p.category === cat);
                  if (pages.length === 0) return null;
                  return (
                    <div key={cat}>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-1">{cat}</p>
                      <div className="space-y-0.5">
                        {pages.map(page => {
                          const Icon = page.icon;
                          const onCanvas = nodes.some(n => n.pageId === page.id);
                          return (
                            <button
                              key={page.id}
                              onClick={() => { addPageToCanvas(page); setMobileLibraryOpen(false); }}
                              className={cn(
                                "flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-lg text-xs transition-all duration-150",
                                "hover:bg-muted active:scale-[0.97]",
                                onCanvas ? "text-foreground bg-muted" : "text-muted-foreground"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{page.label}</span>
                              {onCanvas && <span className="ml-auto text-[9px] text-green-500 font-semibold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-border/40 text-center">
                <p className="text-[10px] text-muted-foreground">{nodes.length} on canvas · {stockPages.length} available</p>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile FAB — Add Page */}
          <button
            onClick={() => setMobileLibraryOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Canvas */}
          <div className="flex-1 relative overflow-auto canvas-dot-grid">
            {nodes.length === 0 && (
              <div className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4 md:hidden">
                <div className="pointer-events-auto w-full max-w-sm rounded-[28px] border border-border/70 bg-background/95 p-5 text-center shadow-[0_24px_80px_-40px_hsla(var(--foreground)/0.28)] backdrop-blur-xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/70">
                    {builderMode === "flow" ? <MousePointer className="h-7 w-7 text-primary" /> : <Globe className="h-7 w-7 text-primary" />}
                  </div>
                  <div className="mb-2 inline-flex items-center rounded-full border border-border/60 bg-muted/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    {builderMode === "flow" ? "User Flow Builder" : "Visual Sitemap Builder"}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {builderMode === "flow" ? "Start Mapping The User Journey" : "Start Building Your Sitemap"}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {builderMode === "flow"
                      ? "Add steps, decisions, and backend actions to map how users move through your product."
                      : "Add pages from the library and connect them into a clear website structure."}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Button size="sm" onClick={() => addPageToCanvas(primaryEmptyStatePage)} className="gap-1.5 rounded-lg btn-glow">
                      <Plus className="h-3.5 w-3.5" /> {builderMode === "flow" ? "Add First Flow Step" : "Add Home Page"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setMobileLibraryOpen(true)} className="gap-1.5 rounded-lg">
                      <Menu className="h-3.5 w-3.5" /> Open {builderMode === "flow" ? "Flow Library" : "Page Library"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* UX Score Panel */}
            <UXScorePanel nodes={nodes} connections={connections} visible={showUXScore} onClose={() => setShowUXScore(false)} isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
            <div ref={canvasRef} className="relative w-full h-full min-w-[1400px] min-h-[900px] origin-top-left transition-transform duration-150" style={{ transform: `scale(${zoomLevel})` }}>
              {/* SVG Connections — Curved Bezier lines */}
              <svg ref={svgRef} className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: "none" }}>
                <defs>
                  <linearGradient id="conn-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.85" />
                  </linearGradient>
                  <marker id="arrow-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
                  </marker>
                </defs>
                {connections.map(conn => {
                  const from = nodes.find(n => n.id === conn.fromId);
                  const to = nodes.find(n => n.id === conn.toId);
                  if (!from || !to) return null;
                  const fromH = getNodeHeight(from);
                  const fx = from.x + nodeW / 2;
                  const fy = from.y + fromH;
                  const tx = to.x + nodeW / 2;
                  const ty = to.y;
                  const midY = (fy + ty) / 2;
                  const d = `M ${fx} ${fy} C ${fx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
                  
                  return (
                    <g key={conn.id} style={{ pointerEvents: "auto", cursor: "pointer" }}>
                      {/* Invisible fat hit target for easy clicking */}
                      <path
                        d={d}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={16}
                      >
                        <title>Click to delete connection</title>
                      </path>
                      {/* Subtle base line for depth */}
                      <path
                        d={d}
                        fill="none"
                        stroke="url(#conn-gradient)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        opacity={0.35}
                        style={{ pointerEvents: "none" }}
                      />
                      {/* Animated flowing dashes */}
                      <path
                        d={d}
                        fill="none"
                        stroke="url(#conn-gradient)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        className="connection-flow"
                        style={{ pointerEvents: "none" }}
                      />
                      {/* Connection end dot */}
                      <circle cx={tx} cy={ty} r={4} fill="hsl(var(--primary))" style={{ pointerEvents: "none" }} />
                      <circle cx={fx} cy={fy} r={4} fill="hsl(var(--accent))" style={{ pointerEvents: "none" }} />
                      {/* Delete-on-click overlay (visible on hover of the group) */}
                      <g
                        onClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }}
                        className="opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <circle cx={(fx + tx) / 2} cy={(fy + ty) / 2} r={10} fill="hsl(var(--destructive))" />
                        <text
                          x={(fx + tx) / 2}
                          y={(fy + ty) / 2 + 4}
                          textAnchor="middle"
                          fill="hsl(var(--destructive-foreground))"
                          style={{ fontSize: "12px", fontWeight: 700, pointerEvents: "none", userSelect: "none" }}
                        >
                          ×
                        </text>
                      </g>
                      {/* Connection label */}
                      {conn.label && (
                        <g style={{ pointerEvents: "none" }}>
                          <rect
                            x={(fx + tx) / 2 - conn.label.length * 3 - 6}
                            y={(fy + ty) / 2 - 9}
                            width={conn.label.length * 6 + 12}
                            height={18}
                            rx={9}
                            fill="hsl(var(--card))"
                            stroke="hsl(var(--border))"
                            strokeWidth={1}
                            opacity={0.95}
                          />
                          <text
                            x={(fx + tx) / 2}
                            y={(fy + ty) / 2 + 3}
                            textAnchor="middle"
                            style={{ fontSize: "9px", fill: "hsl(var(--muted-foreground))" }}
                          >
                            {conn.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes — Card style like reference image */}
              <AnimatePresence>
                {nodes.map(node => {
                  const page = stockPages.find(p => p.id === node.pageId);
                  const Icon = page?.icon || FileText;
                  const isSelected = selectedNode === node.id;
                  const isMultiSelected = selectedNodes.has(node.id);
                  const isConnecting = connectingFrom === node.id;
                  const sections = node.sections || [];
                  const badgeColor = pageTypeBadgeColors[node.pageType || "Content"] || { bg: "#e5e7eb", text: "#374151" };

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("absolute select-none z-10 group", draggingNode === node.id && "z-30")}
                      style={{ left: node.x, top: node.y, width: nodeW }}
                    >
                      <div
                        onMouseDown={e => handleMouseDown(e, node.id)}
                        onTouchStart={e => handleTouchStart(e, node.id)}
                        onClick={(e) => handleNodeClick(node.id, e)}
                        className={cn(
                          "rounded-xl bg-white dark:bg-card cursor-grab active:cursor-grabbing transition-all duration-200",
                          "shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none border",
                          isSelected 
                            ? "border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-500/20" 
                            : "border-neutral-200 dark:border-border hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
                          isMultiSelected && "border-amber-400 ring-2 ring-amber-100 dark:ring-amber-500/20",
                          isConnecting && "border-purple-400 ring-2 ring-purple-100 dark:ring-purple-500/20"
                        )}
                      >
                        {/* Card Header */}
                        <div className="px-3.5 pt-3 pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-foreground">{node.label}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={e => { e.stopPropagation(); duplicateNode(node.id); }}
                                className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-muted/50 text-muted-foreground flex items-center justify-center hover:scale-110 transition-transform"
                                title="Duplicate"
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); setConnectingFrom(node.id); }}
                                className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-110 transition-transform"
                                title="Connect"
                              >
                                <Link2 className="h-2.5 w-2.5" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); removeNode(node.id); }}
                                className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center hover:scale-110 transition-transform"
                                title="Remove"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Type badges */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold"
                              style={{ backgroundColor: badgeColor.bg, color: badgeColor.text }}
                            >
                              {node.pageType || "Content"}
                            </span>
                            {node.colorTag && node.colorTag !== "none" && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold text-white"
                                style={{ backgroundColor: colorTags.find(c => c.value === node.colorTag)?.color }}
                              >
                                {node.colorTag}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Divider */}
                        {sections.length > 0 && <div className="mx-3 border-t border-neutral-100 dark:border-border/30" />}

                        {/* Sections list */}
                        {sections.length > 0 && (
                          <div className="px-3 py-2 space-y-1">
                            {sections.map(section => (
                              <div key={section.id} className="flex items-center gap-2 group/section py-1">
                                <div
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: section.color }}
                                />
                                <span className="text-[11px] text-neutral-600 dark:text-muted-foreground flex-1">{section.label}</span>
                                <button
                                  onClick={e => { e.stopPropagation(); removeSectionFromNode(node.id, section.id); }}
                                  className="opacity-0 group-hover/section:opacity-100 transition-opacity"
                                >
                                  <X className="h-2.5 w-2.5 text-neutral-400 hover:text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add section button */}
                        <div className="px-3 pb-2.5">
                          {addingSectionTo === node.id ? (
                            <div className="mt-1 p-2 bg-neutral-50 dark:bg-muted/30 rounded-lg">
                              <div className="grid grid-cols-2 gap-1 max-h-32 overflow-auto">
                                {sectionPresets.map(preset => (
                                  <button
                                    key={preset.id}
                                    onClick={e => { e.stopPropagation(); addSectionToNode(node.id, preset); }}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-neutral-600 dark:text-muted-foreground hover:bg-white dark:hover:bg-muted transition-colors text-left"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: preset.color }} />
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); setAddingSectionTo(null); }}
                                className="mt-1 text-[10px] text-muted-foreground hover:text-foreground w-full text-center"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={e => { e.stopPropagation(); setAddingSectionTo(node.id); }}
                              className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Plus className="h-3 w-3" /> Add section
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty State */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mx-4 hidden w-full max-w-md rounded-[28px] border border-border/70 bg-background/92 p-6 text-center shadow-[0_24px_80px_-40px_hsla(var(--foreground)/0.28)] backdrop-blur-xl md:block md:p-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/70">
                      {builderMode === "flow" ? <MousePointer className="h-8 w-8 text-primary" /> : <Globe className="h-8 w-8 text-primary" />}
                    </div>
                    <div className="mb-3 inline-flex items-center rounded-full border border-border/60 bg-muted/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                      {builderMode === "flow" ? "User Flow Builder" : "Visual Sitemap Builder"}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {builderMode === "flow" ? "Start Mapping The User Journey" : "Start Building Your Sitemap"}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {builderMode === "flow"
                        ? "Add steps, decisions, and backend actions to create a clean product flow without changing your current EPIC structure."
                        : "Add pages from the library, drag to arrange them, and connect them into a clear website structure."}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button variant="outline" size="sm" onClick={importJSON} className="gap-1.5 rounded-lg">
                        <FileUp className="h-3.5 w-3.5" /> Import JSON
                      </Button>
                      <Button size="sm" onClick={() => addPageToCanvas(primaryEmptyStatePage)} className="gap-1.5 rounded-lg btn-glow">
                        <Plus className="h-3.5 w-3.5" /> {builderMode === "flow" ? "Add First Flow Step" : "Add Home Page"}
                      </Button>
                    </div>
                    <button
                      onClick={() => setMobileLibraryOpen(true)}
                      className="mt-4 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:hidden"
                    >
                      Open {builderMode === "flow" ? "flow library" : "page library"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Minimap */}
            {showMinimap && nodes.length > 0 && (
              <div className="absolute bottom-4 left-4 w-44 h-28 bg-white/95 dark:bg-card/90 backdrop-blur border border-neutral-200 dark:border-border rounded-xl overflow-hidden z-20 shadow-sm">
                <div className="absolute top-1.5 right-1.5 z-10">
                  <button onClick={() => setShowMinimap(false)} className="text-neutral-400 hover:text-foreground">
                    <Minimize2 className="h-3 w-3" />
                  </button>
                </div>
                <svg className="w-full h-full" viewBox={`0 0 ${1400 * minimapScale} ${900 * minimapScale}`}>
                  {minimapNodes.map((n, i) => (
                    <rect key={i} x={n.x} y={n.y} width={n.w} height={n.h} rx={2} fill={n.isNone ? "#6366f1" : n.color} opacity={0.5} />
                  ))}
                </svg>
              </div>
            )}
            {!showMinimap && nodes.length > 0 && (
              <button onClick={() => setShowMinimap(true)} className="absolute bottom-4 left-4 z-20 px-3 py-1.5 text-[10px] bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-lg text-muted-foreground hover:text-foreground shadow-sm">
                Minimap
              </button>
            )}
          </div>

          {/* Right Panel — Node Details */}
          {selectedNodeData && (
            <aside className="w-72 border-l border-neutral-200 dark:border-border/40 bg-white dark:bg-card/50 flex flex-col shrink-0 hidden lg:flex">
              <div className="p-5 border-b border-neutral-100 dark:border-border/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Page Details</p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => duplicateNode(selectedNodeData.id)} className="text-muted-foreground hover:text-foreground" title="Duplicate">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{selectedNodeData.label}</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-5 space-y-5">
                  {/* Label */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Label</label>
                    <Input value={selectedNodeData.label} onChange={e => updateNodeMeta(selectedNodeData.id, { label: e.target.value })} className="h-9 text-xs rounded-lg" />
                  </div>

                  {/* Page Type */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Page Type</label>
                    <Select value={selectedNodeData.pageType || "Content"} onValueChange={(v) => updateNodeMeta(selectedNodeData.id, { pageType: v as PageType })}>
                      <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {pageTypes.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Slug</label>
                    <Input value={selectedNodeData.slug || ""} onChange={e => updateNodeMeta(selectedNodeData.id, { slug: e.target.value })} className="h-9 text-xs rounded-lg font-mono" placeholder="/page-slug" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Description</label>
                    <textarea
                      value={selectedNodeData.description || ""}
                      onChange={e => updateNodeMeta(selectedNodeData.id, { description: e.target.value })}
                      className="w-full h-20 px-3 py-2 text-xs bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Brief page description..."
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <StickyNote className="h-3 w-3" /> Notes
                    </label>
                    <textarea
                      value={selectedNodeData.notes || ""}
                      onChange={e => updateNodeMeta(selectedNodeData.id, { notes: e.target.value })}
                      className="w-full h-24 px-3 py-2 text-xs bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Dev notes, implementation details..."
                    />
                  </div>

                  {/* Color Tag */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-2">Color Tag</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorTags.map(ct => (
                        <button
                          key={ct.value}
                          onClick={() => updateNodeMeta(selectedNodeData.id, { colorTag: ct.value })}
                          className={cn(
                            "w-7 h-7 rounded-lg border-2 transition-all hover:scale-110",
                            selectedNodeData.colorTag === ct.value ? "border-foreground scale-110 shadow-sm" : "border-transparent"
                          )}
                          style={{ backgroundColor: ct.value === "none" ? "hsl(var(--muted))" : ct.color }}
                          title={ct.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Tags</label>
                    <Input
                      value={(selectedNodeData.tags || []).join(", ")}
                      onChange={e => updateNodeMeta(selectedNodeData.id, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                      className="h-9 text-xs rounded-lg"
                      placeholder="tag1, tag2, ..."
                    />
                  </div>

                  {/* Sections */}
                  <div>
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-2">Page Sections</label>
                    <div className="space-y-1.5">
                      {(selectedNodeData.sections || []).map(section => (
                        <div key={section.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-50 dark:bg-muted/30 rounded-lg">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                          <span className="text-xs text-foreground flex-1">{section.label}</span>
                          <button onClick={() => removeSectionFromNode(selectedNodeData.id, section.id)}>
                            <X className="h-3 w-3 text-neutral-400 hover:text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingSectionTo(selectedNodeData.id)}
                      className="mt-2 h-7 text-[10px] gap-1 w-full justify-start"
                    >
                      <Plus className="h-3 w-3" /> Add Section
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </aside>
          )}

          {/* Mobile Node Editing Bottom Sheet */}
          <Sheet open={!!mobileNodeEditId} onOpenChange={(open) => { if (!open) setMobileNodeEditId(null); }}>
            <SheetContent side="bottom" className="md:hidden h-[75vh] rounded-t-2xl p-0">
              {mobileEditNodeData && (
                <>
                  <SheetHeader className="p-4 pb-3 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-sm font-semibold">{mobileEditNodeData.label}</SheetTitle>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { duplicateNode(mobileEditNodeData.id); setMobileNodeEditId(null); }}
                          className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-muted/50 text-muted-foreground flex items-center justify-center"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { setConnectingFrom(mobileEditNodeData.id); setMobileNodeEditId(null); toast.info("Tap another node to connect"); }}
                          className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"
                        >
                          <Link2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { removeNode(mobileEditNodeData.id); setMobileNodeEditId(null); }}
                          className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </SheetHeader>
                  <div className="overflow-y-auto overscroll-contain flex-1 p-4 space-y-5" style={{ maxHeight: "calc(75vh - 80px)" }}>
                    {/* Label */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Label</label>
                      <Input value={mobileEditNodeData.label} onChange={e => updateNodeMeta(mobileEditNodeData.id, { label: e.target.value })} className="h-10 text-sm rounded-lg" />
                    </div>

                    {/* Page Type */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Page Type</label>
                      <Select value={mobileEditNodeData.pageType || "Content"} onValueChange={(v) => updateNodeMeta(mobileEditNodeData.id, { pageType: v as PageType })}>
                        <SelectTrigger className="h-10 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {pageTypes.map(t => <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Slug</label>
                      <Input value={mobileEditNodeData.slug || ""} onChange={e => updateNodeMeta(mobileEditNodeData.id, { slug: e.target.value })} className="h-10 text-sm rounded-lg font-mono" placeholder="/page-slug" />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Description</label>
                      <textarea
                        value={mobileEditNodeData.description || ""}
                        onChange={e => updateNodeMeta(mobileEditNodeData.id, { description: e.target.value })}
                        className="w-full h-20 px-3 py-2 text-sm bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Brief page description..."
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <StickyNote className="h-3 w-3" /> Notes
                      </label>
                      <textarea
                        value={mobileEditNodeData.notes || ""}
                        onChange={e => updateNodeMeta(mobileEditNodeData.id, { notes: e.target.value })}
                        className="w-full h-24 px-3 py-2 text-sm bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Dev notes, implementation details..."
                      />
                    </div>

                    {/* Color Tag */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-2">Color Tag</label>
                      <div className="flex gap-2.5 flex-wrap">
                        {colorTags.map(ct => (
                          <button
                            key={ct.value}
                            onClick={() => updateNodeMeta(mobileEditNodeData.id, { colorTag: ct.value })}
                            className={cn(
                              "w-9 h-9 rounded-lg border-2 transition-all",
                              mobileEditNodeData.colorTag === ct.value ? "border-foreground scale-110 shadow-sm" : "border-transparent"
                            )}
                            style={{ backgroundColor: ct.value === "none" ? "hsl(var(--muted))" : ct.color }}
                            title={ct.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">Tags</label>
                      <Input
                        value={(mobileEditNodeData.tags || []).join(", ")}
                        onChange={e => updateNodeMeta(mobileEditNodeData.id, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                        className="h-10 text-sm rounded-lg"
                        placeholder="tag1, tag2, ..."
                      />
                    </div>

                    {/* Sections */}
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-2">Page Sections</label>
                      <div className="space-y-2">
                        {(mobileEditNodeData.sections || []).map(section => (
                          <div key={section.id} className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 rounded-lg">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                            <span className="text-sm text-foreground flex-1">{section.label}</span>
                            <button onClick={() => removeSectionFromNode(mobileEditNodeData.id, section.id)}>
                              <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {addingSectionTo === mobileEditNodeData.id ? (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-auto">
                            {sectionPresets.map(preset => (
                              <button
                                key={preset.id}
                                onClick={() => addSectionToNode(mobileEditNodeData.id, preset)}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:bg-background transition-colors text-left"
                              >
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: preset.color }} />
                                {preset.label}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setAddingSectionTo(null)}
                            className="mt-2 text-xs text-muted-foreground hover:text-foreground w-full text-center"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAddingSectionTo(mobileEditNodeData.id)}
                          className="mt-2 h-9 text-xs gap-1 w-full justify-start"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Section
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ProPaywall 
        open={showPaywall} 
        onOpenChange={setShowPaywall} 
      />
    </>
  );
};

export default NavigationMaker;
