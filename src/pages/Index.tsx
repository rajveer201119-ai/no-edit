import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Hero } from "@/components/Hero";
import { AnimatedAIChat } from "@/components/AnimatedAIChat";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { InstallButton } from "@/components/InstallButton";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { SEO, homePageSchema } from "@/components/SEO";
import { Sparkles, Shield, Download, Upload, Loader2 } from "lucide-react";
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
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
        fetchDailyLimit(session.user.id);
      } else {
        setIsAdmin(false);
        setRemainingPrompts(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
        fetchDailyLimit(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // Map command to style
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

    setIsGenerating(true);
    setGeneratedImage(null);
    setLastPrompt(prompt);
    toast.loading("Creating your design...", { id: "generating", duration: 120000 });

    try {
      const style = getStyleFromCommand(command);
      
      // Add design-specific context to the prompt
      let enhancedPrompt = prompt;
      if (command === 'logo') {
        enhancedPrompt = `Professional logo design: ${prompt}. Clean, modern, scalable vector style.`;
      } else if (command === 'social') {
        enhancedPrompt = `Social media graphic: ${prompt}. Eye-catching, vibrant, perfect for Instagram/Facebook.`;
      } else if (command === 'banner') {
        enhancedPrompt = `Web banner design: ${prompt}. Wide format, professional marketing banner.`;
      } else if (command === 'poster') {
        enhancedPrompt = `Poster design: ${prompt}. High impact, print-ready poster design.`;
      }

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: enhancedPrompt,
          style,
          size: command === 'banner' ? 'landscape' : command === 'poster' ? 'portrait' : 'square',
        },
      });

      if (error) throw error;
      if (!data) throw new Error("No response from design service");
      if (data.error) throw new Error(data.error);

      const imageUrl = data.imageUrl as string | undefined;
      if (!imageUrl) throw new Error("Design generation failed");

      setGeneratedImage(imageUrl);
      toast.success("Design created successfully!");

      // Refresh daily limit after successful generation
      if (currentUserId) {
        await fetchDailyLimit(currentUserId);
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
  }, [currentUserId, navigate]);

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

      // Upload to storage
      const fileName = `${currentUserId}/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, blob, {
          contentType: blob.type || "image/png",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(fileName);

      // Create post
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

  return (
    <>
      <SEO 
        title="EPIC - Design Generator for Non-Designers | Create Professional Designs Instantly"
        description="AI-powered design generator for non-designers. Create stunning logos, social media graphics, banners, posters, and business cards instantly. No design skills needed."
        keywords="AI design generator, design for non-designers, logo maker, social media graphics, banner maker, poster design, business card maker, AI graphic design"
        canonicalUrl="https://epic-ai-generator.lovable.app/"
        structuredData={homePageSchema}
      />
      <div className="min-h-screen">
        <ProPlanDialog />
        {isGenerating && <SpaceBackground particleCount={450} />}
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <header className="flex justify-end items-center gap-3 mb-4">
            <InstallButton />
            <ThemeToggle />
            {isAdmin && (
              <GradientButton 
                variant="variant"
                onClick={() => navigate("/admin")}
                className="relative z-10"
              >
                <span className="relative z-10">
                  <Shield className="mr-2 h-4 w-4 inline" />
                  Admin
                </span>
              </GradientButton>
            )}
            <GradientButton 
              onClick={() => navigate("/pricing-india")}
              className="relative z-10"
            >
              <span className="relative z-10">
                <Sparkles className="mr-2 h-4 w-4 inline" />
                View Plans
              </span>
            </GradientButton>
            {isAuthed ? (
              <GradientButton variant="variant" onClick={signOut} className="relative z-10">
                <span className="relative z-10">Sign out</span>
              </GradientButton>
            ) : (
              <GradientButton onClick={() => navigate("/auth")} className="relative z-10">
                <span className="relative z-10">Sign in</span>
              </GradientButton>
            )}
          </header>
          <AnnouncementBanner />
          <main>
            <Hero />
            
            <section aria-label="AI Design Generator Tool" className="mt-8">
              <AnimatedAIChat 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                remainingPrompts={remainingPrompts}
                isPremium={isPremium}
              />
              
              {/* Generated Image Display */}
              {generatedImage && (
                <div className="max-w-2xl mx-auto mt-8">
                  <Card className="glass-card p-4 md:p-6 space-y-4 animate-fade-in border-2 glow-purple">
                    <div className="relative group">
                      <img
                        src={generatedImage}
                        alt={`AI generated design: ${lastPrompt}`}
                        className="w-full h-auto rounded-lg shadow-2xl"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                    </div>
                    <div className="flex gap-3">
                      <GradientButton
                        onClick={handleDownload}
                        variant="variant"
                        className="flex-1 relative z-10"
                      >
                        <span className="relative z-10">
                          <Download className="mr-2 h-4 w-4 inline" />
                          Download
                        </span>
                      </GradientButton>
                      <GradientButton
                        onClick={handleSaveToFeed}
                        disabled={isSaving || !currentUserId}
                        className="flex-1 relative z-10"
                      >
                        <span className="relative z-10">
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4 inline" />
                              Save to Gallery
                            </>
                          )}
                        </span>
                      </GradientButton>
                    </div>
                  </Card>
                </div>
              )}
            </section>
            
            <section aria-label="Community Generated Designs" className="mt-16">
              <Suspense fallback={<div className="text-center py-8">Loading gallery...</div>}>
                <Feed />
              </Suspense>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
