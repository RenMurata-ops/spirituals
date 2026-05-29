'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuickDiagnosisStore } from '../../../store/quickDiagnosis';
import { QuestionCard } from '../../../components/diagnosis/QuestionCard';
import { YesNoButtons } from '../../../components/diagnosis/YesNoButtons';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import type { AgeGroup, Gender } from '../../../types/diagnosis';

// 質問定義
const QUESTIONS = [
  { id: 'q1', text: '人と会った後、理由もなくぐったりすることがある', step: 1 },
  { id: 'q2', text: '情報を集めれば集めるほど、かえって迷うことがある', step: 1 },
  { id: 'q3', text: '場所や人によって、自分のテンションが大きく変わる', step: 2 },
  { id: 'q4', text: '過去の出来事を、ふとした瞬間に何度も思い出す', step: 2 },
  { id: 'q5', text: '他人の機嫌が気になって、自分の意見を言えないことがある', step: 2 },
];

// 属性オプション
const AGE_OPTIONS = [
  { value: '18-24', label: '18〜24歳' },
  { value: '25-34', label: '25〜34歳' },
  { value: '35-44', label: '35〜44歳' },
  { value: '45-54', label: '45〜54歳' },
  { value: '55+', label: '55歳以上' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他・回答しない' },
];

const OCCUPATION_OPTIONS = [
  { value: 'office', label: '会社員' },
  { value: 'self-employed', label: '自営業・フリーランス' },
  { value: 'public', label: '公務員' },
  { value: 'student', label: '学生' },
  { value: 'homemaker', label: '主婦・主夫' },
  { value: 'parttime', label: 'パート・アルバイト' },
  { value: 'unemployed', label: '無職' },
  { value: 'other', label: 'その他' },
];

export default function QuickDiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { answers, attributes, setAnswer, setAttribute, reset } = useQuickDiagnosisStore();

  // 現在のステップの質問を取得
  const currentStepQuestions = QUESTIONS.filter((q) => q.step === currentStep);
  const currentQuestion = currentStep < 3 ? currentStepQuestions[currentQuestionIndex] : null;

  // 全体の進捗計算
  const totalSteps = 3;
  const progress = ((currentStep - 1) / totalSteps) * 100 +
    (currentStep < 3 ? (currentQuestionIndex / currentStepQuestions.length) * (100 / totalSteps) : 0);

  // 質問に回答
  const handleAnswer = (value: boolean) => {
    if (!currentQuestion) return;

    setAnswer(currentQuestion.id, value);

    // 次の質問へ、またはステップ進行
    if (currentQuestionIndex < currentStepQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentStep((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  // 前の質問に戻る
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentStep > 1) {
      // 前のステップの最後の質問へ
      const prevStepQuestions = QUESTIONS.filter((q) => q.step === currentStep - 1);
      setCurrentStep((prev) => prev - 1);
      setCurrentQuestionIndex(prevStepQuestions.length - 1);
    }
  };

  // 戻れるかどうか
  const canGoBack = currentStep > 1 || currentQuestionIndex > 0;

  // 属性フォーム送信
  const handleSubmit = async () => {
    if (!attributes.ageGroup || !attributes.gender) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/diagnosis/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          ageGroup: attributes.ageGroup,
          gender: attributes.gender,
          occupation: attributes.occupation || '',
        }),
      });

      if (!response.ok) {
        throw new Error('診断に失敗しました');
      }

      const data = await response.json();

      // APIレスポンス: { serial, gate, result: { gateName, description, headline, advice, ctaText } }
      const result = data.result;

      // serialをsessionStorageに保存（フル診断で使用）
      if (data.serial) {
        sessionStorage.setItem('diagnosisSerial', data.serial);
      }

      // 結果ページへ遷移（結果をURLパラメータで渡す）
      const params = new URLSearchParams({
        gate: result.gateName || '',
        headline: result.headline || '',
        desc: result.description || '',
        advice: result.advice || '',
        cta: result.ctaText || '3分無料診断を始める',
      });

      router.push(`/quick/result?${params.toString()}`);
    } catch (error) {
      console.error('診断エラー:', error);
      alert('診断に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 属性入力が完了しているか
  const isAttributesComplete = attributes.ageGroup && attributes.gender;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* ヘッダー */}
      <header className="py-8 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-medium text-stone-800 text-center mb-6 tracking-wide">
            10秒スピリチュアル診断
          </h1>
          <ProgressBar value={progress} max={100} size="sm" />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* ステップ1-2: 質問 */}
          {currentStep < 3 && currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              questionNumber={QUESTIONS.findIndex((q) => q.id === currentQuestion.id) + 1}
              totalQuestions={5}
              questionText={currentQuestion.text}
            >
              <YesNoButtons onSelect={handleAnswer} />
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

          {/* ステップ3: 属性入力 */}
          {currentStep === 3 && (
            <motion.div
              key="attributes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg mx-auto"
            >
              <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-lg font-medium text-stone-800 mb-8">
                  あなたについて教えてください
                </h2>

                <div className="space-y-6">
                  <Select
                    label="年齢"
                    options={AGE_OPTIONS}
                    placeholder="選択してください"
                    value={attributes.ageGroup || ''}
                    onChange={(e) => setAttribute('ageGroup', e.target.value as AgeGroup)}
                  />

                  <Select
                    label="性別"
                    options={GENDER_OPTIONS}
                    placeholder="選択してください"
                    value={attributes.gender || ''}
                    onChange={(e) => setAttribute('gender', e.target.value as Gender)}
                  />

                  <Select
                    label="職業（任意）"
                    options={OCCUPATION_OPTIONS}
                    placeholder="選択してください"
                    value={attributes.occupation}
                    onChange={(e) => setAttribute('occupation', e.target.value)}
                  />
                </div>

                <div className="mt-10">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-stone-800 hover:bg-stone-700 text-white border-0 shadow-none"
                    onClick={handleSubmit}
                    disabled={!isAttributesComplete}
                    isLoading={isSubmitting}
                  >
                    診断結果を見る
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* フッター */}
      <footer className="py-8 text-center">
        <p className="text-sm text-stone-400">
          ステップ {currentStep} / {totalSteps}
        </p>
      </footer>
    </div>
  );
}
