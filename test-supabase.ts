import { supabase } from './lib/supabase';

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  // Try to fetch from clinics table
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Found', data?.length, 'clinics');
    console.log('First clinic:', data?.[0]);
  }
}

testSupabase();
