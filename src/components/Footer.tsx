import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 mt-16 border-t border-white/10">
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
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Design Generator
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing-india" 
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Pricing (India)
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing-international" 
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Pricing (International)
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Design Types */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Design Types</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Logo Design</li>
              <li>Social Media Graphics</li>
              <li>Banners & Headers</li>
              <li>Posters & Flyers</li>
              <li>Business Cards</li>
              <li>Presentation Slides</li>
            </ul>
          </div>

          {/* Company Info */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <address className="not-italic text-sm text-gray-400 space-y-2">
              <p>
                <span className="font-semibold text-white">Founder:</span> RAJVEER RINKU
              </p>
              <p>UNIT OF - NO BOX</p>
              <p className="text-xs mt-4">
                ALL RIGHTS RESERVED BY NO BOX © 2025
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2025 EPIC Design Generator. All rights reserved.
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
