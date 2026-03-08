import { Twitter, Linkedin, Link2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
}

export const SocialShare = ({ url, title }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const share = (href: string) => window.open(href, "_blank", "width=600,height=400");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground font-medium">Share:</span>
      <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => share(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}>
        <Twitter className="h-3.5 w-3.5" /> Twitter
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => share(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}>
        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => share(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`)}>
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copied!"); }}>
        <Link2 className="h-3.5 w-3.5" /> Copy
      </Button>
    </div>
  );
};
