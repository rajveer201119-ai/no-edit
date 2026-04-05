import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const baseUrl = "https://no-edit.lovable.app";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact EPIC Design",
  url: `${baseUrl}/contact`,
  description: "Get in touch with the EPIC design team for support, feedback, or partnerships.",
};

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    try {
      // Send via mailto as a fallback (opens email client)
      const subject = encodeURIComponent(`EPIC Contact: ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:noboxrgroup@gmail.com?subject=${subject}&body=${body}`;
      toast.success("Opening your email client to send the message!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send. Please email us directly at noboxrgroup@gmail.com");
    } finally {
      setSending(false);
    }
  };

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

        <main className="container mx-auto px-4 py-16 max-w-xl">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-center">Contact Us</h1>
          <p className="text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Have a question, suggestion, or partnership idea? Fill out the form below.
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="contact-name" className="text-sm font-medium text-foreground">Name <span className="text-destructive">*</span></Label>
                <Input id="contact-name" value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Your name" className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="contact-email" className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></Label>
                <Input id="contact-email" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="you@example.com" className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="contact-phone" className="text-sm font-medium text-foreground">Phone <span className="text-destructive">*</span></Label>
                <Input id="contact-phone" type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={errors.phone ? "border-destructive" : ""} />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="contact-message" className="text-sm font-medium text-foreground">Message <span className="text-destructive">*</span></Label>
                <Textarea id="contact-message" value={form.message} onChange={e => handleChange("message", e.target.value)} placeholder="Tell us what's on your mind..." rows={5} className={errors.message ? "border-destructive" : ""} />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={sending} className="w-full gap-2">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Or email us directly at <a href="mailto:noboxrgroup@gmail.com" className="text-primary hover:underline">noboxrgroup@gmail.com</a></p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
