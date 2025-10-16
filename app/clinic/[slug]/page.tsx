import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, Clock, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { ClaimClinicModal } from '@/components/claim-clinic-modal';
import { AppointmentRequestButton } from '@/components/appointment-request-button';

// Generate static params for all clinics
export async function generateStaticParams() {
  const { data: clinics } = await supabase
    .from('clinics_madison_wi')
    .select('place_id, clinic_name');

  return (clinics || []).map((clinic) => ({
    slug: createSlug(clinic.clinic_name, clinic.place_id),
  }));
}

function createSlug(name: string, placeId: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const shortId = placeId.substring(0, 8);
  return `${nameSlug}-${shortId}`;
}

async function getClinic(slug: string) {
  // Extract place_id from slug (last 8 characters after final dash)
  const parts = slug.split('-');
  const shortId = parts[parts.length - 1];
  
  const { data: clinics } = await supabase
    .from('clinics_madison_wi')
    .select('*')
    .ilike('place_id', `${shortId}%`)
    .limit(1);

  return clinics?.[0] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getClinic(slug);
  
  if (!clinic) {
    return {
      title: 'Clinic Not Found',
    };
  }

  return {
    title: `${clinic.clinic_name} - Madison Veterinarian | Madison Vet Finder`,
    description: `${clinic.clinic_name} in ${clinic.city}, WI. ${clinic.rating ? `Rated ${clinic.rating} stars` : 'Quality veterinary care'} for your pets. ${clinic.full_address}. ${clinic.phone || 'Contact for appointments.'}`,
    openGraph: {
      title: clinic.clinic_name,
      description: `${clinic.clinic_type || 'Veterinary Clinic'} in ${clinic.city}, WI`,
      type: 'website',
    },
  };
}

