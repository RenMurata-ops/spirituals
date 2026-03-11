'use client';

import { motion } from 'framer-motion';

interface ScoreBarProps {
  score: number; // 0-100
  label?: string;
  showValue?: boolean;
  color?: string;
  className?: string;
}

export function ScoreBar({
  score,
  label,
  showValue = true,
  color,
  className = '',
}: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div className={`w-full ${className}`}>
      {/* Label and value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-stone-600">{label}</span>}
          {showValue && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm font-medium text-stone-700"
            >
              {clampedScore}
            </motion.span>
          )}
        </div>
      )}

      {/* Bar background */}
      <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedScore}%` }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
          className="h-full rounded-full"
          style={{
            backgroundColor: color || '#a8998a',
          }}
        />
      </div>
    </div>
  );
}

export default ScoreBar;
