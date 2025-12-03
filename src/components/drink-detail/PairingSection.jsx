import Card from '../ui/Card'

export default function PairingSection({ drink }) {
  if (!drink.food_pairing || drink.food_pairing.trim().length === 0) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🍽️ Populära kombinationer
      </h2>

      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">Passar bra med:</p>
        <p className="text-gray-700">{drink.food_pairing}</p>
      </div>
    </Card>
  )
}
