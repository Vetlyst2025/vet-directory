# Clinic Claims Setup Instructions

## Step 1: Create the Database Table

Go to your Supabase dashboard SQL Editor and run this SQL:

```sql
-- Create clinic_claims table
CREATE TABLE IF NOT EXISTS clinic_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  
  -- Claimant information
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  claimant_phone TEXT,
  claimant_role TEXT NOT NULL,
  
  -- Verification details
  verification_method TEXT NOT NULL,
  verification_notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clinic_claims_clinic_id ON clinic_claims(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_claims_status ON clinic_claims(status);
CREATE INDEX IF NOT EXISTS idx_clinic_claims_email ON clinic_claims(claimant_email);

-- Enable RLS
ALTER TABLE clinic_claims ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to submit claims" ON clinic_claims
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to read claims" ON clinic_claims
  FOR SELECT
  USING (true);
```

## Step 2: Test the Claim Feature

1. Start your dev server: `bun run dev`
2. Visit any clinic page
3. Look for the "Claim This Clinic" button in the sidebar
4. Fill out the claim form and submit
5. Check your email for notifications

## What's Been Built

✅ **Database Table**: `clinic_claims` to store all claim requests
✅ **Claim Modal**: Beautiful form with validation
✅ **API Endpoint**: `/api/claim-clinic` handles submissions
✅ **Email Notifications**: 
   - Admin notification to practicemanager@healthypetvetclinic.com
   - Confirmation email to the claimant
✅ **UI Integration**: Claim button on every clinic page

## Next Steps (Future)

- Build admin dashboard to review claims
- Add approval/rejection workflow
- Create clinic owner portal after approval
- Add authentication for claimed clinics
