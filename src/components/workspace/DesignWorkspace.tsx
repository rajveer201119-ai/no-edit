import { useState, useCallback } from "react";
import { ChatPanel } from "./ChatPanel";
import { PreviewCanvas } from "./PreviewCanvas";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DesignWorkspaceProps {
  onGenerate: (prompt: string, command?: string) => void;
  isGenerating: boolean;
  generatedImage: string | null;
  remainingPrompts: number | null;
  isPremium: boolean;
  onUpgrade: () => void;
  projectId?: string;
  projectName?: string;
  onImageUpdate?: (newUrl: string) => void;
}

export function DesignWorkspace({
  onGenerate,
  isGenerating,
  generatedImage,
  remainingPrompts,
  isPremium,
  onUpgrade,
  projectId,
  projectName,
  onImageUpdate
}: DesignWorkspaceProps) {
  // Mobile view state: "chat" or "preview"
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Handle generation and auto-switch to preview on mobile
  const handleGenerate = useCallback((prompt: string, command?: string) => {
    onGenerate(prompt, command);
    // Auto-switch to preview when generating starts on mobile
    setMobileView("preview");
  }, [onGenerate]);

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Navigation */}
      <div className="flex-shrink-0 md:hidden border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-between p-3">
          <h1 className="font-semibold text-sm gradient-epic-text">EPIC Studio</h1>
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
            <Button
              variant={mobileView === "chat" ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setMobileView("chat")}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Chat
            </Button>
            <Button
              variant={mobileView === "preview" ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setMobileView("preview")}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Layout: Side by Side */}
        <div className="hidden md:flex w-full">
          {/* Chat Panel - Left Side */}
          <div className="w-[400px] lg:w-[450px] xl:w-[500px] flex-shrink-0 border-r border-border/50">
            <ChatPanel
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              generatedImage={generatedImage}
              remainingPrompts={remainingPrompts}
              isPremium={isPremium}
            />
          </div>

          {/* Preview Canvas - Right Side */}
          <div className="flex-1 min-w-0">
            <PreviewCanvas
              imageUrl={generatedImage}
              isGenerating={isGenerating}
              onUpgrade={onUpgrade}
              projectId={projectId}
              projectName={projectName}
              onImageUpdate={onImageUpdate}
            />
          </div>
        </div>

        {/* Mobile Layout: Single View with Toggle */}
        <div className="md:hidden w-full h-full">
          <AnimatePresence mode="wait">
            {mobileView === "chat" ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ChatPanel
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  generatedImage={generatedImage}
                  remainingPrompts={remainingPrompts}
                  isPremium={isPremium}
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <PreviewCanvas
                  imageUrl={generatedImage}
                  isGenerating={isGenerating}
                  onUpgrade={onUpgrade}
                  projectId={projectId}
                  projectName={projectName}
                  onImageUpdate={onImageUpdate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
