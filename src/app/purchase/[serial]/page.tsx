import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { PRODUCT } from '@/data/product';
import { PurchaseButton } from './PurchaseButton';

interface PageProps {
  params: Promise<{ serial: string }>;
  searchParams: Promise<{ token?: string }>;
}

export const metadata: Metadata = {
  title: `${PRODUCT.name} | Spirituals`,
  description: 'あなたの診断結果に基づく完全版レポート。',
  robots: { index: false, follow: false },
};

const priceLabel = `¥${PRODUCT.price.toLocaleString('ja-JP')}`;

export default async function PurchasePage({ params, searchParams }: PageProps) {
  const { serial } = await params;
  const { token } = await searchParams;
  if (!token) redirect('/error/unauthorized');

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('diagnoses')
    .select('serial, token, paid_at')
    .eq('serial', serial)
    .single();

  if (error || !data || data.token !== token) {
    redirect('/error/unauthorized');
  }
  if (data.paid_at) {
    redirect(`/result/${serial}/detail?token=${encodeURIComponent(token)}`);
  }

  return (
    <main className="min-h-screen bg-amber-50/50">
      <div className="max-w-xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <p className="text-sm text-amber-700/80 mb-3 tracking-wide">完全版レポート</p>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-6 leading-snug tracking-wide">
          {PRODUCT.name}
        </h1>
        <p className="text-amber-800 leading-relaxed mb-10">
          無料診断で見えた4つの門のバランスを、さらに深く読み解きます。あなたの精神構造を「守る」ための、保存版のレポートです。
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-10">
          <h2 className="text-base font-medium text-amber-900 mb-5">完全版に含まれるもの</h2>
          <ul className="space-y-3">
            {PRODUCT.features.map((f, i) => (
              <li key={i} className="flex gap-3 text-amber-800 leading-relaxed">
                <span className="text-amber-500 shrink-0">◆</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-amber-100 flex items-baseline justify-between">
            <span className="text-amber-700 text-sm">買い切り（一回のお支払い）</span>
            <span className="text-2xl font-bold text-amber-900">{priceLabel}</span>
          </div>
        </div>

        <PurchaseButton serial={serial} token={token} priceLabel={priceLabel} />

        <p className="mt-6 text-xs text-amber-600 leading-relaxed text-center">
          お支払い後、この端末ですぐに完全版レポートが解放されます。
          特定商取引法に基づく表記は
          <a href="/legal/tokushoho" className="underline underline-offset-2 mx-1">こちら</a>
          。
        </p>
      </div>
    </main>
  );
}
