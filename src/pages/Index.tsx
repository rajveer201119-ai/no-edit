import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SEO, homePageSchema } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Shield, Sparkles, Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

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
  Template,
  getRandomTemplate,
} from "@/components/platform";

const Index = () => {
  const navigate = useNavigate();
  const { isInstallable, promptInstall } = useInstallPrompt();

  // Auth state
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState<MainTab>("create");
  const [showHomepage, setShowHomepage] = useState(true);

  // Create workspace state
  const [showDesignTypeModal, setShowDesignTypeModal] = useState(false);
  const [activeDesignCategory, setActiveDesignCategory] = useState<DesignCategory | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");

  // Export state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);

  // Workspace meta
  const [isSaving, setIsSaving] = useState(false);

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
      toast.success("Template swapped!");
    }
  };

  // Handle using a template from library
  const handleUseTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setActiveDesignCategory(template.category);
    setActiveTab("create");
    setShowHomepage(false);
    toast.success("Template loaded!");
  };

  // Handle remix from inspire
  const handleRemix = (imageUrl: string, prompt: string) => {
    // For now, just switch to create tab
    setActiveTab("create");
    setShowHomepage(false);
    toast.info("Remix feature coming soon! For now, start fresh.");
  };

  // Handle start from inspire
  const handleStartFrom = (imageUrl: string) => {
    setActiveTab("create");
    setShowHomepage(false);
    toast.info("Start from feature coming soon!");
  };

  // Handle export - captures canvas and downloads
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    try {
      // Find the canvas element
      const canvasContainer = document.querySelector('.bg-white.shadow-2xl.rounded-lg');
      if (!canvasContainer) {
        toast.error("No design to export. Create something first!");
        return;
      }

      // Use html2canvas approach - for now simulate
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Create a simple canvas export (placeholder - in production use html2canvas)
      const canvas = document.createElement('canvas');
      canvas.width = currentTemplate?.canvasWidth || 800;
      canvas.height = currentTemplate?.canvasHeight || 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Fill with template background
        const bgElement = currentTemplate?.elements.find(el => el.id === 'bg');
        ctx.fillStyle = bgElement?.backgroundColor || '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text elements
        currentTemplate?.elements.forEach(el => {
          if (el.type === 'text' && el.content) {
            ctx.fillStyle = el.color || '#ffffff';
            ctx.font = `${el.fontWeight || 'normal'} ${el.fontSize || 16}px sans-serif`;
            ctx.fillText(el.content, el.x, el.y + (el.fontSize || 16));
          }
        });

        // Convert to blob and download
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentTemplate?.name || 'design'}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success(`Exported as ${format.toUpperCase()}!`);
          }
        }, mimeType, 0.95);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Export failed. Please try again.");
    }
  };

  // Render user menu in navbar
  const renderUserMenu = () => (
    <div className="flex items-center gap-2">
      {isInstallable && (
        <Button variant="ghost" size="icon" onClick={promptInstall} title="Install App">
          <Download className="h-4 w-4" />
        </Button>
      )}
      
      <Button variant="ghost" size="icon" onClick={() => setShowProDialog(true)} title="View Plans">
        <Sparkles className="h-4 w-4" />
      </Button>

      {isAdmin && (
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} title="Admin">
          <Shield className="h-4 w-4" />
        </Button>
      )}

      <ThemeToggle />

      {isAuthed ? (
        <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
          <LogOut className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="gap-2">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      )}
    </div>
  );

  // Determine what content to render
  const renderContent = () => {
    // Show homepage first
    if (showHomepage && activeTab === "create") {
      return (
        <NewHomepage
          onStartDesigning={handleStartDesigning}
          onBrowseInspiration={handleBrowseInspiration}
        />
      );
    }

    // Library tab
    if (activeTab === "library") {
      return <LibraryTab onUseTemplate={handleUseTemplate} />;
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
      <div className="min-h-screen pt-16 pb-16 md:pb-0">
        {/* Workspace Top Bar */}
        <WorkspaceTopBar
          projectName={currentTemplate?.name || "New Design"}
          isSaving={isSaving}
          onExport={() => setShowExportDialog(true)}
          canUndo={false}
          canRedo={false}
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

        {/* Canvas Area - responsive padding */}
        <div className="pt-24 px-2 md:pl-16 md:pr-4">
          <CanvasWorkspace
            template={currentTemplate}
            activeTool={activeTool}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="EPIC - Design Generator | Create Professional Designs Instantly"
        description="Create stunning logos, social media graphics, banners, and posters in seconds. No design skills needed."
        keywords="design generator, logo maker, poster creator, social media graphics, AI design"
        canonicalUrl="https://epic-ai-generator.lovable.app/"
        structuredData={homePageSchema}
      />

      <div className="min-h-screen bg-background">
        {/* Main Navigation */}
        <MainNavigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "create" && !currentTemplate) {
              setShowHomepage(true);
            } else {
              setShowHomepage(false);
            }
          }}
        />

        {/* User Menu - Absolute positioned in navbar */}
        <div className="fixed top-0 right-4 h-16 flex items-center z-50">
          {renderUserMenu()}
        </div>

        {/* Main Content */}
        <main>{renderContent()}</main>

        {/* Footer - only on homepage */}
        {showHomepage && <Footer />}

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
      </div>
    </>
  );
};

export default Index;
