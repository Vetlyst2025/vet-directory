"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface AppointmentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: {
    id: string;
    name: string;
    email?: string;
  };
}

export function AppointmentRequestModal({
  isOpen,
  onClose,
  clinic,
}: AppointmentRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petOwnerName: '',
    petOwnerEmail: '',
    petOwnerPhone: '',
    petName: '',
    petType: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/appointment-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinic.id,
          clinic_name: clinic.name,
          clinic_email: clinic.email,
          pet_owner_name: formData.petOwnerName,
          pet_owner_email: formData.petOwnerEmail,
          pet_owner_phone: formData.petOwnerPhone,
          pet_name: formData.petName,
          pet_type: formData.petType,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormData({
          petOwnerName: '',
          petOwnerEmail: '',
          petOwnerPhone: '',
          petName: '',
          petType: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
        });
        onClose();
        alert('Appointment request submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting appointment request:', error);
      alert('Failed to submit appointment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with {clinic.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="petOwnerName">Your Name</Label>
            <Input
              id="petOwnerName"
              value={formData.petOwnerName}
              onChange={(e) => setFormData({ ...formData, petOwnerName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="petOwnerEmail">Email</Label>
            <Input
              id="petOwnerEmail"
              type="email"
              value={formData.petOwnerEmail}
              onChange={(e) => setFormData({ ...formData, petOwnerEmail: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="petOwnerPhone">Phone</Label>
            <Input
              id="petOwnerPhone"
              type="tel"
              value={formData.petOwnerPhone}
              onChange={(e) => setFormData({ ...formData, petOwnerPhone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="petName">Pet Name</Label>
            <Input
              id="petName"
              value={formData.petName}
              onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="petType">Pet Type</Label>
            <Select value={formData.petType} onValueChange={(value) => setFormData({ ...formData, petType: value })}>
              <SelectTrigger id="petType">
                <SelectValue placeholder="Select pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Input
              id="preferredTime"
              type="time"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any additional information..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
