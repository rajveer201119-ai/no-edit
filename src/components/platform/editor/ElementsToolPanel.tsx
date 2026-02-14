import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Star,
  Heart,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Check,
  X,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  HelpCircle,
  MessageCircle,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Home,
  Settings,
  Search,
  Bookmark,
  Flag,
  Award,
  Zap,
  Sun,
  Moon,
  Cloud,
  Flame,
  Droplet,
  Leaf,
  Music,
  Camera,
  Video,
  Mic,
  Headphones,
  Wifi,
  Battery,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  Gift,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Target,
  Crosshair,
  Compass,
  Navigation,
  Send,
  Share2,
  Download,
  Upload,
  ExternalLink,
  Link,
  Paperclip,
  File,
  FileText,
  Folder,
  Image,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  CheckSquare,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Coffee,
  Utensils,
  Briefcase,
  GraduationCap,
  Book,
  Lightbulb,
  Rocket,
  Sparkles,
  Crown,
  Trophy,
  LucideIcon,
} from "lucide-react";
import { useState, useCallback, memo } from "react";
import * as ReactDOMServer from "react-dom/server";

interface ElementsToolPanelProps {
  onAddIcon: (iconName: string, svgContent: string, IconComponent: LucideIcon) => void;
  onAddGraphic: (graphicType: string) => void;
}

interface IconItem {
  name: string;
  icon: LucideIcon;
  category: string;
}

