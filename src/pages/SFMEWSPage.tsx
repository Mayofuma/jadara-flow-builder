import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowRight, Droplets, Brain, MessageSquare, Monitor, CheckCircle, Target, Users, Building, Globe } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SFMEWSPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://n8n.chuvana.com/webhook-test/3c2a3bae-0107-4b2e-b967-a7b36587671e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast("Thank you! We'll be in touch soon.");
        setFormData({ name: "", email: "", organization: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Smart Flood Monitoring and Early Warning System (SFMEWS)
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                AI + IoT innovation to protect Lagos from recurrent flooding.
              </p>
              <Link to="/sfmews/dashboard">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 mr-4">
                  View Dashboard
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/sfmews/sensors">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  Manage Sensors
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* The Challenge Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">The Challenge</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                Every year, flooding in Lagos displaces thousands of residents, destroys property, and causes billions in economic losses. Despite efforts, existing systems lack real-time monitoring, accurate forecasting, and accessible communication in local languages.
              </p>
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">AI + IoT for Disaster Resilience</h2>
              <p className="text-lg text-muted-foreground mb-8 text-center">
                At Jadara Labs, we are developing the Smart Flood Monitoring and Early Warning System (SFMEWS) — an AI + IoT platform designed to predict and mitigate flooding risks across Lagos.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Droplets className="text-primary mr-3" size={24} />
                      <h3 className="font-semibold">IoT sensors continuously track rainfall and water levels.</h3>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Brain className="text-primary mr-3" size={24} />
                      <h3 className="font-semibold">AI models forecast flood risks before they happen.</h3>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="text-primary mr-3" size={24} />
                      <h3 className="font-semibold">Multilingual alerts (SMS, WhatsApp, USSD) reach communities in English, Yoruba, and Pidgin.</h3>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Monitor className="text-primary mr-3" size={24} />
                      <h3 className="font-semibold">Emergency dashboards empower response teams with real-time insights.</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-center text-lg font-medium">
                This approach ensures faster response times, fewer casualties, and reduced damage to homes and businesses.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-center mb-8">SFMEWS Workflow: From Sensors to Safety</h3>
                
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 shadow-soft mb-4">
                      <Droplets className="text-blue-600 mx-auto mb-4" size={32} />
                      <h4 className="font-bold text-blue-900 mb-2">IoT Sensors</h4>
                      <p className="text-sm text-blue-700">Collect water level data in real time.</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 shadow-soft mb-4">
                      <Brain className="text-blue-600 mx-auto mb-4" size={32} />
                      <h4 className="font-bold text-blue-900 mb-2">AI Forecasting</h4>
                      <p className="text-sm text-blue-700">Predict flood risks before they occur.</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 shadow-soft mb-4">
                      <MessageSquare className="text-blue-600 mx-auto mb-4" size={32} />
                      <h4 className="font-bold text-blue-900 mb-2">Multi-Channel Alerts</h4>
                      <p className="text-sm text-blue-700">Send notifications via SMS, WhatsApp, USSD in English, Yoruba, Pidgin.</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 shadow-soft mb-4">
                      <Monitor className="text-blue-600 mx-auto mb-4" size={32} />
                      <h4 className="font-bold text-blue-900 mb-2">Emergency Dashboard</h4>
                      <p className="text-sm text-blue-700">Provide live insights for response teams.</p>
                    </div>
                  </div>
                </div>
                
                {/* Arrow connectors */}
                <div className="hidden md:flex justify-center items-center mt-4">
                  <div className="flex items-center space-x-8">
                    <ArrowRight className="text-blue-400" size={24} />
                    <ArrowRight className="text-blue-400" size={24} />
                    <ArrowRight className="text-blue-400" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Impact Areas</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="text-primary mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold mb-4">Social Impact</h3>
                    <p className="text-muted-foreground">Faster response saves lives and reduces displacement.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Building className="text-primary mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold mb-4">Economic Impact</h3>
                    <p className="text-muted-foreground">Protects businesses and households, while creating new jobs in tech and emergency response.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Globe className="text-primary mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold mb-4">Environmental Impact</h3>
                    <p className="text-muted-foreground">Enhances climate resilience and supports better urban drainage planning.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Locations Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Pilot Locations</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Initial deployment will focus on these flood-prone Lagos areas:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Ikorodu", "Lekki", "Ajegunle", "Mushin", "Epe"].map((location) => (
                  <Card key={location}>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-primary">{location}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">SFMEWS Project Roadmap</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h3 className="text-xl font-bold mb-2">Pilot Phase</h3>
                  <p className="text-muted-foreground">Deploy IoT sensors in 5 Lagos locations.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h3 className="text-xl font-bold mb-2">Expansion Phase</h3>
                  <p className="text-muted-foreground">Scale coverage to all flood-prone areas.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h3 className="text-xl font-bold mb-2">Commercialization</h3>
                  <p className="text-muted-foreground">Launch freemium alerts, subscriptions & licensing.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                  <h3 className="text-xl font-bold mb-2">Long-Term Impact</h3>
                  <p className="text-muted-foreground">Nationwide adoption & climate resilience.</p>
                </div>
              </div>
              
              {/* Connecting line */}
              <div className="hidden md:block relative mt-8">
                <div className="absolute top-0 left-1/2 w-3/4 h-1 bg-blue-200 transform -translate-x-1/2 -translate-y-8"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Commercialization Strategy Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Commercialization Strategy</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">Residents</h3>
                    <p className="text-muted-foreground">Free alerts via SMS/WhatsApp/USSD.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">Businesses & Estates</h3>
                    <p className="text-muted-foreground">Subscription-based access to tailored flood intelligence.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">Government & NGOs</h3>
                    <p className="text-muted-foreground">Licensing for large-scale deployment and disaster management.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Join us in building a safer, more resilient Lagos.</h2>
                <p className="text-xl text-white/90">Partner with Jadara Labs to bring SFMEWS to life.</p>
              </div>
              
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="organization" className="text-foreground">Organization</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-foreground">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Sending..." : "Partner with Us"}
                      {!isSubmitting && <ArrowRight className="ml-2" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SFMEWSPage;