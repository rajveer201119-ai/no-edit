import { ShaderAnimation } from "@/components/ui/shader-animation";
import epicLogo from "@/assets/epic-logo.png";

export const Hero = () => {
  return (
    <header className="relative overflow-hidden rounded-2xl">
      {/* Shader Animation Background */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <ShaderAnimation />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center space-y-8 py-16 md:py-24 px-4">
        <div className="animate-float">
          <img 
            src={epicLogo} 
            alt="EPIC AI Image Generator - Transform text into stunning artwork with artificial intelligence" 
            className="w-48 md:w-72 mx-auto drop-shadow-2xl relative z-20 brightness-110"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' }}
            width={288}
            height={288}
            loading="eager"
          />
        </div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            Free AI Image Generator - Create Stunning Art Instantly
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal drop-shadow-md">
            Transform text into stunning images with AI. Generate Ghibli-style art, 3D renders, realistic photos, cyberpunk graphics, vintage posters, and animated artwork. Perfect for social media, ads, and creative projects.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm md:text-base" role="navigation" aria-label="AI Art Styles">
          {[
            { name: "Ghibli Anime Style", desc: "Create Studio Ghibli inspired anime artwork" },
            { name: "3D Render Art", desc: "Generate professional 3D rendered graphics" },
            { name: "Realistic AI Photos", desc: "Create photorealistic AI images" },
            { name: "Cyberpunk Graphics", desc: "Design futuristic cyberpunk art" },
            { name: "Vintage Posters", desc: "Generate retro and vintage style posters" },
            { name: "Animated Characters", desc: "Create animated character designs" }
          ].map((feature, i) => (
            <div 
              key={feature.name}
              className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 animate-glow"
              style={{ animationDelay: `${i * 0.2}s` }}
              title={feature.desc}
            >
              <span className="text-white font-medium drop-shadow-md">{feature.name}</span>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};
