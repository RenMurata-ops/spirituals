'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface YesNoButtonsProps {
  onSelect: (value: boolean) => void;
  disabled?: boolean;
}

export function YesNoButtons({ onSelect, disabled = false }: YesNoButtonsProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    if (disabled) return;
    setSelected(value);
    setTimeout(() => {
      onSelect(value);
      setSelected(null);
    }, 300);
  };

  const buttonBase =
    'flex-1 py-4 px-8 rounded-lg font-medium text-base transition-all duration-200 border';

  return (
    <div className="flex gap-4">
      {/* Yes Button */}
      <motion.button
        whileHover={!disabled ? { y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={() => handleSelect(true)}
        disabled={disabled}
        className={`${buttonBase} ${
          selected === true
            ? 'bg-teal-50 text-teal-700 border-teal-300'
            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        はい
      </motion.button>

      {/* No Button */}
      <motion.button
        whileHover={!disabled ? { y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={() => handleSelect(false)}
        disabled={disabled}
        className={`${buttonBase} ${
          selected === false
            ? 'bg-stone-100 text-stone-700 border-stone-300'
            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        いいえ
      </motion.button>
    </div>
  );
}

export default YesNoButtons;
