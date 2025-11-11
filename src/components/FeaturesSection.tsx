import { Heart, ShoppingCart, GraduationCap, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Heart,
    title: "Automation for Healthcare",
    description: "Send appointment reminders automatically.",
    details: "Integrate with EMR systems and calendars to automate patient communications, reduce no-shows, and improve care coordination."
  },
  {
    icon: ShoppingCart,
    title: "Automation for E-commerce",
    description: "Recover abandoned carts with personalized emails.",
    details: "Connect with Shopify, WooCommerce, and other platforms to automatically re-engage customers and boost conversion rates."
  },
  {
    icon: GraduationCap,
    title: "Automation for Education",
    description: "Onboard students with AI-powered workflows.",
    details: "Streamline enrollment processes, course communications, and student engagement with intelligent automation sequences."
  },
  {
    icon: MessageSquare,
    title: "Bulk SMS Service",
    description: "Send targeted SMS campaigns at scale.",
    details: "Powerful API-driven SMS platform with bulk messaging, usage analytics, and comprehensive documentation. Perfect for marketing campaigns, notifications, and alerts."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Industry-Specific Automation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready-to-use workflow templates designed for your industry. No technical expertise required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-bounce">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {feature.description}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;