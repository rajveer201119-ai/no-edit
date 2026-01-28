import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hero } from "@/components/Hero";
import { AnimatedAIChat } from "@/components/AnimatedAIChat";
import { Footer } from "@/components/Footer";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { GlassSidebar, type Project, type TabType } from "@/components/GlassSidebar";
import { CreativeWorkspace } from "@/components/editor";
import { SEO, homePageSchema } from "@/components/SEO";
import { Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SpaceBackground } from "@/components/ui/space-background";
import { toast } from "sonner";

const Feed = lazy(() => import("@/components/Feed").then(mod => ({ default: mod.Feed })));

export type ImageStyle = "ghibli" | "3d" | "animated" | "realistic" | "vintage" | "cyberpunk";
export type ImageSize = "square" | "portrait" | "landscape";
export type DesignType = "logo" | "social" | "banner" | "poster";

const Index = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [remainingPrompts, setRemainingPrompts] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProDialog, setShowProDialog] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const navigate = useNavigate();
  
  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('sidebarCollapsed', String(newVal));
      return newVal;
    });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
        fetchDailyLimit(session.user.id);
        fetchProjects(session.user.id);
      } else {
        setIsAdmin(false);
        setRemainingPrompts(null);
        setProjects([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
        fetchDailyLimit(session.user.id);
        fetchProjects(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async (userId: string) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    
    if (!error && data) {
      setProjects(data);
    }
  };

  const refreshProjects = useCallback(() => {
    if (currentUserId) {
      fetchProjects(currentUserId);
    }
  }, [currentUserId]);

  const fetchDailyLimit = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('check_generation_limit', {
        user_id_param: userId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setRemainingPrompts(data[0].remaining_prompts);
        setIsPremium(data[0].is_premium);
      }
    } catch (error) {
      console.error("Error fetching daily limit:", error);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
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
  };

  const getStyleFromCommand = (command?: string): ImageStyle => {
    switch (command) {
      case 'logo': return 'realistic';
      case 'social': return '3d';
      case 'banner': return 'cyberpunk';
      case 'poster': return 'vintage';
      default: return 'realistic';
    }
  };

  const getDesignTypeFromPrompt = (rawPrompt: string): DesignType | null => {
    const p = rawPrompt.toLowerCase();

    // Order matters: check more specific terms first
    if (p.includes('logo')) return 'logo';
    if (p.includes('banner') || p.includes('header')) return 'banner';
    if (p.includes('poster') || p.includes('flyer')) return 'poster';
    if (
      p.includes('social') ||
      p.includes('instagram') ||
      p.includes('facebook') ||
      p.includes('linkedin') ||
      p.includes('twitter') ||
      p.includes('x ') ||
      p.includes('social post') ||
      p.includes('post for')
    ) {
      return 'social';
    }

    return null;
  };

  const resolveUserForGeneration = async (): Promise<{ userId: string | null; isGuest: boolean }> => {
    // getSession() can be stale; getUser() verifies the session with the API.
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.id) {
      return { userId: null, isGuest: true };
    }
    return { userId: data.user.id, isGuest: false };
  };

  const handleGenerate = useCallback(async (prompt: string, command?: string) => {
    // Allow generation without signup - auth is only required for editor

    if (!prompt.trim()) {
      toast.error("Please describe what you want to design");
      return;
    }

    // Resolve auth at the moment of generation (avoids stale/invalid sessions causing 401)
    const { userId: authedUserId, isGuest } = await resolveUserForGeneration();

    // Only check limits if user is actually authenticated
    if (!isGuest && authedUserId && remainingPrompts !== null && remainingPrompts <= 0) {
      setShowProDialog(true);
      toast.error(
        isPremium
          ? "You've used all 25 daily credits. Come back tomorrow!"
          : "You've used your free daily credits. Upgrade to Pro for more!",
        { duration: 5000 }
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setLastPrompt(prompt);
    toast.loading("Creating your design...", { id: "generating", duration: 120000 });

    try {
      const normalizedCommand = command?.toLowerCase();
      const commandDesignType: DesignType | null =
        normalizedCommand === 'logo' ||
        normalizedCommand === 'social' ||
        normalizedCommand === 'banner' ||
        normalizedCommand === 'poster'
          ? (normalizedCommand as DesignType)
          : null;

      const designType: DesignType | null = commandDesignType ?? getDesignTypeFromPrompt(prompt);

      // Avoid calling the edge function with an invalid designType (e.g. "default")
      if (!designType) {
        toast.error("Please specify a design type (logo, social post, banner, or poster)");
        return;
      }

      const style = getStyleFromCommand(designType);
      const size: ImageSize = designType === 'banner' ? 'landscape' : designType === 'poster' ? 'portrait' : 'square';

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, style, size, designType, isGuest },
      });

      if (error) throw error;
      if (!data) throw new Error("No response from design service");
      if (data.error) throw new Error(data.error);

      const imageUrl = data.imageUrl as string | undefined;
      if (!imageUrl) throw new Error("Design generation failed");

      // Track usage and create project only if logged in (and session is valid)
      if (!isGuest && authedUserId) {
        await supabase.rpc('increment_generation_usage', { user_id_param: authedUserId });

        // Create a new project
        const projectName = prompt.slice(0, 50) + (prompt.length > 50 ? "..." : "");
        const { data: newProject, error: projectError } = await supabase
          .from("projects")
          .insert({
            user_id: authedUserId,
            name: projectName,
            prompt: prompt,
            image_url: imageUrl
          })
          .select()
          .single();

        if (projectError) {
          console.error("Failed to create project:", projectError);
        }

        await fetchDailyLimit(authedUserId);
        await fetchProjects(authedUserId);

        // Open the project in editor tab
        if (newProject) {
          setActiveTab({ type: "project", project: newProject });
          toast.success("Design created! Opening editor...");
          return;
        }
      }

      setGeneratedImage(imageUrl);
      toast.success(isGuest ? "Design created! Sign in to save and edit." : "Design created!");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(
        error?.message || "The design service is temporarily unavailable. Please try again.",
        { duration: 5000 }
      );
    } finally {
      toast.dismiss("generating");
      setIsGenerating(false);
    }
  }, [currentUserId, navigate, remainingPrompts, isPremium]);

  const getImageBlob = async (imageUrl: string): Promise<Blob> => {
    const resp = await fetch(imageUrl);
    if (!resp.ok) throw new Error("Failed to fetch image");
    return await resp.blob();
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      toast.loading("Preparing download...", { id: "download" });

      const blob = await getImageBlob(generatedImage);
      const url = URL.createObjectURL(blob);

      const extension = blob.type === "image/jpeg" ? "jpg" : "png";
      const link = document.createElement("a");
      link.href = url;
      link.download = `epic-design-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Design downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download design");
    } finally {
      toast.dismiss("download");
    }
  };

  const handleSaveToFeed = async () => {
    if (!generatedImage || !currentUserId) {
      toast.error("Please sign in to save designs to the gallery");
      return;
    }

    setIsSaving(true);
    toast.loading("Saving to gallery...", { id: "saving" });

    try {
      const blob = await getImageBlob(generatedImage);
      const extension = blob.type === "image/jpeg" ? "jpg" : "png";

      const fileName = `${currentUserId}/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, blob, { contentType: blob.type || "image/png" });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(fileName);

      const { error: postError } = await supabase.from("posts").insert({
        user_id: currentUserId,
        image_url: publicUrl,
        content: lastPrompt,
      });

      if (postError) throw postError;

      toast.success("Design saved to gallery!");
      setGeneratedImage(null);
      setLastPrompt("");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save design to gallery");
    } finally {
      toast.dismiss("saving");
      setIsSaving(false);
    }
  };

  const handleProjectImageUpdate = (newImageUrl: string) => {
    if (typeof activeTab === "object" && activeTab.type === "project") {
      setActiveTab({
        type: "project",
        project: { ...activeTab.project, image_url: newImageUrl }
      });
      refreshProjects();
    }
  };

  const renderContent = () => {
    // Project editor tab - require auth
    if (typeof activeTab === "object" && activeTab.type === "project") {
      if (!isAuthed) {
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
            <p className="text-muted-foreground text-center">Sign in to access the editor</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        );
      }
      
      if (!activeTab.project.image_url) {
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image to edit
          </div>
        );
      }
      
      return (
        <CreativeWorkspace
          projectId={activeTab.project.id}
          projectName={activeTab.project.name}
          imageUrl={activeTab.project.image_url}
          onImageUpdate={handleProjectImageUpdate}
          onClose={() => setActiveTab("chat")}
        />
      );
    }

    // Chat tab
    if (activeTab === "chat") {
      return (
        <div className="flex flex-col min-h-full">
          <AnnouncementBanner />
          <Hero />
          
          <section id="chat-section" aria-label="AI Design Generator Tool" className="mt-8 animate-fade-in pb-8">
            <AnimatedAIChat 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              remainingPrompts={remainingPrompts}
              isPremium={isPremium}
            />
          </section>
          
          {/* Show generated image for non-authenticated users */}
          {generatedImage && !isAuthed && (
            <div className="mt-8 mb-8 max-w-2xl mx-auto w-full px-4">
              <Card className="p-4 glass-card border-white/10">
                <img 
                  src={generatedImage} 
                  alt="Generated design" 
                  className="w-full h-auto rounded-lg mb-4"
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={() => navigate("/auth")} className="w-full">
                    Sign in to Save & Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      const link = document.createElement("a");
                      link.href = generatedImage;
                      link.download = `epic-design-${Date.now()}.png`;
                      link.click();
                    }}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      );
    }

    // Feed tab
    if (activeTab === "feed") {
      return (
        <section aria-label="Community Generated Designs" className="mt-8 animate-fade-in">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <Feed />
          </Suspense>
        </section>
      );
    }

    return null;
  };

  const isEditorMode = typeof activeTab === "object" && activeTab.type === "project";

  return (
    <>
      <SEO 
        title="EPIC - Design Generator for Non-Designers | Create Professional Designs Instantly"
        description="AI-powered design generator for non-designers. Create stunning logos, social media graphics, banners, posters, and business cards instantly. No design skills needed."
        keywords="AI design generator, design for non-designers, logo maker, social media graphics, banner maker, poster design, business card maker, AI graphic design"
        canonicalUrl="https://epic-ai-generator.lovable.app/"
        structuredData={homePageSchema}
      />
      <div className="min-h-screen flex flex-col md:flex-row">
        <ProPlanDialog open={showProDialog} onOpenChange={setShowProDialog} />
        {isGenerating && <SpaceBackground particleCount={450} />}
        
        <GlassSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAuthed={isAuthed}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          onSignOut={signOut}
          onSignIn={() => navigate("/auth")}
          onViewPlans={() => navigate("/pricing-india")}
          onAdminClick={() => navigate("/admin")}
          projects={projects}
          onProjectsChange={refreshProjects}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isOverlayActive={isEditorMode}
        />
        
        <div className={cn(
          "flex-1 pt-14 md:pt-0 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300",
          // Only apply margin when sidebar is visible (not collapsed, not in editor mode)
          (!sidebarCollapsed && !isEditorMode) ? "md:ml-20 lg:ml-64" : "md:ml-0"
        )}>
          {!isEditorMode && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          )}

          {isEditorMode ? (
            <div className="flex-1 relative z-10">
              {renderContent()}
            </div>
          ) : (
            <>
              <div className="relative z-10 container mx-auto px-4 py-8 flex-1">
                <main>
                  {renderContent()}
                </main>
              </div>
              <Footer />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
