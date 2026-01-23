import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Hero } from "@/components/Hero";
import { AnimatedAIChat } from "@/components/AnimatedAIChat";
import { Footer } from "@/components/Footer";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { GlassSidebar, type Project, type TabType } from "@/components/GlassSidebar";
import { ImageEditor } from "@/components/ImageEditor";
import { SEO, homePageSchema } from "@/components/SEO";
import { Download, Upload, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SpaceBackground } from "@/components/ui/space-background";
import { toast } from "sonner";

const Feed = lazy(() => import("@/components/Feed").then(mod => ({ default: mod.Feed })));

export type ImageStyle = "ghibli" | "3d" | "animated" | "realistic" | "vintage" | "cyberpunk";
export type ImageSize = "square" | "portrait" | "landscape";

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
  const navigate = useNavigate();

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
      const { data, error } = await supabase.rpc('check_daily_limit', {
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

  const handleGenerate = useCallback(async (prompt: string, command?: string) => {
    if (!currentUserId) {
      toast.error("Please sign in to generate designs");
      navigate("/auth");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please describe what you want to design");
      return;
    }

    if (remainingPrompts !== null && remainingPrompts <= 0) {
      toast.error(
        isPremium 
          ? "You've used all 25 daily credits. Come back tomorrow!" 
          : "You've used your 2 free daily credits. Upgrade to Pro for 25 credits/day!",
        { duration: 5000 }
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setLastPrompt(prompt);
    toast.loading("Creating your design...", { id: "generating", duration: 120000 });

    try {
      const style = getStyleFromCommand(command);
      const designType = command || 'default';
      const size = command === 'banner' ? 'landscape' : command === 'poster' ? 'portrait' : 'square';

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, style, size, designType },
      });

      if (error) throw error;
      if (!data) throw new Error("No response from design service");
      if (data.error) throw new Error(data.error);

      const imageUrl = data.imageUrl as string | undefined;
      if (!imageUrl) throw new Error("Design generation failed");

      await supabase.rpc('increment_prompt_usage', { user_id_param: currentUserId });

      // Create a new project
      const projectName = prompt.slice(0, 50) + (prompt.length > 50 ? "..." : "");
      const { data: newProject, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: currentUserId,
          name: projectName,
          prompt: prompt,
          image_url: imageUrl
        })
        .select()
        .single();

      if (projectError) {
        console.error("Failed to create project:", projectError);
      }

      setGeneratedImage(imageUrl);
      toast.success("Design created successfully!");
      
      await fetchDailyLimit(currentUserId);
      await fetchProjects(currentUserId);

      // Open the project in editor tab
      if (newProject) {
        setActiveTab({ type: "project", project: newProject });
      }
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
    // Project editor tab
    if (typeof activeTab === "object" && activeTab.type === "project") {
      if (!activeTab.project.image_url) {
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image to edit
          </div>
        );
      }
      
      return (
        <ImageEditor
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
        <>
          <AnnouncementBanner />
          <Hero />
          
          <section aria-label="AI Design Generator Tool" className="mt-8 animate-fade-in">
            <AnimatedAIChat 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              remainingPrompts={remainingPrompts}
              isPremium={isPremium}
            />
          </section>
        </>
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
      <div className="min-h-screen flex">
        <ProPlanDialog />
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
        />
        
        <div className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
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
