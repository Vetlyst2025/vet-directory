"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClaimClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinicName: string;
}

export function ClaimClinicModal({
  isOpen,
  onClose,
  clinicName,
}: ClaimClinicModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    claimantTitle: "",
    clinicName: clinicName,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/claim-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            claimantName: "",
            claimantEmail: "",
            claimantPhone: "",
            claimantTitle: "",
            clinicName: clinicName,
          });
          onClose();
        }, 2000);
      } else {
        setError("Failed to submit claim. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Claim This Clinic</DialogTitle>
          <DialogDescription>
            Verify that you own or manage {clinicName}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-green-900">Claim Submitted Successfully!</h3>
            <p className="text-slate-600">
              We will review your claim and contact you at {formData.claimantEmail} within 1-2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="claimantName">Your Name</Label>
              <Input
                id="claimantName"
                value={formData.claimantName}
                onChange={(e) =>
                  setFormData({ ...formData, claimantName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="claimantEmail">Email</Label>
              <Input
                id="claimantEmail"
                type="email"
                value={formData.claimantEmail}
                onChange={(e) =>
                  setFormData({ ...formData, claimantEmail: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="claimantPhone">Phone</Label>
              <Input
                id="claimantPhone"
                type="tel"
                value={formData.claimantPhone}
                onChange={(e) =>
                  setFormData({ ...formData, claimantPhone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="claimantTitle">Your Title</Label>
              <Select
                value={formData.claimantTitle}
                onValueChange={(value) =>
                  setFormData({ ...formData, claimantTitle: value })
                }
              >
                <SelectTrigger id="claimantTitle">
                  <SelectValue placeholder="Select your title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Claim"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
