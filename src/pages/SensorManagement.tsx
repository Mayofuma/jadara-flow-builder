import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Sensor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  threshold: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastReading?: number;
  lastUpdated?: string;
}

const SensorManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    threshold: ''
  });

  // Check if user is authenticated admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSensors();
  }, [user, navigate]);

  const fetchSensors = async () => {
    try {
      // Mock data for demo - replace with actual API call
      const mockSensors: Sensor[] = [
        {
          id: '1',
          name: 'Ikorodu Station',
          latitude: 6.6018,
          longitude: 3.5106,
          threshold: 3.0,
          status: 'active',
          lastReading: 2.5,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Lekki Station',
          latitude: 6.4698,
          longitude: 3.6043,
          threshold: 3.0,
          status: 'active',
          lastReading: 3.2,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Ajegunle Station',
          latitude: 6.4564,
          longitude: 3.3364,
          threshold: 3.0,
          status: 'maintenance',
          lastReading: 2.8,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          id: '4',
          name: 'Mushin Station',
          latitude: 6.5328,
          longitude: 3.3439,
          threshold: 3.0,
          status: 'active',
          lastReading: 1.8,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Epe Station',
          latitude: 6.5833,
          longitude: 3.9833,
          threshold: 3.0,
          status: 'inactive',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        }
      ];

      setSensors(mockSensors);
      setIsLoading(false);
    } catch (error) {
      toast('Failed to fetch sensors');
      setIsLoading(false);
    }
  };

  const handleAddSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newSensor: Sensor = {
        id: Date.now().toString(),
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        threshold: parseFloat(formData.threshold),
        status: 'active'
      };

      // Mock API call - replace with actual endpoint
      setSensors(prev => [...prev, newSensor]);
      
      toast('Sensor added successfully');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      toast('Failed to add sensor');
    }
  };

  const handleEditSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSensor) return;

    try {
      const updatedSensor: Sensor = {
        ...editingSensor,
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        threshold: parseFloat(formData.threshold),
      };

      // Mock API call - replace with actual endpoint
      setSensors(prev => prev.map(s => s.id === editingSensor.id ? updatedSensor : s));
      
      toast('Sensor updated successfully');
      setEditingSensor(null);
      resetForm();
    } catch (error) {
      toast('Failed to update sensor');
    }
  };

  const handleDeleteSensor = async (sensorId: string) => {
    if (!confirm('Are you sure you want to delete this sensor?')) return;

    try {
      // Mock API call - replace with actual endpoint
      setSensors(prev => prev.filter(s => s.id !== sensorId));
      toast('Sensor deleted successfully');
    } catch (error) {
      toast('Failed to delete sensor');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', latitude: '', longitude: '', threshold: '' });
  };

  const openEditDialog = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setFormData({
      name: sensor.name,
      latitude: sensor.latitude.toString(),
      longitude: sensor.longitude.toString(),
      threshold: sensor.threshold.toString()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <p>Loading sensors...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/sfmews/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Sensor Management</h1>
                <p className="text-muted-foreground">Manage SFMEWS monitoring stations</p>
              </div>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sensor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sensor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSensor} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Sensor Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Victoria Island Station"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="6.4281"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="3.4219"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="threshold">Flood Threshold (meters)</Label>
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      step="0.1"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      placeholder="3.0"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setShowAddDialog(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Sensor</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Admin Access Notice */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You are logged in as an admin. This page allows you to manage SFMEWS sensor stations.
            </AlertDescription>
          </Alert>

          {/* Sensors Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sensor Stations ({sensors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sensors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No sensors found. Add your first sensor to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">Location</th>
                        <th className="text-left py-3 px-2">Threshold</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Last Reading</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensors.map((sensor) => (
                        <tr key={sensor.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-2 font-medium">{sensor.name}</td>
                          <td className="py-4 px-2 text-sm font-mono">{sensor.id}</td>
                          <td className="py-4 px-2 text-sm">
                            {sensor.latitude.toFixed(4)}, {sensor.longitude.toFixed(4)}
                          </td>
                          <td className="py-4 px-2 text-sm">{sensor.threshold}m</td>
                          <td className="py-4 px-2">
                            <Badge
                              variant={
                                sensor.status === 'active' ? 'default' :
                                sensor.status === 'maintenance' ? 'secondary' : 'outline'
                              }
                            >
                              {sensor.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 text-sm">
                            {sensor.lastReading ? `${sensor.lastReading}m` : 'No data'}
                            {sensor.lastUpdated && (
                              <div className="text-xs text-muted-foreground">
                                {new Date(sensor.lastUpdated).toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(sensor)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteSensor(sensor.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={!!editingSensor} onOpenChange={(open) => !open && setEditingSensor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Sensor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSensor} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Sensor Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-latitude">Latitude</Label>
                    <Input
                      id="edit-latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-longitude">Longitude</Label>
                    <Input
                      id="edit-longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-threshold">Flood Threshold (meters)</Label>
                  <Input
                    id="edit-threshold"
                    name="threshold"
                    type="number"
                    step="0.1"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setEditingSensor(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SensorManagement;