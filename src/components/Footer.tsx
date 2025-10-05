import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm mb-1">
              <span className="font-semibold">Founder:</span> RAJVEER RINKU
            </p>
            <p className="text-sm mb-1">UNIT OF - NO BOX</p>
            <p className="text-xs text-gray-400 mt-2">
              ALL RIGHTS RESERVED BY NO BOX © 2025
            </p>
            <Link 
              to="/terms" 
              className="text-xs text-gray-400 hover:text-primary transition-colors block mt-1"
            >
              Terms & Conditions
            </Link>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
