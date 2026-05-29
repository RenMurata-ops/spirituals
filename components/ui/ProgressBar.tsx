'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  animate?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({
    value,
    max = 100,
    showLabel = false,
    labelPosition = 'outside',
    size = 'md',
    variant = 'default',
    animate = true,
    className = '',
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const trackStyles = [
      'w-full rounded-full overflow-hidden',
      'bg-stone-200',
      sizeStyles[size],
    ].join(' ');

    const fillStyles = [
      'h-full rounded-full',
      'bg-[#8b7355]',
    ].join(' ');

    return (
      <div ref={ref} className={['w-full', className].join(' ')} {...props}>
        {showLabel && labelPosition === 'outside' && (
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-stone-500">Progress</span>
            <span className="text-sm font-medium text-stone-700">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div className={trackStyles} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
          {animate ? (
            <motion.div
              className={fillStyles}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {showLabel && labelPosition === 'inside' && size === 'lg' && (
                <span className="flex items-center justify-center h-full text-xs font-medium text-white">
                  {Math.round(percentage)}%
                </span>
              )}
            </motion.div>
          ) : (
            <div className={fillStyles} style={{ width: `${percentage}%` }}>
              {showLabel && labelPosition === 'inside' && size === 'lg' && (
                <span className="flex items-center justify-center h-full text-xs font-medium text-white">
                  {Math.round(percentage)}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
