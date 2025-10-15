import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('clinics_madison_wi')
      .select('city')
      .not('city', 'is', null)
      .order('city', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }

    // Get unique cities
    const uniqueCities = [...new Set(data.map(row => row.city))];
    
    return NextResponse.json(uniqueCities);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
