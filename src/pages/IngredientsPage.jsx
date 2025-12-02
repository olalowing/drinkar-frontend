import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Package } from 'lucide-react'
import { useIngredients } from '../hooks/useIngredients'
import Button from '../components/ui/Button'
import SearchBar from '../components/ui/SearchBar'
import Loading from '../components/ui/Loading'
import Card from '../components/ui/Card'

export default function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { data: ingredients = [], isLoading, error } = useIngredients()

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || ing.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(ingredients.map(i => i.category))]

  if (isLoading) return <Loading message="Laddar ingredienser..." />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Ett fel uppstod: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Försök igen</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 w-full">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Sök ingredienser..."
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-56"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Alla kategorier' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery
              ? `Inga ingredienser hittades för "${searchQuery}"`
              : 'Inga ingredienser ännu. Lägg till din första ingrediens!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIngredients.map(ingredient => (
            <Link key={ingredient.id} to={`/ingredients/${ingredient.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                {ingredient.image_url && (
                  <img
                    src={ingredient.image_url}
                    alt={ingredient.name}
                    className="w-full h-32 object-cover rounded-t-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {ingredient.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{ingredient.category}</p>
                {ingredient.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {ingredient.description}
                  </p>
                )}
                {ingredient.alcohol_content && (
                  <p className="text-sm text-primary-600 font-medium mt-2">
                    {ingredient.alcohol_content}% alkohol
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
