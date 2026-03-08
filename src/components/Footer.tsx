import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-black text-white py-12 mt-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">EPIC Design</h3>
            <p className="text-sm text-gray-400 mb-4">
              Design generator for non-designers. Create professional logos, social media graphics, banners, and more with AI. No design skills needed.
            </p>
          </div>

          {/* Guides (Pillar Pages) */}
          <nav aria-label="Guides">
            <h4 className="text-lg font-semibold mb-4">Guides</h4>
            <ul className="space-y-2">
              <li><Link to="/website-flow-generator" className="text-sm text-gray-400 hover:text-primary transition-colors">Website Flow Generator</Link></li>
              <li><Link to="/visual-sitemap-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Visual Sitemap Maker</Link></li>
              <li><Link to="/user-flow-diagram-tool" className="text-sm text-gray-400 hover:text-primary transition-colors">User Flow Diagram Tool</Link></li>
              <li><Link to="/saas-navigation-planner" className="text-sm text-gray-400 hover:text-primary transition-colors">SaaS Navigation Planner</Link></li>
              <li><Link to="/drag-drop-website-builder" className="text-sm text-gray-400 hover:text-primary transition-colors">Drag & Drop Builder</Link></li>
              <li><Link to="/canva-alternative-for-students" className="text-sm text-gray-400 hover:text-primary transition-colors">Canva Alternative</Link></li>
              <li><Link to="/free-poster-design-tool" className="text-sm text-gray-400 hover:text-primary transition-colors">Free Poster Tool</Link></li>
              <li><Link to="/online-logo-maker-fast" className="text-sm text-gray-400 hover:text-primary transition-colors">Online Logo Maker</Link></li>
            </ul>
          </nav>

          {/* Design Tools */}
          <nav aria-label="Design Tools">
            <h4 className="text-lg font-semibold mb-4">Design Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/navigation-maker" className="text-sm text-amber-400 hover:text-primary transition-colors font-medium">🆕 Navigation Maker</Link></li>
              <li><Link to="/tools/poster-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Poster Maker</Link></li>
              <li><Link to="/tools/logo-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Logo Maker</Link></li>
              <li><Link to="/tools/resume-builder" className="text-sm text-gray-400 hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link to="/tools/youtube-thumbnail-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Thumbnail Maker</Link></li>
              <li><Link to="/tools/instagram-post-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Instagram Maker</Link></li>
              <li><Link to="/tools/certificate-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Certificate Maker</Link></li>
              <li><Link to="/tools/flyer-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Flyer Maker</Link></li>
              <li><Link to="/tools/business-card-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Business Card Maker</Link></li>
              <li><Link to="/tools/banner-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Banner Maker</Link></li>
              <li><Link to="/tools/invitation-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Invitation Maker</Link></li>
              <li><Link to="/tools/meme-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Meme Maker</Link></li>
              <li><Link to="/tools/infographic-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Infographic Maker</Link></li>
              <li><Link to="/tools/presentation-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Presentation Maker</Link></li>
              <li><Link to="/tools/brochure-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Brochure Maker</Link></li>
              <li><Link to="/tools/menu-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Menu Maker</Link></li>
              <li><Link to="/tools/album-cover-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Album Cover Maker</Link></li>
              <li><Link to="/tools/ebook-cover-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">eBook Cover Maker</Link></li>
            </ul>
          </nav>

          {/* Website Tools & Alternatives */}
          <nav aria-label="Website Tools & Alternatives">
            <h4 className="text-lg font-semibold mb-4">Website Tools</h4>
            <ul className="space-y-2 mb-4">
              <li><Link to="/analyzer" className="text-sm text-amber-400 hover:text-primary transition-colors font-medium">🔍 Website Analyzer</Link></li>
              <li><Link to="/sitemaps" className="text-sm text-amber-400 hover:text-primary transition-colors font-medium">🗺️ Sitemap Library</Link></li>
            </ul>

            <h4 className="text-lg font-semibold mb-4">Alternatives</h4>
            <ul className="space-y-2">
              <li><Link to="/alternatives/canva-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Canva Alternative</Link></li>
              <li><Link to="/alternatives/figma-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Figma Alternative</Link></li>
              <li><Link to="/alternatives/miro-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Miro Alternative</Link></li>
              <li><Link to="/alternatives/lucidchart-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Lucidchart Alternative</Link></li>
              <li><Link to="/alternatives/adobe-express-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Adobe Express Alt.</Link></li>
              <li><Link to="/alternatives/visme-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Visme Alternative</Link></li>
              <li><Link to="/alternatives/crello-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Crello Alternative</Link></li>
              <li><Link to="/alternatives/piktochart-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors">Piktochart Alternative</Link></li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 mt-6">Blog</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-gray-400 hover:text-primary transition-colors">All Articles</Link></li>
              <li><Link to="/blog/category/ux-design" className="text-sm text-gray-400 hover:text-primary transition-colors">UX Design</Link></li>
              <li><Link to="/blog/category/web-planning" className="text-sm text-gray-400 hover:text-primary transition-colors">Web Planning</Link></li>
              <li><Link to="/blog/category/saas-design" className="text-sm text-gray-400 hover:text-primary transition-colors">SaaS Design</Link></li>
              <li><Link to="/blog/category/design-tips" className="text-sm text-gray-400 hover:text-primary transition-colors">Design Tips</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <address className="not-italic text-sm text-gray-400 space-y-2">
              <p><span className="font-semibold text-white">Founder:</span> RAJVEER RINKU</p>
              <p>UNIT OF - NO BOX</p>
              <ul className="mt-3 space-y-1">
                <li><Link to="/about" className="block text-gray-400 hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="block text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/changelog" className="block text-gray-400 hover:text-primary transition-colors">Changelog</Link></li>
                <li><Link to="/roadmap" className="block text-gray-400 hover:text-primary transition-colors">Roadmap</Link></li>
                <li><Link to="/examples" className="block text-gray-400 hover:text-primary transition-colors">Examples</Link></li>
                <li><Link to="/pricing-india" className="block text-gray-400 hover:text-primary transition-colors">Pricing (India)</Link></li>
                <li><Link to="/pricing-international" className="block text-gray-400 hover:text-primary transition-colors">Pricing (Intl)</Link></li>
                <li><Link to="/terms" className="block text-gray-400 hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/privacy" className="block text-gray-400 hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
              <p className="text-xs mt-4">ALL RIGHTS RESERVED BY NO BOX © 2026</p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 EPIC Design Generator. All rights reserved.
          </p>
          
          <nav className="flex gap-4" aria-label="Social Media Links">
            <a href="https://x.com/epicdesigngen" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Follow EPIC Design on X (Twitter)"><Twitter size={24} /></a>
            <a href="https://instagram.com/epicdesigngen" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Follow EPIC Design on Instagram"><Instagram size={24} /></a>
            <a href="https://linkedin.com/company/epicdesigngen" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Connect with EPIC Design on LinkedIn"><Linkedin size={24} /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
