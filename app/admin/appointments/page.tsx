'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Phone, User } from 'lucide-react';

interface AppointmentRequest {
  id: number;
  clinic_place_id: string;
  clinic_name: string;
  clinic_email: string;
  pet_owner_name: string;
  pet_owner_email: string;
  pet_owner_phone: string;
  pet_name: string;
  pet_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AppointmentRequestsAdmin() {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/appointments');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching appointment requests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Appointment Requests</h1>
          <p className="text-slate-600 mt-2">View all appointment requests from pet owners</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading appointment requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No appointment requests yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{request.clinic_name}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Submitted: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={request.status === 'pending' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Owner Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 mb-3">Pet Owner Information</h3>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-slate-600" />
                        <span className="font-medium">{request.pet_owner_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-slate-600" />
                        <a href={`mailto:${request.pet_owner_email}`} className="text-blue-600 hover:underline">
                          {request.pet_owner_email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-600" />
                        <a href={`tel:${request.pet_owner_phone}`} className="text-blue-600 hover:underline">
                          {request.pet_owner_phone}
                        </a>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 mb-3">Appointment Details</h3>
                      
                      {request.pet_name && (
                        <div className="text-sm">
                          <span className="font-medium">Pet: </span>
                          {request.pet_name} {request.pet_type && `(${request.pet_type})`}
                        </div>
                      )}

                      {request.preferred_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-slate-600" />
                          <span>{request.preferred_date}</span>
                        </div>
                      )}

                      {request.preferred_time && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-slate-600" />
                          <span>{request.preferred_time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.message && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">Additional Information</h3>
                      <p className="text-sm text-slate-600">{request.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Back to Directory
          </a>
        </div>
      </div>
    </div>
  );
}
