'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  children?: ReactNode;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  children,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 shadow-sm">
        {/* Question number */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-stone-500">
            質問 {questionNumber} / {totalQuestions}
          </span>
          <div className="h-1 flex-1 mx-4 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-stone-400"
            />
          </div>
        </div>

        {/* Question text */}
        <h2 className="text-lg md:text-xl font-medium text-stone-800 leading-relaxed mb-8">
          {questionText}
        </h2>

        {/* Answer buttons slot */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
}

export default QuestionCard;
