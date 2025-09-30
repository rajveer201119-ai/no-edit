import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Download } from "lucide-react";
import { StyleSelector } from "./StyleSelector";
import { SizeSelector } from "./SizeSelector";

export type ImageStyle = "ghibli" | "3d" | "animated" | "realistic" | "vintage" | "cyberpunk";
export type ImageSize = "square" | "portrait" | "landscape";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("realistic");
  const [size, setSize] = useState<ImageSize>("square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
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
        toast.success("Image generated successfully!");
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
          <div>
            <label className="text-sm font-medium mb-2 block gradient-epic-text">
              Describe Your Vision
            </label>
            <Textarea
              placeholder="e.g., A majestic dragon soaring through sunset clouds, breathing fire..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 bg-background/50 border-white/10 focus:border-primary resize-none text-base"
              disabled={isGenerating}
            />
          </div>

          <StyleSelector value={style} onChange={setStyle} disabled={isGenerating} />
          <SizeSelector value={size} onChange={setSize} disabled={isGenerating} />

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-14 text-lg font-semibold gradient-epic hover:opacity-90 transition-opacity"
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
    </div>
  );
};
