import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">🧾 EPIC – Terms & Conditions</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Last updated:</strong> October 2025<br />
            <strong>App name:</strong> EPIC<br />
            <strong>Website:</strong> <a href="https://no-edit.lovable.app" className="text-primary hover:underline">https://no-edit.lovable.app</a><br />
            <strong>Operated by:</strong> NO BOX (Research Organization)
          </p>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using EPIC, you agree to be bound by these Terms and Conditions.
              If you do not agree, please do not use the app.
            </p>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>EPIC is an AI-powered image creation and editing tool that allows users to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate images using AI prompts and styles</li>
              <li>Edit, transform, and share images</li>
              <li>Explore a public AI Feed and interact with others' creations</li>
            </ul>
            <p className="mt-4">Features may evolve or change at any time as the app is updated.</p>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years old to use EPIC.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>Do not share your password or misuse other users' accounts.</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Use of Content</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own the images you generate, but by posting to the AI Feed, you grant EPIC permission to display them publicly.</li>
              <li>You may not upload or generate content that is illegal, harmful, offensive, or violates anyone's rights.</li>
              <li>EPIC may remove or restrict content that breaks these rules.</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The EPIC name, logo, and interface design belong to NO BOX.</li>
              <li>You may not copy, redistribute, or resell the app or its source code.</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. AI-Generated Content Disclaimer</h2>
            <p>
              AI-generated outputs may not always be accurate, unique, or free of copyright issues.
              You are responsible for how you use generated content outside the app.
            </p>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>EPIC reserves the right to suspend or terminate any account found violating the Terms.</li>
              <li>You may stop using the app at any time.</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>EPIC is provided "as is."</li>
              <li>NO BOX and its team are not responsible for any losses, damages, or misuse of generated content.</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              These Terms may be updated occasionally. Continued use of EPIC means you accept the latest version.
            </p>
          </section>

          <hr className="my-8" />
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
