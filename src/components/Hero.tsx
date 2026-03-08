import { WebGLShader } from "@/components/ui/web-gl-shader";
import { Button } from "@/components/ui/button";

const badges = [
  "No Design Skills",
  "Plan Websites",
  "Export JSON", 
  "200+ Templates",
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
      <div className="absolute inset-0 -z-20"><WebGLShader /></div>
      <div className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-[2px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.02] to-transparent" />

      <div className="flex justify-center mb-4 md:mb-5 relative z-10">
        <img 
          src="/epic-logo-256.png" 
          alt="EPIC — Visual Sitemap & Design Platform" 
          className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl"
          width={112}
          height={112}
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />
      </div>
      
      <h1
        className="animate-fade-in -translate-y-4 text-balance 
        bg-gradient-to-b from-white to-white/50 
        bg-clip-text py-4 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-none tracking-[-0.04em] 
        text-transparent opacity-0 relative z-10"
      >
        Plan, design &amp; export — effortlessly
      </h1>
      
      <p
        className="animate-fade-in mb-6 -translate-y-4 text-balance 
        text-sm md:text-base lg:text-lg tracking-tight text-neutral-400 
        opacity-0 max-w-xl mx-auto relative z-10 [animation-delay:200ms]"
      >
        Map your website structure. Create stunning graphics. Export clean JSON or HD images — no tools, no layers, no learning curve.
      </p>
      
      <div className="my-5 md:my-6 flex flex-wrap items-center justify-center gap-2 relative z-10 animate-fade-in opacity-0 [animation-delay:400ms]">
        {badges.map((badge) => (
          <span 
            key={badge}
            className="px-3 py-1 text-xs md:text-sm rounded-md border border-white/10 
            bg-white/5 backdrop-blur-md text-neutral-400"
          >
            {badge}
          </span>
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-3 relative z-20 animate-fade-in opacity-0 [animation-delay:600ms]">
        <Button 
          className="bg-white text-neutral-900 hover:bg-white/90 rounded-lg min-w-[200px] min-h-[48px] text-sm font-medium shadow-sm" 
          size="lg"
          onClick={scrollToChat}
        >
          Start Designing Free
        </Button>
        <p className="text-xs text-neutral-500">
          Free forever. Upgrade anytime for ₹10.
        </p>
      </div>

      <div
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      />
    </section>
  );
};
