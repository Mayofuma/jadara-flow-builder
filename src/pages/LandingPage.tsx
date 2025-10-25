import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorkflowsSection from "@/components/WorkflowsSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* Research & Innovation Banner */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto bg-white/10 border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Brain className="text-white mr-3" size={32} />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Research & Innovation</h2>
                  <Zap className="text-white ml-3" size={32} />
                </div>
                <p className="text-lg text-white/90 text-center mb-6">
                  Beyond business automation, Jadara Labs is pioneering AI + IoT research for real-world impact. 
                  Explore our flagship project: Smart Flood Monitoring & Early Warning System (SFMEWS).
                </p>
                <div className="text-center">
                  <Link to="/research">
                    <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                      Explore SFMEWS Project
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <WorkflowsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;