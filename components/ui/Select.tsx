'use client';

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, children, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = [
      'w-full px-4 py-3 rounded-lg',
      'bg-white border border-stone-300',
      'text-stone-800',
      'transition-all duration-200',
      'focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50',
      'appearance-none cursor-pointer',
      'bg-no-repeat bg-right',
    ].join(' ');

    const errorStyles = error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
      : '';

    const selectStyle = {
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundPosition: 'right 12px center',
      backgroundSize: '16px',
      paddingRight: '40px',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block mb-2 text-sm font-medium text-stone-600"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={[baseStyles, errorStyles, className].filter(Boolean).join(' ')}
          style={selectStyle}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            : children}
        </select>
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

Select.displayName = 'Select';
