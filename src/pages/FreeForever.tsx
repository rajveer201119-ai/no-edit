import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Gift, ArrowRight } from "lucide-react";

const UNLOCKED = [
  "Unlimited sitemap & user-flow projects",
  "Unlimited pages per project",
  "PDF, PNG and JSON export — no watermark",
  "AI sitemap generation",
  "UX Tester + Website Analyzer",
  "Full structure library & templates",
];

const FreeForever = () => (
  <>
    <SEO
      title="EPIC is Free Forever — Retired, All Features Unlocked"
      description="EPIC is retired and free for lifetime. Every former Pro feature — unlimited sitemaps, exports, AI generation and analysis — is unlocked for everyone, at no cost."
    />
    <main id="main-content" className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Gift className="h-3.5 w-3.5" /> Retired · Free for lifetime
          </span>
          <h1 className="mt-5 text-4xl font-bold text-foreground">EPIC is now free for everyone</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            There are no plans, no payments and no limits anymore. EPIC has been retired as a paid
            product, and every feature is permanently unlocked for all users.
          </p>
        </div>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Everything you get, free</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {UNLOCKED.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
        </Card>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/navigation-maker">
              Start building free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  </>
);

export default FreeForever;
