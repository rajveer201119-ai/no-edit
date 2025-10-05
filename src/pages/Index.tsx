import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import { ImageGenerator } from "@/components/ImageGenerator";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

const Feed = lazy(() => import("@/components/Feed").then(mod => ({ default: mod.Feed })));

const Index = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex justify-end items-center gap-3 mb-4">
          <ThemeToggle />
          {isAuthed ? (
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign in</Button>
          )}
        </header>
        <main>
          <Hero />
          <section aria-label="AI Image Generator Tool">
            <ImageGenerator />
          </section>
          <section aria-label="Community Generated Images">
            <Suspense fallback={<div className="text-center py-8">Loading feed...</div>}>
              <Feed />
            </Suspense>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
