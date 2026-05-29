'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface Props {
  serial: string;
  token: string;
  priceLabel: string;
}

export function PurchaseButton({ serial, token, priceLabel }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial, token }),
      });
      const data = await res.json();

      if (data.alreadyPaid) {
        router.push(`/result/${serial}/detail?token=${encodeURIComponent(token)}`);
        return;
      }
      if (data.configured === false) {
        setMessage('ただいま決済準備中です。公開までもう少々お待ちください。');
        return;
      }
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      setMessage('決済の開始に失敗しました。時間をおいて再度お試しください。');
    } catch {
      setMessage('通信エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        size="lg"
        onClick={onClick}
        isLoading={loading}
        disabled={loading}
        className="w-full !bg-amber-800 hover:!bg-amber-900"
      >
        {priceLabel}で完全版を受け取る
      </Button>
      {message && (
        <p className="mt-4 text-sm text-amber-700 text-center leading-relaxed">{message}</p>
      )}
    </div>
  );
}
