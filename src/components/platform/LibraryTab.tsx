import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Copy, Check, ExternalLink, Clock, Grid3X3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { templates, searchTemplates } from "./templates";
import type { DesignCategory } from "./DesignTypeModal";
import type { Template } from "./templates";
import { HistoryPanel, type HistoryItem } from "./editor/HistoryPanel";
import type { CanvasState } from "./editor/types";

interface LibraryTabProps {
  onUseTemplate: (template: Template) => void;
  onLoadDesign?: (state: CanvasState) => void;
  currentCanvasState?: CanvasState;
}

// Prompt vault for external AI tools - expanded library
const aiPrompts = [
  // Marketing Prompts
  {
    id: "midjourney-logo",
    title: "Minimalist Tech Logo",
    description: "Clean geometric logo for modern brands",
    prompt: "minimalist logo design, geometric shapes, tech startup, clean lines, vector style, flat design, professional, on white background --ar 1:1",
    tool: "Midjourney / DALL-E",
    category: "Marketing",
  },
  {
    id: "marketing-social-ad",
    title: "Social Media Ad",
    description: "Eye-catching promotional graphics",
    prompt: "professional social media advertisement, bold typography, vibrant colors, product showcase, marketing layout, modern design, instagram ad format, clean composition --ar 1:1",
    tool: "Midjourney / DALL-E",
    category: "Marketing",
  },
  {
    id: "marketing-banner",
    title: "Website Banner",
    description: "Hero section banner design",
    prompt: "website hero banner, gradient background, professional typography, call to action button, modern SaaS design, clean layout, 16:9 aspect ratio, corporate style",
    tool: "DALL-E / Midjourney",
    category: "Marketing",
  },
  
  // Event Poster Prompts
  {
    id: "midjourney-poster",
    title: "Event Poster Gradient",
    description: "Vibrant gradient event poster",
    prompt: "event poster design, bold typography, gradient background from purple to pink, modern layout, concert style, high contrast text, professional design --ar 2:3",
    tool: "Midjourney / DALL-E",
    category: "Events",
  },
  {
    id: "event-music-festival",
    title: "Music Festival Poster",
    description: "Dynamic music event artwork",
    prompt: "music festival poster, neon lights, dark background, bold artist names, electric atmosphere, concert vibes, stage lighting effects, vibrant colors --ar 2:3",
    tool: "Midjourney",
    category: "Events",
  },
  {
    id: "event-conference",
    title: "Conference Poster",
    description: "Professional conference design",
    prompt: "tech conference poster, geometric shapes, professional blue color scheme, speaker headshots placeholder, clean modern layout, corporate event style --ar 2:3",
    tool: "DALL-E / Midjourney",
    category: "Events",
  },
  {
    id: "event-workshop",
    title: "Workshop Flyer",
    description: "Educational workshop promotion",
    prompt: "workshop flyer design, minimalist style, educational theme, light background, organized sections, registration info area, professional typography --ar 2:3",
    tool: "DALL-E",
    category: "Events",
  },
  
  // Social Media Prompts
  {
    id: "midjourney-social",
    title: "Social Media Abstract",
    description: "Abstract backgrounds for posts",
    prompt: "abstract background design, flowing shapes, soft gradients, pastel colors, modern aesthetic, instagram style, square format --ar 1:1",
    tool: "Midjourney",
    category: "Social Media",
  },
  {
    id: "social-quote-card",
    title: "Quote Card Background",
    description: "Inspirational quote backdrop",
    prompt: "minimalist quote background, soft gradient, elegant texture, warm tones, inspiring atmosphere, space for text overlay, instagram post format --ar 1:1",
    tool: "DALL-E",
    category: "Social Media",
  },
  {
    id: "social-story-template",
    title: "Story Template BG",
    description: "Instagram story backgrounds",
    prompt: "instagram story background, vertical format, trendy colors, abstract shapes, modern aesthetic, space for text and stickers, mobile friendly --ar 9:16",
    tool: "Midjourney",
    category: "Social Media",
  },
  {
    id: "social-carousel",
    title: "Carousel Slide BG",
    description: "Educational carousel slides",
    prompt: "instagram carousel background, clean minimal design, professional colors, subtle gradient, space for text content, educational style, consistent theme --ar 1:1",
    tool: "DALL-E / Midjourney",
    category: "Social Media",
  },
  
  // Business & Startup Prompts
  {
    id: "dalle-product",
    title: "Product Photography",
    description: "Studio-quality product shots",
    prompt: "professional product photography, soft lighting, gradient background, minimalist style, commercial quality, centered composition, high resolution",
    tool: "DALL-E / Midjourney",
    category: "Business",
  },
  {
    id: "business-pitch-deck",
    title: "Pitch Deck Slide",
    description: "Investor presentation visuals",
    prompt: "pitch deck slide background, professional corporate design, subtle gradient, modern business aesthetic, clean layout space, startup presentation style --ar 16:9",
    tool: "DALL-E",
    category: "Business",
  },
  {
    id: "business-team-banner",
    title: "Team Page Banner",
    description: "About us section visual",
    prompt: "team page banner, abstract professional background, corporate blue tones, modern office aesthetic, space for team photos, company culture vibes --ar 16:9",
    tool: "Midjourney",
    category: "Business",
  },
  {
    id: "business-app-mockup",
    title: "App Store Mockup",
    description: "Mobile app promotional graphics",
    prompt: "app store screenshot mockup, floating phone design, gradient background, app UI showcase, professional marketing visual, clean modern style --ar 2:3",
    tool: "DALL-E / Midjourney",
    category: "Business",
  },
  
  // Thumbnail Prompts
  {
    id: "dalle-thumbnail",
    title: "YouTube Thumbnail BG",
    description: "Attention-grabbing backgrounds",
    prompt: "dynamic background for youtube thumbnail, bold colors, diagonal lines, energetic, eye-catching, 16:9 aspect ratio, professional content creator style",
    tool: "DALL-E / Midjourney",
    category: "Thumbnails",
  },
  {
    id: "thumbnail-tutorial",
    title: "Tutorial Thumbnail",
    description: "Educational content thumbnails",
    prompt: "youtube tutorial thumbnail background, clean professional look, tech aesthetic, subtle code patterns, space for face and text, educational vibes --ar 16:9",
    tool: "Midjourney",
    category: "Thumbnails",
  },
  {
    id: "thumbnail-vlog",
    title: "Vlog Thumbnail",
    description: "Lifestyle vlog backgrounds",
    prompt: "vlog thumbnail background, warm inviting colors, lifestyle aesthetic, blurred lifestyle imagery, space for face overlay, friendly casual vibe --ar 16:9",
    tool: "DALL-E",
    category: "Thumbnails",
  },
  {
    id: "thumbnail-gaming",
    title: "Gaming Thumbnail",
    description: "Gaming content visuals",
    prompt: "gaming youtube thumbnail background, neon colors, dark theme, action lines, explosive effects, high energy gaming aesthetic, esports style --ar 16:9",
    tool: "Midjourney",
    category: "Thumbnails",
  },
];

