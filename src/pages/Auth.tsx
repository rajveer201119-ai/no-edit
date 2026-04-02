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
import { Separator } from "@/components/ui/separator";

const emailSchema = z.string().trim().min(1, "Email is required").email("Invalid email address").max(255, "Email too long");
const signInPasswordSchema = z.string().min(1, "Password is required");
const signUpPasswordSchema = z.string().min(6, "Password must be at least 6 characters").max(128, "Password too long");

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) { toast.error(emailValidation.error.errors[0].message); return; }
    const passwordSchema = mode === "signup" ? signUpPasswordSchema : signInPasswordSchema;
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) { toast.error(passwordValidation.error.errors[0].message); return; }
    const validatedEmail = emailValidation.data.toLowerCase();

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: validatedEmail, password });
        if (error) throw error;
        toast.success("Signed in successfully");
        navigate("/");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({ email: validatedEmail, password, options: { emailRedirectTo: redirectUrl } });
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
      <main className="min-h-screen flex items-center justify-center px-4 bg-background">
        <Card className="w-full max-w-md p-6 space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? "Sign in" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground">Access EPIC — Visual Sitemap Builder & Design Platform.</p>
          </header>

          <nav className="grid grid-cols-2 gap-2" aria-label="Auth mode">
            <Button variant={mode === "signin" ? "default" : "outline"} onClick={() => setMode("signin")}>Sign in</Button>
            <Button variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>Sign up</Button>
          </nav>

          {/* Google Sign-In */}
          <Button
            variant="outline"
            className="w-full gap-2 h-11"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">or</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{mode === "signup" ? "Set Your Own Password" : "Password"}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
            {mode === "signin" && (
              <div className="text-center">
                <button type="button" className="text-sm text-primary hover:underline" onClick={async () => {
                  const emailVal = emailSchema.safeParse(email);
                  if (!emailVal.success) { toast.error("Enter your email address first"); return; }
                  setLoading(true);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(emailVal.data.toLowerCase(), { redirectTo: `${window.location.origin}/reset-password` });
                    if (error) throw error;
                    toast.success("Check your email for a password reset link.");
                  } catch (err: any) { toast.error(err?.message || "Failed to send reset email"); } finally { setLoading(false); }
                }}>Forgot your password?</button>
              </div>
            )}
            <div className="text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>New here? <button type="button" className="underline text-foreground" onClick={() => setMode("signup")}>Create an account</button></>
              ) : (
                <>Already have an account? <button type="button" className="underline text-foreground" onClick={() => setMode("signin")}>Sign in</button></>
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
