export default function Logo({ size = 'default' }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  const textSizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl'
  }

  return (
    <div className="flex items-center gap-3">
      {/* Logo icon - cocktail glass with gradient */}
      <div className="relative">
        <svg
          className={`${sizeClasses[size]} drop-shadow-lg`}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="cocktail-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Cocktail glass */}
          <path
            d="M12 8 L24 28 L24 38 L20 38 L20 42 L28 42 L28 38 L24 38 L24 28 L36 8 Z"
            fill="url(#cocktail-gradient)"
            stroke="url(#cocktail-gradient)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Liquid in glass */}
          <path
            d="M14 10 L24 24 L34 10 Z"
            fill="url(#cocktail-gradient)"
            opacity="0.3"
          />

          {/* Rim decoration */}
          <line x1="10" y1="8" x2="38" y2="8" stroke="url(#cocktail-gradient)" strokeWidth="2" strokeLinecap="round" />

          {/* Garnish - citrus slice */}
          <circle cx="34" cy="12" r="4" fill="url(#accent-gradient)" opacity="0.9" />
          <line x1="32" y1="12" x2="36" y2="12" stroke="white" strokeWidth="0.5" />
          <line x1="34" y1="10" x2="34" y2="14" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Logo text */}
      <div className="flex flex-col -space-y-1">
        <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent tracking-tight`}>
          Drinkar
        </span>
        {size !== 'small' && (
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            COCKTAIL MANAGER
          </span>
        )}
      </div>
    </div>
  )
}
