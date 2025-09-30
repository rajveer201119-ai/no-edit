import epicLogo from "@/assets/epic-logo.png";

export const Hero = () => {
  return (
    <div className="text-center space-y-8 py-12 md:py-20 px-4">
      <div className="animate-float">
        <img 
          src={epicLogo} 
          alt="EPIC Logo" 
          className="w-64 md:w-96 mx-auto drop-shadow-2xl"
        />
      </div>
      
      <div className="space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold gradient-epic-text leading-tight">
          Transform Ideas into Visual Magic
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Create stunning images, ads, and posters with AI-powered artistry. 
          Choose from multiple artistic styles and bring your vision to life.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
        {["Ghibli Style", "3D Renders", "Realistic Photos", "Cyberpunk Art"].map((feature, i) => (
          <div 
            key={feature}
            className="glass-card px-4 py-2 rounded-full border border-white/10 animate-glow"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <span className="gradient-epic-text font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
