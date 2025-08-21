import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Since backend is not set up, show a message about Supabase integration
    toast({
      title: "Backend Integration Required",
      description: "Please connect to Supabase to enable signup functionality.",
    });
  };

  const benefits = [
    "Access to industry-specific workflow templates",
    "100 free automation runs per month",
    "Community support and resources",
    "No credit card required to start"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Benefits */}
        <div className="text-white">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8 hover:opacity-80 transition-smooth">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold">Jadara Labs</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join thousands of businesses automating with AI
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Start with our free plan and scale as you grow. No hidden fees, no long-term contracts.
          </p>
          
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-blue-100">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side - Signup form */}
        <Card className="w-full max-w-md mx-auto shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>
              Get started with AI workflow automation in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
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
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;