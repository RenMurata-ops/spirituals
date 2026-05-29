'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = [
      'w-full px-4 py-3 rounded-lg',
      'bg-white border border-stone-300',
      'text-stone-800 placeholder:text-stone-400',
      'transition-all duration-200',
      'focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50',
    ].join(' ');

    const errorStyles = error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-stone-600"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[baseStyles, errorStyles, className].filter(Boolean).join(' ')}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
