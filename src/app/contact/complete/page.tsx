'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../../components/ui/Card';

interface ContactInfo {
  lastName: string;
  firstName: string;
  email: string;
}

export default function ContactCompletePage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactInfo');
    if (stored) {
      try {
        setContactInfo(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-amber-50/50 flex items-center justify-center px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 md:p-10">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-10 h-10 text-amber-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-amber-900 text-center mb-8 tracking-wide"
          >
            送信先を登録しました
          </motion.h1>

          {/* User Info */}
          {contactInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-stone-50 rounded-lg p-5 mb-8 border border-stone-100"
            >
              <p className="text-stone-700 text-sm text-center">
                送信先: {contactInfo.email}
              </p>
            </motion.div>
          )}

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="space-y-3">
              <p className="text-stone-700 leading-relaxed">
                <span className="text-stone-900 font-medium">数分以内</span>に
                <br />
                あなた専用の診断レポートをお届けします。
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                レポートには、あなたの消耗パターンの詳細分析と
                <br />
                具体的な改善アクションが含まれています。
              </p>
            </div>

            <div className="pt-6 border-t border-stone-100 space-y-3">
              <p className="text-sm text-stone-500">
                届かない場合は迷惑メールフォルダをご確認ください
              </p>
              <p className="text-sm text-stone-500">
                このページは閉じていただいて構いません
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
