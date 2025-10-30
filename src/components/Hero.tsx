import { ShaderAnimation } from "@/components/ui/shader-animation";
import epicLogo from "@/assets/epic-logo.png";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Shader Animation Background */}
      <div className="absolute inset-0 w-full h-full">
        <ShaderAnimation />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center space-y-8 py-16 md:py-24 px-4">
        <div className="animate-float">
          <img 
            src={epicLogo} 
            alt="EPIC Logo" 
            className="w-48 md:w-72 mx-auto drop-shadow-2xl"
          />
        </div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            Efficient AI Image Generator - Create Professional Art Instantly
          </h1>
          <h2 className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal drop-shadow-md">
            Transform text into stunning images with AI. Generate Ghibli-style art, 3D renders, realistic photos, cyberpunk graphics, vintage posters, and animated artwork. Perfect for social media, ads, and creative projects.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base" role="list" aria-label="AI Art Styles">
          {["Ghibli Anime Style", "3D Render Art", "Realistic AI Photos", "Cyberpunk Graphics", "Vintage Posters", "Animated Characters"].map((feature, i) => (
            <div 
              key={feature}
              className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 animate-glow"
              style={{ animationDelay: `${i * 0.2}s` }}
              role="listitem"
            >
              <span className="text-white font-medium drop-shadow-md">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
