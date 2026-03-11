'use client';

import { motion } from 'framer-motion';
import { GateScore, GATE_CONFIG, GateType } from '../../types/diagnosis';
import { GateIcon } from '../diagnosis/GateIcon';

interface GateChartProps {
  gates: GateScore[];
  strongestGate?: GateType;
  weakestGate?: GateType;
  className?: string;
}

// 控えめなパステルカラー
const GATE_COLORS: Record<GateType, string> = {
  heart: '#e8b4b8',    // 淡いピンク
  wisdom: '#b8c4e8',   // 淡いブルー
  energy: '#c8e8b4',   // 淡いグリーン
  time: '#e8d4b4',     // 淡いベージュ
};

export function GateChart({
  gates,
  strongestGate,
  weakestGate,
  className = '',
}: GateChartProps) {
  const maxScore = 100;

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="space-y-4">
        {gates.map((gate, index) => {
          const config = GATE_CONFIG[gate.type];
          const isStrongest = gate.type === strongestGate;
          const isWeakest = gate.type === weakestGate;
          const barColor = GATE_COLORS[gate.type];

          return (
            <motion.div
              key={gate.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative"
            >
              {/* Gate label row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <GateIcon type={gate.type} size={20} />
                  <span className="text-sm font-medium text-amber-900">
                    {config.label}
                  </span>

                  {/* Badges - subtle style */}
                  {isStrongest && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      最強
                    </span>
                  )}
                  {isWeakest && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      要強化
                    </span>
                  )}
                </div>

                <span className="text-sm font-medium text-amber-800">
                  {gate.score}
                </span>
              </div>

              {/* Progress bar - subtle */}
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(gate.score / maxScore) * 100}%` }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center text-xs text-stone-400"
      >
        各門のスコアは質問への回答から算出されます
      </motion.div>
    </div>
  );
}

export default GateChart;
