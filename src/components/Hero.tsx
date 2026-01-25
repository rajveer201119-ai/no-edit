import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidGlassHeading } from "@/components/ui/liquid-glass-heading";
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
      min-h-[calc(100vh-40px)] overflow-hidden 
      bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#e8e8e8_88%)]  
      dark:bg-[linear-gradient(to_bottom,#000,#0000_30%,#898e8e_78%,#ffffff_99%_50%)] 
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] 
        -translate-x-1/2 rounded-[100%] bg-white dark:bg-black 
        bg-[radial-gradient(closest-side,#fff_82%,#000000)] 
        dark:bg-[radial-gradient(closest-side,#000_82%,#ffffff)] 
        animate-fade-up"
      />

      {/* Logo */}
      <div className="flex justify-center mb-4 md:mb-5 relative z-10">
        <img 
          src={epicLogo} 
          alt="EPIC Design Generator" 
          className="w-28 h-28 md:w-40 md:h-40 drop-shadow-2xl"
          width={160}
          height={160}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      
      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance 
        bg-gradient-to-br from-black from-30% to-black/40 
        bg-clip-text py-4 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-none tracking-tighter 
        text-transparent opacity-0 
        dark:from-white dark:to-white/40 relative z-10"
      >
        EPIC CAN MAKE YOU DESIGNS.......
      </h1>
      
      {/* Subtitle */}
      <p
        className="animate-fade-in mb-6 -translate-y-4 text-balance 
        text-sm md:text-base lg:text-lg tracking-tight text-gray-600 dark:text-gray-400 
        opacity-0 max-w-xl mx-auto relative z-10 [animation-delay:200ms]"
      >
        Describe what you want. EPIC creates and edits logos, posters, and graphics — no tools, no layers, no learning curve.
      </p>
      
      {/* Badges */}
      <div className="my-5 md:my-6 flex flex-wrap items-center justify-center gap-2 relative z-10 animate-fade-in opacity-0 [animation-delay:400ms]">
        {badges.map((badge) => (
          <span 
            key={badge}
            className="px-3 py-1 text-xs md:text-sm rounded-full border border-gray-300/50 dark:border-white/10 
            bg-white/50 dark:bg-black/30 backdrop-blur-sm text-gray-600 dark:text-gray-400"
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
        <p className="text-xs text-gray-500 dark:text-gray-500">
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
