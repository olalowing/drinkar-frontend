import Card from '../ui/Card'

export default function ProportionsSection({ drink }) {
  if (!drink.proportions_description && (!drink.proportion_examples || drink.proportion_examples.length === 0)) {
    return null
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ⚖️ Proportioner – hur bars gör idag
      </h2>

      {drink.proportions_description && (
        <div className="text-gray-700 whitespace-pre-line mb-4">
          {drink.proportions_description}
        </div>
      )}

      {drink.proportion_examples && drink.proportion_examples.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-gray-600">Exempel:</p>
          <ul className="space-y-2">
            {drink.proportion_examples.map((example, idx) => (
              <li key={idx} className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900">{example.name}</p>
                {example.description && (
                  <p className="text-gray-600 text-sm mt-1">{example.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
