export default function ImageGallerySection({ drink }) {
  if (!drink.images || drink.images.length === 0) return null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {drink.images.map((image, idx) => (
        <img
          key={idx}
          src={image}
          alt={`${drink.name} ${idx + 1}`}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      ))}
    </div>
  )
}
