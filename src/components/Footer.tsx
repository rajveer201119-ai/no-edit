import { Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-card text-foreground py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-foreground">EPIC</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The fastest visual sitemap builder for designers, developers, and founders. Plan website structures, export JSON or HD images.
            </p>
          </div>

          {/* Tools */}
          <nav aria-label="Tools">
            <h4 className="text-sm font-semibold mb-4 text-foreground">Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/navigation-maker" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sitemap Builder</Link></li>
              <li><Link to="/analyzer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Website Analyzer</Link></li>
              <li><Link to="/sitemaps" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sitemap Library</Link></li>
              <li><Link to="/my-projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Projects</Link></li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h4 className="text-sm font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/changelog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</Link></li>
              <li><Link to="/roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</Link></li>
              <li><Link to="/examples" className="text-sm text-muted-foreground hover:text-primary transition-colors">Examples</Link></li>
              <li><Link to="/free" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free Forever</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">A unit of NO BOX</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 EPIC. All rights reserved.
          </p>
          <nav className="flex gap-4" aria-label="Social Media Links">
            <a href="https://x.com/epicdesigngen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow on X"><Twitter size={20} /></a>
            <a href="https://instagram.com/epicdesigngen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow on Instagram"><Instagram size={20} /></a>
            <a href="https://linkedin.com/company/epicdesigngen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Connect on LinkedIn"><Linkedin size={20} /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
