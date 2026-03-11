'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface LikertScaleProps {
  onSelect: (value: number) => void;
  disabled?: boolean;
}

const LABELS = [
  '全く当てはまらない',
  'あまり当てはまらない',
  'どちらとも言えない',
  'やや当てはまる',
  '非常に当てはまる',
];

export function LikertScale({ onSelect, disabled = false }: LikertScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    if (disabled) return;
    setSelected(value);
    setTimeout(() => {
      onSelect(value);
      setSelected(null);
    }, 300);
  };

  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <motion.button
            key={value}
            whileHover={!disabled ? { y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={() => handleSelect(value)}
            disabled={disabled}
            className={`w-12 h-12 rounded-lg font-medium text-base transition-all duration-200 border ${
              selected === value
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {value}
          </motion.button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-stone-500 px-1">
        <span>{LABELS[0]}</span>
        <span>{LABELS[4]}</span>
      </div>

      {/* Selected label */}
      {selected !== null && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-stone-600"
        >
          {LABELS[selected - 1]}
        </motion.p>
      )}
    </div>
  );
}

export default LikertScale;
