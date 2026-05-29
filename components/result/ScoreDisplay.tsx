'use client';

import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
  md: { container: 'w-36 h-36', text: 'text-4xl', label: 'text-sm' },
  lg: { container: 'w-48 h-48', text: 'text-5xl', label: 'text-base' },
};

export function ScoreDisplay({ score, size = 'lg', className = '' }: ScoreDisplayProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const sizeStyles = SIZES[size];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative ${sizeStyles.container} ${className}`}
    >
      {/* Outer ring - subtle border */}
      <div
        className="absolute inset-0 rounded-full border-2 border-amber-200/40"
      />

      {/* Inner circle */}
      <div
        className="absolute inset-2 rounded-full bg-amber-50/80 flex flex-col items-center justify-center border border-amber-100"
      >
        {/* Score number */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`${sizeStyles.text} font-semibold text-amber-900`}
        >
          {clampedScore}
        </motion.span>

        {/* Label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${sizeStyles.label} text-amber-700/70 mt-1`}
        >
          総合スコア
        </motion.span>
      </div>
    </motion.div>
  );
}

export default ScoreDisplay;
