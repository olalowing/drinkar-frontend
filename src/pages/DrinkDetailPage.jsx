import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Edit2, Trash2, ArrowLeft, ExternalLink, MoreVertical } from 'lucide-react'
import { useDrink } from '../hooks/useDrinks'
import { deleteDrink } from '../lib/api/drinks'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'
import StarRating from '../components/ui/StarRating'

export default function DrinkDetailPage() {
  const [actionsOpen, setActionsOpen] = useState(false)
  const actionsRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: drink, isLoading, error } = useDrink(id)

  const handleDelete = async () => {
    if (!confirm('Är du säker på att du vill ta bort denna drink?')) return

    try {
      await deleteDrink(id)
      navigate('/drinks')
    } catch (error) {
      alert('Kunde inte ta bort drink: ' + error.message)
    }
  }

  useEffect(() => {
    const handleClick = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false)
      }
    }

    if (actionsOpen) {
      document.addEventListener('click', handleClick)
    }

    return () => document.removeEventListener('click', handleClick)
  }, [actionsOpen])

  if (isLoading) return <Loading message="Laddar drink..." />

  if (error || !drink) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Kunde inte ladda drink</p>
        <Link to="/drinks">
          <Button>Tillbaka till drinkar</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/drinks" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka till drinkar
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{drink.name}</h1>
          <p className="text-gray-600 mt-2">{drink.spritbas}</p>
          {drink.rating ? (
            <div className="flex items-center gap-3 mt-3">
              <StarRating value={drink.rating} readOnly size="lg" />
              <span className="text-sm font-semibold text-gray-700">{drink.rating} / 5</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-3">Inte betygsatt ännu</p>
          )}
        </div>
        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            className="inline-flex items-center p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {actionsOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20">
              <Link
                to={`/drinks/${id}/edit`}
                onClick={() => setActionsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4" />
                Redigera
              </Link>
              <button
                onClick={() => {
                  setActionsOpen(false)
                  handleDelete()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Ta bort
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      {drink.images && drink.images.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {drink.images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={drink.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Description */}
      {drink.description && (
        <Card>
          <h2 className="text-xl font-semibold mb-2">Beskrivning</h2>
          <p className="text-gray-700">{drink.description}</p>
        </Card>
      )}

      {(drink.ingredients?.length > 0 || drink.instructions?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ingredients */}
          {drink.ingredients && drink.ingredients.length > 0 && (
            <Card className="h-full">
              <h2 className="text-xl font-semibold mb-4">Ingredienser</h2>
              <ul className="space-y-2">
                {drink.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{ing.ingredient_name}</span>
                    <span className="font-medium">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Instructions */}
          {drink.instructions && drink.instructions.length > 0 && (
            <Card className="h-full">
              <h2 className="text-xl font-semibold mb-4">Instruktioner</h2>
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
            </Card>
          )}
        </div>
      )}

      {/* Details */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Detaljer</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Glas</dt>
            <dd className="font-medium">{drink.glass_type || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Servering</dt>
            <dd className="font-medium">{drink.serving_type || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Garnering</dt>
            <dd className="font-medium">{drink.garnish || '-'}</dd>
          </div>
          {drink.youtube_url && (
            <div className="col-span-2">
              <dt className="text-sm text-gray-600 mb-2">YouTube</dt>
              <a
                href={drink.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                Se video
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
        </dl>
      </Card>
    </div>
  )
}
