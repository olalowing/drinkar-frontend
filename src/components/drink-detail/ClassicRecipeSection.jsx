import Card from '../ui/Card'

export default function ClassicRecipeSection({ drink }) {
  if (!drink.ingredients || drink.ingredients.length === 0) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📋 Klassiskt originalrecept
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredienser</h3>
          <ul className="space-y-2">
            {drink.ingredients.map((ing, idx) => (
              <li key={idx} className="flex justify-between items-baseline">
                <span className="text-gray-700">{ing.ingredient_name}</span>
                <span className="font-medium text-gray-900 ml-2">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Method */}
        {drink.instructions && drink.instructions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Metod</h3>
            <ol className="space-y-3">
              {drink.instructions.map((inst, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{inst}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Taste Profile */}
      {drink.taste_profile && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-1">Smak:</p>
          <p className="text-gray-800">{drink.taste_profile}</p>
        </div>
      )}
    </Card>
  )
}
