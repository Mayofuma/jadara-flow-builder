import { Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-background">Jadara Labs</span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              AI-powered workflow automation for Healthcare, E-commerce, and Education. 
              Streamline your processes with ready-to-use templates.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-background transition-smooth">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-background transition-smooth">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="text-muted-foreground hover:text-background transition-smooth">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-background transition-smooth">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-background transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-background transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/security" className="text-muted-foreground hover:text-background transition-smooth">
                  Security
                </a>
              </li>
              <li>
                <a href="/compliance" className="text-muted-foreground hover:text-background transition-smooth">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Jadara Labs. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">Made with ❤️ for automation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;