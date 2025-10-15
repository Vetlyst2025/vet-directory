import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const clinicType = searchParams.get('clinicType') || '';
  const city = searchParams.get('city') || '';
  const sortBy = searchParams.get('sortBy') || '';

  try {
    let query = supabase.from('clinics_madison_wi').select('*');

    if (search) {
      query = query.ilike('clinic_name', `%${search}%`);
    }

    if (clinicType) {
      query = query.ilike('clinic_type', `%${clinicType}%`);
    }

    if (city) {
      query = query.eq('city', city);
    }

    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false, nullsFirst: false });
    } else {
      query = query.order('clinic_name', { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
  }
}
