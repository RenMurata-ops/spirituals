import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getOrderStatus } from '@/lib/payment/square';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://spirituals.vercel.app';

// Square はホスト型決済の完了後、redirect_url に orderId 等を付けてGETで戻す。
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const squareOrderId = url.searchParams.get('orderId');

  if (!squareOrderId) {
    return NextResponse.redirect(`${BASE}/error/not-found`);
  }

  try {
    const supabase = createServerClient();
    // request時に payment_ref へ保存した Square order_id で診断行を特定
    const { data, error } = await supabase
      .from('diagnoses')
      .select('serial, token, paid_at, payment_ref')
      .eq('payment_ref', squareOrderId)
      .single();

    if (error || !data) {
      return NextResponse.redirect(`${BASE}/error/not-found`);
    }

    const detailUrl = `${BASE}/result/${data.serial}/detail?token=${encodeURIComponent(data.token)}`;

    // 既に確定済みなら冪等にdetailへ
    if (data.paid_at) {
      return NextResponse.redirect(detailUrl);
    }

    // Square 側で支払い完了しているか検証
    const status = await getOrderStatus(squareOrderId);
    if (!status.paid) {
      return NextResponse.redirect(detailUrl);
    }

    await supabase
      .from('diagnoses')
      .update({ paid_at: new Date().toISOString() })
      .eq('serial', data.serial);

    return NextResponse.redirect(detailUrl);
  } catch (err) {
    console.error('payment/confirm error:', err);
    return NextResponse.redirect(`${BASE}/error/not-found`);
  }
}
