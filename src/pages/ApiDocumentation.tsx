import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Code, Key, Send, CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ApiDocumentation = () => {
  const baseUrl = "https://mupprrjhftvxhblotcyt.supabase.co/functions/v1";

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-gradient-hero text-white py-12 px-6">
        <div className="container mx-auto">
          <Link to="/sms-admin" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-smooth">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">API Documentation</h1>
              <p className="text-xl text-blue-100 mt-2">
                Complete guide to integrating with the Jadara Labs SMS API
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Authentication Section */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Authentication</CardTitle>
              </div>
              <CardDescription>
                All API requests require authentication using an API key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Getting Your API Key</h3>
                <p className="text-muted-foreground mb-4">
                  Generate an API key from your <Link to="/sms-admin" className="text-primary hover:underline">SMS Admin Dashboard</Link>. 
                  Each key is unique and should be kept secure.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <code className="text-sm">jl_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef</code>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How to Authenticate</h3>
                <p className="text-muted-foreground mb-4">
                  Include your API key in the request headers and pass your Supabase auth token in the Authorization header.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border space-y-2">
                  <div><code className="text-sm">Authorization: Bearer YOUR_SUPABASE_AUTH_TOKEN</code></div>
                  <div><code className="text-sm">Content-Type: application/json</code></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send SMS Endpoint */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <CardTitle>Send SMS</CardTitle>
              </div>
              <CardDescription>
                Send SMS messages to one or multiple recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-green-600 bg-green-500/10">POST</Badge>
                <code className="text-sm bg-muted/50 px-3 py-1.5 rounded">{baseUrl}/send-sms</code>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Request Body</h3>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <pre className="text-sm overflow-x-auto">
{`{
  "recipients": ["2348012345678", "2348087654321"],
  "message": "Hello from Jadara Labs!"
}`}
                  </pre>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">recipients</Badge>
                    <div>
                      <p className="text-sm font-medium">Array of phone numbers</p>
                      <p className="text-xs text-muted-foreground">Format: Country code + number (e.g., 2348012345678)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">message</Badge>
                    <div>
                      <p className="text-sm font-medium">String - Message content</p>
                      <p className="text-xs text-muted-foreground">The SMS text to send (max 160 characters recommended)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Success Response</h3>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-500/10">200 OK</Badge>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "message": "2 messages sent successfully",
  "results": [
    {
      "phone_number": "2348012345678",
      "status": "sent",
      "message_id": "abc123"
    },
    {
      "phone_number": "2348087654321",
      "status": "sent",
      "message_id": "def456"
    }
  ],
  "total_cost": 10.00,
  "new_balance": 990.00
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Error Response</h3>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <Badge variant="secondary" className="bg-red-500/10">400 / 401 / 500</Badge>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <pre className="text-sm overflow-x-auto">
{`{
  "error": "Insufficient balance",
  "details": "Your wallet balance is too low to send 2 messages"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Implementation examples in popular programming languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="php">PHP</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Using Fetch API</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto">
{`const sendSMS = async () => {
  const response = await fetch('${baseUrl}/send-sms', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_AUTH_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipients: ['2348012345678', '2348087654321'],
      message: 'Hello from Jadara Labs!'
    })
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log('Success:', data);
    console.log('New balance:', data.new_balance);
  } else {
    console.error('Error:', data.error);
  }
};

sendSMS();`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Using Axios</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto">
{`const axios = require('axios');

const sendSMS = async () => {
  try {
    const response = await axios.post(
      '${baseUrl}/send-sms',
      {
        recipients: ['2348012345678', '2348087654321'],
        message: 'Hello from Jadara Labs!'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_SUPABASE_AUTH_TOKEN',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Success:', response.data);
    console.log('New balance:', response.data.new_balance);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

sendSMS();`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="python" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Using Requests Library</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto">
{`import requests
import json

def send_sms():
    url = '${baseUrl}/send-sms'
    
    headers = {
        'Authorization': 'Bearer YOUR_SUPABASE_AUTH_TOKEN',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'recipients': ['2348012345678', '2348087654321'],
        'message': 'Hello from Jadara Labs!'
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print('Success:', data)
        print('New balance:', data['new_balance'])
    else:
        error = response.json()
        print('Error:', error['error'])

send_sms()`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="php" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Using cURL</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto">
{`<?php

function sendSMS() {
    $url = '${baseUrl}/send-sms';
    
    $data = array(
        'recipients' => array('2348012345678', '2348087654321'),
        'message' => 'Hello from Jadara Labs!'
    );
    
    $headers = array(
        'Authorization: Bearer YOUR_SUPABASE_AUTH_TOKEN',
        'Content-Type: application/json'
    );
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    if ($httpCode == 200) {
        echo 'Success: ' . print_r($result, true);
        echo 'New balance: ' . $result['new_balance'];
    } else {
        echo 'Error: ' . $result['error'];
    }
}

sendSMS();

?>`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="curl" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Command Line</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto">
{`curl -X POST '${baseUrl}/send-sms' \\
  -H 'Authorization: Bearer YOUR_SUPABASE_AUTH_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "recipients": ["2348012345678", "2348087654321"],
    "message": "Hello from Jadara Labs!"
  }'`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Rate Limits & Best Practices */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Rate Limits & Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Rate Limits</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Maximum 100 recipients per request</li>
                  <li>Maximum 1000 requests per hour per API key</li>
                  <li>Requests exceeding limits will receive a 429 status code</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Always validate phone numbers before sending</li>
                  <li>Keep messages under 160 characters to avoid splitting</li>
                  <li>Handle errors gracefully and implement retry logic</li>
                  <li>Store API keys securely and never expose them in client-side code</li>
                  <li>Monitor your wallet balance to avoid service interruptions</li>
                  <li>Use meaningful message content that identifies your brand</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Error Codes</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">400</Badge>
                    <span className="text-sm text-muted-foreground">Bad Request - Invalid parameters or missing fields</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">401</Badge>
                    <span className="text-sm text-muted-foreground">Unauthorized - Invalid or missing API key</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">402</Badge>
                    <span className="text-sm text-muted-foreground">Payment Required - Insufficient wallet balance</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">429</Badge>
                    <span className="text-sm text-muted-foreground">Too Many Requests - Rate limit exceeded</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">500</Badge>
                    <span className="text-sm text-muted-foreground">Internal Server Error - Contact support if persists</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="shadow-soft bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions or need assistance integrating our API, our support team is here to help.
              </p>
              <div className="flex gap-3">
                <Link to="/sms-admin">
                  <Button variant="outline">
                    View Dashboard
                  </Button>
                </Link>
                <Button>
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;