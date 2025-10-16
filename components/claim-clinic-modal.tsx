'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClaimClinicModalProps {
  clinicId: string;
  clinicName: string;
}

export function ClaimClinicModal({ clinicId, clinicName }: ClaimClinicModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    claimantName: '',
    claimantEmail: '',
    claimantPhone: '',
    claimantRole: '',
    verificationMethod: '',
    verificationNotes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/claim-clinic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicId,
          clinicName,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit claim');
      }

      setSuccess(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setFormData({
          claimantName: '',
          claimantEmail: '',
          claimantPhone: '',
          claimantRole: '',
          verificationMethod: '',
          verificationNotes: '',
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Building2 className="h-4 w-4 mr-2" />
          Claim This Clinic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim {clinicName}</DialogTitle>
          <DialogDescription>
            Are you the owner or manager of this clinic? Claim your listing to manage your profile, respond to appointment requests, and unlock premium features.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-green-900">Claim Submitted Successfully!</h3>
            <p className="text-slate-600">
              WeWe'll reviewapos;ll review your claim and contact you at {formData.claimantEmail} within 1-2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="claimantName">Your Full Name *</Label>
              <Input
                id="claimantName"
                required
                value={formData.claimantName}
                onChange={(e) => setFormData({ ...formData, claimantName: e.target.value })}
                placeholder="Dr. Jane Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimantEmail">Your Email Address *</Label>
              <Input
                id="claimantEmail"
                type="email"
                required
                value={formData.claimantEmail}
                onChange={(e) => setFormData({ ...formData, claimantEmail: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimantPhone">Your Phone Number</Label>
              <Input
                id="claimantPhone"
                type="tel"
                value={formData.claimantPhone}
                onChange={(e) => setFormData({ ...formData, claimantPhone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimantRole">Your Role at This Clinic *</Label>
              <Select
                required
                value={formData.claimantRole}
                onValueChange={(value) => setFormData({ ...formData, claimantRole: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Practice Manager</SelectItem>
                  <SelectItem value="veterinarian">Veterinarian</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationMethod">How can we verify your ownership? *</Label>
              <Select
                required
                value={formData.verificationMethod}
                onValueChange={(value) => setFormData({ ...formData, verificationMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select verification method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email from clinic domain</SelectItem>
                  <SelectItem value="phone">Phone call to clinic number</SelectItem>
                  <SelectItem value="document">Business documentation</SelectItem>
                  <SelectItem value="website">Website verification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationNotes">Additional Information</Label>
              <Textarea
                id="verificationNotes"
                value={formData.verificationNotes}
                onChange={(e) => setFormData({ ...formData, verificationNotes: e.target.value })}
                placeholder="Any additional details that can help us verify your claim..."
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700">
              <p className="font-semibold mb-2">What happens next?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>WeWe'll reviewapos;ll review your claim within 1-2 business days</li>
                <li>You may be contacted for verification</li>
                <li>Once approved, you'll get access to your clinic dashboard</li>
                <li>Manage your profile, hours, and appointment requests</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Claim'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
