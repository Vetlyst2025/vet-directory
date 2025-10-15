'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, Globe, MapPin, Star, Clock, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { AppointmentRequestModal } from '@/components/appointment-request-modal';
import Link from 'next/link';
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
  accepts_appointments?: boolean;
  is_featured?: boolean;
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

  const clinicTypes = [
    'General Practice',
    'Emergency / Urgent Care',
    'Mobile Clinic',
    'Low Cost / No Cost'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Veterinary Directory</h1>
              <p className="text-slate-600 mt-1">Madison, WI Area</p>
            </div>
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-slate-500">Logo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
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
            >
              List View
            </Button>
            <Button
              variant={showMap ? 'default' : 'outline'}
              onClick={() => setShowMap(true)}
              size="sm"
            >
              Map View
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-slate-600">
            {loading ? 'Loading...' : `${clinics.length} clinics found`}
          </p>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="mb-6">
            <MapView clinics={clinics} />
          </div>
        )}

        {/* Clinics Grid */}
        {!showMap && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : clinics.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">No clinics found matching your criteria</p>
              </div>
            ) : (
              clinics.map((clinic) => (
                <Card key={clinic.place_id} className={`hover:shadow-lg transition-shadow ${clinic.is_featured ? 'ring-2 ring-blue-500' : ''}`}>
                  {clinic.photo_final && (
                    <div className="h-48 overflow-hidden rounded-t-lg relative">
                      <img
                        src={clinic.photo_final}
                        alt={clinic.clinic_name}
                        className="w-full h-full object-cover"
                      />
                      {clinic.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-blue-600">
                          ✨ Featured
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{clinic.clinic_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {clinic.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{clinic.rating}</span>
                          {clinic.reviews && (
                            <span className="text-xs text-slate-500">({clinic.reviews})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {clinic.clinic_type && (
                        <Badge variant="secondary">{clinic.clinic_type}</Badge>
                      )}
                      {clinic.accepts_appointments && (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          🎯 Accepts Requests
                        </Badge>
                      )}
                    </div>
                    
                    {clinic.full_address && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{clinic.full_address}</span>
                      </div>
                    )}

                    {clinic.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-600" />
                        <a
                          href={`tel:${clinic.phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {clinic.phone}
                        </a>
                      </div>
                    )}

                    {clinic.site && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-600" />
                        <a
                          href={clinic.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {clinic.working_hours_csv_compatible && (
                      <div className="flex items-start gap-2 text-xs text-slate-500">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          {clinic.working_hours_csv_compatible.split('|').slice(0, 2).map((hours, i) => (
                            <div key={i}>{hours}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {clinic.species_treated && (
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">Species: </span>
                        {clinic.species_treated}
                      </div>
                    )}

                    {/* Request Appointment Button */}
                    {clinic.accepts_appointments && (
                      <Button 
                        onClick={() => handleRequestAppointment(clinic)}
                        className="w-full mt-4"
                        variant="default"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Request Appointment
                      </Button>
                    )}
                  </CardContent>

                    {/* View Details Button */}
                    <Button 
                      asChild
                      className="w-full mt-2"
                      variant="outline"
                    >
                      <Link href={`/clinic/${createClinicSlug(clinic.clinic_name, clinic.place_id)}`}>
                        View Details
                      </Link>
                    </Button>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            © 2025 Veterinary Directory - Madison, WI Area
          </p>
        </div>
      </footer>

      {/* Appointment Request Modal */}
      {selectedClinic && (
        <AppointmentRequestModal
          isOpen={showAppointmentModal}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedClinic(null);
          }}
          clinic={{
            id: selectedClinic.id,
            name: selectedClinic.clinic_name,
            email: selectedClinic.email
          }}
        />
      )}
    </div>
  );
}
