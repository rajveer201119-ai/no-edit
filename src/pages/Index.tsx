import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DesignWorkspace } from "@/components/workspace";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { SEO, homePageSchema } from "@/components/SEO";
import { Loader2, User, LogOut, Crown, Settings } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ImageStyle = "ghibli" | "3d" | "animated" | "realistic" | "vintage" | "cyberpunk";
export type ImageSize = "square" | "portrait" | "landscape";

const Index = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [remainingPrompts, setRemainingPrompts] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>();
  const [currentProjectName, setCurrentProjectName] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      setCurrentUserId(session?.user?.id || null);
      setUserEmail(session?.user?.email || null);
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
      setUserEmail(session?.user?.email || null);
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
    toast.success("Signed out");
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
    if (!prompt.trim()) {
      toast.error("Please describe what you want to design");
      return;
    }

    // Only check limits if user is logged in
    if (currentUserId && remainingPrompts !== null && remainingPrompts <= 0) {
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

      // Track usage and create project only if logged in
      if (currentUserId) {
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

        if (!projectError && newProject) {
          setCurrentProjectId(newProject.id);
          setCurrentProjectName(newProject.name);
        }

        await fetchDailyLimit(currentUserId);
      }

      setGeneratedImage(imageUrl);
      toast.success("Design created!");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(
        error?.message || "The design service is temporarily unavailable. Please try again.",
        { duration: 5000 }
      );
    } finally {
      setIsGenerating(false);
    }
  }, [currentUserId, remainingPrompts, isPremium]);

  const handleImageUpdate = (newUrl: string) => {
    setGeneratedImage(newUrl);
  };

  return (
    <>
      <SEO 
        title="EPIC - AI Design Studio | Create Professional Designs by Talking"
        description="AI-powered design studio for creators. Create stunning logos, social media graphics, banners, and posters just by describing what you want. No design skills needed."
        keywords="AI design studio, design by talking, logo maker, social media graphics, banner maker, poster design, AI graphic design, no-code design"
        canonicalUrl="https://epic-ai-generator.lovable.app/"
        structuredData={homePageSchema}
      />
      
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <ProPlanDialog />
        
        {/* Top Header Bar */}
        <header className="flex-shrink-0 h-14 border-b border-border/50 bg-background/95 backdrop-blur-xl flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold gradient-epic-text tracking-tight">EPIC</h1>
            <span className="hidden sm:inline text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              AI Design Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAuthed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="hidden sm:inline text-xs truncate max-w-[120px]">
                      {userEmail}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/pricing-india")}>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden">
          <DesignWorkspace
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generatedImage={generatedImage}
            remainingPrompts={remainingPrompts}
            isPremium={isPremium}
            onUpgrade={() => navigate("/pricing-india")}
            projectId={currentProjectId}
            projectName={currentProjectName}
            onImageUpdate={handleImageUpdate}
          />
        </main>
      </div>
    </>
  );
};

export default Index;
