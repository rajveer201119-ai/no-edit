import { ShaderAnimation } from "@/components/ui/shader-animation";

export const Hero = () => {
  return (
    <div className="text-center space-y-8 py-12 md:py-20 px-4">
      <div className="animate-float w-64 md:w-96 h-64 md:h-96 mx-auto rounded-xl overflow-hidden">
        <ShaderAnimation />
      </div>
      
      <div className="space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold gradient-epic-text leading-tight">
          Efficient AI Image Generator - Create Professional Art Instantly
        </h1>
        <h2 className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
          Transform text into stunning images with AI. Generate Ghibli-style art, 3D renders, realistic photos, cyberpunk graphics, vintage posters, and animated artwork. Perfect for social media, ads, and creative projects.
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base" role="list" aria-label="AI Art Styles">
        {["Ghibli Anime Style", "3D Render Art", "Realistic AI Photos", "Cyberpunk Graphics", "Vintage Posters", "Animated Characters"].map((feature, i) => (
          <div 
            key={feature}
            className="glass-card px-4 py-2 rounded-full border border-white/10 animate-glow"
            style={{ animationDelay: `${i * 0.2}s` }}
            role="listitem"
          >
            <span className="gradient-epic-text font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