export default async function ClinicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getClinic(slug);

  if (!clinic) {
    notFound();
  }

  // Check if clinic is a paid listing (has listing_tier value)
  const isPaidListing = clinic.listing_tier && clinic.listing_tier.trim() !== '';

  // Parse working hours if available
  const parseWorkingHours = (hoursString: string) => {
    if (!hoursString) return [];
    return hoursString.split('|').map((hour) => hour.trim()).filter(Boolean);
  };

  const workingHours = parseWorkingHours(clinic.working_hours_csv_compatible);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <Header />

      {/* Back Link */}
      <div className="bg-[#F5F7FA] border-b border-[#E8EEF5]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a href="/" className="text-[#0F3A5C] hover:text-[#D4AF37] font-medium transition-colors flex items-center gap-1">
            ← Back to Directory
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clinic Header */}
            <Card className="border-[#E8EEF5] shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {isPaidListing && (
                    <Badge className="bg-[#D4AF37] text-[#0F3A5C] hover:bg-[#E8C547]">✨ Featured</Badge>
                  )}
                  {isPaidListing && (
                    <Badge className="bg-[#28A745] text-white hover:bg-[#20c997]">
                      🎯 Accepts Requests
                    </Badge>
                  )}
                  {clinic.clinic_type && (
                    <Badge variant="secondary" className="bg-[#F5F7FA] text-[#0F3A5C] border border-[#E8EEF5]">
                      {clinic.clinic_type}
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-[#0F3A5C] mb-2">
                  {clinic.clinic_name}
                </h1>

                {clinic.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                      <span className="ml-1 font-semibold text-lg text-[#2C3E50]">{clinic.rating}</span>
                    </div>
                    {clinic.reviews && (
                      <span className="text-[#7A8FA3]">
                        ({clinic.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-3 text-[#2C3E50]">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#0F3A5C] mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{clinic.full_address}</p>
                      <p>{clinic.city}, {clinic.state} {clinic.zip}</p>
                    </div>
                  </div>

                  {clinic.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#0F3A5C] flex-shrink-0" />
                      <a 
                        href={`tel:${clinic.phone}`}
                        className="text-[#0F3A5C] hover:text-[#D4AF37] font-medium transition-colors"
                      >
                        {clinic.phone}
                      </a>
                    </div>
                  )}

                  {clinic.site && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-[#0F3A5C] flex-shrink-0" />
                      <a 
                        href={clinic.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F3A5C] hover:text-[#D4AF37] font-medium transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {workingHours.length > 0 && (
              <Card className="border-[#E8EEF5] shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#0F3A5C]">
                    <Clock className="h-5 w-5" />
                    Hours of Operation
                  </h2>
                  <div className="space-y-2">
                    {workingHours.map((hour: string, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-[#E8EEF5] last:border-0">
                        <span className="text-[#2C3E50]">
                          {hour}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {clinic.species_treated && (
              <Card className="border-[#E8EEF5] shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#0F3A5C]">Services & Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {clinic.species_treated.split(',').map((species: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-[#0F3A5C] text-[#0F3A5C] bg-[#F5F7FA]">
                        {species.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {clinic.latitude && clinic.longitude && (
              <Card className="border-[#E8EEF5] shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#0F3A5C]">Location</h2>
                  <div className="aspect-video bg-[#F5F7FA] rounded-lg overflow-hidden border border-[#E8EEF5]">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${clinic.latitude},${clinic.longitude}&zoom=15`}
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Appointment CTA */}
            {isPaidListing && (
              <Card className="border-2 border-[#D4AF37] shadow-lg bg-gradient-to-br from-[#0F3A5C] to-[#1A4D6D]">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Calendar className="h-12 w-12 text-[#D4AF37] mx-auto" />
                    <h3 className="text-xl font-semibold text-white">Request an Appointment</h3>
                    <p className="text-[#E8EEF5] text-sm">
                      Send a request and {clinic.clinic_name} will contact you to confirm.
                    </p>
                    <AppointmentRequestButton 
                      clinic={{
                        id: clinic.place_id,
                        name: clinic.clinic_name,
                        email: clinic.email
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Contact */}
            <Card className="border-[#E8EEF5] shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-[#0F3A5C]">Quick Contact</h3>
                <div className="space-y-3">
                  {clinic.phone && (
                    <Button variant="outline" className="w-full border-[#0F3A5C] text-[#0F3A5C] hover:bg-[#F5F7FA]" asChild>
                      <a href={`tel:${clinic.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  )}
                  {clinic.site && (
                    <Button variant="outline" className="w-full border-[#0F3A5C] text-[#0F3A5C] hover:bg-[#F5F7FA]" asChild>
                      <a href={clinic.site} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full border-[#0F3A5C] text-[#0F3A5C] hover:bg-[#F5F7FA]" asChild>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Claim This Clinic */}
            <Card className="bg-gradient-to-br from-[#F5F7FA] to-[#E8EEF5] border-2 border-[#D4AF37] shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 text-[#0F3A5C]">Own or manage this clinic?</h3>
                <p className="text-sm text-[#2C3E50] mb-4">
                  Claim your listing to manage your profile, respond to appointment requests, and unlock premium features.
                </p>
                <ClaimClinicModal 
                  clinicId={clinic.place_id}
                  clinicName={clinic.clinic_name}
                />
              </CardContent>
            </Card>

            {/* About Madison Vet Finder */}
            <Card className="bg-gradient-to-br from-[#0F3A5C] to-[#1A4D6D] text-white shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Are you a veterinary clinic?</h3>
                <p className="text-sm text-[#E8EEF5] mb-4">
                  Get more appointment requests and grow your practice with Madison Vet Finder.
                </p>
                <Button variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F3A5C] font-semibold" asChild>
                  <a href="/for-clinics">
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#0F3A5C] to-[#1A4D6D] text-white mt-12 border-t-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Madison Vet Finder</h3>
              <p className="text-[#D4AF37] text-sm">Find trusted Madison vets. Fast.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Pet Owners</h4>
              <ul className="text-sm space-y-1 text-[#E8EEF5]">
                <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Browse Clinics</a></li>
                <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Request Appointment</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Clinics</h4>
              <ul className="text-sm space-y-1 text-[#E8EEF5]">
                <li><a href="/for-clinics" className="hover:text-[#D4AF37] transition-colors">Claim Your Clinic</a></li>
                <li><a href="/for-clinics" className="hover:text-[#D4AF37] transition-colors">Get More Appointments</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1A4D6D] pt-6 text-center text-sm text-[#E8EEF5]">
            <p>© 2025 Madison Vet Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
