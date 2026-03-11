'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GateType, RankName, GATE_CONFIG } from '@/types/diagnosis';
import { GateDefinition } from '@/data/gates';
import { RankBadge } from '@/components/result/RankBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GateIcon } from '@/components/diagnosis/GateIcon';

interface WeakestAnalysis {
  reason: string;
  steps: string[];
  daily_practice: string;
}

interface StrongestAnalysis {
  analysis: string;
  use_cases: string[];
  advice: string;
}

interface ResultDetailClientProps {
  userName: string;
  rank: RankName;
  soulType: string;
  totalScore: number;
  weakestGate: GateType | null;
  strongestGate: GateType | null;
  weakestGateData: GateDefinition | null;
  strongestGateData: GateDefinition | null;
  weakestAnalysis: WeakestAnalysis;
  strongestAnalysis: StrongestAnalysis;
  nextSteps: string[];
}

export function ResultDetailClient({
  userName,
  rank,
  soulType,
  totalScore,
  weakestGate,
  strongestGate,
  weakestGateData,
  strongestGateData,
  weakestAnalysis,
  strongestAnalysis,
  nextSteps,
}: ResultDetailClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-amber-50/50">
      <motion.div
        className="container mx-auto px-4 py-12 md:py-20 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3 tracking-wide">
            {userName} 様の詳細レポート
          </h1>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <RankBadge rank={rank} size="sm" />
            <span className="text-amber-400">|</span>
            <span className="text-amber-800 font-medium">{soulType}</span>
            <span className="text-amber-400">|</span>
            <span className="text-amber-900 font-semibold">{totalScore}点</span>
          </div>
        </motion.div>

        {/* Weakest Gate Detail Analysis */}
        {weakestGate && weakestGateData && (
          <motion.div variants={itemVariants}>
            <div
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8 border-l-4"
              style={{ borderLeftColor: GATE_CONFIG[weakestGate].color }}
            >
              <div className="flex items-center gap-4 mb-6">
                <GateIcon type={weakestGate} size={40} />
                <div>
                  <h2 className="text-xl font-bold text-amber-900">
                    {weakestGateData.label}【詳細分析】
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    弱点の門
                  </span>
                </div>
              </div>

              {/* Why this gate is open */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs text-amber-800">
                    1
                  </span>
                  なぜこの門が開いているのか
                </h3>
                <p className="text-amber-700 text-sm pl-8 leading-relaxed">
                  {weakestAnalysis.reason}
                </p>
              </div>

              {/* Steps to address */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs text-amber-800">
                    2
                  </span>
                  対処法（ステップ形式）
                </h3>
                <div className="pl-8 space-y-3">
                  {weakestAnalysis.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: `${GATE_CONFIG[weakestGate].color}20`,
                          color: GATE_CONFIG[weakestGate].color,
                        }}
                      >
                        {index + 1}
                      </span>
                      <p className="text-amber-700 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily practice */}
              <div>
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs text-amber-800">
                    3
                  </span>
                  日常での実践
                </h3>
                <div className="pl-8">
                  <p className="text-amber-700 text-sm bg-amber-50 rounded-lg p-5 border border-amber-100 leading-relaxed">
                    {weakestAnalysis.daily_practice}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Strongest Gate Detail Analysis */}
        {strongestGate && strongestGateData && (
          <motion.div variants={itemVariants}>
            <div
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8 border-l-4"
              style={{ borderLeftColor: GATE_CONFIG[strongestGate].color }}
            >
              <div className="flex items-center gap-4 mb-6">
                <GateIcon type={strongestGate} size={40} />
                <div>
                  <h2 className="text-xl font-bold text-amber-900">
                    {strongestGateData.label}【詳細分析】
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 border border-amber-300">
                    強みの門
                  </span>
                </div>
              </div>

              {/* Strength analysis */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs text-amber-800">
                    ★
                  </span>
                  強みの分析
                </h3>
                <p className="text-amber-700 text-sm pl-8 leading-relaxed">
                  {strongestAnalysis.analysis}
                </p>
              </div>

              {/* Use cases */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs text-amber-800">
                    ✦
                  </span>
                  活用シーン
                </h3>
                <ul className="pl-8 space-y-2">
                  {strongestAnalysis.use_cases.map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-700 text-sm">
                      <span className="text-amber-500">•</span>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advice */}
              <div>
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs text-amber-800">
                    !
                  </span>
                  アドバイス
                </h3>
                <div className="pl-8">
                  <p className="text-amber-700 text-sm bg-amber-50 rounded-lg p-5 border border-amber-200 leading-relaxed">
                    {strongestAnalysis.advice}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-6 text-center">
              次のステップ
            </h2>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-amber-50 rounded-lg p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-amber-900">
                    {index + 1}
                  </span>
                  <p className="text-amber-800 text-sm pt-1 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Course CTA */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8 text-center">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              さらに深く学びたい方へ
            </h3>
            <p className="text-amber-700 text-sm mb-6 leading-relaxed">
              4つの門のバランスを整え、本来の力を発揮するための講座をご用意しています。
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="w-full !bg-amber-800 hover:!bg-amber-900">
                講座について詳しく見る
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Back to Preview */}
        <motion.div variants={itemVariants} className="text-center">
          <Link
            href="/"
            className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
          >
            ← トップページに戻る
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
