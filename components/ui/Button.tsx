import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:scale-[0.98]',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
    ghost: 'text-gray-600 hover:bg-gray-100',
    white: 'bg-white text-primary-dark hover:bg-gray-50 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="w-4 h-4 animate-spin text-current" />}
      {!loading && icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
