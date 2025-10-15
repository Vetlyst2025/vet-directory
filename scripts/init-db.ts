import pool from '../lib/db';

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id SERIAL PRIMARY KEY,
        clinic_name TEXT NOT NULL,
        site TEXT,
        phone TEXT,
        full_address TEXT,
        city TEXT,
        zip TEXT,
        state TEXT,
        clinic_type TEXT,
        species_treated TEXT,
        species_tag TEXT,
        latitude DECIMAL(10, 7),
        longitude DECIMAL(10, 7),
        rating DECIMAL(3, 2),
        reviews INTEGER,
        reviews_link TEXT,
        photo TEXT,
        photo_final TEXT,
        working_hours JSONB,
        working_hours_csv_compatible TEXT,
        working_hours_old_format TEXT,
        other_hours TEXT,
        about JSONB,
        place_id TEXT,
        google_id TEXT,
        slug TEXT,
        listing_tier TEXT,
        lead_email TEXT,
        emergency_status TEXT,
        emergency_auto_tag TEXT
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
