import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Palette, 
  Replace,
  Wand2,
  X
} from "lucide-react";

interface InpaintingPanelProps {
  maskDataUrl: string | null;
  onInpaint: (prompt: string, maskDataUrl: string) => void;
  onClearMask: () => void;
  onClose: () => void;
  isProcessing: boolean;
}

const QUICK_PROMPTS = [
  { label: "Remove object", prompt: "Remove the object completely, fill with natural background", icon: Trash2 },
  { label: "Replace with...", prompt: "Replace this area with ", icon: Replace },
  { label: "Change style", prompt: "Transform this area to ", icon: Palette },
  { label: "Enhance details", prompt: "Enhance and improve the details in this area, make it sharper and more refined", icon: Sparkles },
];

export const InpaintingPanel = ({
  maskDataUrl,
  onInpaint,
  onClearMask,
  onClose,
  isProcessing,
}: InpaintingPanelProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !maskDataUrl) return;
    onInpaint(prompt.trim(), maskDataUrl);
    setPrompt("");
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    if (!maskDataUrl) return;
    
    // If prompt ends with space, open for user input
    if (quickPrompt.endsWith(" ")) {
      setPrompt(quickPrompt);
      return;
    }
    
    onInpaint(quickPrompt, maskDataUrl);
  };

  return (
    <div className="w-72 border-l border-border/10 bg-background/40 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/10">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Inpainting</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Mask preview */}
          {maskDataUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Mask Preview</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-destructive hover:text-destructive"
                  onClick={onClearMask}
                >
                  Clear mask
                </Button>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-border/30 bg-muted/20">
                <img
                  src={maskDataUrl}
                  alt="Mask preview"
                  className="w-full h-auto max-h-32 object-contain"
                />
              </div>
            </div>
          )}

          {/* No mask state */}
          {!maskDataUrl && (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Draw a mask on the image to select the area you want to edit
              </p>
            </div>
          )}

          {/* Quick prompts */}
          {maskDataUrl && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Quick Actions</span>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((qp) => (
                  <Button
                    key={qp.label}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-3 flex flex-col items-center gap-1 text-xs"
                    onClick={() => handleQuickPrompt(qp.prompt)}
                    disabled={isProcessing}
                  >
                    <qp.icon className="h-4 w-4" />
                    {qp.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Custom prompt */}
          {maskDataUrl && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Custom Edit</span>
              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what to put here..."
                  className="text-sm"
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={!prompt.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Apply Edit
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Tips */}
          <div className="space-y-2 pt-2 border-t border-border/10">
            <span className="text-xs text-muted-foreground">Tips</span>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Be specific about what you want
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Mention lighting and style to match
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use "remove" for object removal
              </li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
