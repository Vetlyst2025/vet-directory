'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, Globe, MapPin, Star, Clock, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/header';
import { createClinicSlug } from '@/lib/utils-clinic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-slate-100 rounded-lg animate-pulse" />
});

interface Clinic {
  place_id: string;
  clinic_name: string;
  site: string;
  phone: string;
  email?: string;
  full_address: string;
  city: string;
  zip: string;
  state: string;
  clinic_type: string;
  species_treated: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  photo_final: string;
  working_hours_csv_compatible: string;
  listing_tier?: string;
  emergency_status?: string;
}

export default function Home() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    fetchCities();
    fetchClinics();
  }, []);

  useEffect(() => {
    fetchClinics();
  }, [search, selectedCity, selectedType, sortBy]);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity);
      if (selectedType && selectedType !== 'all') params.append('clinicType', selectedType);
      if (sortBy && sortBy !== 'name') params.append('sortBy', sortBy);

      const response = await fetch(`/api/clinics?${params}`);
      const data = await response.json();
      setClinics(data);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAppointment = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowAppointmentModal(true);
  };

  // Match the exact clinic types from the database
  const clinicTypes = [
    'General Practice',
    'Emergency/Urgent Care',
    'Mobile Clinic',
    'Low Cost / No Cost'
  ];

  // Function to get badge styling based on clinic type
  const getClinicTypeBadgeClass = (type: string) => {
    if (type === 'Emergency/Urgent Care') {
      return 'badge-emergency';
    }
    return 'badge-navy';
  };

  // Check if clinic is a paid listing (has a non-empty listing_tier)
  const isPaidListing = (clinic: Clinic) => {
    return clinic.listing_tier && clinic.listing_tier.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="card-brand rounded-lg shadow-md p-6 mb-6 border-t-4" style={{ borderTopColor: 'var(--gold)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: 'var(--navy-dark)' }} />
                <Input
                  placeholder="Search by clinic name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {clinicTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="mt-4 flex gap-2">
            <Button
              variant={!showMap ? 'default' : 'outline'}
              onClick={() => setShowMap(false)}
              size="sm"
              className={!showMap ? 'btn-primary' : ''}
            >
              List View
            </Button>
            <Button
              variant={showMap ? 'default' : 'outline'}
              onClick={() => setShowMap(true)}
              size="sm"
              className={showMap ? 'btn-primary' : ''}
            >
              Map View
            </Button>
          </div>
        </div>

        {/* Results */}
        {showMap ? (
          <MapView clinics={clinics} />
        ) : (
          <>
            <p className="text-gray-600 mb-4">{clinics.length} clinics found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic) => (
                <Card key={clinic.place_id} className="card-brand hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{clinic.clinic_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-gold" style={{ color: 'var(--gold)' }} />
                            <span className="ml-1 text-sm font-semibold">{clinic.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({clinic.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className={getClinicTypeBadgeClass(clinic.clinic_type)}>
                        {clinic.clinic_type}
                      </Badge>
                      {isPaidListing(clinic) && (
                        <Badge className="badge-gold">✨ Featured</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {clinic.photo_final && (
                      <img
                        src={clinic.photo_final}
                        alt={clinic.clinic_name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--navy-dark)' }} />
                        <span>{clinic.full_address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--navy-dark)' }} />
                        <a href={`tel:${clinic.phone}`} className="hover:text-gold transition-colors">
                          {clinic.phone}
                        </a>
                      </div>
                      {clinic.site && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--navy-dark)' }} />
                          <a href={clinic.site} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors truncate">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/clinic/${createClinicSlug(clinic.clinic_name, clinic.place_id)}`}
                      className="btn-primary w-full text-center py-2 rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Appointment Modal */}
      {showAppointmentModal && selectedClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request Appointment</CardTitle>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  try {
                    const response = await fetch('/api/appointment-requests', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        clinic_id: selectedClinic.place_id,
                        clinic_name: selectedClinic.clinic_name,
                        clinic_email: selectedClinic.email,
                        pet_owner_name: formData.get('name'),
                        pet_owner_email: formData.get('email'),
                        pet_owner_phone: formData.get('phone'),
                        pet_name: formData.get('petName'),
                        pet_type: formData.get('petType'),
                        appointment_date: formData.get('date'),
                        appointment_time: formData.get('time'),
                        reason: formData.get('reason'),
                      }),
                    });
                    if (response.ok) {
                      alert('Appointment request sent!');
                      setShowAppointmentModal(false);
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to send request');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <Input name="name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input name="email" type="email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input name="phone" type="tel" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pet Name</label>
                  <Input name="petName" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pet Type</label>
                  <Input name="petType" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <Input name="date" type="date" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <Input name="time" type="time" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                  <Input name="reason" required />
                </div>
                <Button type="submit" className="w-full btn-primary">
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
