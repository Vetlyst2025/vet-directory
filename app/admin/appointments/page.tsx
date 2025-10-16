'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  created_at: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Appointment Requests</h1>
          <p className="text-slate-600">Manage all appointment requests from pet owners</p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-600">No appointment requests yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{appointment.clinic_name}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Request ID: {appointment.id}
                      </p>
                    </div>
                    <Badge
                      variant={appointment.status === 'pending' ? 'default' : 'secondary'}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Owner Information */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Pet Owner</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{appointment.pet_owner_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <a
                            href={`mailto:${appointment.pet_owner_email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {appointment.pet_owner_email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <a
                            href={`tel:${appointment.pet_owner_phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {appointment.pet_owner_phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Pet Information */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Pet Details</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-slate-600">Name</p>
                          <p className="text-slate-900">{appointment.pet_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Type</p>
                          <p className="text-slate-900">{appointment.pet_type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Appointment</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{appointment.preferred_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{appointment.preferred_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clinic Information */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Clinic Contact</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-slate-600">Email</p>
                          <a
                            href={`mailto:${appointment.clinic_email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {appointment.clinic_email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {appointment.message && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">Message</h3>
                      <p className="text-slate-700 whitespace-pre-wrap">{appointment.message}</p>
                    </div>
                  )}

                  {/* Created At */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Submitted on {new Date(appointment.created_at).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Back to Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
