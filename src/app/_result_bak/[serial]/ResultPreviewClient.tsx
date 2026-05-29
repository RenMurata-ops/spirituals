'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GateType, GateScore, RankName, GATE_CONFIG } from '@/types/diagnosis';
import { GateDefinition } from '@/data/gates';
import { ScoreDisplay } from '@/components/result/ScoreDisplay';
import { RankBadge } from '@/components/result/RankBadge';
import { GateChart } from '@/components/result/GateChart';
import { ShareButtons } from '@/components/result/ShareButtons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GateIcon } from '@/components/diagnosis/GateIcon';

interface ResultPreviewClientProps {
  userName: string;
  totalScore: number;
  rank: RankName;
  soulType: string;
  gateScores: GateScore[];
  strongestGate: GateType | null;
  weakestGate: GateType | null;
  strongestGateData: GateDefinition | null;
  weakestGateData: GateDefinition | null;
  shareText: string;
  serial: string;
}

export function ResultPreviewClient({
  userName,
  totalScore,
  rank,
  soulType,
  gateScores,
  strongestGate,
  weakestGate,
  strongestGateData,
  weakestGateData,
  shareText,
  serial,
}: ResultPreviewClientProps) {
  return (
    <div className="min-h-screen bg-amber-50/50">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3 tracking-wide">
            {userName} 様の診断レポート
          </h1>
          <p className="text-amber-700">4つの門のバランス分析結果</p>
        </motion.div>

        {/* Score & Rank Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            <ScoreDisplay score={totalScore} size="lg" />
            <RankBadge rank={rank} size="lg" />

            {/* Soul Type */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-amber-600 mb-1">あなたの魂のタイプ</p>
              <p className="text-xl font-semibold text-amber-900">
                {soulType}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Gate Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8">
          <h2 className="text-lg font-semibold text-amber-900 mb-6 text-center">
            4つの門のバランス
          </h2>
          <GateChart
            gates={gateScores}
            strongestGate={strongestGate || undefined}
            weakestGate={weakestGate || undefined}
          />
        </div>

        {/* Weakest Gate Section */}
        {weakestGate && weakestGateData && (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8 border-l-4" style={{ borderLeftColor: GATE_CONFIG[weakestGate].color }}>
            <div className="flex items-start gap-4">
              <GateIcon type={weakestGate} size={32} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-amber-900">
                    要強化：{weakestGateData.label}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    弱点
                  </span>
                </div>
                <p className="text-amber-700 text-sm mb-4 leading-relaxed">
                  {weakestGateData.description}
                </p>
                <div className="text-sm">
                  <p className="text-amber-600 mb-2">リスク傾向：</p>
                  <ul className="list-disc list-inside text-amber-700 space-y-1">
                    {weakestGateData.risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strongest Gate Section */}
        {strongestGate && strongestGateData && (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8 border-l-4" style={{ borderLeftColor: GATE_CONFIG[strongestGate].color }}>
            <div className="flex items-start gap-4">
              <GateIcon type={strongestGate} size={32} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-amber-900">
                    強み：{strongestGateData.label}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 border border-amber-300">
                    最強
                  </span>
                </div>
                <p className="text-amber-700 text-sm mb-4 leading-relaxed">
                  {strongestGateData.description}
                </p>
                <div className="text-sm">
                  <p className="text-amber-600 mb-2">あなたの特性：</p>
                  <ul className="list-disc list-inside text-amber-700 space-y-1">
                    {strongestGateData.traits.slice(0, 3).map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8">
          <h3 className="text-lg font-semibold text-amber-900 mb-6 text-center">
            結果をシェアする
          </h3>
          <ShareButtons shareText={shareText} />
        </div>

        {/* CTA Section */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href={`/result/${serial}/detail`} className="block">
              <Button variant="primary" size="lg" className="w-full !bg-amber-800 hover:!bg-amber-900">
                詳しいレポートを見る
              </Button>
            </Link>
            <p className="text-center text-xs text-amber-600 mt-3">
              ※詳細レポートの閲覧にはメールで届いたリンクが必要です
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link href="/" className="block">
              <Button variant="secondary" size="lg" className="w-full !bg-white !text-amber-800 !border-amber-200 hover:!bg-amber-50">
                無料で診断する
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
