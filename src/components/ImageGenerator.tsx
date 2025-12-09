import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Download, Upload, X, Zap } from "lucide-react";
import { StyleSelector } from "./StyleSelector";
import { SizeSelector } from "./SizeSelector";
import { SpaceBackground } from "@/components/ui/space-background";

export type ImageStyle = "ghibli" | "3d" | "animated" | "realistic" | "vintage" | "cyberpunk";
export type ImageSize = "square" | "portrait" | "landscape";

export const ImageGenerator = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("realistic");
  const [size, setSize] = useState<ImageSize>("square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previousState, setPreviousState] = useState<{
    prompt: string;
    style: ImageStyle;
    size: ImageSize;
    image: string | null;
  } | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkUser();
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

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
    if (user?.id) {
      await fetchDailyLimit(user.id);
    }
  };

  const handleUndo = () => {
    if (previousState) {
      setPrompt(previousState.prompt);
      setStyle(previousState.style);
      setSize(previousState.size);
      setGeneratedImage(previousState.image);
      setPreviousState(null);
      toast.success("Reverted to previous state");
    }
  };

  const handleGenerate = async () => {
    if (!currentUserId) {
      toast.error("Please sign up or sign in to generate images");
      navigate("/auth");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a description for your image");
      return;
    }

    // Save current state for undo
    setPreviousState({
      prompt,
      style,
      size,
      image: generatedImage,
    });

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Build styled prompt
      const styleDescriptions: Record<ImageStyle, string> = {
        ghibli: "Studio Ghibli anime style, whimsical, hand-drawn aesthetic",
        "3d": "3D rendered, CGI, detailed modeling, professional rendering",
        animated: "Animated style, vibrant, expressive, cartoon-like",
        realistic: "Photorealistic, ultra-detailed, natural lighting, cinematic",
        vintage: "Vintage style, retro, nostalgic, aged aesthetic",
        cyberpunk: "Cyberpunk style, neon lights, futuristic, dystopian"
      };
      
      const styledPrompt = `${prompt.trim()}. ${styleDescriptions[style]}`;
      
      // Determine dimensions
      const dimensions = size === "portrait" 
        ? { width: 768, height: 1024 }
        : size === "landscape"
        ? { width: 1024, height: 768 }
        : { width: 1024, height: 1024 };
      
      // Add seed for unique generation each time
      const seed = Math.floor(Math.random() * 1000000);
      
      // Try to load the image with timeout and retry
      const loadImageWithTimeout = (url: string, timeoutMs: number): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const timeout = setTimeout(() => {
            img.src = "";
            reject(new Error("Image load timeout"));
          }, timeoutMs);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve(url);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Image failed to load"));
          };
          img.src = url;
        });
      };

      // Try multiple Pollinations configurations
      const urls = [
        `https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed}&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed + 1}`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.trim())}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed + 2}`
      ];

      let loadedUrl: string | null = null;
      let lastError: Error | null = null;

      for (const url of urls) {
        try {
          toast.loading("Generating your image...", { id: "generating" });
          loadedUrl = await loadImageWithTimeout(url, 90000); // 90 second timeout
          toast.dismiss("generating");
          break;
        } catch (err) {
          lastError = err as Error;
          console.warn("Attempt failed, trying next:", err);
          continue;
        }
      }

      if (!loadedUrl) {
        throw lastError || new Error("All generation attempts failed");
      }

      setGeneratedImage(loadedUrl);
      toast.success("Image generated successfully!");
      
      // Refresh daily limit after successful generation
      if (currentUserId) {
        await fetchDailyLimit(currentUserId);
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.dismiss("generating");
      toast.error("Image generation service is currently unavailable. Please try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `epic-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const handleSaveToFeed = async () => {
    if (!generatedImage || !currentUserId) {
      toast.error("Please sign in to save images to the feed");
      return;
    }

    setIsSaving(true);
    try {
      // Fetch the image from URL
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      // Upload to storage
      const fileName = `${currentUserId}/${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      // Create post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: currentUserId,
          image_url: publicUrl,
          content: prompt,
        });

      if (postError) throw postError;

      toast.success("Image saved to feed!");
      setGeneratedImage(null);
      setPrompt("");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save image to feed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {isGenerating && <SpaceBackground particleCount={450} />}
      <Card className="glass-card p-6 md:p-8 space-y-6 border-2">
        <div className="space-y-4">
          {currentUserId && remainingPrompts !== null && (
            <div className="flex items-center justify-between gap-4 p-3 md:p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground truncate">
                  Daily Generations
                </span>
              </div>
              <Badge variant="default" className="flex-shrink-0 text-xs md:text-sm px-2 md:px-3 py-1">
                {remainingPrompts} / {isPremium ? '25' : '2'} left
              </Badge>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block gradient-epic-text">
              Describe Your Vision
            </label>
            <div className="relative">
              <Textarea
                placeholder="e.g., A majestic dragon soaring through sunset clouds, breathing fire..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 bg-card/80 backdrop-blur-sm border-white/10 focus:border-primary resize-none text-base text-foreground placeholder:text-muted-foreground pr-10 animate-cursor-blink"
                disabled={isGenerating}
              />
              {prompt && !isGenerating && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setPrompt("")}
                  className="absolute top-2 right-2 h-6 w-6 hover:bg-destructive/20"
                  title="Clear prompt"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <StyleSelector value={style} onChange={setStyle} disabled={isGenerating} />
          <SizeSelector value={size} onChange={setSize} disabled={isGenerating} />

          <div className="flex gap-2">
            <GradientButton
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 h-14 text-lg font-semibold relative z-10"
            >
              <span className="relative z-10">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 inline" />
                    Generate Image
                  </>
                )}
              </span>
            </GradientButton>
            
            {previousState && (
              <GradientButton
                onClick={handleUndo}
                disabled={isGenerating}
                variant="variant"
                className="h-14 relative z-10"
              >
                <span className="relative z-10">Undo</span>
              </GradientButton>
            )}
          </div>
        </div>
      </Card>

      {generatedImage && (
        <Card className="glass-card p-4 md:p-6 space-y-4 animate-fade-in border-2 glow-purple">
          <div className="relative group">
            <img
              src={generatedImage}
              alt={`AI generated ${style} style artwork: ${prompt}`}
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
                    Save to Feed
                  </>
                )}
              </span>
            </GradientButton>
          </div>
        </Card>
      )}
    </div>
  );
};
