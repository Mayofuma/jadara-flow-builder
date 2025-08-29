import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Mail, MessageSquare, Settings, Users, TestTube2, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HealthcareConfig from '@/components/HealthcareConfig';
import HealthcareAdmin from '@/components/HealthcareAdmin';

const HealthcareWorkflow = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('healthcare-config');
    return saved ? JSON.parse(saved) : {
      N8N_BASE_URL: 'https://n8n.chuvana.com',
      APPOINTMENT_WEBHOOK_PATH: '/webhook/appointment-scheduled-Trigger',
      REPLY_WEBHOOK_PATH: '/webhook/patient-reply',
      RESCHEDULE_PATH: '/webhook/reschedule-appointment-trigger',
      EMR_API_BASE: '',
      EMR_API_KEY: ''
    };
  });

  const sendTestPayload = async () => {
    const testPayload = {
      appointmentId: `APT-${Date.now()}`,
      patientName: 'John Doe',
      patientEmail: 'john.doe@email.com',
      patientPhone: '+234-800-123-4567',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '14:00',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      status: 'scheduled'
    };

    try {
      const response = await fetch(`${config.N8N_BASE_URL}${config.APPOINTMENT_WEBHOOK_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      
      if (response.ok) {
        alert('Test appointment payload sent successfully!');
      } else {
        alert('Failed to send test payload');
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--clinic-primary))] to-[hsl(var(--clinic-primary-light))] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Healthcare Workflow – Appointment Reminder
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered appointment management system that automates reminders, confirmations, and rescheduling for your clinic.
            </p>
          </div>

          {/* Workflow Diagram */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[hsl(var(--clinic-primary))]" />
                Workflow Process
              </CardTitle>
              <CardDescription>
                How the appointment reminder system works from trigger to completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-between items-center gap-4 p-6 bg-gradient-to-r from-[hsl(var(--clinic-primary)/0.1)] to-[hsl(var(--clinic-primary-light)/0.1)] rounded-lg">
                {[
                  { icon: Calendar, title: 'Trigger', desc: 'Appointment Scheduled' },
                  { icon: Clock, title: 'Wait', desc: '24h Before Appointment' },
                  { icon: Mail, title: 'Email', desc: 'Send Reminder' },
                  { icon: MessageSquare, title: 'SMS', desc: 'Multi-language Alert' }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-[hsl(var(--clinic-primary))] rounded-full flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                      {index < 3 && (
                        <div className="hidden md:block absolute w-8 h-0.5 bg-[hsl(var(--clinic-primary))] transform translate-x-16 mt-6"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Management Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube2 className="h-4 w-4" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <HealthcareAdmin config={config} />
            </TabsContent>

            <TabsContent value="testing" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Workflow Triggers</CardTitle>
                  <CardDescription>
                    Send test data to your n8n workflow endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Send Test Appointment</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Trigger the appointment scheduled webhook with sample patient data
                      </p>
                      <Button 
                        onClick={sendTestPayload}
                        className="w-full bg-[hsl(var(--clinic-primary))] hover:bg-[hsl(var(--clinic-primary-dark))]"
                      >
                        <TestTube2 className="h-4 w-4 mr-2" />
                        Send Test Payload
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Reschedule Form</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Test the patient reschedule form (opens in new tab)
                      </p>
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`${config.N8N_BASE_URL}${config.RESCHEDULE_PATH}?id=TEST-123`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Reschedule Form
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config" className="mt-6">
              <HealthcareConfig config={config} setConfig={setConfig} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthcareWorkflow;