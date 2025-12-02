import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Package, CheckCircle } from 'lucide-react'
import { useIngredients, useUpdateIngredient } from '../hooks/useIngredients'
import Button from '../components/ui/Button'
import SearchBar from '../components/ui/SearchBar'
import Loading from '../components/ui/Loading'
import Card from '../components/ui/Card'

export default function MyBarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: ingredients = [], isLoading, error } = useIngredients()
  const updateMutation = useUpdateIngredient()

  const myIngredients = ingredients.filter(i => i.has_at_home)
  const availableIngredients = ingredients.filter(i => !i.has_at_home)

  const filteredMyIngredients = searchQuery
    ? myIngredients.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : myIngredients

  const filteredAvailable = searchQuery
    ? availableIngredients.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableIngredients

  const toggleIngredient = (id, currentStatus) => {
    updateMutation.mutate({
      id,
      data: { has_at_home: !currentStatus }
    })
  }

  if (isLoading) return <Loading message="Laddar min bar..." />

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Min Bar</h1>
          <p className="text-gray-600 mt-1">
            {myIngredients.length} {myIngredients.length === 1 ? 'ingrediens' : 'ingredienser'} hemma
          </p>
        </div>
        <Link to="/ingredients/new" className="shrink-0">
          <Button size="lg" className="w-full sm:w-auto shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Ny ingrediens
          </Button>
        </Link>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Sök ingredienser..."
      />

      {/* My ingredients */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mina ingredienser</h2>
        {filteredMyIngredients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchQuery
                ? `Inga ingredienser hittades för "${searchQuery}"`
                : 'Inga ingredienser markerade som hemma än. Lägg till några nedan!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMyIngredients.map(ingredient => (
              <Card key={ingredient.id} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/ingredients/${ingredient.id}`} className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                      {ingredient.name}
                    </h3>
                    <p className="text-sm text-gray-600">{ingredient.category}</p>
                  </Link>
                  <button
                    onClick={() => toggleIngredient(ingredient.id, ingredient.has_at_home)}
                    className="text-green-600 hover:text-green-700 ml-2"
                  >
                    <CheckCircle className="w-6 h-6" fill="currentColor" />
                  </button>
                </div>
                {ingredient.alcohol_content && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ingredient.alcohol_content}% alkohol
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available ingredients */}
      {!searchQuery && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tillgängliga ingredienser
          </h2>
          {availableIngredients.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Alla ingredienser är markerade som hemma!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableIngredients.map(ingredient => (
                <Card key={ingredient.id} className="relative opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/ingredients/${ingredient.id}`} className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {ingredient.name}
                      </h3>
                      <p className="text-sm text-gray-600">{ingredient.category}</p>
                    </Link>
                    <button
                      onClick={() => toggleIngredient(ingredient.id, ingredient.has_at_home)}
                      className="text-gray-400 hover:text-green-600 ml-2"
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  </div>
                  {ingredient.alcohol_content && (
                    <p className="text-sm text-gray-600 mt-1">
                      {ingredient.alcohol_content}% alkohol
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
