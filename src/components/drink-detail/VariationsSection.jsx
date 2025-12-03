import Card from '../ui/Card'

export default function VariationsSection({ drink }) {
  if (!drink.variations || drink.variations.length === 0) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🔄 Variationer
      </h2>

      <div className="space-y-4">
        {drink.variations.map((variation, idx) => (
          <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
            <h3 className="font-semibold text-gray-900 mb-1">
              {idx + 1}. {variation.name}
            </h3>
            <p className="text-gray-700 text-sm mb-2">{variation.description}</p>
            <p className="text-sm">
              <span className="font-semibold text-primary-700">Effekt:</span>{' '}
              <span className="text-gray-600">{variation.effect}</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
