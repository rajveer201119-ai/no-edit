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

      {/* Whiteboard-style faint grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsla(0,0%,100%,0.08) 1px, transparent 1px), linear-gradient(to bottom, hsla(0,0%,100%,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 85%)",
        }}
      />

      {/* Soft grain / noise texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      {/* Floating decorative shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[12%] left-[8%] w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-2xl animate-[float_9s_ease-in-out_infinite]" />
        <div className="absolute top-[22%] right-[10%] w-28 h-28 md:w-44 md:h-44 rounded-3xl rotate-12 bg-gradient-to-br from-accent/25 to-transparent blur-2xl animate-[float_11s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[18%] left-[14%] w-20 h-20 md:w-32 md:h-32 rounded-2xl -rotate-6 border border-white/15 bg-white/[0.03] backdrop-blur-md animate-[float_13s_ease-in-out_infinite]" />
        <div className="absolute bottom-[12%] right-[16%] w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[45%] right-[6%] w-10 h-10 md:w-14 md:h-14 rotate-45 border border-white/15 bg-white/[0.03] backdrop-blur-sm animate-[float_12s_ease-in-out_infinite]" />
      </div>

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
