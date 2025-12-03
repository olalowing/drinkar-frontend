import Card from '../ui/Card'

export default function ServingDetailsSection({ drink }) {
  const details = [
    { label: 'Glas', value: drink.glass_type },
    { label: 'Temperatur', value: drink.temperature },
    { label: 'Istillstånd', value: drink.ice_type },
    { label: 'Servering', value: drink.serving_type },
  ].filter(item => item.value && item.value.trim().length > 0)

  if (details.length === 0) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🍷 Servering & Glasval
      </h2>

      <dl className="grid grid-cols-2 gap-4">
        {details.map((detail, idx) => (
          <div key={idx}>
            <dt className="text-sm font-semibold text-gray-600">{detail.label}</dt>
            <dd className="text-gray-900 mt-1">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
