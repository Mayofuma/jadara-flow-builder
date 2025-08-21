import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, ShoppingCart, GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IndustryInfo {
  title: string;
  description: string;
  template: string;
  icon: typeof Heart;
  color: string;
}

const industryTemplates: Record<string, IndustryInfo> = {
  healthcare: {
    title: "Healthcare Automation",
    description: "Streamline patient communications and appointment management",
    template: "Appointment Reminder Workflow",
    icon: Heart,
    color: "text-red-500"
  },
  ecommerce: {
    title: "E-commerce Automation", 
    description: "Recover lost sales and improve customer engagement",
    template: "Abandoned Cart Recovery Workflow",
    icon: ShoppingCart,
    color: "text-blue-500"
  },
  education: {
    title: "Education Automation",
    description: "Enhance student onboarding and course engagement",
    template: "Student Onboarding Workflow", 
    icon: GraduationCap,
    color: "text-green-500"
  }
};

const DashboardPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [businessInfo, setBusinessInfo] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Mock user data - in real app this would come from auth context
  const userName = "John Smith";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedIndustry || !businessInfo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an industry and provide business information.",
        variant: "destructive"
      });
      return;
    }

    const formData = {
      industry: selectedIndustry,
      businessInfo: businessInfo,
      userName: userName,
      timestamp: new Date().toISOString()
    };

    try {
      // Send to the provided webhook
      const response = await fetch("https://n8n.chuvana.com/webhook-test/3c2a3bae-0107-4b2e-b967-a7b36587671e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Success!",
          description: "Your information has been submitted successfully.",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl shadow-strong text-center">
          <CardContent className="p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Thank You!</h2>
            <p className="text-xl text-muted-foreground mb-6">
              A Jadara Labs workflow specialist will reach out shortly to help you get started with your automation journey.
            </p>
            <p className="text-muted-foreground mb-8">
              In the meantime, check your email for helpful resources and tips to maximize your workflow efficiency.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              size="lg"
            >
              Return to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedIndustryInfo = selectedIndustry ? industryTemplates[selectedIndustry] : null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-gradient-primary text-white py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome, {userName}! 👋
          </h1>
          <p className="text-xl text-blue-100">
            Let's set up your perfect automation workflow
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Industry Selection */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Choose Your Industry</CardTitle>
                <CardDescription>
                  Select your primary industry to see relevant automation templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Dynamic Industry Information */}
            {selectedIndustryInfo && (
              <Card className="shadow-soft border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <selectedIndustryInfo.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-primary">{selectedIndustryInfo.title}</CardTitle>
                      <CardDescription>{selectedIndustryInfo.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/50 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-2">Available Template:</h4>
                    <p className="text-primary font-medium text-lg">{selectedIndustryInfo.template}</p>
                    <p className="text-muted-foreground text-sm mt-2">
                      This workflow will be customized based on your business information below.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Information */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Tell Us About Your Business</CardTitle>
                <CardDescription>
                  Share details about your business and accomplishments to help us customize your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="businessInfo">Business Information & Accomplishments</Label>
                  <Textarea
                    id="businessInfo"
                    value={businessInfo}
                    onChange={(e) => setBusinessInfo(e.target.value)}
                    placeholder="Tell us about your business size, current processes, key achievements, challenges you're facing, and what you hope to accomplish with automation..."
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    The more details you provide, the better we can tailor your automation workflow to your specific needs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                size="lg"
                className="bg-gradient-primary hover:opacity-90 px-8"
                disabled={!selectedIndustry || !businessInfo.trim()}
              >
                Submit & Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Our team will review your information and reach out within 24 hours
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;