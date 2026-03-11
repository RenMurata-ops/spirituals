'use client';

import { motion } from 'framer-motion';
import { RankName } from '../../types/diagnosis';

interface RankBadgeProps {
  rank: RankName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { padding: 'px-3 py-1', text: 'text-sm' },
  md: { padding: 'px-5 py-2', text: 'text-base' },
  lg: { padding: 'px-8 py-3', text: 'text-lg' },
};

const RANK_DESCRIPTIONS: Record<RankName, string> = {
  '覚醒者': '全ての門を開く者',
  '守護者': '高き霊性の持ち主',
  '修行者': '成長の途上にある者',
  '探求者': '道を求める者',
  '目覚めの時': '旅の始まり',
};

// 控えめなランク別カラー
const RANK_STYLES: Record<RankName, { bg: string; text: string; border: string }> = {
  '覚醒者': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  '守護者': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  '修行者': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
  '探求者': { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' },
  '目覚めの時': { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200' },
};

export function RankBadge({ rank, size = 'md', className = '' }: RankBadgeProps) {
  const sizeStyles = SIZES[size];
  const rankStyle = RANK_STYLES[rank];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`inline-flex flex-col items-center ${className}`}
    >
      {/* Badge */}
      <div
        className={`${sizeStyles.padding} rounded-full ${rankStyle.bg} ${rankStyle.text} border ${rankStyle.border}`}
      >
        <span className={`${sizeStyles.text} font-semibold tracking-wide`}>
          {rank}
        </span>
      </div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-sm text-stone-500"
      >
        {RANK_DESCRIPTIONS[rank]}
      </motion.p>
    </motion.div>
  );
}

export default RankBadge;