// Icon library
const iconLibrary: IconItem[] = [
  // Basic
  { name: "Star", icon: Star, category: "basic" },
  { name: "Heart", icon: Heart, category: "basic" },
  { name: "Circle", icon: Circle, category: "basic" },
  { name: "Square", icon: Square, category: "basic" },
  { name: "Triangle", icon: Triangle, category: "basic" },
  { name: "Hexagon", icon: Hexagon, category: "basic" },
  { name: "Pentagon", icon: Pentagon, category: "basic" },
  { name: "Octagon", icon: Octagon, category: "basic" },
  
  // Arrows
  { name: "ArrowRight", icon: ArrowRight, category: "arrows" },
  { name: "ArrowUp", icon: ArrowUp, category: "arrows" },
  { name: "ArrowDown", icon: ArrowDown, category: "arrows" },
  { name: "ArrowLeft", icon: ArrowLeft, category: "arrows" },
  { name: "Navigation", icon: Navigation, category: "arrows" },
  { name: "Send", icon: Send, category: "arrows" },
  { name: "Share", icon: Share2, category: "arrows" },
  { name: "ExternalLink", icon: ExternalLink, category: "arrows" },
  
  // Status
  { name: "Check", icon: Check, category: "status" },
  { name: "X", icon: X, category: "status" },
  { name: "Plus", icon: Plus, category: "status" },
  { name: "Minus", icon: Minus, category: "status" },
  { name: "AlertTriangle", icon: AlertTriangle, category: "status" },
  { name: "Info", icon: Info, category: "status" },
  { name: "HelpCircle", icon: HelpCircle, category: "status" },
  
  // Communication
  { name: "MessageCircle", icon: MessageCircle, category: "communication" },
  { name: "MessageSquare", icon: MessageSquare, category: "communication" },
  { name: "Mail", icon: Mail, category: "communication" },
  { name: "Phone", icon: Phone, category: "communication" },
  { name: "Bell", icon: Bell, category: "communication" },
  
  // Location
  { name: "MapPin", icon: MapPin, category: "location" },
  { name: "Globe", icon: Globe, category: "location" },
  { name: "Compass", icon: Compass, category: "location" },
  { name: "Home", icon: Home, category: "location" },
  
  // Time
  { name: "Calendar", icon: Calendar, category: "time" },
  { name: "Clock", icon: Clock, category: "time" },
  
  // People
  { name: "User", icon: User, category: "people" },
  { name: "Users", icon: Users, category: "people" },
  { name: "Smile", icon: Smile, category: "people" },
  { name: "Frown", icon: Frown, category: "people" },
  { name: "Meh", icon: Meh, category: "people" },
  
  // Interface
  { name: "Settings", icon: Settings, category: "interface" },
  { name: "Search", icon: Search, category: "interface" },
  { name: "Bookmark", icon: Bookmark, category: "interface" },
  { name: "Flag", icon: Flag, category: "interface" },
  { name: "Lock", icon: Lock, category: "interface" },
  { name: "Unlock", icon: Unlock, category: "interface" },
  { name: "Eye", icon: Eye, category: "interface" },
  { name: "EyeOff", icon: EyeOff, category: "interface" },
  
  // Weather
  { name: "Sun", icon: Sun, category: "weather" },
  { name: "Moon", icon: Moon, category: "weather" },
  { name: "Cloud", icon: Cloud, category: "weather" },
  { name: "Flame", icon: Flame, category: "weather" },
  { name: "Droplet", icon: Droplet, category: "weather" },
  { name: "Leaf", icon: Leaf, category: "weather" },
  
  // Media
  { name: "Music", icon: Music, category: "media" },
  { name: "Camera", icon: Camera, category: "media" },
  { name: "Video", icon: Video, category: "media" },
  { name: "Mic", icon: Mic, category: "media" },
  { name: "Headphones", icon: Headphones, category: "media" },
  { name: "Image", icon: Image, category: "media" },
  
  // Tech
  { name: "Wifi", icon: Wifi, category: "tech" },
  { name: "Battery", icon: Battery, category: "tech" },
  { name: "Download", icon: Download, category: "tech" },
  { name: "Upload", icon: Upload, category: "tech" },
  { name: "Link", icon: Link, category: "tech" },
  { name: "Paperclip", icon: Paperclip, category: "tech" },
  
  // Files
  { name: "File", icon: File, category: "files" },
  { name: "FileText", icon: FileText, category: "files" },
  { name: "Folder", icon: Folder, category: "files" },
  
  // Commerce
  { name: "Gift", icon: Gift, category: "commerce" },
  { name: "ShoppingCart", icon: ShoppingCart, category: "commerce" },
  { name: "CreditCard", icon: CreditCard, category: "commerce" },
  { name: "DollarSign", icon: DollarSign, category: "commerce" },
  
  // Analytics
  { name: "TrendingUp", icon: TrendingUp, category: "analytics" },
  { name: "TrendingDown", icon: TrendingDown, category: "analytics" },
  { name: "BarChart", icon: BarChart, category: "analytics" },
  { name: "PieChart", icon: PieChart, category: "analytics" },
  { name: "Activity", icon: Activity, category: "analytics" },
  { name: "Target", icon: Target, category: "analytics" },
  
  // Text
  { name: "Type", icon: Type, category: "text" },
  { name: "Bold", icon: Bold, category: "text" },
  { name: "Italic", icon: Italic, category: "text" },
  { name: "AlignLeft", icon: AlignLeft, category: "text" },
  { name: "AlignCenter", icon: AlignCenter, category: "text" },
  { name: "AlignRight", icon: AlignRight, category: "text" },
  { name: "List", icon: List, category: "text" },
  { name: "CheckSquare", icon: CheckSquare, category: "text" },
  
  // Gestures
  { name: "ThumbsUp", icon: ThumbsUp, category: "gestures" },
  { name: "ThumbsDown", icon: ThumbsDown, category: "gestures" },
  
  // Objects
  { name: "Coffee", icon: Coffee, category: "objects" },
  { name: "Utensils", icon: Utensils, category: "objects" },
  { name: "Briefcase", icon: Briefcase, category: "objects" },
  { name: "GraduationCap", icon: GraduationCap, category: "objects" },
  { name: "Book", icon: Book, category: "objects" },
  { name: "Lightbulb", icon: Lightbulb, category: "objects" },
  
  // Special
  { name: "Award", icon: Award, category: "special" },
  { name: "Zap", icon: Zap, category: "special" },
  { name: "Rocket", icon: Rocket, category: "special" },
  { name: "Sparkles", icon: Sparkles, category: "special" },
  { name: "Crown", icon: Crown, category: "special" },
  { name: "Trophy", icon: Trophy, category: "special" },
  { name: "Crosshair", icon: Crosshair, category: "special" },
];

