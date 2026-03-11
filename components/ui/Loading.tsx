'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'dots';
  message?: string;
}

const sizeStyles: Record<string, { container: string; spinner: string }> = {
  sm: { container: 'h-4 w-4', spinner: 'border-2' },
  md: { container: 'h-6 w-6', spinner: 'border-2' },
  lg: { container: 'h-8 w-8', spinner: 'border-3' },
};

const Spinner = ({ size }: { size: 'sm' | 'md' | 'lg' }) => (
  <div
    className={[
      sizeStyles[size].container,
      sizeStyles[size].spinner,
      'rounded-full border-stone-300 border-t-[#8b7355] animate-spin',
    ].join(' ')}
  />
);

const Pulse = ({ size }: { size: 'sm' | 'md' | 'lg' }) => (
  <motion.div
    className={[
      sizeStyles[size].container,
      'rounded-full bg-[#8b7355]',
    ].join(' ')}
    animate={{
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.8, 0.6],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const Dots = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const dotSize = size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={[dotSize, 'rounded-full bg-[#8b7355]'].join(' ')}
          animate={{
            y: ['0%', '-30%', '0%'],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = 'md', variant = 'spinner', message, className = '', ...props }, ref) => {
    const renderLoader = () => {
      switch (variant) {
        case 'pulse':
          return <Pulse size={size} />;
        case 'dots':
          return <Dots size={size} />;
        case 'spinner':
        default:
          return <Spinner size={size} />;
      }
    };

    return (
      <div
        ref={ref}
        className={['flex flex-col items-center justify-center gap-3', className].join(' ')}
        role="status"
        aria-label={message || 'Loading'}
        {...props}
      >
        {renderLoader()}
        {message && (
          <p className="text-sm text-stone-500">{message}</p>
        )}
      </div>
    );
  }
);

Loading.displayName = 'Loading';
