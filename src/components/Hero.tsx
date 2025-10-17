export const Hero = () => {
  return (
    <div className="space-y-12 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                WE CRAFT THE FUTURE{" "}
                <span className="inline-block bg-yellow-400 text-black px-4 py-2 -rotate-1">
                  CREATIVE.
                </span>
              </h1>
            </div>

            <div className="glass-card p-8 rounded-3xl bg-yellow-400 max-w-md space-y-4">
              <div>
                <p className="text-sm font-medium text-black/70 mb-1">Images Generated</p>
                <p className="text-4xl font-black text-black">10K+</p>
              </div>
              <p className="text-sm text-black/80 leading-relaxed">
                Join thousands of creators using AI to generate stunning images. 
                From concept to reality in seconds with our advanced AI technology.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-4 rounded-3xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">🎨</div>
                  <p className="text-lg font-semibold">AI Image Generator</p>
                  <p className="text-sm text-muted-foreground">Start creating below</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 p-3 bg-background/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                  ✨
                </div>
                <div>
                  <p className="font-semibold text-sm">Featured Creator</p>
                  <p className="text-xs text-muted-foreground">AI Generated Art</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3" role="list" aria-label="AI Art Styles">
          {["Ghibli Style", "3D Render", "Realistic", "Cyberpunk", "Vintage", "Anime"].map((style, i) => (
            <div 
              key={style}
              className="glass-card px-6 py-3 rounded-full border hover:border-primary/50 transition-all hover:scale-105"
              style={{ animationDelay: `${i * 0.1}s` }}
              role="listitem"
            >
              <span className="font-medium text-sm">{style}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
