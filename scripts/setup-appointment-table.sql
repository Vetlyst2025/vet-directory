-- Create appointment_requests table
CREATE TABLE IF NOT EXISTS appointment_requests (
  id SERIAL PRIMARY KEY,
  clinic_id INTEGER,
  clinic_name TEXT,
  clinic_email TEXT,
  pet_owner_name TEXT NOT NULL,
  pet_owner_email TEXT NOT NULL,
  pet_owner_phone TEXT NOT NULL,
  pet_name TEXT,
  pet_type TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns to clinics_madison_wi table
ALTER TABLE clinics_madison_wi 
ADD COLUMN IF NOT EXISTS accepts_appointments BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update a few clinics to accept appointments (for demo)
UPDATE clinics_madison_wi 
SET accepts_appointments = true, is_featured = true 
WHERE id IN (1, 2, 3, 4, 5);
