import Card from '../ui/Card'

export default function GarnishSection({ drink }) {
  const hasGarnishOptions = drink.garnish_options && drink.garnish_options.length > 0
  const hasBasicGarnish = drink.garnish && drink.garnish.trim().length > 0

  if (!hasGarnishOptions && !hasBasicGarnish) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🍒 Garnityr
      </h2>

      {hasGarnishOptions ? (
        <ul className="space-y-3">
          {drink.garnish_options.map((option, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="text-primary-600 font-bold mt-0.5">•</span>
              <div className="flex-1">
                <span className="font-semibold text-gray-900">{option.name}</span>
                <span className="text-gray-600"> – {option.description}</span>
                {option.effect && (
                  <p className="text-sm text-gray-500 mt-1">
                    Effekt: {option.effect}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">{drink.garnish}</p>
      )}
    </Card>
  )
}