// Categories for filtering
const categoryFilters: { id: DesignCategory | "all"; label: string }[] = [
  { id: "all", label: "All Templates" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "poster", label: "Posters" },
  { id: "logo", label: "Logos" },
  { id: "certificate", label: "Certificates" },
  { id: "presentation", label: "Presentations" },
];

// Simple fuzzy search function
const fuzzyMatch = (query: string, text: string): boolean => {
  const lowerQuery = query.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  
  if (!lowerQuery) return true;
  if (lowerText.includes(lowerQuery)) return true;
  
  // Typo tolerance - check if most characters match
  const words = lowerQuery.split(" ");
  return words.every(word => {
    if (lowerText.includes(word)) return true;
    // Allow 1 character difference for words > 3 chars
    if (word.length > 3) {
      for (let i = 0; i < lowerText.length - word.length + 1; i++) {
        const substr = lowerText.slice(i, i + word.length);
        let diff = 0;
        for (let j = 0; j < word.length; j++) {
          if (word[j] !== substr[j]) diff++;
        }
        if (diff <= 1) return true;
      }
    }
    return false;
  });
};

export const LibraryTab = ({ onUseTemplate, onLoadDesign, currentCanvasState }: LibraryTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory | "all">("all");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  const handleCopyPrompt = async (promptId: string, promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(promptId);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(t =>
        fuzzyMatch(searchQuery, `${t.name} ${t.category}`)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory]);

  // Get unique prompt categories
  const promptCategories = ["all", ...Array.from(new Set(aiPrompts.map(p => p.category)))];
  const [selectedPromptCategory, setSelectedPromptCategory] = useState("all");

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    let filtered = aiPrompts;
    
    if (selectedPromptCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedPromptCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        fuzzyMatch(searchQuery, `${p.title} ${p.description} ${p.tool} ${p.category}`)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedPromptCategory]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-epic-text">
            Design Library
          </h1>
          <p className="text-muted-foreground">
            Templates, recent work, and AI prompts
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-3 h-12">
              <TabsTrigger value="templates" className="gap-2 h-10">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 h-10">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Recent</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="gap-2 h-10">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Prompts</span>
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </div>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-0">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryFilters.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="h-9"
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">No templates found</p>
                <p className="text-sm text-muted-foreground">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative bg-muted/30 rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all hover:shadow-lg"
                  >
                    {/* Template Preview */}
                    <div
                      className="aspect-square flex items-center justify-center p-4"
                      style={{
                        backgroundColor: template.elements[0]?.backgroundColor || "#1a1a2e",
                      }}
                    >
                      <span className="text-white/90 text-sm font-medium text-center line-clamp-2">
                        {template.name}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={() => onUseTemplate(template)}
                        className="min-h-[44px]"
                      >
                        Use Template
                      </Button>
                    </div>

                    {/* Template Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{template.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{template.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0">
            <div className="max-w-3xl mx-auto">
              <HistoryPanel
                onLoadDesign={onLoadDesign || (() => {})}
                currentState={currentCanvasState}
              />
            </div>
          </TabsContent>

          {/* AI Prompts Tab */}
          <TabsContent value="prompts" className="mt-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">
                Prompts for External AI Tools
              </h2>
              <p className="text-sm text-muted-foreground">
                Use with Midjourney, DALL-E, and other AI image generators
              </p>
            </div>

            {/* Category Filter for Prompts */}
            <div className="flex flex-wrap gap-2 mb-6">
              {promptCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedPromptCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPromptCategory(cat)}
                  className="h-9 capitalize"
                >
                  {cat === "all" ? "All Prompts" : cat}
                </Button>
              ))}
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No prompts match your search</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="bg-muted/30 rounded-xl p-4 border border-border/30 hover:border-border/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium">{prompt.title}</h3>
                        <p className="text-xs text-muted-foreground">{prompt.description}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full whitespace-nowrap">
                        {prompt.tool}
                      </span>
                    </div>

                    <div className="bg-background/50 rounded-lg p-3 mt-3 text-xs text-muted-foreground font-mono break-words">
                      {prompt.prompt}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 gap-2 min-h-[44px]"
                      onClick={() => handleCopyPrompt(prompt.id, prompt.prompt)}
                    >
                      {copiedPrompt === prompt.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
              <ExternalLink className="h-3 w-3" />
              These prompts are designed for external AI tools, not EPIC's internal AI
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
