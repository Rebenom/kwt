import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  required,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        required={required}
        className={cn(
          'w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      {!error && helperText && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
};
