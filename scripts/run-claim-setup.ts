import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupClaimTable() {
  console.log('Setting up clinic_claims table...');
  
  const sqlPath = path.join(__dirname, 'setup-claim-table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  
  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      if (error) {
        console.error('Error executing statement:', error);
        console.log('Statement:', statement.substring(0, 100) + '...');
      } else {
        console.log('✓ Executed statement successfully');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
  
  console.log('\n✅ Clinic claims table setup complete!');
}

setupClaimTable().catch(console.error);
