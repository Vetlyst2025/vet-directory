"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, Clock, Star } from "lucide-react";

import { Header } from "@/components/header";
import { ClaimClinicModal } from "@/components/claim-clinic-modal";
import { AppointmentRequestButton } from "@/components/appointment-request-button";
import MapView from "@/components/MapView";

interface ClinicPageProps {
  params: {
    slug: string;
  };
}

export default function ClinicPage({ params }: ClinicPageProps) {
  const [clinic, setClinic] = React.useState<any>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchClinic = async () => {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (error || !data) {
        // Handle not found
        return;
      }
      setClinic(data);
    };

    fetchClinic();
  }, [params.slug]);

  if (!clinic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back Link */}
      <div className="bg-[#F5F7FA] border-b border-[#E8EEF5]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-[#0F3A5C] hover:text-[#D4AF37] font-medium transition-colors flex items-center gap-1">
            ← Back to Directory
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#0F3A5C] mb-2">
                    {clinic.name}
                  </h1>
                  {clinic.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(clinic.rating)
                                ? "fill-[#D4AF37] text-[#D4AF37]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {clinic.rating.toFixed(1)} ({clinic.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setClaimModalOpen(true)}
                  variant="outline"
                  className="text-[#0F3A5C] border-[#0F3A5C] hover:bg-[#0F3A5C] hover:text-white"
                >
                  Claim This Clinic
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {clinic.services && clinic.services.map((service: string) => (
                  <Badge key={service} variant="secondary" className="bg-[#E8EEF5] text-[#0F3A5C]">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <Card className="border-[#E8EEF5]">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#0F3A5C]">Contact Information</h2>

                {clinic.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#0F3A5C] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-[#0F3A5C] font-medium">{clinic.address}</p>
                    </div>
                  </div>
                )}

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

                {clinic.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#0F3A5C] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Hours</p>
                      <p className="text-[#0F3A5C] font-medium whitespace-pre-line">
                        {clinic.hours}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {clinic.description && (
              <Card className="border-[#E8EEF5]">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold text-[#0F3A5C] mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{clinic.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {clinic.latitude && clinic.longitude && (
              <Card className="border-[#E8EEF5] overflow-hidden">
                <MapView
                  latitude={clinic.latitude}
                  longitude={clinic.longitude}
                  clinicName={clinic.name}
                />
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appointment Request */}
            <Card className="border-[#E8EEF5] bg-gradient-to-br from-[#0F3A5C] to-[#1a5a8c] text-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Request an Appointment</h3>
                <AppointmentRequestButton clinicName={clinic.name} />
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-[#E8EEF5]">
              <CardContent className="pt-6 space-y-4">
                {clinic.acceptingNewPatients !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">New Patients</p>
                    <p className="text-[#0F3A5C] font-medium">
                      {clinic.acceptingNewPatients ? "Accepting" : "Not Currently Accepting"}
                    </p>
                  </div>
                )}

                {clinic.emergencyServices && (
                  <div>
                    <p className="text-sm text-gray-600">Emergency Services</p>
                    <p className="text-[#0F3A5C] font-medium">Available</p>
                  </div>
                )}

                {clinic.specialties && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.specialties.map((specialty: string) => (
                        <Badge key={specialty} variant="outline" className="text-[#0F3A5C] border-[#0F3A5C]">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0F3A5C] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Vetlyst</h4>
              <p className="text-sm text-[#E8EEF5]">
                Connecting pet owners with trusted veterinary clinics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Pet Owners</h4>
              <ul className="text-sm space-y-1 text-[#E8EEF5]">
                <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Browse Clinics</Link></li>
                <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Request Appointment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Clinics</h4>
              <ul className="text-sm space-y-1 text-[#E8EEF5]">
                <li><Link href="/for-clinics" className="hover:text-[#D4AF37] transition-colors">Claim Your Clinic</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Legal</h4>
              <ul className="text-sm space-y-1 text-[#E8EEF5]">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1a5a8c] pt-8 text-center text-sm text-[#E8EEF5]">
            <p>&copy; 2025 Vetlyst. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ClaimClinicModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        clinicName={clinic.name}
      />
    </div>
  );
}
// Force rebuild
