import { supabase } from '../lib/supabase';

async function addAppointmentFeatures() {
  console.log('Adding appointment request features to Supabase...');
  
  // Create appointment_requests table
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS appointment_requests (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics_madison_wi(id),
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
    `
  });

  if (tableError) {
    console.log('Note: Table might already exist or RPC not available. Will use direct SQL.');
  }

  // Add columns to clinics table for listing tiers
  console.log('Adding listing tier columns...');
  
  const { error: col1Error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE clinics_madison_wi ADD COLUMN IF NOT EXISTS accepts_appointments BOOLEAN DEFAULT false;`
  });
  
  const { error: col2Error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE clinics_madison_wi ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;`
  });

  console.log('Setup complete! Note: If RPC is not enabled, you may need to run SQL manually in Supabase dashboard.');
}

addAppointmentFeatures();
