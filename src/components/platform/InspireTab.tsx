import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Shuffle, Layout, Play, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Template } from "./templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InspireTabProps {
  onRemix: (imageUrl: string, prompt: string) => void;
  onUseLayout: (template: Template) => void;
  onStartFrom: (imageUrl: string) => void;
}

interface FeedItem {
  id: string;
  imageUrl: string;
  prompt: string;
  category: string;
  likes: number;
}

const feedCategories = [
  { id: "startup", label: "Trending Startup Ads" },
  { id: "app-launch", label: "App Launch Designs" },
  { id: "posters", label: "Premium Posters" },
  { id: "social", label: "Social Media Winners" },
];

// Mock feed data - In production, this would come from Supabase
const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    imageUrl: "",
    prompt: "Modern startup product launch ad with gradient background, featuring bold sans-serif typography, abstract 3D shapes, and a clean minimal layout. Dark theme with purple and blue accent colors.",
    category: "startup",
    likes: 142,
  },
  {
    id: "2",
    imageUrl: "",
    prompt: "Minimalist app store screenshot design with clean UI mockup, device frame, feature highlights with icons, and compelling headline. White background with subtle shadows.",
    category: "app-launch",
    likes: 98,
  },
  {
    id: "3",
    imageUrl: "",
    prompt: "Bold typographic poster for music event, featuring distorted text effects, neon color palette, grid layout, and retro-futuristic aesthetic. High contrast with textured background.",
    category: "posters",
    likes: 256,
  },
  {
    id: "4",
    imageUrl: "",
    prompt: "Instagram carousel design for fashion brand, featuring product photography with clean white space, elegant serif typography, and cohesive brand colors. Luxury aesthetic.",
    category: "social",
    likes: 189,
  },
  {
    id: "5",
    imageUrl: "",
    prompt: "SaaS landing page hero section, featuring isometric 3D illustrations, gradient mesh background, floating UI elements, and clear value proposition headline.",
    category: "startup",
    likes: 203,
  },
  {
    id: "6",
    imageUrl: "",
    prompt: "Mobile app onboarding screen with friendly illustrations, progress indicators, bold headlines, and clear call-to-action buttons. Playful color scheme.",
    category: "app-launch",
    likes: 167,
  },
];

export const InspireTab = ({ onRemix, onUseLayout, onStartFrom }: InspireTabProps) => {
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<FeedItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading feed from database
    const timer = setTimeout(() => {
      setFeedItems(mockFeedItems);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Try to fetch real posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, image_url, content, created_at")
          .not("image_url", "is", null)
          .order("created_at", { ascending: false })
          .limit(12);

        if (!error && data && data.length > 0) {
          const realItems: FeedItem[] = data.map((post, i) => ({
            id: post.id,
            imageUrl: post.image_url || "",
            prompt: post.content || "AI Generated Design",
            category: feedCategories[i % feedCategories.length].id,
            likes: Math.floor(Math.random() * 200) + 50,
          }));
          setFeedItems(realItems);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const filteredItems = activeCategory
    ? feedItems.filter((item) => item.category === activeCategory)
    : feedItems;

  // Handle copy prompt
  const handleCopyPrompt = async (item: FeedItem) => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedId(item.id);
      toast.success("Prompt copied — paste into your favorite AI tool!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback: show modal with prompt
      setSelectedPrompt(item);
    }
  };

  // Handle remix click
  const handleRemixClick = (item: FeedItem) => {
    handleCopyPrompt(item);
  };

  // Handle start from click
  const handleStartFromClick = (item: FeedItem) => {
    if (item.imageUrl) {
      onStartFrom(item.imageUrl);
    } else {
      // No image, copy prompt instead
      handleCopyPrompt(item);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-epic-text">
            Get Inspired
          </h1>
          <p className="text-muted-foreground">
            Discover AI-generated designs and use them as starting points
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className="min-h-[44px]"
          >
            All
          </Button>
          {feedCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className="min-h-[44px]"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-muted/30 rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all"
            >
              {/* Image or Placeholder */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm text-center px-4">
                    {item.prompt.slice(0, 50)}...
                  </span>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                <Button
                  size="sm"
                  className="w-full max-w-[200px] gap-2 min-h-[44px]"
                  onClick={() => handleRemixClick(item)}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Shuffle className="h-4 w-4" />
                      Remix This
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full max-w-[200px] gap-2 min-h-[44px]"
                  onClick={() => handleStartFromClick(item)}
                >
                  <Play className="h-4 w-4" />
                  Start From This
                </Button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm line-clamp-2 text-foreground">{item.prompt}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {item.likes} likes
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1 text-xs"
                    onClick={() => handleCopyPrompt(item)}
                  >
                    <Copy className="h-3 w-3" />
                    Copy Prompt
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No designs found in this category. Check back later!
          </div>
        )}
      </div>

      {/* Prompt Modal (fallback for clipboard) */}
      <Dialog open={!!selectedPrompt} onOpenChange={() => setSelectedPrompt(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Copy This Prompt</DialogTitle>
            <DialogDescription>
              Use this prompt with Midjourney, DALL·E, or your favorite AI tool
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono">
            {selectedPrompt?.prompt}
          </div>
          
          <Button
            className="w-full gap-2"
            onClick={async () => {
              if (selectedPrompt) {
                try {
                  await navigator.clipboard.writeText(selectedPrompt.prompt);
                  toast.success("Prompt copied!");
                  setSelectedPrompt(null);
                } catch {
                  toast.error("Please copy the text manually");
                }
              }
            }}
          >
            <Copy className="h-4 w-4" />
            Copy Prompt
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
