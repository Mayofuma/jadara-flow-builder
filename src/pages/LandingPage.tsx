import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorkflowsSection from "@/components/WorkflowsSection";
import SmsPricingSection from "@/components/SmsPricingSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Droplets, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* Research Projects Section */}
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Projects</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Beyond business automation, we're pioneering AI + IoT solutions for real-world impact
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-primary p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Droplets className="text-white mx-auto mb-4" size={48} />
                      <h3 className="text-white font-bold text-xl">SFMEWS</h3>
                      <p className="text-white/80 text-sm">AI + IoT Platform</p>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-bold mb-4">
                      Smart Flood Monitoring & Early Warning System
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Our flagship research project combines IoT sensors with AI forecasting to predict and mitigate flooding risks across Lagos. Real-time monitoring, multilingual alerts, and emergency dashboards work together to protect communities and save lives.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="text-primary" size={16} />
                        <span>AI Forecasting</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="text-primary" size={16} />
                        <span>IoT Sensors</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="text-primary" size={16} />
                        <span>Multi-lingual Alerts</span>
                      </div>
                    </div>
                    <Link to="/sfmews">
                      <Button size="lg">
                        Explore SFMEWS
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
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
                  <Link to="/sfmews">
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
        <SmsPricingSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;