import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfigProps {
  config: {
    N8N_BASE_URL: string;
    APPOINTMENT_WEBHOOK_PATH: string;
    REPLY_WEBHOOK_PATH: string;
    RESCHEDULE_PATH: string;
    EMR_API_BASE: string;
    EMR_API_KEY: string;
  };
  setConfig: (config: any) => void;
}

const HealthcareConfig = ({ config, setConfig }: ConfigProps) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setConfig(localConfig);
    localStorage.setItem('healthcare-config', JSON.stringify(localConfig));
    toast({
      title: "Configuration saved",
      description: "Your healthcare workflow settings have been updated.",
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[hsl(var(--clinic-primary))]" />
          Healthcare Workflow Configuration
        </CardTitle>
        <CardDescription>
          Configure your n8n endpoints and EMR API settings for the appointment reminder workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">n8n Workflow Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="n8n-base">n8n Base URL</Label>
              <Input
                id="n8n-base"
                value={localConfig.N8N_BASE_URL}
                onChange={(e) => handleInputChange('N8N_BASE_URL', e.target.value)}
                placeholder="https://n8n.chuvana.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-webhook">Appointment Webhook Path</Label>
              <Input
                id="appointment-webhook"
                value={localConfig.APPOINTMENT_WEBHOOK_PATH}
                onChange={(e) => handleInputChange('APPOINTMENT_WEBHOOK_PATH', e.target.value)}
                placeholder="/webhook/appointment-scheduled-Trigger"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply-webhook">Reply Webhook Path</Label>
              <Input
                id="reply-webhook"
                value={localConfig.REPLY_WEBHOOK_PATH}
                onChange={(e) => handleInputChange('REPLY_WEBHOOK_PATH', e.target.value)}
                placeholder="/webhook/patient-reply"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-path">Reschedule Form Path</Label>
              <Input
                id="reschedule-path"
                value={localConfig.RESCHEDULE_PATH}
                onChange={(e) => handleInputChange('RESCHEDULE_PATH', e.target.value)}
                placeholder="/webhook/reschedule-appointment-trigger"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">EMR API Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="emr-base">EMR API Base URL</Label>
              <Input
                id="emr-base"
                value={localConfig.EMR_API_BASE}
                onChange={(e) => handleInputChange('EMR_API_BASE', e.target.value)}
                placeholder="https://api.your-emr.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emr-key">EMR API Key</Label>
              <div className="relative">
                <Input
                  id="emr-key"
                  type={showApiKey ? "text" : "password"}
                  value={localConfig.EMR_API_KEY}
                  onChange={(e) => handleInputChange('EMR_API_KEY', e.target.value)}
                  placeholder="Your EMR API key"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            className="bg-[hsl(var(--clinic-primary))] hover:bg-[hsl(var(--clinic-primary-dark))]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthcareConfig;