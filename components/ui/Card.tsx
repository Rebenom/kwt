import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden bg-white',
        variant === 'default' ? 'border border-gray-200' : 'shadow-md border border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
