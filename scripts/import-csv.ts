import fs from 'fs';
import csv from 'csv-parser';
import pool from '../lib/db';

async function importCSV() {
  const client = await pool.connect();
  const results: any[] = [];

  fs.createReadStream('clinics_data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          await client.query(
            `INSERT INTO clinics (
              clinic_name, site, phone, full_address, city, zip, state,
              clinic_type, species_treated, species_tag, latitude, longitude,
              rating, reviews, reviews_link, photo, photo_final,
              working_hours, working_hours_csv_compatible, working_hours_old_format,
              other_hours, about, place_id, google_id, slug,
              listing_tier, lead_email, emergency_status, emergency_auto_tag
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
              $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
            )`,
            [
              row.clinic_name,
              row.site,
              row.phone,
              row.full_address,
              row.city,
              row.zip,
              row.state,
              row.clinic_type,
              row.species_treated,
              row.species_tag,
              row.latitude ? parseFloat(row.latitude) : null,
              row.longitude ? parseFloat(row.longitude) : null,
              row.rating ? parseFloat(row.rating) : null,
              row.reviews ? parseInt(row.reviews) : null,
              row.reviews_link,
              row.photo,
              row.photo_final,
              row.working_hours ? JSON.parse(row.working_hours) : null,
              row.working_hours_csv_compatible,
              row.working_hours_old_format,
              row.other_hours,
              row.about ? JSON.parse(row.about) : null,
              row.place_id,
              row.google_id,
              row.slug,
              row.listing_tier,
              row.lead_email,
              row.emergency_status,
              row.emergency_auto_tag
            ]
          );
        }
        console.log(`Successfully imported ${results.length} clinics`);
      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        client.release();
        await pool.end();
      }
    });
}

importCSV();
