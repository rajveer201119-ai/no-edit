import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Download, Upload, X, Zap } from "lucide-react";
import { StyleSelector } from "./StyleSelector";
import { SizeSelector } from "./SizeSelector";

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
        toast.success("Image generated successfully!");
        // Refresh daily limit after successful generation
        if (currentUserId) {
          await fetchDailyLimit(currentUserId);
        }
      } else {
        toast.error("Failed to generate image");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      const rawMsg = String(error?.message ?? "");
      const match = rawMsg.match(/\b(4\d{2}|5\d{2})\b/);
      const status = (error as any)?.status ?? (error as any)?.context?.response?.status ?? (match ? Number(match[0]) : undefined);

      if (status === 402 || rawMsg.toLowerCase().includes("payment required")) {
        toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage to continue.");
      } else if (status === 429 || rawMsg.toLowerCase().includes("rate limit")) {
        toast.error("Rate limit exceeded. Please wait a few seconds and try again.");
      } else {
        toast.error("Failed to generate image. Please try again shortly.");
      }
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

  const handleSaveToFeed = async () => {
    if (!generatedImage || !currentUserId) {
      toast.error("Please sign in to save images to the feed");
      return;
    }

    setIsSaving(true);
    try {
      // Convert base64 to blob
      const base64Data = generatedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

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
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 h-14 text-lg font-semibold gradient-epic hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>
            
            {previousState && (
              <Button
                onClick={handleUndo}
                disabled={isGenerating}
                variant="outline"
                size="lg"
                className="h-14"
              >
                Undo
              </Button>
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
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={handleSaveToFeed}
              disabled={isSaving || !currentUserId}
              className="flex-1 gradient-epic hover:opacity-90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Save to Feed
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
