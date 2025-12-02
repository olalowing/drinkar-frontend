import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
  className,
}) {
  const stars = [1, 2, 3, 4, 5]

  const handleSelect = (starValue) => {
    if (readOnly || !onChange) return
    if (value === starValue) {
      onChange(0)
    } else {
      onChange(starValue)
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars.map((star) => {
        const filled = value >= star
        const icon = (
          <Star
            className={cn(
              'transition-colors',
              sizeClasses[size] || sizeClasses.md,
              filled ? 'text-amber-500' : 'text-gray-300'
            )}
            style={{ fill: filled ? 'currentColor' : 'transparent' }}
          />
        )

        if (readOnly) {
          return (
            <span key={star} aria-hidden="true">
              {icon}
            </span>
          )
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleSelect(star)}
            className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={`Sätt betyg ${star}`}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}
