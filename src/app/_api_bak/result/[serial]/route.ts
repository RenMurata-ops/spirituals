import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{
    serial: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { serial } = await params;

    if (!serial) {
      return NextResponse.json(
        { success: false, error: 'Serial is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch diagnosis by serial
    const { data: diagnosis, error: fetchError } = await supabase
      .from('diagnoses')
      .select(`
        id,
        serial,
        created_at,
        last_name,
        first_name,
        middle_name,
        age_group,
        gender,
        occupation,
        quick_gate,
        quick_result,
        scores,
        weakest_gate,
        strongest_gate,
        soul_type,
        rank,
        full_result,
        preview_viewed_at,
        detail_viewed_at
      `)
      .eq('serial', serial)
      .single();

    if (fetchError || !diagnosis) {
      return NextResponse.json(
        { success: false, error: 'Diagnosis not found' },
        { status: 404 }
      );
    }

    // Update preview_viewed_at if not already set
    if (!diagnosis.preview_viewed_at) {
      await supabase
        .from('diagnoses')
        .update({ preview_viewed_at: new Date().toISOString() })
        .eq('serial', serial);
    }

    // Return diagnosis data (excluding sensitive fields like token, email)
    return NextResponse.json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    console.error('Result API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
