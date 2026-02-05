import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SEO, homePageSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { CreatorModePaywall } from "@/components/CreatorModePaywall";
import { UsageCounter } from "@/components/UsageCounter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Shield, Download, Crown } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  MainNavigation,
  MainTab,
  DesignTypeModal,
  DesignCategory,
  WorkspaceToolbar,
  ToolType,
  WorkspaceTopBar,
  QuickStartStrip,
  CanvasWorkspace,
  LibraryTab,
  InspireTab,
  NewHomepage,
  ExportDialog,
  LandingCredibility,
  Template,
  getRandomTemplate,
 AIModeModal,
} from "@/components/platform";

import { useExportCanvas } from "@/components/platform/editor/useExportCanvas";
import { Layer, CanvasState } from "@/components/platform/editor/types";

const Index = () => {
  const navigate = useNavigate();
  const { isInstallable, promptInstall } = useInstallPrompt();
  const isMobile = useIsMobile();

  // Auth state
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [showHomepage, setShowHomepage] = useState(true);

  // Create workspace state
  const [showDesignTypeModal, setShowDesignTypeModal] = useState(false);
  const [activeDesignCategory, setActiveDesignCategory] = useState<DesignCategory | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [importedImageUrl, setImportedImageUrl] = useState<string | null>(null);

  // Canvas state from workspace
  const [canvasLayers, setCanvasLayers] = useState<Layer[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Export state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"export" | "limit" | "premium-feature" | "hd-export">("limit");
   const [showAIModeModal, setShowAIModeModal] = useState(false);

  // Workspace meta
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  
  // Export hook
  const { downloadExport } = useExportCanvas();

  // Undo/redo callbacks from workspace
  const undoRef = useRef<(() => void) | null>(null);
  const redoRef = useRef<(() => void) | null>(null);

  // Auth listeners
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  // Handle "Start Designing" click
  const handleStartDesigning = () => {
    setShowHomepage(false);
    setShowDesignTypeModal(true);
    setActiveTab("create");
  };
 
   // Handle AI Mode button click
   const handleAIModeClick = () => {
     setShowAIModeModal(true);
   };
 
   // Handle AI Mode template generation
   const handleAIModeGenerate = (template: Template) => {
     setCurrentTemplate(template);
     setActiveDesignCategory(template.category);
     setCanvasWidth(template.canvasWidth);
     setCanvasHeight(template.canvasHeight);
     setActiveTab("create");
     setShowHomepage(false);
   };

  // Handle browsing inspiration
  const handleBrowseInspiration = () => {
    setShowHomepage(false);
    setActiveTab("inspire");
  };

  // Handle design type selection
  const handleDesignTypeSelect = (category: DesignCategory) => {
    setActiveDesignCategory(category);
    
    // Load a random template for this category
    const template = getRandomTemplate(category);
    if (template) {
      setCurrentTemplate(template);
      setCanvasWidth(template.canvasWidth);
      setCanvasHeight(template.canvasHeight);
      toast.success("Template loaded! Tap any text to edit.");
    } else {
      toast.info("No templates available. Start from scratch!");
    }
    
    setShowHomepage(false);
    setActiveTab("create");
  };

  // Handle quick start category change
  const handleQuickCategoryChange = (category: DesignCategory) => {
    const template = getRandomTemplate(category);
    if (template) {
      setCurrentTemplate(template);
      setActiveDesignCategory(category);
      setCanvasWidth(template.canvasWidth);
      setCanvasHeight(template.canvasHeight);
      toast.success("Template swapped!");
    }
  };

  // Handle using a template from library
  const handleUseTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setActiveDesignCategory(template.category);
    setCanvasWidth(template.canvasWidth);
    setCanvasHeight(template.canvasHeight);
    setActiveTab("create");
    setShowHomepage(false);
    toast.success("Template loaded!");
  };

  // Handle loading design from history
  const handleLoadDesign = (state: CanvasState) => {
    setCanvasLayers(state.layers);
    setCanvasWidth(state.width);
    setCanvasHeight(state.height);
    setActiveTab("create");
    setShowHomepage(false);
    // Create a blank template to trigger workspace rendering
    const blankTemplate: Template = {
      id: "loaded-design",
      name: "Loaded Design",
      category: "custom" as DesignCategory,
      thumbnailUrl: "",
      canvasWidth: state.width,
      canvasHeight: state.height,
      elements: [],
    };
    setCurrentTemplate(blankTemplate);
    toast.success("Design loaded!");
  };

  // Handle remix from inspire
  const handleRemix = (imageUrl: string, prompt: string) => {
    setActiveTab("create");
    setShowHomepage(false);
    toast.info("Remix feature coming soon! For now, start fresh.");
  };

  // Handle start from inspire - opens image in workspace
  const handleStartFrom = (imageUrl: string) => {
    const blankTemplate: Template = {
      id: "imported-design",
      name: "Imported Design",
      category: "custom" as DesignCategory,
      thumbnailUrl: "",
      canvasWidth: 800,
      canvasHeight: 800,
      elements: [
        {
          id: "bg",
          type: "shape",
          x: 0,
          y: 0,
          width: 800,
          height: 800,
          backgroundColor: "#1a1a2e",
        },
      ],
    };
    
    setCurrentTemplate(blankTemplate);
    setImportedImageUrl(imageUrl);
    setActiveTab("create");
    setShowHomepage(false);
    toast.success("Image loaded in editor! Drag to position.");
  };

  // Handle tab change with proper routing
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    
    if (tab === "home") {
      setShowHomepage(true);
    } else if (tab === "create" && !currentTemplate) {
      setShowDesignTypeModal(true);
      setShowHomepage(false);
    } else {
      setShowHomepage(false);
    }
  };

  // Handle export using layer-based system
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    // Get canvas layers from localStorage (set by CanvasWorkspace)
    const savedState = localStorage.getItem("epic_project_state");
    if (!savedState) {
      toast.error("No design to export. Create something first!");
      return;
    }

    try {
      const state = JSON.parse(savedState) as CanvasState;
      
      if (!state.layers || state.layers.length === 0) {
        toast.error("No design to export. Create something first!");
        return;
      }

      await downloadExport(
        state.layers,
        state.width,
        state.height,
        { format, quality: 0.95, scale: 2 },
        currentTemplate?.name || "design"
      );

       // Save to history after successful export
       saveToHistory(state, currentTemplate?.name);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again.");
    }
  };
 
   // Save design to history
   const saveToHistory = (state: CanvasState, name?: string) => {
     const HISTORY_STORAGE_KEY = "epic_design_history";
     const MAX_HISTORY_ITEMS = 20;
 
     try {
       const existing = localStorage.getItem(HISTORY_STORAGE_KEY);
       const history = existing ? JSON.parse(existing) : [];
 
       // Generate simple thumbnail
       const thumbnail = generateThumbnail(state);
       const now = new Date().toISOString();
 
       const newItem = {
         id: `design-${Date.now()}`,
         name: name || `Design ${new Date().toLocaleDateString()}`,
         thumbnail,
         createdAt: now,
         updatedAt: now,
         canvasState: state,
       };
 
       const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
       localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
     } catch (error) {
       console.error("Failed to save to history:", error);
     }
   };
 
   // Generate thumbnail from canvas state
   const generateThumbnail = (state: CanvasState): string => {
     try {
       const canvas = document.createElement("canvas");
       const scale = 100 / Math.max(state.width, state.height);
       canvas.width = state.width * scale;
       canvas.height = state.height * scale;
       const ctx = canvas.getContext("2d");
       
       if (!ctx) return "";
 
       // Fill background
       ctx.fillStyle = "#f3f4f6";
       ctx.fillRect(0, 0, canvas.width, canvas.height);
 
       // Draw layers
       const sortedLayers = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);
       
       for (const layer of sortedLayers) {
         if (!layer.visible) continue;
 
         ctx.save();
         ctx.globalAlpha = layer.opacity;
 
         const x = layer.x * scale;
         const y = layer.y * scale;
         const w = layer.width * scale;
         const h = layer.height * scale;
 
         switch (layer.type) {
           case "background": {
             const bgLayer = layer as any;
             ctx.fillStyle = bgLayer.backgroundColor || "#ffffff";
             ctx.fillRect(x, y, w, h);
             break;
           }
           case "shape": {
             const shapeLayer = layer as any;
             ctx.fillStyle = shapeLayer.fillColor;
             if (shapeLayer.shapeType === "circle") {
               ctx.beginPath();
               ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
               ctx.fill();
             } else {
               ctx.fillRect(x, y, w, h);
             }
             break;
           }
           case "text": {
             const textLayer = layer as any;
             ctx.fillStyle = textLayer.color;
             ctx.font = `${Math.max(8, textLayer.fontSize * scale)}px sans-serif`;
             ctx.fillText(textLayer.content.slice(0, 20), x, y + h / 2);
             break;
           }
         }
 
         ctx.restore();
       }
 
       return canvas.toDataURL("image/png");
     } catch {
       return "";
     }
   };

  // Handle export button click - check limits first
  const handleExportClick = async () => {
    // Check if user can export (check generation limit)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Guest - show signup prompt
      setShowExportDialog(true);
      return;
    }

    // Always allow export for now, but show paywall info after
    setShowExportDialog(true);
  };

  // Render user menu in navbar
  const renderUserMenu = () => (
    <div className="flex items-center gap-1 md:gap-2">
      {isInstallable && !isMobile && (
        <Button variant="ghost" size="icon" onClick={promptInstall} title="Install App" className="h-9 w-9">
          <Download className="h-4 w-4" />
        </Button>
      )}
      
      {/* Usage Counter - visible in create mode */}
      {activeTab === "create" && !showHomepage && (
        <div className="hidden md:block">
          <UsageCounter 
            type="generate" 
            onUpgradeClick={() => {
              setPaywallReason("limit");
              setShowPaywall(true);
            }}
          />
        </div>
      )}
      
      {/* Pro Button - visible on all screens */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowProDialog(true)} 
        title="Creator Mode" 
        className="h-9 w-9 text-primary hover:text-primary/80"
      >
        <Crown className="h-4 w-4" />
      </Button>

      {/* Admin Button - visible on all screens if admin */}
      {isAdmin && (
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} title="Admin" className="h-9 w-9">
          <Shield className="h-4 w-4" />
        </Button>
      )}

      {/* Notification Bell */}
      <NotificationBell />

      <ThemeToggle />

      {isAuthed ? (
        <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out" className="h-9 w-9">
          <LogOut className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/auth")} 
          className="gap-1.5 h-9 px-2 md:px-3"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Sign In</span>
        </Button>
      )}
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    // Show homepage for home tab
    if (activeTab === "home" || showHomepage) {
      return (
        <>
          <NewHomepage
            onStartDesigning={handleStartDesigning}
            onBrowseInspiration={handleBrowseInspiration}
             onAIModeClick={handleAIModeClick}
          />
          <LandingCredibility onStartDesigning={handleStartDesigning} />
        </>
      );
    }

    // Library tab
    if (activeTab === "library") {
      return (
        <LibraryTab
          onUseTemplate={handleUseTemplate}
          onLoadDesign={handleLoadDesign}
        />
      );
    }

    // Inspire tab
    if (activeTab === "inspire") {
      return (
        <InspireTab
          onRemix={handleRemix}
          onUseLayout={handleUseTemplate}
          onStartFrom={handleStartFrom}
        />
      );
    }

    // Create workspace
    return (
      <div className="min-h-screen pt-40 pb-20 md:pb-4">
        {/* Workspace Top Bar */}
        <WorkspaceTopBar
          projectName={currentTemplate?.name || "New Design"}
          saveStatus={saveStatus}
          onExport={handleExportClick}
          onUndo={() => undoRef.current?.()}
          onRedo={() => redoRef.current?.()}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        {/* Left Toolbar (desktop) / Bottom Toolbar (mobile) */}
        <WorkspaceToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />

        {/* Quick Start Strip */}
        <QuickStartStrip
          onSelect={handleQuickCategoryChange}
          activeCategory={activeDesignCategory || undefined}
        />

        {/* Canvas Area */}
        <div className="px-2 md:pl-20 md:pr-4">
          <CanvasWorkspace
            template={currentTemplate}
            activeTool={activeTool}
            initialImportedImage={importedImageUrl}
            onSaveStatusChange={setSaveStatus}
            onCanUndo={setCanUndo}
            onCanRedo={setCanRedo}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="EPIC — AI Design Generator | Create Professional Graphics Instantly"
        description="Create stunning posters, logos, social media graphics, YouTube thumbnails, and more in seconds. No design skills needed. Free to use."
        keywords="AI design generator, logo maker, poster creator, YouTube thumbnail maker, Instagram post creator, social media graphics, free design tool, no-prompt AI"
        canonicalUrl="https://no-edit.lovable.app/"
        structuredData={homePageSchema}
      />

      <div className="min-h-screen bg-background">
        {/* Main Navigation */}
        <MainNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAdmin={isAdmin}
          onAdminClick={() => navigate("/admin")}
          onProClick={() => setShowProDialog(true)}
        />

        {/* User Menu */}
        <div className="fixed top-0 right-2 md:right-4 h-16 flex items-center z-50">
          {renderUserMenu()}
        </div>

        {/* Main Content */}
        <main>{renderContent()}</main>

        {/* Footer - only on homepage */}
        {(showHomepage || activeTab === "home") && <Footer />}

        {/* Modals */}
        <DesignTypeModal
          open={showDesignTypeModal}
          onOpenChange={setShowDesignTypeModal}
          onSelect={handleDesignTypeSelect}
        />

        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          onExport={handleExport}
          requiresSignup={!isAuthed}
          onSignup={() => navigate("/auth")}
        />

        <ProPlanDialog open={showProDialog} onOpenChange={setShowProDialog} />
        
        <CreatorModePaywall 
          open={showPaywall} 
          onOpenChange={setShowPaywall}
          triggerReason={paywallReason}
        />

         <AIModeModal
           open={showAIModeModal}
           onOpenChange={setShowAIModeModal}
           onGenerate={handleAIModeGenerate}
         />
      </div>
    </>
  );
};

export default Index;
