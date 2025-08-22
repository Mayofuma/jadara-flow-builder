import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Send, Heart, ShoppingCart, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface IndustryInfo {
  title: string;
  description: string;
  template: string;
  icon: typeof Heart;
  color: string;
}

const industryTemplates: Record<string, IndustryInfo> = {
  Healthcare: {
    title: "Healthcare Automation",
    description: "Streamline patient communications and appointment management",
    template: "Appointment Reminder Workflow",
    icon: Heart,
    color: "text-red-500"
  },
  "E-commerce": {
    title: "E-commerce Automation", 
    description: "Recover lost sales and improve customer engagement",
    template: "Abandoned Cart Recovery Workflow",
    icon: ShoppingCart,
    color: "text-blue-500"
  },
  Education: {
    title: "Education Automation",
    description: "Enhance student onboarding and course engagement",
    template: "Student Onboarding Workflow", 
    icon: GraduationCap,
    color: "text-green-500"
  }
};

const DashboardPage = () => {
  const [formData, setFormData] = useState({
    industry: "",
    businessDescription: ""
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
          setFormData({
            industry: data.industry || "",
            businessDescription: data.business_description || ""
          });
        }
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update or create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          industry: formData.industry,
          business_description: formData.businessDescription
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Send to webhook
      const payload = {
        industry: formData.industry,
        businessDescription: formData.businessDescription,
        userEmail: user.email,
        userName: `${user.user_metadata?.first_name} ${user.user_metadata?.last_name}`,
        timestamp: new Date().toISOString()
      };

      const response = await fetch("https://n8n.chuvana.com/webhook-test/3c2a3bae-0107-4b2e-b967-a7b36587671e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "A Jadara Labs workflow specialist will reach out shortly.",
        });
        
        // Update local state
        setUserProfile(prev => ({
          ...prev,
          industry: formData.industry,
          business_description: formData.businessDescription
        }));
      } else {
        throw new Error("Failed to submit to webhook");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const selectedIndustryInfo = formData.industry ? industryTemplates[formData.industry] : null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-gradient-hero text-white py-16 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-smooth">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold">Jadara Labs</span>
            </Link>
            <h1 className="text-3xl font-bold">
              Welcome to your dashboard, {user.user_metadata?.first_name || 'there'}! 👋
            </h1>
            <p className="text-xl text-blue-100 mt-2">
              Let's set up your perfect automation workflow
            </p>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-primary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
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
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({...prev, industry: value}))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
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
                  <Label htmlFor="businessDescription">Business Information & Accomplishments</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData(prev => ({...prev, businessDescription: e.target.value}))}
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
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Submitting..." : "Submit Information"}
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