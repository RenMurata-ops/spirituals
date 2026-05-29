'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { RankName } from '@/types/diagnosis';
import { RankBadge } from '@/components/result/RankBadge';
import { Button } from '@/components/ui/Button';

interface GateAnalysisItem {
  gate: string;
  gateName: string;
  score: number;
  status: string;
  description: string;
  improvement: string;
}

interface DetailNarrative {
  overallAnalysis: string;
  gateAnalysis: GateAnalysisItem[];
  soulTypeDeepDive: string;
  lifePathGuidance: string;
  dailyPractices: string[];
  warningMessage: string;
  finalMessage: string;
}

interface ResultDetailClientProps {
  userName: string;
  rank: RankName;
  soulType: string;
  totalScore: number;
  detail: DetailNarrative | null;
  // 有料ゲート: false のときは詳細を伏せて購入導線を出す
  unlocked: boolean;
  purchaseHref: string;
}

const STATUS_STYLE: Record<string, string> = {
  危険: 'bg-rose-50 text-rose-700 border-rose-200',
  注意: 'bg-amber-50 text-amber-700 border-amber-200',
  良好: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ResultDetailClient({
  userName,
  rank,
  soulType,
  totalScore,
  detail,
  unlocked,
  purchaseHref,
}: ResultDetailClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
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

        {detail ? (
          <>
            {/* 総合分析 */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8"
            >
              <h2 className="text-lg font-semibold text-amber-900 mb-4">総合分析</h2>
              <p className="text-amber-800 text-sm leading-relaxed">
                {detail.overallAnalysis}
              </p>
            </motion.section>

            {/* 7門の分析 */}
            {detail.gateAnalysis?.length ? (
              <motion.section
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8"
              >
                <h2 className="text-lg font-semibold text-amber-900 mb-6">
                  門ごとの状態
                </h2>
                <div className="space-y-6">
                  {detail.gateAnalysis.map((g) => (
                    <div key={g.gate} className="border-b border-amber-50 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-amber-900">{g.gateName}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-sm text-amber-700">{g.score}点</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${
                              STATUS_STYLE[g.status] ?? 'bg-stone-50 text-stone-600 border-stone-200'
                            }`}
                          >
                            {g.status}
                          </span>
                        </span>
                      </div>
                      <p className="text-amber-800 text-sm leading-relaxed mb-2">
                        {g.description}
                      </p>
                      <p className="text-amber-600 text-sm leading-relaxed">
                        → {g.improvement}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) : null}

            {/* 魂タイプの深層 */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8"
            >
              <h2 className="text-lg font-semibold text-amber-900 mb-4">
                あなたの魂タイプの深層
              </h2>
              <p className="text-amber-800 text-sm leading-relaxed">
                {detail.soulTypeDeepDive}
              </p>
            </motion.section>

            {/* 人生の指針 */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8"
            >
              <h2 className="text-lg font-semibold text-amber-900 mb-4">人生の指針</h2>
              <p className="text-amber-800 text-sm leading-relaxed">
                {detail.lifePathGuidance}
              </p>
            </motion.section>

            {/* 日々の実践 */}
            {detail.dailyPractices?.length ? (
              <motion.section
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8"
              >
                <h2 className="text-lg font-semibold text-amber-900 mb-6">日々の実践</h2>
                <div className="space-y-3">
                  {detail.dailyPractices.map((p, i) => (
                    <div key={i} className="flex items-start gap-4 bg-amber-50 rounded-lg p-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-amber-900">
                        {i + 1}
                      </span>
                      <p className="text-amber-800 text-sm pt-1 leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) : null}

            {/* 警告 */}
            <motion.section variants={itemVariants} className="mb-8">
              <div className="bg-rose-50/60 rounded-2xl border border-rose-100 p-8">
                <h2 className="text-base font-semibold text-rose-800 mb-3">
                  このまま放置すると
                </h2>
                <p className="text-rose-900/80 text-sm leading-relaxed">
                  {detail.warningMessage}
                </p>
              </div>
            </motion.section>

            {/* 締め */}
            <motion.section variants={itemVariants} className="mb-8">
              <p className="text-center text-amber-900 leading-relaxed px-2 font-medium">
                {detail.finalMessage}
              </p>
            </motion.section>
          </>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8 text-center"
          >
            <p className="text-amber-700 text-sm leading-relaxed">
              詳細レポートを準備中です。診断が完了していない場合は、もう一度お試しください。
            </p>
          </motion.div>
        )}

        {!unlocked && detail && (
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-8 mb-8 text-center">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                さらに深い「完全版レポート」
              </h3>
              <p className="text-amber-700 text-sm mb-6 leading-relaxed">
                7つの門の相互作用、あなた専用の90日リカバリープラン、魂タイプ別の詳細ガイドを含む完全版レポートをご用意しています。
              </p>
              <Link href={purchaseHref}>
                <Button variant="primary" size="lg" className="w-full !bg-amber-800 hover:!bg-amber-900">
                  完全版レポートを受け取る
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Back */}
        <motion.div variants={itemVariants} className="text-center">
          <Link href="/" className="text-sm text-amber-600 hover:text-amber-800 transition-colors">
            ← トップページに戻る
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
