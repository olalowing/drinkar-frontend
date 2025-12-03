import Card from '../ui/Card'

export default function StyleProfileSection({ drink }) {
  if (!drink.style_description) return null

  // Split by newlines to create bullet points
  const stylePoints = drink.style_description
    .split('\n')
    .filter(line => line.trim().length > 0)

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🌿 Stil och smakprofil
      </h2>

      <ul className="space-y-2">
        {stylePoints.map((point, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-gray-700 flex-1">{point}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
