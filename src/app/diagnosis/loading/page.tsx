'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { ScoreBar } from '@/components/diagnosis/ScoreBar';
import { GATE_CONFIG } from '@/types/diagnosis';
import type { GateType, Scores } from '@/types/diagnosis';

type LoadingStep = 1 | 2 | 3;

interface StepConfig {
  duration: number;
  message: string;
}

const STEP_CONFIG: Record<LoadingStep, StepConfig> = {
  1: { duration: 1500, message: '回答データを分析しています...' },
  2: { duration: 2500, message: 'あなたの消耗パターンが見つかりました' },
  3: { duration: 0, message: '' },
};

const GATE_ORDER: GateType[] = ['heart', 'wisdom', 'energy', 'time'];

// 最も低いスコアの門を特定
function getWeakestGate(scores: Scores): GateType {
  let weakest: GateType = 'heart';
  let minScore = scores.heart;
  for (const gate of GATE_ORDER) {
    if (scores[gate] < minScore) {
      minScore = scores[gate];
      weakest = gate;
    }
  }
  return weakest;
}

// 門ごとの「わかること」プレビュー
const GATE_PREVIEW: Record<GateType, string> = {
  heart: '「断れない・気を遣いすぎる」パターンの根本原因と対処法',
  wisdom: '「考えすぎ・決められない」ループの止め方と決断力の上げ方',
  energy: '「休んでも回復しない」原因と、本当に効く休息法',
  time: '「過去に囚われて動けない」記憶パターンの解除法',
};

export default function DiagnosisLoadingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<LoadingStep>(1);
  const [scores, setScores] = useState<Scores | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    // Get scores from sessionStorage
    const storedResult = sessionStorage.getItem('diagnosisResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        if (result.scores) {
          setScores(result.scores);
        }
      } catch (error) {
        console.error('Failed to parse diagnosis result:', error);
      }
    }

    // If no result, generate mock scores for demo
    if (!storedResult) {
      setScores({
        heart: Math.floor(Math.random() * 40) + 40,
        wisdom: Math.floor(Math.random() * 40) + 40,
        energy: Math.floor(Math.random() * 40) + 40,
        time: Math.floor(Math.random() * 40) + 40,
        total: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      const timer = setTimeout(() => setCurrentStep(2), STEP_CONFIG[1].duration);
      return () => clearTimeout(timer);
    }

    if (currentStep === 2) {
      const timer = setTimeout(() => setCurrentStep(3), STEP_CONFIG[2].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleSubmitEmail = useCallback(async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError('正しいメールアドレスを入力してください');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const serial = sessionStorage.getItem('diagnosisSerial');
      if (!serial) {
        throw new Error('診断データが見つかりません');
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serial,
          lastName: '',
          firstName: '',
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      // Store email for thank you page
      sessionStorage.setItem('contactInfo', JSON.stringify({ email }));
      router.push('/contact/complete');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [email, router]);

  const weakestGate = scores ? getWeakestGate(scores) : 'heart';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Step 1: Loading */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <Loading size="lg" variant="pulse" />
              <p className="text-stone-500 text-center">
                {STEP_CONFIG[1].message}
              </p>
            </motion.div>
          )}

          {/* Step 2: Scores Display */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4"
                >
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <p className="text-stone-800 font-medium">
                  {STEP_CONFIG[2].message}
                </p>
              </div>

              {/* Score Bars */}
              <div className="space-y-5 bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                <h3 className="text-sm text-stone-500 mb-5">
                  あなたの4つの領域のスコア
                </h3>
                {scores &&
                  GATE_ORDER.map((gate, index) => (
                    <motion.div
                      key={gate}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <ScoreBar
                        score={scores[gate]}
                        label={GATE_CONFIG[gate].label}
                        color={GATE_CONFIG[gate].color}
                      />
                    </motion.div>
                  ))}
              </div>

              <div className="flex items-center justify-center gap-3 text-stone-500">
                <Loading size="sm" variant="dots" />
                <span className="text-sm">詳細レポートを作成中...</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Email Capture (integrated) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-6"
            >
              {/* 完了アイコン */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100"
                >
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              </div>

              <div className="text-center">
                <p className="text-stone-800 font-medium text-lg">
                  あなた専用のレポートが完成しました
                </p>
              </div>

              {/* レポートに含まれる内容プレビュー */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm"
              >
                <p className="text-stone-500 text-xs mb-3">レポートに含まれる内容：</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-sm mt-0.5">✓</span>
                    <p className="text-stone-700 text-sm">4領域のバランス詳細分析</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-sm mt-0.5">✓</span>
                    <p className="text-stone-700 text-sm">{GATE_PREVIEW[weakestGate]}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-sm mt-0.5">✓</span>
                    <p className="text-stone-700 text-sm">あなた専用の改善アクション3つ</p>
                  </div>
                </div>
              </motion.div>

              {/* メール入力フォーム（配送フレーミング） */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-stone-600 text-sm mb-2 block">
                    レポートの送り先
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitError(null);
                    }}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  />
                  {submitError && (
                    <p className="text-red-500 text-xs mt-2">{submitError}</p>
                  )}
                </div>

                <Button
                  onClick={handleSubmitEmail}
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-white border-0 shadow-none"
                >
                  レポートを受け取る
                </Button>

                <p className="text-stone-400 text-xs text-center">
                  ※ レポートは数分以内にメールでお届けします
                  <br />
                  ※ 迷惑メールフォルダもご確認ください
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="flex justify-center gap-3 mt-16">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'bg-stone-800 w-8'
                  : step < currentStep
                  ? 'bg-stone-400 w-1.5'
                  : 'bg-stone-300 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
