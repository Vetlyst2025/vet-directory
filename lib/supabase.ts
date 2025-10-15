import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qklnxfkwjpdboqawxpts.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbG54Zmt3anBkYm9xYXd4cHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzE4NTIsImV4cCI6MjA3NTk0Nzg1Mn0.Y7w1pV-BC5rfYMFo_vMlhYVq7KaFOdUtcyG3eHYMmms';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
