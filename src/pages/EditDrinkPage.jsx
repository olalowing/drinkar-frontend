import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useDrink, drinkKeys } from '../hooks/useDrinks'
import { updateDrink } from '../lib/api/drinks'
import { SPRITBAS_OPTIONS, GLASS_TYPES, SERVING_TYPES } from '../lib/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'

export default function EditDrinkPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: drink, isLoading } = useDrink(id)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    spritbas: 'Övrigt',
    glass_type: 'Cocktail',
    serving_type: 'Shaker',
    garnish: '',
    youtube_url: '',
  })
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }])
  const [instructions, setInstructions] = useState([''])
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])

  useEffect(() => {
    if (drink) {
      setFormData({
        name: drink.name || '',
        description: drink.description || '',
        spritbas: drink.spritbas || 'Övrigt',
        glass_type: drink.glass_type || 'Cocktail',
        serving_type: drink.serving_type || 'Shaker',
        garnish: drink.garnish || '',
        youtube_url: drink.youtube_url || '',
      })
      setIngredients(
        drink.ingredients?.length > 0
          ? drink.ingredients.map(i => ({ name: i.ingredient_name, amount: i.amount }))
          : [{ name: '', amount: '' }]
      )
      setInstructions(
        drink.instructions?.length > 0
          ? drink.instructions
          : ['']
      )
      setExistingImages(drink.images || [])
    }
  }, [drink])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const filteredInstructions = instructions.filter(i => i && i.trim())

      const drinkData = {
        ...formData,
        ingredients: ingredients.filter(i => i.name && i.amount),
        instructions: filteredInstructions,
        images: images.length > 0 ? images : undefined,
        existingImages: existingImages,
      }

      console.log('Submitting drinkData:', drinkData)
      console.log('Instructions to save:', filteredInstructions)

      await updateDrink(id, drinkData)

      // Invalidate queries to force refetch
      await queryClient.invalidateQueries({ queryKey: drinkKeys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: drinkKeys.lists() })

      navigate(`/drinks/${id}`)
    } catch (error) {
      console.error('Full error:', error)
      alert('Kunde inte uppdatera drink: ' + error.message)
      setLoading(false)
    }
  }

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }])
  const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx))
  const updateIngredient = (idx, field, value) => {
    const updated = [...ingredients]
    updated[idx][field] = value
    setIngredients(updated)
  }

  const addInstruction = () => setInstructions([...instructions, ''])
  const removeInstruction = (idx) => setInstructions(instructions.filter((_, i) => i !== idx))
  const updateInstruction = (idx, value) => {
    const updated = [...instructions]
    updated[idx] = value
    setInstructions(updated)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImages([...images, ...files])
  }

  const removeNewImage = (idx) => setImages(images.filter((_, i) => i !== idx))
  const removeExistingImage = (idx) => setExistingImages(existingImages.filter((_, i) => i !== idx))

  if (isLoading) return <Loading message="Laddar drink..." />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/drinks/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Redigera drink</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Grundinformation</h2>
          <div className="space-y-4">
            <Input
              label="Namn"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivning
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spritbas
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.spritbas}
                  onChange={(e) => setFormData({ ...formData, spritbas: e.target.value })}
                >
                  {SPRITBAS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Glas
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.glass_type}
                  onChange={(e) => setFormData({ ...formData, glass_type: e.target.value })}
                >
                  {GLASS_TYPES.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servering
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={formData.serving_type}
                  onChange={(e) => setFormData({ ...formData, serving_type: e.target.value })}
                >
                  {SERVING_TYPES.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Garnering"
                placeholder="t.ex. Citronskiva, Mynta"
                value={formData.garnish}
                onChange={(e) => setFormData({ ...formData, garnish: e.target.value })}
              />
            </div>
            <Input
              label="YouTube URL"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ingredienser</h2>
            <Button type="button" size="sm" onClick={addIngredient}>
              <Plus className="w-4 h-4 mr-1" />
              Lägg till
            </Button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingrediens"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Mängd"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeIngredient(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Instruktioner</h2>
            <Button type="button" size="sm" onClick={addInstruction}>
              <Plus className="w-4 h-4 mr-1" />
              Lägg till
            </Button>
          </div>
          <div className="space-y-3">
            {instructions.map((inst, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-600">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  placeholder="Instruktion"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={inst}
                  onChange={(e) => updateInstruction(idx, e.target.value)}
                />
                {instructions.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeInstruction(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Images */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Bilder</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Befintliga bilder:</p>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={imgUrl}
                      alt={`Drink ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lägg till nya bilder
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`New ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Ny
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Sparar...' : 'Spara ändringar'}
          </Button>
          <Link to={`/drinks/${id}`} className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Avbryt
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
