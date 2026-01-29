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

  // Handle export
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Exported as ${format.toUpperCase()}`);
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
      <div className="min-h-screen pt-16">
        {/* Workspace Top Bar */}
        <WorkspaceTopBar
          projectName={currentTemplate?.name || "New Design"}
          isSaving={isSaving}
          onExport={() => setShowExportDialog(true)}
          canUndo={false}
          canRedo={false}
        />

        {/* Left Toolbar */}
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
        <div className="pl-14 pt-24">
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
