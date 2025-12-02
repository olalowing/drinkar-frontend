import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { useIngredient } from '../hooks/useIngredients'
import { updateIngredient } from '../lib/api/ingredients'
import { INGREDIENT_CATEGORY_LIST } from '../lib/constants'
import { extractSystembolagetNumber } from '../lib/utils'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'

export default function EditIngredientPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: ingredient, isLoading } = useIngredient(id)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'liqueur',
    description: '',
    alcohol_content: '',
    systembolaget_number: '',
    systembolaget_url: '',
    notes: '',
    has_at_home: false,
  })
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState(null)

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name || '',
        category: ingredient.category || 'liqueur',
        description: ingredient.description || '',
        alcohol_content: ingredient.alcohol_content?.toString() || '',
        systembolaget_number: ingredient.systembolaget_number || '',
        systembolaget_url: ingredient.systembolaget_url || '',
        notes: ingredient.notes || '',
        has_at_home: ingredient.has_at_home || false,
      })
      setExistingImage(ingredient.image_url || null)
    }
  }, [ingredient])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const ingredientData = {
        ...formData,
        alcohol_content: formData.alcohol_content ? parseFloat(formData.alcohol_content) : null,
        image: image,
        existingImage: existingImage,
      }

      await updateIngredient(id, ingredientData)
      navigate(`/ingredients/${id}`)
    } catch (error) {
      alert('Kunde inte uppdatera ingrediens: ' + error.message)
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const removeNewImage = () => setImage(null)
  const removeExistingImage = () => setExistingImage(null)

  const handleSystembolagetUrlChange = (value) => {
    const parsedNumber = extractSystembolagetNumber(value)
    setFormData((prev) => ({
      ...prev,
      systembolaget_url: value,
      systembolaget_number: parsedNumber || prev.systembolaget_number,
    }))
  }

  if (isLoading) return <Loading message="Laddar ingrediens..." />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/ingredients/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Redigera ingrediens</h1>

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
                Kategori
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {INGREDIENT_CATEGORY_LIST.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

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
              <Input
                label="Alkoholhalt (%)"
                type="number"
                step="0.1"
                value={formData.alcohol_content}
                onChange={(e) => setFormData({ ...formData, alcohol_content: e.target.value })}
              />
              <Input
                label="Systembolaget-nummer"
                value={formData.systembolaget_number}
                onChange={(e) => setFormData({ ...formData, systembolaget_number: e.target.value })}
              />
            </div>
            <Input
              label="Systembolaget-länk"
              type="url"
              placeholder="https://www.systembolaget.se/produkt/..."
              value={formData.systembolaget_url}
              onChange={(e) => handleSystembolagetUrlChange(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anteckningar
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_at_home"
                checked={formData.has_at_home}
                onChange={(e) => setFormData({ ...formData, has_at_home: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="has_at_home" className="ml-2 text-sm text-gray-700">
                Finns hemma
              </label>
            </div>
          </div>
        </Card>

        {/* Image */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Bild</h2>

          {/* Existing Image */}
          {existingImage && !image && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Befintlig bild:</p>
              <div className="relative w-48 group">
                <img
                  src={existingImage}
                  alt={formData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeExistingImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* New Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {existingImage ? 'Ersätt bild' : 'Lägg till bild'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {image && (
              <div className="relative w-48 group">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeNewImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Ny
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Sparar...' : 'Spara ändringar'}
          </Button>
          <Link to={`/ingredients/${id}`} className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Avbryt
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
