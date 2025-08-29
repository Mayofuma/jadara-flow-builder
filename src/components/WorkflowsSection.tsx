import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  ShoppingCart, 
  GraduationCap,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const workflowTemplates = [
  {
    id: "healthcare",
    title: "Healthcare Workflow – Appointment Reminder",
    icon: Heart,
    color: "text-red-500",
    steps: [
      { icon: Calendar, title: "Trigger", description: "Appointment scheduled in calendar (Google Calendar / EMR)" },
      { icon: Clock, title: "Wait Node", description: "Pause until 24 hours before appointment" },
      { icon: Mail, title: "Email Node", description: "Send personalized reminder email with patient name, date, and time" },
      { icon: MessageSquare, title: "SMS Node", description: "Send SMS reminder (if phone number available)" },
      { icon: CheckCircle, title: "If Node", description: "If patient confirms via reply → mark as confirmed in EMR" },
      { icon: ArrowRight, title: "End Node", description: "Stop workflow" }
    ]
  },
  {
    id: "ecommerce",
    title: "E-commerce Workflow – Abandoned Cart Recovery",
    icon: ShoppingCart,
    color: "text-blue-500",
    steps: [
      { icon: ShoppingCart, title: "Trigger", description: "Customer adds items to cart but does not check out (Shopify / WooCommerce)" },
      { icon: Clock, title: "Wait Node", description: "Pause 2 hours" },
      { icon: CheckCircle, title: "If Node", description: "Check if purchase completed → If yes → End workflow" },
      { icon: Mail, title: "Email Node", description: "Send cart reminder email with product list + discount code" },
      { icon: Clock, title: "Wait Node", description: "Pause 24 hours" },
      { icon: CheckCircle, title: "If Node", description: "Check if purchase completed → If no → Send follow-up email with stronger incentive" },
      { icon: ArrowRight, title: "End Node", description: "Stop workflow" }
    ]
  },
  {
    id: "education",
    title: "Education Workflow – Student Onboarding",
    icon: GraduationCap,
    color: "text-green-500",
    steps: [
      { icon: GraduationCap, title: "Trigger", description: "New student enrollment in LMS (Moodle, Teachable, etc.)" },
      { icon: Mail, title: "Email Node", description: "Send welcome email with login details + orientation guide" },
      { icon: Clock, title: "Wait Node", description: "Pause 3 days" },
      { icon: Mail, title: "Email Node", description: "Send introduction to instructor + community links" },
      { icon: Clock, title: "Wait Node", description: "Pause 7 days" },
      { icon: Mail, title: "Email Node", description: "Send first assignment details or learning resources" },
      { icon: CheckCircle, title: "If Node", description: "If student has not logged in → Send gentle reminder email" },
      { icon: ArrowRight, title: "End Node", description: "Stop workflow" }
    ]
  }
];

const WorkflowsSection = () => {
  return (
    <section id="workflows" className="py-20 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready-to-Use Workflow Templates
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our pre-built automation workflows. Each template is designed with industry best practices and can be customized to fit your specific needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {workflowTemplates.map((workflow) => {
              const IconComponent = workflow.icon;
              return (
                <AccordionItem key={workflow.id} value={workflow.id} className="border-0">
                  <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-smooth">
                    <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-secondary/50 transition-smooth">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center`}>
                          <IconComponent className={`h-6 w-6 text-white`} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-semibold text-foreground">
                            {workflow.title}
                          </h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-8">
                      <div className="space-y-6">
                        {workflow.steps.map((step, index) => {
                          const StepIcon = step.icon;
                          return (
                            <div key={index} className="flex items-start space-x-4">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <StepIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">
                                  {step.title}
                                </h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                              {index < workflow.steps.length - 1 && (
                                <div className="w-px h-8 bg-border ml-4"></div>
                              )}
                            </div>
                          );
                        })}
                        
                        {workflow.id === 'healthcare' && (
                          <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">
                                  Live Healthcare Workflow
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  Experience the working appointment reminder system with real EMR integration, testing tools, and admin dashboard.
                                </p>
                              </div>
                              <Button asChild className="ml-4">
                                <a href="/healthcare-workflow">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Try Live Version
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default WorkflowsSection;