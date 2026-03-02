import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from "lucide-react";

const baseUrl = "https://no-edit.lovable.app";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact EPIC Design",
  url: `${baseUrl}/contact`,
  description: "Get in touch with the EPIC design team for support, feedback, or partnerships.",
};

const Contact = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Contact Us — EPIC Design"
        description="Get in touch with EPIC. We help with support, feedback, and partnership inquiries."
        keywords="contact EPIC, EPIC support, design tool help, EPIC feedback"
        structuredData={contactSchema}
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft size={20} /> Back to Home
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-center">Contact Us</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Have a question, suggestion, or partnership idea? We'd love to hear from you.
          </p>

          <div className="grid gap-6">
            {[
              { icon: HelpCircle, title: "Support", desc: "Need help with EPIC? Check our FAQ on each tool page or reach out to us.", action: "Browse FAQs", link: "/" },
              { icon: MessageSquare, title: "Feedback", desc: "Tell us what you love, what's broken, or what you'd like to see next.", action: "Share Feedback", link: "/" },
              { icon: Mail, title: "Partnerships", desc: "Interested in collaborating? We're open to integrations and partnerships.", action: "Get in Touch", link: "/" },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border/50 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">{item.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                  <Button variant="outline" size="sm" onClick={() => navigate(item.link)} className="rounded-full">
                    {item.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
