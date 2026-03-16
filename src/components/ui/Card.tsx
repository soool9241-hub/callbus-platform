'use client';

import React from 'react';

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: keyof typeof paddingClasses;
}

export function Card({
  hover = false,
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-gray-200 bg-white shadow-sm
        ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div className={`border-b border-gray-100 px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div
      className={`border-t border-gray-100 px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
