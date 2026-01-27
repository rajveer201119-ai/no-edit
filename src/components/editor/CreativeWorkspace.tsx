import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { useManualEditing } from "./useManualEditing";
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
  // Image container ref for manual editing
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Version history
  const [versions, setVersions] = useState<ImageVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>("");
  const [isLoadingVersions, setIsLoadingVersions] = useState(true);
  
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
  const [guestEditUsed, setGuestEditUsed] = useState(() => {
    return localStorage.getItem('guestEditUsed') === 'true';
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const currentVersion = versions.find((v) => v.id === currentVersionId) || versions[0];

  // Load versions from database
  const loadVersions = useCallback(async () => {
    setIsLoadingVersions(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For guests, create a local-only version
      if (!user) {
        const initialVersion: ImageVersion = {
          id: crypto.randomUUID(),
          imageUrl: imageUrl,
          prompt: "Original",
          timestamp: new Date(),
        };
        setVersions([initialVersion]);
        setCurrentVersionId(initialVersion.id);
        setIsLoadingVersions(false);
        return;
      }
      
      setCurrentUserId(user.id);
      
      // Fetch existing versions from database
      const { data: savedVersions, error } = await supabase
        .from("project_versions")
        .select("*")
        .eq("project_id", projectId)
        .order("version_number", { ascending: true });
      
      if (error) {
        console.error("Failed to load versions:", error);
      }
      
      if (savedVersions && savedVersions.length > 0) {
        // Use saved versions
        const loadedVersions: ImageVersion[] = savedVersions.map((v: any) => ({
          id: v.id,
          imageUrl: v.image_url,
          prompt: v.prompt,
          timestamp: new Date(v.created_at),
        }));
        setVersions(loadedVersions);
        setCurrentVersionId(loadedVersions[loadedVersions.length - 1].id);
      } else {
        // Create initial version with proper UUID
        const initialVersion: ImageVersion = {
          id: crypto.randomUUID(),
          imageUrl: imageUrl,
          prompt: "Original",
          timestamp: new Date(),
        };
        setVersions([initialVersion]);
        setCurrentVersionId(initialVersion.id);
        
        // Save initial version to database
        await supabase.from("project_versions").insert({
          id: initialVersion.id,
          project_id: projectId,
          user_id: user.id,
          image_url: imageUrl,
          prompt: "Original",
          version_number: 1,
        });
      }
    } catch (error) {
      console.error("Error loading versions:", error);
      // Fallback to initial version
      const initialVersion: ImageVersion = {
        id: crypto.randomUUID(),
        imageUrl: imageUrl,
        prompt: "Original",
        timestamp: new Date(),
      };
      setVersions([initialVersion]);
      setCurrentVersionId(initialVersion.id);
    } finally {
      setIsLoadingVersions(false);
    }
  }, [projectId, imageUrl]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  // Save new version to database
  const saveVersion = useCallback(async (version: ImageVersion, versionNumber: number) => {
    if (!currentUserId) return;
    
    try {
      await supabase.from("project_versions").insert({
        id: version.id,
        project_id: projectId,
        user_id: currentUserId,
        image_url: version.imageUrl,
        prompt: version.prompt,
        version_number: versionNumber,
      });
    } catch (error) {
      console.error("Failed to save version:", error);
    }
  }, [projectId, currentUserId]);

  // Manual editing hook
  const manualEditing = useManualEditing({
    imageContainerRef,
    currentImageUrl: currentVersion?.imageUrl || imageUrl,
    onImageUpdate: async (newImageUrl: string) => {
      // Create a new version from manual edits
      const newVersionNumber = versions.length + 1;
      const newVersion: ImageVersion = {
        id: crypto.randomUUID(),
        imageUrl: newImageUrl,
        prompt: "Manual edit",
        timestamp: new Date(),
      };
      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      onImageUpdate(newImageUrl);
      
      // Auto-save to database
      await saveVersion(newVersion, newVersionNumber);
    },
  });

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
    const { data: { user } } = await supabase.auth.getUser();
    const isGuest = !user;

    // Check if guest has already used their free edit
    if (isGuest && guestEditUsed) {
      toast.error("Sign up to edit more! You've used your free trial edit.");
      setShowUpgradeDialog(true);
      return;
    }

    // For authenticated users, check credits
    if (user) {
      const { data: limitData } = await supabase.rpc("check_edit_limit", {
        user_id_param: user.id,
      });

      if (!limitData?.[0]?.can_edit) {
        setShowUpgradeDialog(true);
        return;
      }
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
          userId: user?.id,
          isGuest,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image returned");

      // Create new version
      const newVersionNumber = versions.length + 1;
      const newVersion: ImageVersion = {
        id: crypto.randomUUID(),
        imageUrl: data.imageUrl,
        prompt: prompt,
        timestamp: new Date(),
      };

      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      onImageUpdate(data.imageUrl);
      
      // Auto-save to database
      if (user) {
        await saveVersion(newVersion, newVersionNumber);
      }

      // Add success message
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✨ Done! Created version ${newVersionNumber}. Automatically saved! Want any more changes?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      // Track guest usage or refresh credits for authenticated users
      if (isGuest) {
        localStorage.setItem('guestEditUsed', 'true');
        setGuestEditUsed(true);
      } else if (user) {
        fetchCredits();
      }
      
      toast.success("Version saved automatically!");
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

  // Handle inpainting edit (with mask)
  const handleInpaintEdit = async (prompt: string, maskDataUrl: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const isGuest = !user;

    // Check if guest has already used their free edit
    if (isGuest && guestEditUsed) {
      toast.error("Sign up to edit more! You've used your free trial edit.");
      setShowUpgradeDialog(true);
      return;
    }

    // For authenticated users, check credits
    if (user) {
      const { data: limitData } = await supabase.rpc("check_edit_limit", {
        user_id_param: user.id,
      });

      if (!limitData?.[0]?.can_edit) {
        setShowUpgradeDialog(true);
        return;
      }
    }

    // Add user message for inpainting
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `[Inpainting] ${prompt}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("edit-image", {
        body: {
          imageUrl: currentVersion.imageUrl,
          prompt: prompt,
          maskDataUrl: maskDataUrl,
          projectId,
          userId: user?.id,
          isGuest,
          isInpainting: true,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image returned");

      // Create new version
      const newVersionNumber = versions.length + 1;
      const newVersion: ImageVersion = {
        id: crypto.randomUUID(),
        imageUrl: data.imageUrl,
        prompt: `[Inpaint] ${prompt}`,
        timestamp: new Date(),
      };

      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      onImageUpdate(data.imageUrl);
      
      // Auto-save to database
      if (user) {
        await saveVersion(newVersion, newVersionNumber);
      }

      // Add success message
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✨ Inpainting complete! Created version ${newVersionNumber}. The masked area has been edited.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      // Track guest usage or refresh credits for authenticated users
      if (isGuest) {
        localStorage.setItem('guestEditUsed', 'true');
        setGuestEditUsed(true);
      } else if (user) {
        fetchCredits();
      }
      
      toast.success("Inpainting complete!");
    } catch (error: any) {
      console.error("Inpainting error:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, inpainting failed: ${error?.message || "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      toast.error(error?.message || "Failed to apply inpainting");
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

  // Show loading state while versions are loading
  if (isLoadingVersions || !currentVersion) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-border/20 bg-background/80 backdrop-blur-xl">
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
      <div className="flex flex-1 min-h-0 overflow-hidden">
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
            // Manual editing props
            isCropping={manualEditing.isCropping}
            cropArea={manualEditing.cropArea}
            overlays={manualEditing.overlays}
            textOverlays={manualEditing.textOverlays}
            activeOverlayId={manualEditing.activeOverlayId}
            activeTextId={manualEditing.activeTextId}
            showTextTool={manualEditing.showTextTool}
            selectedText={manualEditing.selectedText}
            onCropToggle={manualEditing.startCropping}
            onCancelCrop={manualEditing.cancelCrop}
            onApplyCrop={manualEditing.applyCrop}
            onCropPointerDown={manualEditing.handleCropPointerDown}
            onCropPointerMove={manualEditing.handleCropPointerMove}
            onCropPointerUp={manualEditing.handleCropPointerUp}
            onFileUpload={manualEditing.handleFileUpload}
            onTextToolToggle={() => manualEditing.setShowTextTool(!manualEditing.showTextTool)}
            onOverlayPointerDown={manualEditing.handleOverlayPointerDown}
            onResizeOverlay={manualEditing.resizeOverlay}
            onRemoveOverlay={manualEditing.removeOverlay}
            onTextPointerDown={manualEditing.handleTextPointerDown}
            onResizeText={manualEditing.resizeText}
            onRemoveText={manualEditing.removeTextOverlay}
            onAddText={manualEditing.handleAddTextOverlay}
            onUpdateText={manualEditing.handleUpdateTextOverlay}
            imageContainerRef={imageContainerRef}
            onInpaintEdit={handleInpaintEdit}
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
