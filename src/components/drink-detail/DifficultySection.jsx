import Card from '../ui/Card'

export default function DifficultySection({ drink }) {
  const hasDifficulty = drink.difficulty_level || drink.prep_time_minutes || drink.special_equipment

  if (!hasDifficulty) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🎯 Svårighetsgrad
      </h2>

      <dl className="space-y-3">
        {drink.difficulty_level && (
          <div>
            <dt className="text-sm font-semibold text-gray-600">Nivå</dt>
            <dd className="text-gray-900 mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                drink.difficulty_level === 'Enkel' ? 'bg-green-100 text-green-800' :
                drink.difficulty_level === 'Medel' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {drink.difficulty_level}
              </span>
            </dd>
          </div>
        )}

        {drink.prep_time_minutes && (
          <div>
            <dt className="text-sm font-semibold text-gray-600">Tid</dt>
            <dd className="text-gray-900 mt-1">Ca {drink.prep_time_minutes} minuter</dd>
          </div>
        )}

        {drink.special_equipment && drink.special_equipment.trim().length > 0 && (
          <div>
            <dt className="text-sm font-semibold text-gray-600">Speciell utrustning</dt>
            <dd className="text-gray-900 mt-1">{drink.special_equipment}</dd>
          </div>
        )}
      </dl>
    </Card>
  )
}
