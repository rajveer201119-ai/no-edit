import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, TrendingUp, Star, Beaker, Eye, Shuffle } from "lucide-react";
import { toast } from "sonner";

export type PromptStatus = "proven" | "trending" | "experimental";

export interface CommunityPrompt {
  id: string;
  prompt: string;
  title: string;
  description?: string;
  category: string;
  status: PromptStatus;
  remixCount: number;
  reuseCount: number;
  thumbnailUrl?: string;
  createdAt: string;
}

// Storage key for tracking usage
const PROMPT_USAGE_KEY = "epic_prompt_usage";

interface PromptUsage {
  promptId: string;
  remixCount: number;
  reuseCount: number;
  lastUsed: string;
}

// Get usage data from localStorage
const getPromptUsage = (): Record<string, PromptUsage> => {
  try {
    const saved = localStorage.getItem(PROMPT_USAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Update usage data
const updatePromptUsage = (promptId: string, action: "remix" | "reuse") => {
  const usage = getPromptUsage();
  const current = usage[promptId] || { promptId, remixCount: 0, reuseCount: 0, lastUsed: "" };
  
  if (action === "remix") {
    current.remixCount++;
  } else {
    current.reuseCount++;
  }
  current.lastUsed = new Date().toISOString();
  
  usage[promptId] = current;
  localStorage.setItem(PROMPT_USAGE_KEY, JSON.stringify(usage));
  
  return current;
};

// Calculate prompt status based on usage
const calculateStatus = (remixCount: number, reuseCount: number): PromptStatus => {
  const totalUsage = remixCount + reuseCount;
  
  if (totalUsage >= 20 && remixCount >= 5) return "proven";
  if (totalUsage >= 5) return "trending";
  return "experimental";
};

// Status badge component
interface StatusBadgeProps {
  status: PromptStatus;
  className?: string;
}

export const PromptStatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig: Record<PromptStatus, { label: string; icon: React.ElementType; classes: string }> = {
    proven: {
      label: "Proven",
      icon: Star,
      classes: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    trending: {
      label: "Trending",
      icon: TrendingUp,
      classes: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    experimental: {
      label: "Experimental",
      icon: Beaker,
      classes: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("text-xs gap-1", config.classes, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Single prompt card
interface PromptCardProps {
  prompt: CommunityPrompt;
  onCopy: (prompt: CommunityPrompt) => void;
  onRemix: (prompt: CommunityPrompt) => void;
  onViewPrompt?: (prompt: CommunityPrompt) => void;
  compact?: boolean;
}

export const CommunityPromptCard = ({
  prompt,
  onCopy,
  onRemix,
  onViewPrompt,
  compact = false,
}: PromptCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      updatePromptUsage(prompt.id, "reuse");
      toast.success("Prompt copied!");
      setTimeout(() => setCopied(false), 2000);
      onCopy(prompt);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium truncate">{prompt.title}</span>
            <PromptStatusBadge status={prompt.status} />
          </div>
          <p className="text-xs text-muted-foreground truncate">{prompt.prompt}</p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all overflow-hidden">
      {/* Thumbnail */}
      {prompt.thumbnailUrl && (
        <div className="aspect-video bg-muted/30 overflow-hidden">
          <img
            src={prompt.thumbnailUrl}
            alt={prompt.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{prompt.title}</h3>
            {prompt.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{prompt.description}</p>
            )}
          </div>
          <PromptStatusBadge status={prompt.status} />
        </div>

        {/* Prompt preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">{prompt.prompt}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shuffle className="h-3 w-3" />
            {prompt.remixCount} remixes
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {prompt.reuseCount} uses
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => {
              updatePromptUsage(prompt.id, "remix");
              onRemix(prompt);
            }}
          >
            <Shuffle className="h-3.5 w-3.5" />
            Remix
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook to manage community prompts with local tracking
export const useCommunityPrompts = () => {
  // This would normally fetch from a backend
  // For now, we'll use local tracking to simulate community data
  
  const trackUsage = (promptId: string, action: "remix" | "reuse") => {
    const updated = updatePromptUsage(promptId, action);
    return calculateStatus(updated.remixCount, updated.reuseCount);
  };

  const getEnhancedPrompts = (basePrompts: Omit<CommunityPrompt, "status" | "remixCount" | "reuseCount">[]): CommunityPrompt[] => {
    const usage = getPromptUsage();
    
    return basePrompts.map((prompt) => {
      const usageData = usage[prompt.id] || { remixCount: 0, reuseCount: 0 };
      
      // Add some base usage for demo purposes
      const baseRemix = Math.floor(Math.random() * 15) + 1;
      const baseReuse = Math.floor(Math.random() * 30) + 5;
      
      const totalRemix = usageData.remixCount + baseRemix;
      const totalReuse = usageData.reuseCount + baseReuse;
      
      return {
        ...prompt,
        remixCount: totalRemix,
        reuseCount: totalReuse,
        status: calculateStatus(totalRemix, totalReuse),
      };
    });
  };

  return {
    trackUsage,
    getEnhancedPrompts,
  };
};
