'use client';

import React from 'react';
import { Star } from 'lucide-react';

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

interface StarRatingProps {
  value: number;
  max?: number;
  size?: keyof typeof sizeMap;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  size = 'md',
  onChange,
  readOnly = false,
  className = '',
}: StarRatingProps) {
  const isInteractive = !readOnly && !!onChange;
  const iconSize = sizeMap[size];

  const stars = Array.from({ length: max }, (_, i) => {
    const starIndex = i + 1;
    const filled = value >= starIndex;
    const halfFilled = !filled && value >= starIndex - 0.5;

    return (
      <span
        key={i}
        className={`relative inline-block ${isInteractive ? 'cursor-pointer' : ''}`}
        onClick={isInteractive ? () => onChange(starIndex) : undefined}
        role={isInteractive ? 'button' : undefined}
        aria-label={isInteractive ? `${starIndex}점` : undefined}
      >
        {/* Background (empty) star */}
        <Star
          size={iconSize}
          className="text-gray-300"
          fill="none"
          strokeWidth={1.5}
        />

        {/* Filled or half-filled overlay */}
        {(filled || halfFilled) && (
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: halfFilled ? '50%' : '100%' }}
          >
            <Star
              size={iconSize}
              className="text-yellow-400"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </span>
        )}
      </span>
    );
  });

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={isInteractive ? 'group' : 'img'}
      aria-label={`별점 ${value}/${max}`}
    >
      {stars}
    </div>
  );
}
