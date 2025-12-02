import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createIngredient } from '../lib/api/ingredients'
import { INGREDIENT_CATEGORY_LIST } from '../lib/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

export default function AddIngredientPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'liqueur',
    description: '',
    alcohol_content: '',
    systembolaget_number: '',
    notes: '',
    has_at_home: false,
  })
  const [image, setImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const ingredientData = {
        ...formData,
        alcohol_content: formData.alcohol_content ? parseFloat(formData.alcohol_content) : null,
        image: image,
      }

      const newIngredient = await createIngredient(ingredientData)
      navigate(`/ingredients/${newIngredient.id}`)
    } catch (error) {
      alert('Kunde inte skapa ingrediens: ' + error.message)
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/ingredients" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Ny ingrediens</h1>

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

        <Card>
          <h2 className="text-xl font-semibold mb-4">Bild</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Skapar...' : 'Skapa ingrediens'}
          </Button>
          <Link to="/ingredients" className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Avbryt
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
