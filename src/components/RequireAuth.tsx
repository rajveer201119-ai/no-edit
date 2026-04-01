import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Store intended destination for redirect after login
        sessionStorage.setItem("epic_redirect_after_login", location.pathname + location.search);
        navigate("/auth", { replace: true });
      } else {
        setIsAuthed(true);
      }
      setIsChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        sessionStorage.setItem("epic_redirect_after_login", location.pathname + location.search);
        navigate("/auth", { replace: true });
      } else {
        setIsAuthed(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthed) return null;

  return <>{children}</>;
};
