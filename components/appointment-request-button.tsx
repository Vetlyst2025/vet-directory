'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppointmentRequestModal } from '@/components/appointment-request-modal';

interface AppointmentRequestButtonProps {
  clinic: {
    id: string;
    name: string;
    email?: string;
  };
}

export function AppointmentRequestButton({ clinic }: AppointmentRequestButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowModal(true)}
        className="w-full bg-[#D4AF37] hover:bg-[#E8C547] text-[#0F3A5C] font-semibold"
        size="lg"
      >
        Request Appointment
      </Button>
      {showModal && (
        <AppointmentRequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          clinic={clinic}
        />
      )}
    </>
  );
}
