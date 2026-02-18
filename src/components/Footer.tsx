import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-black text-white py-12 mt-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">EPIC Design</h3>
            <p className="text-sm text-gray-400 mb-4">
              Design generator for non-designers. Create professional logos, social media graphics, banners, and more with AI. No design skills needed.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="md:col-span-1" aria-label="Quick Links">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-primary transition-colors">Design Generator</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">About EPIC</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/pricing-india" className="text-sm text-gray-400 hover:text-primary transition-colors">Pricing (India)</Link></li>
              <li><Link to="/pricing-international" className="text-sm text-gray-400 hover:text-primary transition-colors">Pricing (International)</Link></li>
            </ul>
          </nav>

          {/* Design Tools */}
          <nav className="md:col-span-1" aria-label="Design Tools">
            <h4 className="text-lg font-semibold mb-4">Design Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/navigation-maker" className="text-sm text-amber-400 hover:text-primary transition-colors font-medium">🆕 Navigation Maker</Link></li>
              <li><Link to="/tools/poster-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Poster Maker</Link></li>
              <li><Link to="/tools/logo-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Logo Maker</Link></li>
              <li><Link to="/tools/resume-builder" className="text-sm text-gray-400 hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link to="/tools/youtube-thumbnail-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Thumbnail Maker</Link></li>
              <li><Link to="/tools/instagram-post-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Instagram Maker</Link></li>
              <li><Link to="/tools/certificate-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Certificate Maker</Link></li>
              <li><Link to="/tools/invitation-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Invitation Maker</Link></li>
              <li><Link to="/tools/banner-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Banner Maker</Link></li>
              <li><Link to="/tools/website-navigation-maker" className="text-sm text-gray-400 hover:text-primary transition-colors">Website Nav Builder</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <address className="not-italic text-sm text-gray-400 space-y-2">
              <p><span className="font-semibold text-white">Founder:</span> RAJVEER RINKU</p>
              <p>UNIT OF - NO BOX</p>
              <div className="mt-3 space-y-1">
                <Link to="/terms" className="block text-gray-400 hover:text-primary transition-colors">Terms & Conditions</Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
              </div>
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
            <a 
              href="https://twitter.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Connect with us on LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Visit our GitHub"
            >
              <Github size={24} />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
