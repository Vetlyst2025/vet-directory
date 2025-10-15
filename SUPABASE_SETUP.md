# Supabase Database Setup Instructions

## You need to run this SQL in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/qklnxfkwjpdboqawxpts/editor
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL below
5. Click "Run" or press Ctrl+Enter

---

## SQL to Run:

```sql
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

-- Update first 5 clinics to accept appointments (for demo/testing)
UPDATE clinics_madison_wi 
SET accepts_appointments = true, is_featured = true 
WHERE id IN (1, 2, 3, 4, 5);
```

---

## After running the SQL:

The website will automatically show:
- ✨ "Featured" badges on the first 5 clinics
- 🎯 "Accepts Requests" badges
- "Request Appointment" buttons on those clinics
- Working appointment request form

---

## What this does:

1. **Creates `appointment_requests` table** - Stores all appointment requests from pet owners
2. **Adds `accepts_appointments` column** - Marks which clinics accept online requests
3. **Adds `is_featured` column** - Marks premium/featured listings
4. **Updates 5 clinics** - Sets them as featured for testing

