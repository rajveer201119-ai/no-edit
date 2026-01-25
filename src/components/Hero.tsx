import { WebGLShader } from "@/components/ui/web-gl-shader";
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
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-[70vh] md:min-h-[85vh]">
      <WebGLShader />
      
      <div className="relative p-2 w-full mx-auto max-w-3xl">
        <main className="relative py-8 md:py-10 overflow-hidden px-4 backdrop-blur-sm bg-background/5">
          {/* Logo */}
          <div className="flex justify-center mb-4 md:mb-5">
            <img 
              src={epicLogo} 
              alt="EPIC Design Generator" 
              className="w-14 h-14 md:w-20 md:h-20 drop-shadow-2xl brightness-110"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' }}
              width={80}
              height={80}
              loading="eager"
            />
          </div>
          
          <div className="flex justify-center mb-3">
            <LiquidGlassHeading 
              as="h1" 
              className="text-3xl sm:text-4xl md:text-6xl text-center"
            >
              EPIC CAN MAKE YOU DESIGNS.......
            </LiquidGlassHeading>
          </div>
          
          <p className="text-muted-foreground px-4 md:px-6 text-center text-sm md:text-base lg:text-lg max-w-xl mx-auto">
            Describe what you want. EPIC creates and edits logos, posters, and graphics — no tools, no layers, no learning curve.
          </p>
          
          {/* Badges */}
          <div className="my-5 md:my-6 flex flex-wrap items-center justify-center gap-2">
            {badges.map((badge) => (
              <span 
                key={badge}
                className="px-3 py-1 text-xs md:text-sm rounded-full border border-border/50 bg-background/20 backdrop-blur-sm text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <LiquidButton 
              className="text-foreground border rounded-full" 
              size="xl"
              onClick={scrollToChat}
            >
              Start Designing Free
            </LiquidButton>
            <p className="text-xs text-muted-foreground">
              Free forever. Upgrade anytime for ₹10/month.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
