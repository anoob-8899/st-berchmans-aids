'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 1 to 5
  totalCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalCount,
  interactive = false,
  onRate,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'} p-0.5`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`${starSizes[size]} ${
                star <= activeRating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300 fill-transparent'
              }`}
            />
          </button>
        ))}
      </div>
      {typeof rating === 'number' && (
        <span className="text-sm font-semibold text-[#1A1A1A] ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {totalCount !== undefined && (
        <span className="text-xs text-[#5C6470]">({totalCount})</span>
      )}
    </div>
  );
};
