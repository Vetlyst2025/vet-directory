const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parse/sync');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importListingTiers() {
  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, '../clinics_madison_wi_rows.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} records in CSV`);

    let updated = 0;
    let errors = 0;

    // Update each clinic with listing_tier from emergency_status
    for (const record of records) {
      const clinicName = record.clinic_name?.trim();
      const listingTier = record.emergency_status?.trim() || null;

      if (!clinicName) {
        console.log('Skipping record with no clinic name');
        continue;
      }

      try {
        const { data, error } = await supabase
          .from('clinics')
          .update({ listing_tier: listingTier })
          .eq('clinic_name', clinicName);

        if (error) {
          console.error(`Error updating ${clinicName}:`, error.message);
          errors++;
        } else {
          updated++;
          if (updated % 10 === 0) {
            console.log(`Updated ${updated} clinics...`);
          }
        }
      } catch (err) {
        console.error(`Exception updating ${clinicName}:`, err.message);
        errors++;
      }
    }

    console.log(`\nImport complete!`);
    console.log(`Updated: ${updated}`);
    console.log(`Errors: ${errors}`);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importListingTiers();
