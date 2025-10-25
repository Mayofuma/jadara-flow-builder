import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 px-6 bg-gradient-hero min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              AI-Powered Workflows for{" "}
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Smarter Businesses
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-delay">
              Healthcare, E-commerce, and Education automation templates — ready in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delay">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50 shadow-strong">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-blue-100 animate-fade-in-delay">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-sm">Workflows Automated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm">Integrations</div>
              </div>
            </div>
          </div>
          <div className="relative animate-float">
            <img 
              src={heroImage} 
              alt="AI Workflow Automation Dashboard" 
              className="rounded-2xl shadow-strong w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;