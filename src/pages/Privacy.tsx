import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const baseUrl = "https://no-edit.lovable.app";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Privacy Policy — EPIC Design"
        description="EPIC's privacy policy. How we collect, use, and protect your data on our free design platform."
        keywords="EPIC privacy policy, data protection, design tool privacy"
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft size={20} /> Back to Home
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8"><strong>Last updated:</strong> February 2026 · <strong>Operated by:</strong> NO BOX</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p>When you use EPIC, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account info:</strong> Email address when you sign up.</li>
                <li><strong>Usage data:</strong> Design actions, template usage, and feature interactions.</li>
                <li><strong>Device data:</strong> Browser type, screen size, and operating system for optimization.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve the EPIC platform.</li>
                <li>To manage your account and usage limits.</li>
                <li>To send important updates about the service.</li>
                <li>To analyze usage patterns and optimize performance.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Data Storage</h2>
              <p>Your designs are stored locally on your device and in our secure cloud infrastructure powered by Supabase. We use industry-standard encryption to protect your data.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
              <p>We use Supabase for authentication and database services. AI image generation is processed through secure API endpoints. We do not sell your data to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, update, or delete your account data at any time.</li>
                <li>Export your designs before deleting your account.</li>
                <li>Opt out of non-essential communications.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <p>We use essential cookies for authentication and session management. No third-party tracking cookies are used.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Changes</h2>
              <p>We may update this policy. Continued use of EPIC means you accept the latest version.</p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacy;
