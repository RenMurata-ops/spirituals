import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isConfigured, requestPayment } from '@/lib/payment/linepay';
import { PRODUCT } from '@/data/product';

interface Body {
  serial: string;
  token: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://spirituals.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const { serial, token } = (await request.json()) as Body;
    if (!serial || !token) {
      return NextResponse.json({ error: 'Missing serial/token' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('diagnoses')
      .select('serial, token, paid_at')
      .eq('serial', serial)
      .single();

    if (error || !data || data.token !== token) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (data.paid_at) {
      return NextResponse.json({ alreadyPaid: true });
    }

    // 決済プロバイダ未設定でも安全にフォールバック（フロントは「準備中」を表示）
    if (!isConfigured()) {
      return NextResponse.json({ configured: false });
    }

    const confirmUrl = `${BASE}/api/payment/confirm`;
    const cancelUrl = `${BASE}/result/${serial}/detail?token=${encodeURIComponent(token)}`;

    const { paymentUrl, transactionId } = await requestPayment({
      amount: PRODUCT.price,
      currency: PRODUCT.currency,
      orderId: serial,
      productName: PRODUCT.name,
      confirmUrl,
      cancelUrl,
    });

    // transactionId を保存（confirm時の照合・冪等性のため）
    await supabase
      .from('diagnoses')
      .update({ payment_ref: transactionId })
      .eq('serial', serial);

    return NextResponse.json({ configured: true, paymentUrl });
  } catch (err) {
    console.error('payment/request error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
