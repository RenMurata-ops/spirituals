import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { calculateScheduledSendAt } from '@/lib/utils/delay';

interface ContactRequestBody {
  serial: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactRequestBody;

    // Validate required fields (name fields are optional)
    if (!body.serial || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if diagnosis exists
    const { data: diagnosis, error: fetchError } = await supabase
      .from('diagnoses')
      .select('id')
      .eq('serial', body.serial)
      .single();

    if (fetchError || !diagnosis) {
      return NextResponse.json(
        { success: false, error: 'Diagnosis not found' },
        { status: 404 }
      );
    }

    // Calculate scheduled send time (3-30 minutes from now)
    const scheduledSendAt = calculateScheduledSendAt();

    // Update diagnosis with contact info
    const { error: updateError } = await supabase
      .from('diagnoses')
      .update({
        // last_name / first_name は NOT NULL（既定 ''）。null を入れると違反するため空文字で扱う。
        last_name: body.lastName || '',
        first_name: body.firstName || '',
        middle_name: body.middleName || null,
        email: body.email,
        contact_type: 'email',
        scheduled_send_at: scheduledSendAt.toISOString(),
      })
      .eq('serial', body.serial);

    if (updateError) {
      console.error('Failed to update diagnosis:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update contact info' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduledAt: scheduledSendAt.toISOString(),
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
