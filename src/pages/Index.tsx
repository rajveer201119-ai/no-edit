import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Hero } from "@/components/Hero";
import { ImageGenerator } from "@/components/ImageGenerator";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { InstallButton } from "@/components/InstallButton";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { SEO, homePageSchema } from "@/components/SEO";
import { Sparkles, Shield } from "lucide-react";

const Feed = lazy(() => import("@/components/Feed").then(mod => ({ default: mod.Feed })));

const Index = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <SEO 
        title="EPIC - Design Generator for Non-Designers | Create Professional Designs Instantly"
        description="AI-powered design generator for non-designers. Create stunning logos, social media graphics, banners, posters, and business cards instantly. No design skills needed."
        keywords="AI design generator, design for non-designers, logo maker, social media graphics, banner maker, poster design, business card maker, AI graphic design"
        canonicalUrl="https://epic-ai-generator.lovable.app/"
        structuredData={homePageSchema}
      />
      <div className="min-h-screen">
        <ProPlanDialog />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex justify-end items-center gap-3 mb-4">
          <InstallButton />
          <ThemeToggle />
          {isAdmin && (
            <GradientButton 
              variant="variant"
              onClick={() => navigate("/admin")}
              className="relative z-10"
            >
              <span className="relative z-10">
                <Shield className="mr-2 h-4 w-4 inline" />
                Admin
              </span>
            </GradientButton>
          )}
          <GradientButton 
            onClick={() => navigate("/pricing-india")}
            className="relative z-10"
          >
            <span className="relative z-10">
              <Sparkles className="mr-2 h-4 w-4 inline" />
              View Plans
            </span>
          </GradientButton>
          {isAuthed ? (
            <GradientButton variant="variant" onClick={signOut} className="relative z-10">
              <span className="relative z-10">Sign out</span>
            </GradientButton>
          ) : (
            <GradientButton onClick={() => navigate("/auth")} className="relative z-10">
              <span className="relative z-10">Sign in</span>
            </GradientButton>
          )}
        </header>
        <AnnouncementBanner />
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
    </>
  );
};

export default Index;
