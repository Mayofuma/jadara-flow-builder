import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free Plan",
    price: "$0",
    period: "/month",
    description: "Best for exploring automation",
    badge: null,
    features: [
      "Access to 1 workflow template (choose Healthcare, E-commerce, or Education)",
      "100 runs per month included",
      "Community support"
    ],
    cta: "Start Small",
    ctaDescription: "Experience the power of AI workflows"
  },
  {
    name: "Starter Plan",
    price: "$29",
    period: "/month",
    description: "Best for small teams",
    badge: "Most Popular",
    features: [
      "Access to any 2 workflow templates across industries",
      "500 runs per month included",
      "Email integrations (Gmail, Outlook)",
      "Priority email support"
    ],
    cta: "Get Started",
    ctaDescription: "Perfect for businesses ready to automate and save hours"
  },
  {
    name: "Growth Plan",
    price: "$79",
    period: "/month",
    description: "Best for growing businesses",
    badge: null,
    features: [
      "Full access to all workflow templates from 1 industry",
      "2,000 runs per month included",
      "Advanced integrations (Slack, CRM, Shopify, Calendly)",
      "Analytics dashboard for workflow performance"
    ],
    cta: "Scale Operations",
    ctaDescription: "Industry-specific automation that grows with you"
  },
  {
    name: "Pro Plan",
    price: "$149",
    period: "/month",
    description: "Best for enterprises & agencies",
    badge: "Enterprise",
    features: [
      "Unlimited access to all industries and all workflow templates",
      "10,000 runs per month included",
      "Premium integrations (Zapier, API access, Webhooks)",
      "Dedicated support & onboarding session"
    ],
    cta: "Unlock Full Power",
    ctaDescription: "Enterprise-grade automation for maximum impact"
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Automation Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparent pricing tailored for every business size. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-2 transition-smooth hover:shadow-medium ${
                plan.badge === "Most Popular" 
                  ? "border-primary shadow-soft scale-105" 
                  : "border-border hover:border-primary/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-4 py-1">
                    {plan.badge === "Most Popular" && <Star className="w-3 h-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Link to="/signup" className="block">
                    <Button 
                      className={`w-full ${
                        plan.badge === "Most Popular" 
                          ? "bg-gradient-primary hover:opacity-90" 
                          : ""
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    {plan.ctaDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Need a custom solution?</p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;