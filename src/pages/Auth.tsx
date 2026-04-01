import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(255, "Email too long");

const signInPasswordSchema = z.string()
  .min(1, "Password is required");

const signUpPasswordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password too long");

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTo = () => {
      const saved = sessionStorage.getItem("epic_redirect_after_login");
      if (saved) {
        sessionStorage.removeItem("epic_redirect_after_login");
        navigate(saved, { replace: true });
      } else {
        navigate("/");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) redirectTo();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirectTo();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }

    // Validate password based on mode
    const passwordSchema = mode === "signup" ? signUpPasswordSchema : signInPasswordSchema;
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast.error(passwordValidation.error.errors[0].message);
      return;
    }

    const validatedEmail = emailValidation.data.toLowerCase();
    
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: validatedEmail, 
          password 
        });
        if (error) throw error;
        toast.success("Signed in successfully");
        navigate("/");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email: validatedEmail,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SEO title="Sign In — EPIC Design" description="Sign in or create a free EPIC account." noIndex={true} />
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground">Access the EPIC AI image generator.</p>
        </header>

        <nav className="grid grid-cols-2 gap-2" aria-label="Auth mode">
          <Button variant={mode === "signin" ? "default" : "outline"} onClick={() => setMode("signin")}>
            Sign in
          </Button>
          <Button variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>
            Sign up
          </Button>
        </nav>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {mode === "signup" ? "Set Your Own Password" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          {mode === "signin" && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={async () => {
                  const emailVal = emailSchema.safeParse(email);
                  if (!emailVal.success) {
                    toast.error("Enter your email address first");
                    return;
                  }
                  setLoading(true);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(emailVal.data.toLowerCase(), {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) throw error;
                    toast.success("Check your email for a password reset link.");
                  } catch (err: any) {
                    toast.error(err?.message || "Failed to send reset email");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Forgot your password?
              </button>
            </div>
          )}
          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          <div className="text-center">
            <Button type="button" variant="secondary" onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </form>
      </Card>
    </main>
    </>
  );
};

export default Auth;