// Graphics/Decorations — 50+ colorful elements
const graphicItems = [
  // Badges & Ribbons
  { id: "badge-circle", name: "Circle Badge", color: "#3b82f6" },
  { id: "badge-ribbon", name: "Ribbon", color: "#ef4444" },
  { id: "badge-star", name: "Star Badge", color: "#f59e0b" },
  { id: "badge-shield", name: "Shield Badge", color: "#0ea5e9" },
  { id: "badge-hex", name: "Hex Badge", color: "#8b5cf6" },
  { id: "badge-diamond", name: "Diamond Badge", color: "#14b8a6" },
  // Banners & Dividers
  { id: "banner-wave", name: "Wave Banner", color: "#10b981" },
  { id: "banner-ribbon", name: "Ribbon Banner", color: "#ec4899" },
  { id: "divider-line", name: "Line Divider", color: "#6b7280" },
  { id: "divider-dots", name: "Dots Divider", color: "#6b7280" },
  { id: "divider-zigzag", name: "Zigzag Divider", color: "#8b5cf6" },
  { id: "divider-wave", name: "Wave Divider", color: "#06b6d4" },
  // Frames
  { id: "frame-simple", name: "Simple Frame", color: "#1f2937" },
  { id: "frame-rounded", name: "Rounded Frame", color: "#1f2937" },
  { id: "frame-double", name: "Double Frame", color: "#d97706" },
  { id: "frame-ornate", name: "Ornate Frame", color: "#7c3aed" },
  { id: "frame-polaroid", name: "Polaroid Frame", color: "#f3f4f6" },
  // Callouts
  { id: "callout-arrow", name: "Arrow Callout", color: "#f59e0b" },
  { id: "callout-speech", name: "Speech Bubble", color: "#06b6d4" },
  { id: "callout-thought", name: "Thought Bubble", color: "#a855f7" },
  // Blobs & Organic
  { id: "blob-1", name: "Blob Shape 1", color: "#8b5cf6" },
  { id: "blob-2", name: "Blob Shape 2", color: "#ec4899" },
  { id: "blob-3", name: "Blob Shape 3", color: "#14b8a6" },
  { id: "blob-4", name: "Blob Shape 4", color: "#f97316" },
  { id: "blob-5", name: "Blob Shape 5", color: "#22c55e" },
  // Gradients
  { id: "gradient-circle", name: "Gradient Circle", color: "#6366f1" },
  { id: "gradient-rect", name: "Gradient Rect", color: "#14b8a6" },
  { id: "gradient-blob", name: "Gradient Blob", color: "#a855f7" },
  { id: "gradient-pill", name: "Gradient Pill", color: "#ec4899" },
  // Patterns
  { id: "pattern-dots", name: "Dot Pattern", color: "#94a3b8" },
  { id: "pattern-lines", name: "Line Pattern", color: "#475569" },
  { id: "pattern-grid", name: "Grid Pattern", color: "#64748b" },
  { id: "pattern-chevron", name: "Chevron Pattern", color: "#3b82f6" },
  // Arrows
  { id: "arrow-curved", name: "Curved Arrow", color: "#ef4444" },
  { id: "arrow-double", name: "Double Arrow", color: "#3b82f6" },
  { id: "arrow-circle", name: "Circle Arrow", color: "#22c55e" },
  // Waves & Decorative
  { id: "wave-top", name: "Wave Top", color: "#22c55e" },
  { id: "wave-bottom", name: "Wave Bottom", color: "#06b6d4" },
  { id: "wave-double", name: "Double Wave", color: "#8b5cf6" },
  // Stickers
  { id: "sticker-new", name: "NEW Sticker", color: "#dc2626" },
  { id: "sticker-sale", name: "SALE Sticker", color: "#f59e0b" },
  { id: "sticker-hot", name: "HOT Sticker", color: "#ef4444" },
  { id: "sticker-free", name: "FREE Sticker", color: "#22c55e" },
  { id: "sticker-best", name: "BEST Sticker", color: "#8b5cf6" },
  { id: "sticker-top", name: "TOP Sticker", color: "#3b82f6" },
  // UI Components
  { id: "ui-button", name: "Button", color: "#3b82f6" },
  { id: "ui-card", name: "Card", color: "#e5e7eb" },
  { id: "ui-input", name: "Input Field", color: "#f3f4f6" },
  { id: "ui-avatar", name: "Avatar Circle", color: "#8b5cf6" },
  { id: "ui-toggle", name: "Toggle Switch", color: "#22c55e" },
  { id: "ui-progress", name: "Progress Bar", color: "#3b82f6" },
  // Device Mockups (as colored shapes)
  { id: "device-phone", name: "📱 Smartphone", color: "#1f2937" },
  { id: "device-laptop", name: "💻 Laptop", color: "#374151" },
  { id: "device-tablet", name: "📲 Tablet", color: "#4b5563" },
  // Objects
  { id: "obj-book", name: "📚 Book", color: "#92400e" },
  { id: "obj-chart", name: "📊 Chart", color: "#059669" },
  { id: "obj-school", name: "🏫 School", color: "#dc2626" },
  { id: "obj-building", name: "🏢 Building", color: "#6b7280" },
  // Social Icons
  { id: "social-like", name: "❤️ Like", color: "#ef4444" },
  { id: "social-share", name: "🔗 Share", color: "#3b82f6" },
  { id: "social-comment", name: "💬 Comment", color: "#22c55e" },
  { id: "social-follow", name: "➕ Follow", color: "#8b5cf6" },
];

