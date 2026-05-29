'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  hoverable?: boolean;
  animate?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'bg-white border border-stone-200',
  elevated: 'bg-white shadow-sm',
  outlined: 'bg-transparent border border-stone-300',
  gradient: 'bg-gradient-to-b from-white to-stone-50 border border-stone-200',
  glass: 'bg-white/80 backdrop-blur-sm border border-stone-200/50',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, animate = true, padding = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-lg transition-all duration-200';

    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      paddingStyles[padding],
      hoverable ? 'hover:border-stone-300 hover:shadow-sm' : '',
      className,
    ].filter(Boolean).join(' ');

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={combinedClassName}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={hoverable ? { y: -2 } : undefined}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
