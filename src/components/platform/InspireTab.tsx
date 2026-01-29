import { useState, useEffect, lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Shuffle, Layout, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Template } from "./templates";

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
    prompt: "Modern startup product launch ad with gradient background",
    category: "startup",
    likes: 142,
  },
  {
    id: "2",
    imageUrl: "",
    prompt: "Minimalist app store screenshot design",
    category: "app-launch",
    likes: 98,
  },
  {
    id: "3",
    imageUrl: "",
    prompt: "Bold typographic poster for music event",
    category: "posters",
    likes: 256,
  },
  {
    id: "4",
    imageUrl: "",
    prompt: "Instagram carousel design for fashion brand",
    category: "social",
    likes: 189,
  },
];

export const InspireTab = ({ onRemix, onUseLayout, onStartFrom }: InspireTabProps) => {
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
          >
            All
          </Button>
          {feedCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
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
                  className="w-full max-w-[200px] gap-2"
                  onClick={() => onRemix(item.imageUrl, item.prompt)}
                >
                  <Shuffle className="h-4 w-4" />
                  Remix This
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full max-w-[200px] gap-2"
                  onClick={() => onStartFrom(item.imageUrl)}
                >
                  <Play className="h-4 w-4" />
                  Start From This
                </Button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm line-clamp-2 text-foreground">{item.prompt}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.likes} likes
                </p>
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
    </div>
  );
};
