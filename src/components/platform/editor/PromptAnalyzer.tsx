import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PromptWarning {
  id: string;
  type: "warning" | "info";
  message: string;
  suggestion: string;
}

type PromptDifficulty = "beginner" | "intermediate" | "expert";

interface PromptAnalysis {
  difficulty: PromptDifficulty;
  warnings: PromptWarning[];
  wordCount: number;
  hasColorSpec: boolean;
  hasLayoutSpec: boolean;
  hasStyleModifiers: boolean;
}

// Analyze a prompt for potential issues and difficulty
const analyzePrompt = (prompt: string): PromptAnalysis => {
  const text = prompt.toLowerCase().trim();
  const words = text.split(/\s+/).filter(Boolean);
  const warnings: PromptWarning[] = [];

  // Check for vague prompts
  if (words.length < 5) {
    warnings.push({
      id: "short-prompt",
      type: "warning",
      message: "Prompt is very short",
      suggestion: "Add more details for better results (colors, style, layout)",
    });
  }

  // Check for conflicting terms
  const conflictPairs = [
    ["minimalist", "complex"],
    ["dark", "bright"],
    ["modern", "vintage"],
    ["simple", "detailed"],
  ];

  conflictPairs.forEach(([a, b]) => {
    if (text.includes(a) && text.includes(b)) {
      warnings.push({
        id: `conflict-${a}-${b}`,
        type: "warning",
        message: `Conflicting terms: "${a}" and "${b}"`,
        suggestion: "Choose one style direction for clearer output",
      });
    }
  });

  // Check for low contrast risk
  const lowContrastPhrases = [
    "light text on light",
    "white on white",
    "gray on gray",
    "subtle text",
    "light gray text",
  ];
  if (lowContrastPhrases.some((phrase) => text.includes(phrase))) {
    warnings.push({
      id: "low-contrast",
      type: "warning",
      message: "Low contrast risk detected",
      suggestion: "Ensure text has enough contrast for readability",
    });
  }

  // Check for overcrowded layout
  const crowdedIndicators = [
    "lots of text",
    "many elements",
    "packed",
    "filled with",
    "everything",
    "all the information",
  ];
  if (crowdedIndicators.some((phrase) => text.includes(phrase))) {
    warnings.push({
      id: "overcrowded",
      type: "warning",
      message: "Layout might be overcrowded",
      suggestion: "Consider simplifying or using hierarchy to organize content",
    });
  }

  // Detect specifications
  const colorKeywords = [
    "color", "colours", "red", "blue", "green", "purple", "orange", "yellow",
    "pink", "black", "white", "gradient", "palette", "hue", "shade", "tint",
    "#", "rgb", "hex",
  ];
  const hasColorSpec = colorKeywords.some((k) => text.includes(k));

  const layoutKeywords = [
    "layout", "grid", "columns", "rows", "centered", "left-aligned", "right",
    "header", "footer", "sidebar", "margin", "padding", "space", "spacing",
    "position", "top", "bottom", "horizontal", "vertical",
  ];
  const hasLayoutSpec = layoutKeywords.some((k) => text.includes(k));

  const styleModifiers = [
    "minimal", "bold", "elegant", "modern", "vintage", "retro", "futuristic",
    "clean", "professional", "playful", "corporate", "creative", "artistic",
    "geometric", "organic", "flat", "3d", "gradient", "shadow", "neon",
  ];
  const hasStyleModifiers = styleModifiers.some((k) => text.includes(k));

  // Calculate difficulty
  let difficultyScore = 0;
  
  // Word count factor
  if (words.length > 30) difficultyScore += 2;
  else if (words.length > 15) difficultyScore += 1;

  // Specificity factors
  if (hasColorSpec) difficultyScore += 1;
  if (hasLayoutSpec) difficultyScore += 1;
  if (hasStyleModifiers) difficultyScore += 1;

  // Constraint count
  const constraintWords = ["must", "should", "exactly", "precise", "specific", "only"];
  const constraintCount = constraintWords.filter((w) => text.includes(w)).length;
  difficultyScore += constraintCount;

  let difficulty: PromptDifficulty;
  if (difficultyScore >= 5) difficulty = "expert";
  else if (difficultyScore >= 2) difficulty = "intermediate";
  else difficulty = "beginner";

  return {
    difficulty,
    warnings,
    wordCount: words.length,
    hasColorSpec,
    hasLayoutSpec,
    hasStyleModifiers,
  };
};

interface PromptAnalyzerProps {
  prompt: string;
  showWarnings?: boolean;
  showDifficulty?: boolean;
  compact?: boolean;
  className?: string;
}

export const PromptAnalyzer = ({
  prompt,
  showWarnings = true,
  showDifficulty = true,
  compact = false,
  className,
}: PromptAnalyzerProps) => {
  const analysis = useMemo(() => analyzePrompt(prompt), [prompt]);

  if (!prompt.trim()) return null;

  const difficultyColors: Record<PromptDifficulty, string> = {
    beginner: "bg-green-500/10 text-green-600 border-green-500/20",
    intermediate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    expert: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  const difficultyIcons: Record<PromptDifficulty, React.ReactNode> = {
    beginner: <CheckCircle className="h-3 w-3" />,
    intermediate: <Zap className="h-3 w-3" />,
    expert: <Zap className="h-3 w-3" />,
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showDifficulty && (
          <Badge variant="outline" className={cn("text-xs capitalize", difficultyColors[analysis.difficulty])}>
            {difficultyIcons[analysis.difficulty]}
            <span className="ml-1">{analysis.difficulty}</span>
          </Badge>
        )}
        
        {showWarnings && analysis.warnings.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {analysis.warnings.length} warning{analysis.warnings.length > 1 ? "s" : ""}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <ul className="text-sm space-y-1">
                  {analysis.warnings.map((w) => (
                    <li key={w.id}>{w.message}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Difficulty Badge */}
      {showDifficulty && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("capitalize", difficultyColors[analysis.difficulty])}>
            {difficultyIcons[analysis.difficulty]}
            <span className="ml-1">{analysis.difficulty} Prompt</span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            {analysis.wordCount} words
          </span>
        </div>
      )}

      {/* Warnings */}
      {showWarnings && analysis.warnings.length > 0 && (
        <div className="space-y-1">
          {analysis.warnings.map((warning) => (
            <div
              key={warning.id}
              className={cn(
                "flex items-start gap-2 p-2 rounded-md text-sm",
                warning.type === "warning"
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
              )}
            >
              {warning.type === "warning" ? (
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{warning.message}</p>
                <p className="text-xs opacity-80">{warning.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specs detected */}
      {(analysis.hasColorSpec || analysis.hasLayoutSpec || analysis.hasStyleModifiers) && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.hasColorSpec && (
            <Badge variant="outline" className="text-xs bg-primary/5">Colors specified</Badge>
          )}
          {analysis.hasLayoutSpec && (
            <Badge variant="outline" className="text-xs bg-primary/5">Layout specified</Badge>
          )}
          {analysis.hasStyleModifiers && (
            <Badge variant="outline" className="text-xs bg-primary/5">Style specified</Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Export analysis function for external use
export { analyzePrompt };
export type { PromptAnalysis, PromptWarning, PromptDifficulty };
