import Card from '../ui/Card'

export default function OccasionSection({ drink }) {
  // Show occasion_tags if available, otherwise fall back to serving_occasion text
  const hasOccasionTags = drink.occasion_tags && drink.occasion_tags.length > 0
  const hasServingOccasion = drink.serving_occasion && drink.serving_occasion.trim().length > 0

  if (!hasOccasionTags && !hasServingOccasion) return null

  // If we have the old text format, split it
  const textOccasions = hasServingOccasion
    ? drink.serving_occasion.split(/[,\n]/).map(o => o.trim()).filter(o => o.length > 0)
    : []

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        📅 Serveringstillfällen
      </h2>

      <div className="flex flex-wrap gap-2">
        {hasOccasionTags ? (
          drink.occasion_tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            >
              <span>{tag.icon}</span>
              <span>{tag.name}</span>
            </span>
          ))
        ) : (
          textOccasions.map((occasion, idx) => (
            <span
              key={idx}
              className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            >
              {occasion}
            </span>
          ))
        )}
      </div>
    </Card>
  )
}
