'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionCard } from '@/components/diagnosis/QuestionCard';
import { LikertScale } from '@/components/diagnosis/LikertScale';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  useFullDiagnosisStore,
  selectCurrentScreen,
  selectFullAnswers,
  selectIsFullComplete,
  selectProgress,
} from '@/store/fullDiagnosis';
import { fullQuestions } from '@/data/questions';
import type { GateType } from '@/types/diagnosis';

const QUESTIONS_PER_SCREEN = 4;

const SCREEN_GATES: Record<number, { gate: GateType; label: string }> = {
  1: { gate: 'heart', label: '心門' },
  2: { gate: 'wisdom', label: '智門' },
  3: { gate: 'energy', label: '気門' },
  4: { gate: 'time', label: '時門' },
  5: { gate: 'heart', label: '総合' },
};

export default function DiagnosisPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentScreen = useFullDiagnosisStore(selectCurrentScreen);
  const answers = useFullDiagnosisStore(selectFullAnswers);
  const isFullComplete = useFullDiagnosisStore(selectIsFullComplete);
  const progress = useFullDiagnosisStore(selectProgress);
  const setAnswer = useFullDiagnosisStore((state) => state.setAnswer);
  const nextScreen = useFullDiagnosisStore((state) => state.nextScreen);
  const prevScreen = useFullDiagnosisStore((state) => state.prevScreen);

  // 質問IDをメモ化して無限ループを防ぐ
  const questionIds = useMemo(() => {
    const startIndex = (currentScreen - 1) * QUESTIONS_PER_SCREEN;
    return Array.from(
      { length: QUESTIONS_PER_SCREEN },
      (_, i) => `q${startIndex + i + 1}`
    );
  }, [currentScreen]);

  // 現在の画面が完了しているかをメモ化
  const isScreenComplete = useMemo(() => {
    return questionIds.every((id) => id in answers);
  }, [questionIds, answers]);

  const currentQuestionId = questionIds[currentQuestionIndex];
  const currentQuestion = fullQuestions.find((q) => q.id === currentQuestionId);
  const globalQuestionNumber = (currentScreen - 1) * QUESTIONS_PER_SCREEN + currentQuestionIndex + 1;

  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestionId) return;
      setAnswer(currentQuestionId, value);

      if (currentQuestionIndex < 3) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 400);
      }
    },
    [currentQuestionId, currentQuestionIndex, setAnswer]
  );

  // 前の質問に戻る
  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentScreen > 1) {
      // 前のスクリーンの最後の質問へ
      prevScreen();
      setCurrentQuestionIndex(QUESTIONS_PER_SCREEN - 1);
    }
  }, [currentQuestionIndex, currentScreen, prevScreen]);

  // 戻れるかどうか
  const canGoBack = currentScreen > 1 || currentQuestionIndex > 0;

  const handleNextScreen = useCallback(() => {
    if (currentScreen < 5) {
      nextScreen();
      setCurrentQuestionIndex(0);
    }
  }, [currentScreen, nextScreen]);

  const handleSubmit = useCallback(async () => {
    if (!isFullComplete) return;

    setIsSubmitting(true);

    try {
      // sessionStorageからserialを取得
      const serial = sessionStorage.getItem('diagnosisSerial');

      if (!serial) {
        alert('診断データが見つかりません。最初からやり直してください。');
        router.push('/quick');
        return;
      }

      const response = await fetch('/api/diagnosis/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial, answers }),
      });

      if (!response.ok) {
        throw new Error('Diagnosis submission failed');
      }

      const result = await response.json();

      // Store result in sessionStorage for loading page
      sessionStorage.setItem('diagnosisResult', JSON.stringify(result));

      router.push('/diagnosis/loading');
    } catch (error) {
      console.error('Failed to submit diagnosis:', error);
      alert('診断の送信に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  }, [isFullComplete, answers, router]);

  const screenInfo = SCREEN_GATES[currentScreen];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-medium text-stone-800 tracking-wide">Spirituals</h1>
            <span className="text-sm text-stone-500">
              {screenInfo.label}の診断
            </span>
          </div>
          <ProgressBar value={progress} showLabel labelPosition="outside" size="sm" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-12">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestionId}
              questionNumber={globalQuestionNumber}
              totalQuestions={20}
              questionText={currentQuestion.text}
            >
              <LikertScale
                onSelect={handleAnswer}
                disabled={isSubmitting}
              />
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="mt-6 text-sm text-stone-400 hover:text-stone-600 transition-colors"
                >
                  ← 前の質問に戻る
                </button>
              )}
            </QuestionCard>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          {isScreenComplete && currentScreen < 5 && (
            <Button
              onClick={handleNextScreen}
              size="lg"
              className="bg-stone-800 hover:bg-stone-700 text-white border-0 shadow-none"
            >
              次のセクションへ
            </Button>
          )}

          {isFullComplete && currentScreen === 5 && (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              size="lg"
              className="bg-stone-800 hover:bg-stone-700 text-white border-0 shadow-none"
            >
              診断結果を見る
            </Button>
          )}

          {/* Question navigation dots */}
          <div className="flex gap-3 mt-6">
            {questionIds.map((qId, index) => {
              const isAnswered = qId in answers;
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={qId}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-stone-800 scale-125'
                      : isAnswered
                      ? 'bg-stone-400'
                      : 'bg-stone-300'
                  }`}
                  aria-label={`質問 ${index + 1}`}
                />
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
