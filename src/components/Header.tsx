import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Sparkles, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PremiumModal from "./PremiumModal";
import epicLogo from "@/assets/epic-logo.png";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("is_premium")
      .eq("user_id", userId)
      .single();

    setIsPremium(data?.is_premium ?? false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/auth");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={epicLogo} alt="EPIC" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold gradient-epic-text">EPIC</h1>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {!isPremium && (
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="gradient-epic hover:opacity-90 transition-opacity"
                    size="sm"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Go Premium
                  </Button>
                )}
                {isPremium && (
                  <div className="px-3 py-1 rounded-full bg-gradient-epic/20 border border-yellow-400/30 text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                    Premium
                  </div>
                )}
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarFallback className="bg-gradient-epic text-white text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="gradient-epic hover:opacity-90 transition-opacity"
                size="sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <PremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onSuccess={() => checkPremiumStatus(user?.id)}
      />
    </>
  );
};

export default Header;
