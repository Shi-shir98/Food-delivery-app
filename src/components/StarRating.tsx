import React, { useState } from 'react';
import { Star, Award } from 'lucide-react';
import { Language } from '../types.ts';

export interface StarRatingProps {
  rating: number; // e.g., 4.9
  maxStars?: number; // default 5
  reviewCount?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showScore?: boolean;
  showCount?: boolean;
  showTopBadge?: boolean;
  badgeThreshold?: number; // e.g. 4.8
  theme?: 'dark' | 'light' | 'auto';
  interactive?: boolean;
  userRating?: number | null;
  onRate?: (rating: number) => void;
  language?: Language;
  className?: string;
  id?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  reviewCount,
  size = 'md',
  showScore = true,
  showCount = true,
  showTopBadge = false,
  badgeThreshold = 4.8,
  theme = 'auto',
  interactive = false,
  userRating = null,
  onRate,
  language = 'en',
  className = '',
  id,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Size mappings
  const sizeConfig = {
    xs: {
      starClass: 'w-3 h-3',
      textClass: 'text-[11px]',
      gapClass: 'gap-0.5',
      badgeClass: 'text-[9px] px-1.5 py-0.2',
    },
    sm: {
      starClass: 'w-3.5 h-3.5',
      textClass: 'text-xs',
      gapClass: 'gap-0.5',
      badgeClass: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      starClass: 'w-4 h-4',
      textClass: 'text-sm',
      gapClass: 'gap-1',
      badgeClass: 'text-xs px-2 py-0.5',
    },
    lg: {
      starClass: 'w-5 h-5',
      textClass: 'text-base',
      gapClass: 'gap-1.5',
      badgeClass: 'text-xs px-2.5 py-1',
    },
  }[size];

  const effectiveRating = hoverRating !== null ? hoverRating : (userRating ?? rating);
  const isTopRated = rating >= badgeThreshold;

  // Star fill logic for index (0 to 4)
  const renderStar = (starIndex: number) => {
    const starNumber = starIndex + 1;
    let fillFraction = 0;

    if (effectiveRating >= starNumber) {
      fillFraction = 1;
    } else if (effectiveRating > starIndex) {
      fillFraction = Math.max(0, Math.min(1, effectiveRating - starIndex));
    }

    const uniqueId = `star-grad-${id || 'sr'}-${starIndex}-${Math.round(fillFraction * 100)}`;

    return (
      <span
        key={starIndex}
        className={`relative inline-flex items-center justify-center ${interactive ? 'cursor-pointer transition-transform hover:scale-125' : ''}`}
        onMouseEnter={() => interactive && setHoverRating(starNumber)}
        onMouseLeave={() => interactive && setHoverRating(null)}
        onClick={(e) => {
          if (interactive && onRate) {
            e.stopPropagation();
            onRate(starNumber);
          }
        }}
        title={interactive ? `Rate ${starNumber} star${starNumber > 1 ? 's' : ''}` : `${rating.toFixed(1)} / 5 stars`}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? `Rate ${starNumber} star${starNumber > 1 ? 's' : ''}` : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => {
          if (interactive && onRate && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.stopPropagation();
            onRate(starNumber);
          }
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className={`${sizeConfig.starClass} shrink-0 drop-shadow-xs`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${fillFraction * 100}%`} stopColor="#f59e0b" />
              <stop
                offset={`${fillFraction * 100}%`}
                stopColor={theme === 'dark' ? '#44403c' : '#d6d3d1'}
                stopOpacity="0.4"
              />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${uniqueId})`}
            stroke={fillFraction > 0 ? '#d97706' : theme === 'dark' ? '#57534e' : '#a8a29e'}
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      </span>
    );
  };

  return (
    <div
      id={id}
      className={`inline-flex items-center flex-wrap ${sizeConfig.gapClass} ${className}`}
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars based on ${reviewCount || 0} reviews`}
    >
      {/* 5 Stars Glyphs */}
      <div className={`flex items-center ${sizeConfig.gapClass}`}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </div>

      {/* Numeric Score */}
      {showScore && (
        <span
          className={`font-bold ml-1 ${sizeConfig.textClass} ${
            theme === 'dark' ? 'text-amber-300' : 'text-stone-900'
          }`}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {/* Review Count */}
      {showCount && reviewCount !== undefined && (
        <span
          className={`${sizeConfig.textClass} ${
            theme === 'dark' ? 'text-stone-300 font-normal' : 'text-stone-500 font-normal'
          }`}
        >
          {language === 'ne'
            ? `(${reviewCount.toLocaleString('ne-NP')} ${reviewCount === 1 ? 'समीक्षा' : 'समीक्षाहरू'})`
            : `(${reviewCount.toLocaleString()} ${reviewCount === 1 ? 'review' : 'reviews'})`}
        </span>
      )}

      {/* Optional Top Rated Badge */}
      {showTopBadge && isTopRated && (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full ml-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 ${sizeConfig.badgeClass}`}
        >
          <Award className="w-3 h-3 text-amber-500 shrink-0" />
          <span>{language === 'ne' ? 'उत्कृष्ट' : 'Top Rated'}</span>
        </span>
      )}
    </div>
  );
};