const categories = [
  "all",
  "basic",
  "arrows",
  "status",
  "communication",
  "people",
  "interface",
  "media",
  "commerce",
  "special",
];

// Generate SVG string from Lucide icon component
const generateSvgString = (IconComponent: LucideIcon, color: string = "#000000"): string => {
  try {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <IconComponent 
        width={64} 
        height={64} 
        color={color}
        strokeWidth={2}
      />
    );
    return svgString;
  } catch {
    // Fallback SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }
};

// Memoized icon button component for performance
const IconButton = memo(({ 
  item, 
  onAdd 
}: { 
  item: IconItem; 
  onAdd: (item: IconItem) => void 
}) => {
  const Icon = item.icon;
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 hover:bg-primary/10 hover:border-primary/30 transition-all"
      onClick={() => onAdd(item)}
      title={item.name}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
});

IconButton.displayName = "IconButton";

export const ElementsToolPanel = ({ onAddIcon, onAddGraphic }: ElementsToolPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAdding, setIsAdding] = useState(false);

  const filteredIcons = iconLibrary.filter((icon) => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddIcon = useCallback((item: IconItem) => {
    if (isAdding) return;
    setIsAdding(true);
    
    try {
      // Generate actual SVG content from the icon component
      const svgContent = generateSvgString(item.icon, "#3b82f6");
      onAddIcon(item.name, svgContent, item.icon);
      toast.success(`${item.name} added to canvas!`);
    } catch (error) {
      console.error("Failed to add icon:", error);
      toast.error(`Failed to add ${item.name}. Please try again.`);
    } finally {
      setTimeout(() => setIsAdding(false), 100);
    }
  }, [onAddIcon, isAdding]);

  const handleAddGraphic = useCallback((item: typeof graphicItems[0]) => {
    try {
      onAddGraphic(item.id);
      toast.success(`${item.name} added to canvas!`);
    } catch (error) {
      console.error("Failed to add graphic:", error);
      toast.error(`Failed to add ${item.name}. Please try again.`);
    }
  }, [onAddGraphic]);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Search Elements</Label>
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>

        <Tabs defaultValue="icons" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="graphics">Graphics</TabsTrigger>
          </TabsList>

          <TabsContent value="icons" className="mt-4 space-y-4">
            {/* Category Filter */}
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs capitalize whitespace-nowrap"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Icons Grid */}
            <div className="grid grid-cols-5 gap-2">
              {filteredIcons.map((item) => (
                <IconButton 
                  key={item.name} 
                  item={item} 
                  onAdd={handleAddIcon}
                />
              ))}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No icons found. Try a different search.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="graphics" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {graphicItems.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all"
                  onClick={() => handleAddGraphic(item)}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded transition-transform hover:scale-110",
                      item.id.includes("circle") && "rounded-full",
                      item.id.includes("blob") && "rounded-[40%_60%_60%_40%/40%_40%_60%_60%]"
                    )}
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs">{item.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Click any element to add it to your canvas. Elements can be resized, rotated, and recolored.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};
