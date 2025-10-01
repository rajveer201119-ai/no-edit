import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Download, Lock } from "lucide-react";
import { StyleSelector } from "./StyleSelector";
import { SizeSelector } from "./SizeSelector";
import PremiumModal from "./PremiumModal";

export type ImageStyle = "ghibli" | "3d" | "animated" | "realistic" | "vintage" | "cyberpunk";
export type ImageSize = "square" | "portrait" | "landscape";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("realistic");
  const [size, setSize] = useState<ImageSize>("square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [remainingPrompts, setRemainingPrompts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    const { data } = await supabase.rpc("check_daily_limit", {
      user_id_param: userId,
    });

    if (data && data.length > 0) {
      setIsPremium(data[0].is_premium);
      setRemainingPrompts(data[0].remaining_prompts);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate images");
      navigate("/auth");
      return;
    }

    if (remainingPrompts <= 0) {
      if (!isPremium) {
        toast.error("Daily limit reached! Upgrade to premium for 50 prompts/day");
        setShowPremiumModal(true);
      } else {
        toast.error("Daily limit reached! You've used all 50 prompts for today");
      }
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a description for your image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, style, size }
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit reached. Please wait a moment and try again.");
        } else if (data.error.includes("Payment required")) {
          toast.error("Credits needed. Please add credits to continue.");
        } else {
          toast.error(data.error);
        }
        return;
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        await checkPremiumStatus(user.id);
        toast.success(`Image generated! ${remainingPrompts - 1} prompts remaining today`);
      } else {
        toast.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `epic-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card className="glass-card p-6 md:p-8 space-y-6 border-2">
        <div className="space-y-4">
          {user && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-epic/10 border border-white/10">
              <span className="text-sm font-medium">
                {isPremium ? "Premium Plan" : "Free Plan"}
              </span>
              <span className="text-sm font-semibold gradient-epic-text">
                {remainingPrompts} / {isPremium ? "50" : "2"} prompts remaining today
              </span>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block gradient-epic-text">
              Describe Your Vision
            </label>
            <Textarea
              placeholder="e.g., A majestic dragon soaring through sunset clouds, breathing fire..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 bg-card/80 backdrop-blur-sm border-white/10 focus:border-primary resize-none text-base text-foreground placeholder:text-muted-foreground"
              disabled={isGenerating}
            />
          </div>

          <StyleSelector value={style} onChange={setStyle} disabled={isGenerating} />
          <SizeSelector value={size} onChange={setSize} disabled={isGenerating} />

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !user}
            className="w-full h-14 text-lg font-semibold gradient-epic hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Magic...
              </>
            ) : !user ? (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Sign In to Generate
              </>
            ) : remainingPrompts <= 0 ? (
              <>
                <Lock className="mr-2 h-5 w-5" />
                {isPremium ? "Daily Limit Reached" : "Upgrade to Premium"}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedImage && (
        <Card className="glass-card p-4 md:p-6 space-y-4 animate-fade-in border-2 glow-purple">
          <div className="relative group">
            <img
              src={generatedImage}
              alt="Generated artwork"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
          </div>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </Card>
      )}

      <PremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onSuccess={() => checkPremiumStatus(user?.id)}
      />
    </div>
  );
};
