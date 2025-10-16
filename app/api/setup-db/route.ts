import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = 'https://qklnxfkwjpdboqawxpts.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbG54Zmt3anBkYm9xYXd4cHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzE4NTIsImV4cCI6MjA3NTk0Nzg1Mn0.Y7w1pV-BC5rfYMFo_vMlhYVq7KaFOdUtcyG3eHYMmms';

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, let's check if the columns already exist
    const { data: existingData, error: checkError } = await supabase
      .from('clinics_madison_wi')
      .select('id, accepts_appointments, is_featured')
      .limit(1);

    const columnsExist = !checkError;
    
    // Try to update some clinics to featured (this will also test if columns exist)
    const { data: updateData, error: updateError } = await supabase
      .from('clinics_madison_wi')
      .update({ 
        accepts_appointments: true, 
        is_featured: true 
      })
      .in('id', [1, 2, 3, 4, 5])
      .select();

    // Check if appointment_requests table exists
    const { data: appointmentTest, error: appointmentError } = await supabase
      .from('appointment_requests')
      .select('*')
      .limit(1);

    const appointmentTableExists = !appointmentError;

    return NextResponse.json({ 
      success: true,
      columnsExist,
      columnsAdded: !updateError,
      appointmentTableExists,
      message: updateError 
        ? 'Columns may need to be added manually in Supabase dashboard'
        : 'Database setup complete! Featured clinics updated.',
      updatedClinics: updateData?.length || 0,
      errors: {
        checkError: checkError?.message,
        updateError: updateError?.message,
        appointmentError: appointmentError?.message
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      note: 'You may need to run SQL manually in Supabase dashboard'
    }, { status: 500 });
  }
}
