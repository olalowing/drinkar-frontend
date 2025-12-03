import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../ui/Card'

export default function HistorySection({ drink }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasHistory = drink.history_intro || drink.history_theory_1 || drink.history_theory_2 || drink.history_conclusion

  if (!hasHistory) return null

  return (
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          📖 Historia
        </h2>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-500" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-gray-700">
          {drink.history_intro && (
            <p className="leading-relaxed">{drink.history_intro}</p>
          )}

          {drink.history_theory_1 && (
            <div>
              <p className="font-semibold text-gray-900 mb-1">Teori 1</p>
              <p className="leading-relaxed">{drink.history_theory_1}</p>
            </div>
          )}

          {drink.history_theory_2 && (
            <div>
              <p className="font-semibold text-gray-900 mb-1">Teori 2</p>
              <p className="leading-relaxed">{drink.history_theory_2}</p>
            </div>
          )}

          {drink.history_conclusion && (
            <p className="leading-relaxed border-t border-gray-200 pt-4">
              {drink.history_conclusion}
            </p>
          )}

          {drink.iba_classification && (
            <div className="bg-primary-50 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-gray-900">IBA-klassificering:</span>{' '}
                <span className="text-gray-700">{drink.iba_classification}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
