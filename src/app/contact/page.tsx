'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';

export default function ContactPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serial, setSerial] = useState<string | null>(null);

  useEffect(() => {
    const storedSerial = sessionStorage.getItem('diagnosisSerial');
    setSerial(storedSerial);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError('正しいメールアドレスを入力してください');
      return;
    }

    if (!serial) {
      setSubmitError('診断データが見つかりません。もう一度診断を受けてください。');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial,
          lastName: '',
          firstName: '',
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '送信に失敗しました');
      }

      // Store user info for thank you page
      sessionStorage.setItem(
        'contactInfo',
        JSON.stringify({ email })
      );

      router.push('/contact/complete');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-stone-800 mb-3">
              あなた専用レポートが完成しました
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed">
              レポートの送り先を入力してください。
              <br />
              <span className="text-stone-800 font-medium">数分以内</span>にメールでお届けします。
            </p>
          </div>

          {/* レポートに含まれる内容 */}
          <div className="bg-stone-50 rounded-lg p-4 mb-6 border border-stone-100">
            <p className="text-stone-500 text-xs mb-2">レポートに含まれる内容：</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-xs">✓</span>
                <p className="text-stone-700 text-xs">4領域のバランス詳細分析</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-xs">✓</span>
                <p className="text-stone-700 text-xs">消耗パターンの根本原因</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-xs">✓</span>
                <p className="text-stone-700 text-xs">あなた専用の改善アクション3つ</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-stone-700 mb-2 block">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubmitError(null);
                }}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>

            {/* Submit Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200"
              >
                <p className="text-sm text-red-700">{submitError}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full bg-stone-800 hover:bg-stone-700 text-white border-0"
            >
              レポートを受け取る
            </Button>

            {/* Note */}
            <p className="text-xs text-stone-400 text-center leading-relaxed">
              ※ 迷惑メールフォルダもご確認ください
              <br />
              ※ メールアドレスは診断結果の送信のみに使用します
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
