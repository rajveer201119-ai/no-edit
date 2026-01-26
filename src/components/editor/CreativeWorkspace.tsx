import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { 
  ImageVersion, 
  ChatMessage, 
  ActionButton, 
  ACTION_BUTTONS 
} from "./types";
import { X, MessageSquare, Image as ImageIcon } from "lucide-react";

interface CreativeWorkspaceProps {
  projectId: string;
  projectName: string;
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  onClose: () => void;
}

export const CreativeWorkspace = ({
  projectId,
  projectName,
  imageUrl,
  onImageUpdate,
  onClose,
}: CreativeWorkspaceProps) => {
  // Version history
  const [versions, setVersions] = useState<ImageVersion[]>([
    {
      id: "v1-" + Date.now(),
      imageUrl: imageUrl,
      prompt: "Original",
      timestamp: new Date(),
    },
  ]);
  const [currentVersionId, setCurrentVersionId] = useState(versions[0].id);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to the creative workspace! I'm here to help transform "${projectName}". Use the quick actions or describe what you'd like to change.`,
      timestamp: new Date(),
    },
  ]);
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("preview");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  // User state
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const currentVersion = versions.find((v) => v.id === currentVersionId) || versions[0];

  // Fetch credits
  const fetchCredits = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.rpc("check_edit_limit", {
          user_id_param: user.id,
        });
        if (data?.[0]) {
          setRemainingCredits(data[0].remaining_edits);
          setIsPremium(data[0].is_premium);
        }
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Handle AI edit
  const handleAIEdit = async (prompt: string) => {
    // Check credits first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to edit images");
      return;
    }

    const { data: limitData } = await supabase.rpc("check_edit_limit", {
      user_id_param: user.id,
    });

    if (!limitData?.[0]?.can_edit) {
      setShowUpgradeDialog(true);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("edit-image", {
        body: {
          imageUrl: currentVersion.imageUrl,
          prompt: prompt,
          projectId,
          userId: user.id,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image returned");

      // Create new version
      const newVersion: ImageVersion = {
        id: `v${versions.length + 1}-${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: prompt,
        timestamp: new Date(),
      };

      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      onImageUpdate(data.imageUrl);

      // Add success message
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✨ Done! Created version ${versions.length + 1}. Want any more changes?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      // Increment usage and refresh credits
      await supabase.rpc("increment_edit_usage", { user_id_param: user.id });
      fetchCredits();
      
      toast.success("New version created!");
    } catch (error: any) {
      console.error("AI edit error:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I couldn't apply that edit: ${error?.message || "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      toast.error(error?.message || "Failed to edit image");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle quick action
  const handleAction = (action: ActionButton) => {
    if (action.isPremium && !isPremium) {
      setShowUpgradeDialog(true);
      return;
    }
    handleAIEdit(action.prompt);
  };

  // Handle version selection
  const handleSelectVersion = (version: ImageVersion) => {
    setCurrentVersionId(version.id);
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Switched to version ${versions.indexOf(version) + 1}. This was created with: "${version.prompt}"`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  // Handle download
  const handleDownload = async () => {
    if (!isPremium) {
      setShowUpgradeDialog(true);
      return;
    }

    try {
      toast.loading("Preparing download...", { id: "download" });
      const response = await fetch(currentVersion.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName.replace(/\s+/g, "-")}-v${versions.indexOf(currentVersion) + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Downloaded!");
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      toast.dismiss("download");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border/20 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Window controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          <div className="h-4 w-px bg-border/30" />
          
          <h1 className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {projectName}
          </h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="md:hidden flex border-b border-border/20 bg-background/80">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
            activeTab === "chat"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
          {isProcessing && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
            activeTab === "preview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          <ImageIcon className="h-4 w-4" />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-48px)] md:h-[calc(100vh-48px)]">
        {/* Chat Panel */}
        <div
          className={cn(
            "w-full md:w-96 lg:w-[420px] flex-shrink-0 border-r border-border/10",
            activeTab === "chat" ? "flex" : "hidden md:flex"
          )}
        >
          <ChatPanel
            messages={messages}
            isLoading={isProcessing}
            isPremium={isPremium}
            remainingCredits={remainingCredits}
            onSendMessage={handleAIEdit}
            onAction={handleAction}
            onUpgradeClick={() => setShowUpgradeDialog(true)}
          />
        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            "flex-1 min-w-0",
            activeTab === "preview" ? "flex" : "hidden md:flex"
          )}
        >
          <PreviewPanel
            versions={versions}
            currentVersion={currentVersion}
            isPremium={isPremium}
            isProcessing={isProcessing}
            onSelectVersion={handleSelectVersion}
            onDownload={handleDownload}
            onUpgradeClick={() => setShowUpgradeDialog(true)}
          />
        </div>
      </div>

      {/* Upgrade Dialog */}
      <ProPlanDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
      />
    </div>
  );
};
