import { Link } from 'react-router-dom'
import { Wine, Clock, GlassWater, Youtube } from 'lucide-react'
import Card from '../ui/Card'

export default function DrinkCard({ drink }) {
  const mainImage = drink.images?.[0]

  return (
    <Link to={`/drinks/${drink.id}`} className="group">
      <Card className="cursor-pointer h-full hover:scale-[1.02] hover:shadow-2xl hover:border-primary-500/50 overflow-hidden">
        {/* Image */}
        {mainImage ? (
          <div className="relative h-48 -mt-6 -mx-6 mb-4 rounded-t-xl overflow-hidden">
            <img
              src={mainImage}
              alt={drink.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {drink.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">
                {drink.images.length} bilder
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-48 -mt-6 -mx-6 mb-4 rounded-t-xl bg-gradient-to-br from-primary-100 via-primary-200 to-accent-100 flex items-center justify-center group-hover:from-primary-200 group-hover:via-primary-300 group-hover:to-accent-200 transition-all duration-300">
            <Wine className="w-16 h-16 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {drink.name}
            </h3>
            {drink.spritbas && (
              <p className="text-sm text-primary-600 font-semibold mt-1.5 flex items-center">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                {drink.spritbas}
              </p>
            )}
          </div>

          {/* Description */}
          {drink.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{drink.description}</p>
          )}

          {/* Tags */}
          {drink.tags && drink.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {drink.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2.5 py-1 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 text-xs font-semibold rounded-full border border-primary-300"
                >
                  {tag}
                </span>
              ))}
              {drink.tags.length > 3 && (
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-300">
                  +{drink.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Info */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5" title="Glastyp">
                <GlassWater className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{drink.glass_type}</span>
              </div>
              <div className="flex items-center space-x-1.5" title="Ingredienser">
                <Clock className="w-4 h-4 text-accent-600" />
                <span className="font-medium">{drink.ingredients?.length || 0}</span>
              </div>
            </div>
            {drink.youtube_url && (
              <div className="bg-red-100 p-1.5 rounded-full">
                <Youtube className="w-3.5 h-3.5 text-red-600" title="Har video" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
