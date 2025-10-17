import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import { ImageGenerator } from "@/components/ImageGenerator";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProPlanDialog } from "@/components/ProPlanDialog";
import { InstallButton } from "@/components/InstallButton";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ProPlanDialog />
        
        <AppSidebar />
        
        <div className="flex-1 flex flex-col relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-40 left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <header className="relative z-10 glass-card border-b border-border/50 backdrop-blur-lg sticky top-0">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <h1 className="text-xl font-bold gradient-epic-text">EPIC AI Studio</h1>
                </div>
                
                <div className="flex items-center gap-3">
                  <InstallButton />
                  <ThemeToggle />
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/admin")}
                      className="border-primary/30"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/pricing-india")}
                    className="border-primary/30"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Plans
                  </Button>
                  {isAuthed ? (
                    <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
                  ) : (
                    <Button size="sm" onClick={() => navigate("/auth")}>Sign in</Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="relative z-10 flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-8">
              <Hero />
              
              <section aria-label="AI Image Generator Tool" id="generate" className="scroll-mt-20">
                <div className="glass-card p-8 rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl my-12">
                  <h2 className="text-3xl font-black mb-6">Generate Your Vision</h2>
                  <ImageGenerator />
                </div>
              </section>
              
              <section aria-label="Community Generated Images" id="feed" className="scroll-mt-20">
                <Suspense fallback={<div className="text-center py-8">Loading feed...</div>}>
                  <Feed />
                </Suspense>
              </section>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
