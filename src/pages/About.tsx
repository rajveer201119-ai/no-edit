import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Target, Lightbulb, Heart } from "lucide-react";
import epicLogo from "@/assets/epic-logo.png";

const baseUrl = "https://no-edit.lovable.app";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EPIC Design",
  url: baseUrl,
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/kG5hIp7FM3biSpv5njI7csuUQ6O2/uploads/1759212272541-file_00000000100c61faa64c1df9bb0aebc8.png",
  description: "EPIC is a free AI-powered design platform that helps anyone create professional graphics without design skills.",
  foundingDate: "2024",
  founder: { "@type": "Person", name: "NO BOX Team" },
  sameAs: [],
};

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="About EPIC — Free AI Design Platform"
        description="Learn about EPIC, the free AI design platform built to democratize design. Create professional posters, logos, and graphics without any design experience."
        keywords="about EPIC, EPIC design platform, free design tool, AI design generator"
        canonicalUrl={`${baseUrl}/about`}
        structuredData={aboutSchema}
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft size={20} /> Back to Home
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-16">
            <img src={epicLogo} alt="EPIC Design Logo" className="w-20 h-20 mx-auto mb-6" width={80} height={80} />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About EPIC</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              EPIC is a free design platform that empowers anyone to create professional-quality graphics — no design degree required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { icon: Target, title: "Our Mission", desc: "Democratize design by making professional-quality tools accessible to everyone, everywhere — for free." },
              { icon: Lightbulb, title: "Our Vision", desc: "A world where great design isn't limited by budget or skill — where every idea gets the visual it deserves." },
              { icon: Users, title: "Who We Serve", desc: "Students, entrepreneurs, marketers, educators, and creators who need beautiful designs without the learning curve." },
              { icon: Heart, title: "Our Values", desc: "Simplicity, accessibility, quality, and the belief that great tools should be free for everyone to use." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border/50 rounded-2xl p-6">
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">{item.title}</h2>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="text-center mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Built by NO BOX</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              EPIC is developed by NO BOX, a research organization focused on building tools that make technology accessible. We believe creativity shouldn't have a paywall.
            </p>
          </section>

          <div className="text-center">
            <Button onClick={() => navigate("/")} size="lg" className="rounded-full px-8">
              Start Designing Free
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
