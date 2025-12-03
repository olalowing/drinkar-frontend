import Card from '../ui/Card'

export default function TipsSection({ drink }) {
  if (!drink.tips || drink.tips.length === 0) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ⭐ Professionella tips
      </h2>

      <ul className="space-y-2">
        {drink.tips.map((tip, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700 flex-1">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
