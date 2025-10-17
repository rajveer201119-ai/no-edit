export const Hero = () => {
  return (
    <div className="space-y-8 md:space-y-12 py-4 md:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                WE CRAFT THE FUTURE{" "}
                <span className="inline-block bg-yellow-400 text-black px-3 py-1.5 md:px-4 md:py-2 -rotate-1 text-2xl sm:text-3xl md:text-4xl lg:text-7xl">
                  CREATIVE.
                </span>
              </h1>
            </div>

            <div className="glass-card p-5 md:p-8 rounded-2xl md:rounded-3xl bg-yellow-400 max-w-md space-y-3 md:space-y-4">
              <div>
                <p className="text-xs md:text-sm font-medium text-black/70 mb-1">Images Generated</p>
                <p className="text-3xl md:text-4xl font-black text-black">10K+</p>
              </div>
              <p className="text-xs md:text-sm text-black/80 leading-relaxed">
                Join thousands of creators using AI to generate stunning images. 
                From concept to reality in seconds with our advanced AI technology.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-3 md:space-y-4 p-6 md:p-8">
                  <div className="text-4xl md:text-6xl">🎨</div>
                  <p className="text-base md:text-lg font-semibold">AI Image Generator</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Start creating below</p>
                </div>
              </div>
              <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-background/50 rounded-lg md:rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-base md:text-lg flex-shrink-0">
                  ✨
                </div>
                <div>
                  <p className="font-semibold text-xs md:text-sm">Featured Creator</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">AI Generated Art</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 flex flex-wrap gap-2 md:gap-3" role="list" aria-label="AI Art Styles">
          {["Ghibli Style", "3D Render", "Realistic", "Cyberpunk", "Vintage", "Anime"].map((style, i) => (
            <div 
              key={style}
              className="glass-card px-4 md:px-6 py-2 md:py-3 rounded-full border hover:border-primary/50 transition-all hover:scale-105"
              style={{ animationDelay: `${i * 0.1}s` }}
              role="listitem"
            >
              <span className="font-medium text-xs md:text-sm">{style}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
