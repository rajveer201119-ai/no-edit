import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import epicLogo from "@/assets/epic-logo.png";

interface NewHomepageProps {
  onStartDesigning: () => void;
  onBrowseInspiration: () => void;
}

export const NewHomepage = ({ onStartDesigning, onBrowseInspiration }: NewHomepageProps) => {
  return (
    <section
      className="relative mx-auto w-full pt-24 md:pt-40 px-6 text-center 
      min-h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <WebGLShader />
      </div>
      
      {/* Glass Background Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-sm" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.03] to-transparent" />

      {/* Logo */}
      <div className="flex justify-center mb-6 relative z-10">
        <img 
          src={epicLogo} 
          alt="EPIC Design Generator" 
          className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl"
          width={128}
          height={128}
          loading="eager"
        />
      </div>
      
      {/* Headline */}
      <h1
        className="animate-fade-in text-balance 
        bg-gradient-to-br from-white from-30% to-white/60 
        bg-clip-text py-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter 
        text-transparent relative z-10 max-w-3xl"
      >
        Design in seconds — with or without AI
      </h1>
      
      {/* Subtitle */}
      <p
        className="animate-fade-in mt-4 mb-8 text-balance 
        text-base md:text-lg tracking-tight text-gray-300 
        max-w-xl mx-auto relative z-10 [animation-delay:200ms]"
      >
        Create stunning posters, logos, and social graphics. No design skills needed.
      </p>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-20 animate-fade-in [animation-delay:400ms]">
        <LiquidButton 
          className="text-foreground border rounded-full min-w-[200px] min-h-[48px] cursor-pointer 
          hover:scale-105 active:scale-95 transition-transform duration-200" 
          size="xl"
          onClick={onStartDesigning}
        >
          Start Designing
        </LiquidButton>
        
        <button
          onClick={onBrowseInspiration}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 
          transition-colors duration-200 min-h-[44px] px-4 cursor-pointer"
        >
          Browse Inspiration
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 
        bg-gradient-to-t from-background to-transparent pointer-events-none"
      />
    </section>
  );
};
