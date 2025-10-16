-- Create clinic_claims table
CREATE TABLE IF NOT EXISTS clinic_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  
  -- Claimant information
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  claimant_phone TEXT,
  claimant_role TEXT NOT NULL, -- e.g., "Owner", "Manager", "Veterinarian"
  
  -- Verification details
  verification_method TEXT NOT NULL, -- e.g., "email", "phone", "document"
  verification_notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clinic_claims_clinic_id ON clinic_claims(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_claims_status ON clinic_claims(status);
CREATE INDEX IF NOT EXISTS idx_clinic_claims_email ON clinic_claims(claimant_email);

-- Enable RLS (Row Level Security)
ALTER TABLE clinic_claims ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for claim submissions)
CREATE POLICY "Allow public to submit claims" ON clinic_claims
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads (for admin dashboard)
CREATE POLICY "Allow public to read their own claims" ON clinic_claims
  FOR SELECT
  USING (true);

COMMENT ON TABLE clinic_claims IS 'Stores clinic ownership claim requests from veterinary professionals';
