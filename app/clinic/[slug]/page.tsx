import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, Clock, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

// Generate static params for all clinics
export async function generateStaticParams() {
  const { data: clinics } = await supabase
    .from('clinics_madison_wi')
    .select('place_id, name');

  return (clinics || []).map((clinic) => ({
    slug: createSlug(clinic.name, clinic.place_id),
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
    title: `${clinic.name} - Madison Veterinarian | VetFinderPro`,
    description: `${clinic.name} in ${clinic.city}, WI. ${clinic.rating ? `Rated ${clinic.rating} stars` : 'Quality veterinary care'} for your pets. ${clinic.address}. ${clinic.phone || 'Contact for appointments.'}`,
    openGraph: {
      title: clinic.name,
      description: `${clinic.types?.join(', ') || 'Veterinary Clinic'} in ${clinic.city}, WI`,
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

  const hours = clinic.opening_hours ? JSON.parse(clinic.opening_hours) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Directory
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clinic Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {clinic.is_featured && (
                    <Badge className="bg-blue-600">Featured</Badge>
                  )}
                  {clinic.accepts_appointments && (
                    <Badge variant="outline" className="border-green-600 text-green-700">
                      Accepts Requests
                    </Badge>
                  )}
                  {clinic.types?.includes('veterinary_care') && (
                    <Badge variant="secondary">Veterinary Care</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {clinic.name}
                </h1>

                {clinic.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-lg">{clinic.rating}</span>
                    </div>
                    {clinic.user_ratings_total && (
                      <span className="text-slate-600">
                        ({clinic.user_ratings_total} reviews)
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{clinic.address}</p>
                      <p>{clinic.city}, {clinic.state} {clinic.zip_code}</p>
                    </div>
                  </div>

                  {clinic.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-slate-500 flex-shrink-0" />
                      <a 
                        href={`tel:${clinic.phone}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {clinic.phone}
                      </a>
                    </div>
                  )}

                  {clinic.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-slate-500 flex-shrink-0" />
                      <a 
                        href={clinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {hours && hours.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hours of Operation
                  </h2>
                  <div className="space-y-2">
                    {hours.map((hour: string, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-700">
                          {hour.split(': ')[0]}
                        </span>
                        <span className="text-slate-600">
                          {hour.split(': ')[1] || 'Closed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {clinic.types && clinic.types.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Services & Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {clinic.types.map((type: string) => (
                      <Badge key={type} variant="outline">
                        {type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {clinic.latitude && clinic.longitude && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
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
            {clinic.accepts_appointments && (
              <Card className="border-2 border-blue-600 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Calendar className="h-12 w-12 text-blue-600 mx-auto" />
                    <h3 className="text-xl font-semibold">Request an Appointment</h3>
                    <p className="text-slate-600 text-sm">
                      Send a request and {clinic.name} will contact you to confirm.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      Request Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Contact */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  {clinic.phone && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`tel:${clinic.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  )}
                  {clinic.website && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
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

            {/* About VetFinderPro */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Are you a veterinary clinic?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get more appointment requests and grow your practice with VetFinderPro.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/for-clinics">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
