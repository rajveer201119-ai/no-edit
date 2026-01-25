import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import epicLogo from "@/assets/epic-logo.png";

const badges = [
  "No Design Skills",
  "Just Chat",
  "Edit Instantly", 
  "Logos & Posters",
  "Pro at ₹10",
  "Free to Start"
];

export const Hero = () => {
  const scrollToChat = () => {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative mx-auto w-full pt-24 md:pt-40 px-6 text-center md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden rounded-b-xl"
    >
      {/* Single Flowing Line Background */}
      <div className="absolute inset-0 -z-20">
        <WebGLShader />
      </div>
      
      {/* Glass Background Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-sm" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.03] to-transparent" />

      {/* Logo */}
      <div className="flex justify-center mb-4 md:mb-5 relative z-10">
        <img 
          src={epicLogo} 
          alt="EPIC Design Generator" 
          className="w-28 h-28 md:w-40 md:h-40 drop-shadow-2xl"
          width={160}
          height={160}
          loading="eager"
          // @ts-ignore - fetchpriority is valid HTML attribute
          fetchpriority="high"
        />
      </div>
      
      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance 
        bg-gradient-to-br from-white from-30% to-white/60 
        bg-clip-text py-4 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-none tracking-tighter 
        text-transparent opacity-0 relative z-10"
      >
        EPIC CAN MAKE YOU DESIGNS.......
      </h1>
      
      {/* Subtitle */}
      <p
        className="animate-fade-in mb-6 -translate-y-4 text-balance 
        text-sm md:text-base lg:text-lg tracking-tight text-gray-300 
        opacity-0 max-w-xl mx-auto relative z-10 [animation-delay:200ms]"
      >
        Describe what you want. EPIC creates and edits logos, posters, and graphics — no tools, no layers, no learning curve.
      </p>
      
      {/* Badges */}
      <div className="my-5 md:my-6 flex flex-wrap items-center justify-center gap-2 relative z-10 animate-fade-in opacity-0 [animation-delay:400ms]">
        {badges.map((badge) => (
          <span 
            key={badge}
            className="px-3 py-1 text-xs md:text-sm rounded-full border border-white/10 
            bg-white/5 backdrop-blur-md text-gray-300"
          >
            {badge}
          </span>
        ))}
      </div>
      
      {/* CTA */}
      <div className="flex flex-col items-center gap-3 relative z-20 animate-fade-in opacity-0 [animation-delay:600ms]">
        <LiquidButton 
          className="text-foreground border rounded-full" 
          size="xl"
          onClick={scrollToChat}
        >
          Start Designing Free
        </LiquidButton>
        <p className="text-xs text-gray-400">
          Free forever. Upgrade anytime for ₹10/month.
        </p>
      </div>

      {/* Bottom Fade */}
      <div
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      />
    </section>
  );
};
