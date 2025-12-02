import { useParams, Link, useNavigate } from 'react-router-dom'
import { Edit2, Trash2, ArrowLeft, CheckCircle, Circle, ExternalLink } from 'lucide-react'
import { useIngredient, useUpdateIngredient } from '../hooks/useIngredients'
import { deleteIngredient } from '../lib/api/ingredients'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'

export default function IngredientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: ingredient, isLoading, error } = useIngredient(id)
  const updateMutation = useUpdateIngredient()

  const handleDelete = async () => {
    if (!confirm('Är du säker på att du vill ta bort denna ingrediens?')) return

    try {
      await deleteIngredient(id)
      navigate('/ingredients')
    } catch (error) {
      alert('Kunde inte ta bort ingrediens: ' + error.message)
    }
  }

  const toggleHasAtHome = () => {
    updateMutation.mutate({
      id,
      data: { has_at_home: !ingredient.has_at_home }
    })
  }

  if (isLoading) return <Loading message="Laddar ingrediens..." />

  if (error || !ingredient) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Kunde inte ladda ingrediens</p>
        <Link to="/ingredients">
          <Button>Tillbaka till ingredienser</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/ingredients" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka till ingredienser
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{ingredient.name}</h1>
          <p className="text-gray-600 mt-2">{ingredient.category}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/ingredients/${id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Redigera
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Ta bort
          </Button>
        </div>
      </div>

      {ingredient.image_url && (
        <img
          src={ingredient.image_url}
          alt={ingredient.name}
          className="w-full max-w-2xl h-64 object-cover rounded-lg"
        />
      )}

      <Card>
        <Button
          onClick={toggleHasAtHome}
          variant={ingredient.has_at_home ? 'primary' : 'secondary'}
          className="w-full sm:w-auto"
        >
          {ingredient.has_at_home ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Finns hemma
            </>
          ) : (
            <>
              <Circle className="w-5 h-5 mr-2" />
              Markera som hemma
            </>
          )}
        </Button>
      </Card>

      {ingredient.description && (
        <Card>
          <h2 className="text-xl font-semibold mb-2">Beskrivning</h2>
          <p className="text-gray-700">{ingredient.description}</p>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Information</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Kategori</dt>
            <dd className="font-medium">{ingredient.category}</dd>
          </div>
          {ingredient.alcohol_content && (
            <div>
              <dt className="text-sm text-gray-600">Alkoholhalt</dt>
              <dd className="font-medium">{ingredient.alcohol_content}%</dd>
            </div>
          )}
          {ingredient.systembolaget_number && (
            <div>
              <dt className="text-sm text-gray-600">Systembolaget-nummer</dt>
              <dd className="font-medium">{ingredient.systembolaget_number}</dd>
            </div>
          )}
          {ingredient.systembolaget_url && (
            <div className="col-span-2">
              <dt className="text-sm text-gray-600 mb-1">Systembolaget-länk</dt>
              <dd>
                <a
                  href={ingredient.systembolaget_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Öppna produktsida
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {ingredient.notes && (
        <Card>
          <h2 className="text-xl font-semibold mb-2">Anteckningar</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{ingredient.notes}</p>
        </Card>
      )}
    </div>
  )
}
