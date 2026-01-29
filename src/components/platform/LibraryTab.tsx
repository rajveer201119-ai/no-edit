import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { templates, getTemplatesByCategory } from "./templates";
import type { DesignCategory } from "./DesignTypeModal";
import type { Template } from "./templates";

interface LibraryTabProps {
  onUseTemplate: (template: Template) => void;
}

// Prompt vault for external AI tools
const aiPrompts = [
  {
    id: "midjourney-logo",
    title: "Minimalist Tech Logo",
    description: "Clean geometric logo for modern brands",
    prompt: "minimalist logo design, geometric shapes, tech startup, clean lines, vector style, flat design, professional, on white background --ar 1:1",
    tool: "Midjourney / DALL·E",
  },
  {
    id: "midjourney-poster",
    title: "Event Poster Gradient",
    description: "Vibrant gradient event poster",
    prompt: "event poster design, bold typography, gradient background from purple to pink, modern layout, concert style, high contrast text, professional design --ar 2:3",
    tool: "Midjourney / DALL·E",
  },
  {
    id: "dalle-product",
    title: "Product Photography",
    description: "Studio-quality product shots",
    prompt: "professional product photography, soft lighting, gradient background, minimalist style, commercial quality, centered composition, high resolution",
    tool: "DALL·E / Midjourney",
  },
  {
    id: "midjourney-social",
    title: "Social Media Abstract",
    description: "Abstract backgrounds for posts",
    prompt: "abstract background design, flowing shapes, soft gradients, pastel colors, modern aesthetic, instagram style, square format --ar 1:1",
    tool: "Midjourney",
  },
  {
    id: "dalle-thumbnail",
    title: "YouTube Thumbnail BG",
    description: "Attention-grabbing backgrounds",
    prompt: "dynamic background for youtube thumbnail, bold colors, diagonal lines, energetic, eye-catching, 16:9 aspect ratio, professional content creator style",
    tool: "DALL·E / Midjourney",
  },
];

const libraryCategories = [
  { id: "trending", label: "Trending Designs" },
  { id: "startup", label: "Startup Pack" },
  { id: "ads", label: "High-Converting Ads" },
  { id: "premium", label: "Premium Styles" },
  { id: "minimal", label: "Minimal Collection" },
];

export const LibraryTab = ({ onUseTemplate }: LibraryTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

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

  // Group templates by category for display
  const templatesByCategory: Record<string, Template[]> = {
    trending: templates.slice(0, 3),
    startup: templates.filter((t) => t.category === "poster"),
    ads: templates.filter((t) => t.category === "instagram"),
    premium: templates.filter((t) => t.category === "youtube"),
    minimal: templates.filter((t) => t.category === "logo"),
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-epic-text">
            Template Library
          </h1>
          <p className="text-muted-foreground">
            Professional templates ready to customize
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Template Categories */}
        {libraryCategories.map((category) => {
          const categoryTemplates = templatesByCategory[category.id] || [];
          if (categoryTemplates.length === 0) return null;

          return (
            <section key={category.id} className="mb-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {category.label}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative bg-muted/30 rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all"
                  >
                    {/* Template Preview - Simple color representation */}
                    <div
                      className="aspect-square flex items-center justify-center"
                      style={{
                        backgroundColor:
                          template.elements[0]?.backgroundColor || "#1a1a2e",
                      }}
                    >
                      <span className="text-white/80 text-sm font-medium text-center px-4">
                        {template.name}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={() => onUseTemplate(template)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Use Template
                      </Button>
                    </div>

                    {/* Template Name */}
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{template.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {template.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* AI Prompt Vault */}
        <section className="mt-16 pt-8 border-t border-border/30">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">
              Prompts for External AI Tools
            </h2>
            <p className="text-sm text-muted-foreground">
              Use with Midjourney, DALL·E, and other AI image generators
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-muted/30 rounded-xl p-4 border border-border/30"
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

                <div className="bg-background/50 rounded-lg p-3 mt-3 text-xs text-muted-foreground font-mono">
                  {prompt.prompt}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 gap-2"
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

          <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
            <ExternalLink className="h-3 w-3" />
            These prompts are designed for external AI tools, not EPIC's internal AI
          </p>
        </section>
      </div>
    </div>
  );
};
