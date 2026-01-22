import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import epicLogo from "@/assets/epic-logo.png";

export const Hero = () => {
  const scrollToChat = () => {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-[80vh] md:min-h-screen">
      <WebGLShader />
      
      <div className="relative border border-[#27272a] p-2 w-full mx-auto max-w-3xl">
        <main className="relative border border-[#27272a] py-8 md:py-10 overflow-hidden px-4">
          {/* Logo */}
          <div className="flex justify-center mb-4 md:mb-6">
            <img 
              src={epicLogo} 
              alt="EPIC Design Generator" 
              className="w-16 h-16 md:w-24 md:h-24 drop-shadow-2xl brightness-110"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' }}
              width={96}
              height={96}
              loading="eager"
            />
          </div>
          
          <h1 className="mb-3 text-white text-center text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter md:text-[clamp(2rem,8vw,7rem)]">
            Design is Everything
          </h1>
          <p className="text-white/60 px-4 md:px-6 text-center text-xs md:text-sm lg:text-lg max-w-2xl mx-auto">
            Unleashing creativity through bold visuals, seamless interfaces, and limitless possibilities. Create stunning designs without any design skills.
          </p>
          
          <div className="my-6 md:my-8 flex items-center justify-center gap-1">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <p className="text-xs text-green-500">Available for New Projects</p>
          </div>
          
          <div className="flex justify-center">
            <LiquidButton 
              className="text-white border rounded-full" 
              size="xl"
              onClick={scrollToChat}
            >
              Let's Go
            </LiquidButton>
          </div>
        </main>
      </div>
    </div>
  );
};
