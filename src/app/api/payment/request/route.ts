import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isConfigured, createCheckout } from '@/lib/payment/square';
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

    const redirectUrl = `${BASE}/api/payment/confirm`;

    const { url, squareOrderId } = await createCheckout({
      amount: PRODUCT.price,
      currency: PRODUCT.currency,
      orderId: serial,
      productName: PRODUCT.name,
      redirectUrl,
    });

    // Square の order_id を保存（confirm時の照合・冪等性のため）
    await supabase
      .from('diagnoses')
      .update({ payment_ref: squareOrderId })
      .eq('serial', serial);

    return NextResponse.json({ configured: true, paymentUrl: url });
  } catch (err) {
    console.error('payment/request error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
