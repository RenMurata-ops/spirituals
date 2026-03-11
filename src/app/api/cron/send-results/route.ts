import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendResultEmail } from '@/lib/email/sendEmail';

const BATCH_SIZE = 10;

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServerClient();
    const now = new Date().toISOString();

    // Fetch diagnoses that are scheduled to be sent and haven't been sent yet
    const { data: pendingDiagnoses, error: fetchError } = await supabase
      .from('diagnoses')
      .select('*')
      .lte('scheduled_send_at', now)
      .is('email_sent_at', null)
      .not('email', 'is', null)
      .not('full_result', 'is', null)
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error('Failed to fetch pending diagnoses:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pending diagnoses' },
        { status: 500 }
      );
    }

    if (!pendingDiagnoses || pendingDiagnoses.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No pending diagnoses to process',
      });
    }

    let processedCount = 0;
    const errors: { serial: string; error: string }[] = [];

    for (const diagnosis of pendingDiagnoses) {
      if (!diagnosis.email) {
        continue;
      }

      const result = await sendResultEmail(diagnosis.email, {
        id: diagnosis.id,
        serial: diagnosis.serial,
        token: diagnosis.token,
        last_name: diagnosis.last_name,
        first_name: diagnosis.first_name,
        middle_name: diagnosis.middle_name,
        email: diagnosis.email,
        quick_result: diagnosis.quick_result,
        full_result: diagnosis.full_result,
      });

      if (result.success) {
        // Update email_sent_at
        const { error: updateError } = await supabase
          .from('diagnoses')
          .update({ email_sent_at: new Date().toISOString() })
          .eq('id', diagnosis.id);

        if (updateError) {
          console.error(`Failed to update email_sent_at for ${diagnosis.serial}:`, updateError);
          errors.push({ serial: diagnosis.serial, error: 'Failed to update status' });
        } else {
          processedCount++;
        }
      } else {
        console.error(`Failed to send email for ${diagnosis.serial}:`, result.error);
        errors.push({ serial: diagnosis.serial, error: result.error || 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      total: pendingDiagnoses.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Cron send-results error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
