import { Link } from 'react-router-dom'
import { Wine, GlassWater, Youtube } from 'lucide-react'

export default function DrinkListItem({ drink }) {
  const mainImage = drink.images?.[0]

  return (
    <Link to={`/drinks/${drink.id}`} className="group">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-500/50 hover:shadow-lg transition-all duration-200">
        {/* Small Image */}
        <div className="flex-shrink-0">
          {mainImage ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-gray-200">
              <img
                src={mainImage}
                alt={drink.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {drink.images.length > 1 && (
                <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  {drink.images.length}
                </div>
              )}
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 via-primary-200 to-accent-100 flex items-center justify-center group-hover:from-primary-200 transition-all duration-300 ring-1 ring-gray-200">
              <Wine className="w-8 h-8 text-primary-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                {drink.name}
              </h3>
              {drink.spritbas && (
                <p className="text-sm text-primary-600 font-semibold mt-0.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-1.5"></span>
                  {drink.spritbas}
                </p>
              )}
            </div>

            {/* Icons on the right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-gray-600" title="Glastyp">
                <GlassWater className="w-4 h-4 text-primary-600" />
                <span className="hidden sm:inline font-medium">{drink.glass_type}</span>
              </div>
              {drink.youtube_url && (
                <div className="bg-red-100 p-1 rounded-full">
                  <Youtube className="w-3.5 h-3.5 text-red-600" title="Har video" />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {drink.description && (
            <p className="text-sm text-gray-600 line-clamp-1 mt-2">{drink.description}</p>
          )}

          {/* Tags */}
          {drink.tags && drink.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {drink.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full border border-primary-300"
                >
                  {tag}
                </span>
              ))}
              {drink.tags.length > 4 && (
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-300">
                  +{drink.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Ingredient count */}
        <div className="hidden md:flex flex-col items-center justify-center px-4 border-l border-gray-200">
          <div className="text-2xl font-bold text-primary-600">
            {drink.ingredients?.length || 0}
          </div>
          <div className="text-xs text-gray-600 text-center">
            ingredienser
          </div>
        </div>
      </div>
    </Link>
  )
}
