'use client';

import React, { useState } from 'react';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
} as const;

const onlineDotSizes = {
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border-2',
  lg: 'h-3.5 w-3.5 border-2',
} as const;

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: keyof typeof sizeClasses;
  online?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  online,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;
  const initials = name ? getInitials(name) : '?';

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`
          inline-flex items-center justify-center overflow-hidden rounded-full
          bg-blue-100 font-medium text-blue-700
          ${sizeClasses[size]}
        `}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full border-white
            ${online ? 'bg-green-500' : 'bg-gray-400'}
            ${onlineDotSizes[size]}
          `}
        />
      )}
    </div>
  );
}
