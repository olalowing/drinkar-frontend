import { Edit2, Trash2, MoreVertical } from 'lucide-react'
import StarRating from '../ui/StarRating'

export default function HeroSection({ drink, actionsOpen, setActionsOpen, actionsRef, onEdit, onDelete }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {drink.emoji && <span className="text-5xl">{drink.emoji}</span>}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{drink.name}</h1>
            {drink.tagline && (
              <p className="text-lg text-gray-600 italic mt-1">{drink.tagline}</p>
            )}
          </div>
        </div>

        {drink.description && (
          <p className="text-gray-700 mt-4 max-w-3xl leading-relaxed">
            {drink.description}
          </p>
        )}

        {drink.rating ? (
          <div className="flex items-center gap-3 mt-4">
            <StarRating value={drink.rating} readOnly size="lg" />
            <span className="text-sm font-semibold text-gray-700">{drink.rating} / 5</span>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">Inte betygsatt ännu</p>
        )}
      </div>

      <div className="relative ml-4" ref={actionsRef}>
        <button
          onClick={() => setActionsOpen(!actionsOpen)}
          className="inline-flex items-center p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500"
          aria-label="Åtgärder"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        {actionsOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20">
            <button
              onClick={() => {
                setActionsOpen(false)
                onEdit()
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-xl"
            >
              <Edit2 className="w-4 h-4" />
              Redigera
            </button>
            <button
              onClick={() => {
                setActionsOpen(false)
                onDelete()
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl"
            >
              <Trash2 className="w-4 h-4" />
              Ta bort
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
