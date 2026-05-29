import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { confirmPayment } from '@/lib/payment/linepay';
import { PRODUCT } from '@/data/product';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://spirituals.vercel.app';

// LINE Pay は confirmUrl へ transactionId と orderId 付きでリダイレクトしてくる（GET）。
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const transactionId = url.searchParams.get('transactionId');
  const orderId = url.searchParams.get('orderId'); // = serial

  if (!transactionId || !orderId) {
    return NextResponse.redirect(`${BASE}/error/not-found`);
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('diagnoses')
      .select('serial, token, paid_at, payment_ref')
      .eq('serial', orderId)
      .single();

    if (error || !data) {
      return NextResponse.redirect(`${BASE}/error/not-found`);
    }

    const detailUrl = `${BASE}/result/${data.serial}/detail?token=${encodeURIComponent(data.token)}`;

    // 既に確定済みなら冪等にdetailへ
    if (data.paid_at) {
      return NextResponse.redirect(detailUrl);
    }

    // transactionId の照合（リクエスト時に保存したものと一致するか）
    if (data.payment_ref && data.payment_ref !== transactionId) {
      return NextResponse.redirect(`${BASE}/error/not-found`);
    }

    const ok = await confirmPayment(transactionId, PRODUCT.price, PRODUCT.currency);
    if (!ok) {
      return NextResponse.redirect(detailUrl);
    }

    await supabase
      .from('diagnoses')
      .update({ paid_at: new Date().toISOString(), payment_ref: transactionId })
      .eq('serial', orderId);

    return NextResponse.redirect(detailUrl);
  } catch (err) {
    console.error('payment/confirm error:', err);
    return NextResponse.redirect(`${BASE}/error/not-found`);
  }
}
