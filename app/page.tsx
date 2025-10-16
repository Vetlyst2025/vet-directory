'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, Globe, MapPin, Star } from 'lucide-react';
import { Header } from '@/components/header';
import { createClinicSlug } from '@/lib/utils-clinic';

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
  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await fetch('/api/clinics');
      const data = await response.json();
      setClinics(data);
      
      const uniqueCities = [...new Set(data.map((c: Clinic) => c.city))].sort();
      setCities(uniqueCities as string[]);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    }
  };

  const filteredClinics = clinics
    .filter(clinic => {
      const matchesSearch = clinic.clinic_name.toLowerCase().includes(search.toLowerCase()) ||
                           clinic.full_address.toLowerCase().includes(search.toLowerCase());
      const matchesCity = selectedCity === 'all' || clinic.city === selectedCity;
      const matchesType = selectedType === 'all' || clinic.clinic_type === selectedType;
      return matchesSearch && matchesCity && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.clinic_name.localeCompare(b.clinic_name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const clinicTypes = [...new Set(clinics.map(c => c.clinic_type))].sort();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <Input
                placeholder="Clinic name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {clinicTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-slate-600">
            Found <strong>{filteredClinics.length}</strong> clinic{filteredClinics.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <Link key={clinic.place_id} href={`/clinic/${createClinicSlug(clinic.clinic_name, clinic.place_id)}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{clinic.clinic_name}</CardTitle>
                    {clinic.listing_tier && (
                      <Badge className="bg-amber-500 text-white whitespace-nowrap">Featured</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {clinic.photo_final && (
                    <div className="relative w-full h-40 bg-slate-200 rounded-md overflow-hidden">
                      <Image
                        src={clinic.photo_final}
                        alt={clinic.clinic_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{clinic.full_address}</span>
                    </div>

                    {clinic.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <a href={`tel:${clinic.phone}`} className="text-blue-600 hover:underline">
                          {clinic.phone}
                        </a>
                      </div>
                    )}

                    {clinic.site && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <a href={clinic.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                          Visit Website
                        </a>
                      </div>
                    )}

                    {clinic.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-slate-600">
                          {clinic.rating.toFixed(1)} ({clinic.reviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full mt-4">View Details</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No clinics found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
