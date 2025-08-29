import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Phone, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  department: string;
  status: 'scheduled' | 'confirmed' | 'unconfirmed' | 'rescheduled';
}

interface ConfigProps {
  config: {
    EMR_API_BASE: string;
    EMR_API_KEY: string;
    N8N_BASE_URL: string;
    RESCHEDULE_PATH: string;
  };
}

const HealthcareAdmin = ({ config }: ConfigProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demo (replace with real API call)
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockAppointments: Appointment[] = [
        {
          id: 'APT-001',
          patientName: 'John Doe',
          patientEmail: 'john.doe@email.com',
          patientPhone: '+234-800-123-4567',
          appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          appointmentTime: '14:00',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          status: 'scheduled'
        },
        {
          id: 'APT-002',
          patientName: 'Jane Smith',
          patientEmail: 'jane.smith@email.com',
          patientPhone: '+234-800-987-6543',
          appointmentDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
          appointmentTime: '10:30',
          doctorName: 'Dr. Michael Brown',
          department: 'Neurology',
          status: 'confirmed'
        },
        {
          id: 'APT-003',
          patientName: 'David Wilson',
          patientEmail: 'david.wilson@email.com',
          appointmentDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split('T')[0],
          appointmentTime: '16:45',
          doctorName: 'Dr. Emily Davis',
          department: 'Orthopedics',
          status: 'unconfirmed'
        }
      ];
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const markConfirmed = async (appointmentId: string) => {
    try {
      // In real implementation, this would call your EMR API
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'confirmed' as const }
            : apt
        )
      );
      
      toast({
        title: "Appointment confirmed",
        description: `Appointment ${appointmentId} marked as confirmed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm appointment.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'secondary',
      confirmed: 'default',
      unconfirmed: 'destructive',
      rescheduled: 'outline'
    } as const;
    
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      unconfirmed: 'bg-red-100 text-red-800', 
      rescheduled: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge 
        variant={variants[status as keyof typeof variants]} 
        className={colors[status as keyof typeof colors]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    unconfirmed: appointments.filter(a => a.status === 'unconfirmed').length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[hsl(var(--clinic-primary))]" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Unconfirmed</p>
                <p className="text-2xl font-bold text-red-600">{stats.unconfirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[hsl(var(--clinic-primary))]" />
            Upcoming Appointments
          </CardTitle>
          <CardDescription>
            Manage and monitor patient appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--clinic-primary))]"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.patientEmail}</p>
                        {appointment.patientPhone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appointment.patientPhone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.appointmentDate}</p>
                        <p className="text-sm text-muted-foreground">{appointment.appointmentTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {appointment.status !== 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markConfirmed(appointment.id)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirm
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${config.N8N_BASE_URL}${config.RESCHEDULE_PATH}?id=${appointment.id}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthcareAdmin;