import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const pricingTiers = [
  {
    name: "Starter",
    price: "₦5,000",
    description: "Perfect for small businesses getting started",
    credits: "1,000 SMS credits",
    features: [
      "1,000 SMS messages",
      "Basic API access",
      "Email support",
      "Usage analytics",
      "Standard delivery speed"
    ],
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Business",
    price: "₦15,000",
    description: "For growing businesses with higher volume",
    credits: "5,000 SMS credits",
    features: [
      "5,000 SMS messages",
      "Priority API access",
      "Priority support",
      "Advanced analytics",
      "Fast delivery",
      "Bulk upload CSV",
      "Scheduled messaging"
    ],
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large-scale operations",
    credits: "Unlimited SMS credits",
    features: [
      "Unlimited SMS messages",
      "Dedicated API endpoints",
      "24/7 Premium support",
      "Custom analytics dashboard",
      "Instant delivery",
      "White-label options",
      "Dedicated account manager",
      "SLA guarantee"
    ],
    icon: Zap,
    color: "from-orange-500 to-red-500"
  }
];

const SmsPricingSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bulk SMS Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your messaging needs. Scale as you grow with flexible pricing and powerful features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-smooth hover:shadow-medium ${
                  tier.popular ? 'border-primary border-2 shadow-medium scale-105' : 'border-border'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-primary text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {tier.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-2">
                    {tier.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center py-4 border-y border-border">
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {tier.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.credits}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/bulk-sms" className="block">
                    <Button 
                      className={`w-full ${tier.popular ? 'bg-gradient-primary' : ''}`}
                      variant={tier.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <Card className="max-w-4xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-center">All Plans Include</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">API Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive guides with code examples in multiple languages
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Real-time Monitoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Track delivery status and engagement metrics in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Secure API Keys</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate and manage multiple API keys with expiration dates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">99.9% Uptime</h4>
                  <p className="text-sm text-muted-foreground">
                    Reliable infrastructure ensuring your messages are delivered
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Delivery Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed logs and analytics for every message sent
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">No Setup Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Start sending messages immediately with no hidden costs
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-3xl mx-auto bg-gradient-primary text-white border-0 shadow-medium">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Start Sending?
              </h3>
              <p className="text-lg text-white/90 mb-6">
                Join thousands of businesses using our SMS platform to reach their customers effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/bulk-sms">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/api-docs">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View API Documentation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SmsPricingSection;
