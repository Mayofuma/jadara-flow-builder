import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Droplets, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SensorData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  currentReading: number;
  threshold: number;
  lastUpdated: string;
  status: 'normal' | 'warning' | 'danger';
}

interface Reading {
  id: string;
  sensorId: string;
  value: number;
  timestamp: string;
}

const SFMEWSDashboard = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock API base URL - replace with your actual API
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://your-api.com' 
    : 'http://localhost:8000';

  useEffect(() => {
    fetchSensors();
    fetchLatestReadings();
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchSensors();
      fetchLatestReadings();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchSensors = async () => {
    try {
      // Mock data for demo - replace with actual API call
      const mockSensors: SensorData[] = [
        {
          id: '1',
          name: 'Ikorodu Station',
          latitude: 6.6018,
          longitude: 3.5106,
          currentReading: 2.5,
          threshold: 3.0,
          lastUpdated: new Date().toISOString(),
          status: 'normal'
        },
        {
          id: '2',
          name: 'Lekki Station',
          latitude: 6.4698,
          longitude: 3.6043,
          currentReading: 3.2,
          threshold: 3.0,
          lastUpdated: new Date().toISOString(),
          status: 'danger'
        },
        {
          id: '3',
          name: 'Ajegunle Station',
          latitude: 6.4564,
          longitude: 3.3364,
          currentReading: 2.8,
          threshold: 3.0,
          lastUpdated: new Date().toISOString(),
          status: 'warning'
        },
        {
          id: '4',
          name: 'Mushin Station',
          latitude: 6.5328,
          longitude: 3.3439,
          currentReading: 1.8,
          threshold: 3.0,
          lastUpdated: new Date().toISOString(),
          status: 'normal'
        },
        {
          id: '5',
          name: 'Epe Station',
          latitude: 6.5833,
          longitude: 3.9833,
          currentReading: 2.2,
          threshold: 3.0,
          lastUpdated: new Date().toISOString(),
          status: 'normal'
        }
      ];

      setSensors(mockSensors);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch sensor data');
      setIsLoading(false);
    }
  };

  const fetchLatestReadings = async () => {
    try {
      // Mock readings data
      const mockReadings: Reading[] = [
        { id: '1', sensorId: '1', value: 2.5, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: '2', sensorId: '2', value: 3.2, timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
        { id: '3', sensorId: '3', value: 2.8, timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
        { id: '4', sensorId: '4', value: 1.8, timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
        { id: '5', sensorId: '5', value: 2.2, timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() }
      ];

      setReadings(mockReadings);
    } catch (err) {
      console.error('Failed to fetch readings:', err);
    }
  };

  const dangerSensors = sensors.filter(s => s.status === 'danger');
  const warningSensors = sensors.filter(s => s.status === 'warning');

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <Activity className="animate-spin mx-auto mb-4" size={48} />
            <p>Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/sfmews">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Project
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">SFMEWS Dashboard</h1>
                <p className="text-muted-foreground">Real-time flood monitoring across Lagos</p>
              </div>
            </div>
            <Link to="/sfmews/sensors">
              <Button>Manage Sensors</Button>
            </Link>
          </div>

          {/* Alert Banner */}
          {dangerSensors.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Flood Warning Alert!</AlertTitle>
              <AlertDescription className="text-red-700">
                {dangerSensors.length} sensor(s) have exceeded safety thresholds: {' '}
                {dangerSensors.map(s => s.name).join(', ')}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Sensor Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] w-full">
                    <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                      <div className="text-center">
                        <Droplets className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                        <p className="text-muted-foreground mb-4">
                          Real-time sensor locations will be displayed here
                        </p>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          {sensors.map((sensor) => (
                            <div key={sensor.id} className="flex justify-between items-center p-2 bg-background rounded">
                              <span>{sensor.name}</span>
                              <Badge 
                                variant={sensor.status === 'danger' ? 'destructive' : 
                                         sensor.status === 'warning' ? 'secondary' : 'default'}
                              >
                                {sensor.currentReading}m
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Sensors</span>
                    <Badge variant="outline">{sensors.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal</span>
                    <Badge variant="default">{sensors.filter(s => s.status === 'normal').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning</span>
                    <Badge variant="secondary">{warningSensors.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Danger</span>
                    <Badge variant="destructive">{dangerSensors.length}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Readings */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sensors.slice(0, 5).map((sensor) => (
                      <div key={sensor.id} className="flex justify-between items-center p-2 rounded border">
                        <div>
                          <p className="font-medium text-sm">{sensor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sensor.lastUpdated).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm">{sensor.currentReading}m</p>
                          <Badge 
                            variant={sensor.status === 'danger' ? 'destructive' : 
                                     sensor.status === 'warning' ? 'secondary' : 'default'}
                          >
                            {sensor.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SFMEWSDashboard;