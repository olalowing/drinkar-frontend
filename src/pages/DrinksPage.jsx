import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Wine } from 'lucide-react'
import { useDrinks } from '../hooks/useDrinks'
import { groupDrinksBySpritbas } from '../lib/utils'
import Button from '../components/ui/Button'
import SearchBar from '../components/ui/SearchBar'
import Loading from '../components/ui/Loading'
import DrinkCard from '../components/drinks/DrinkCard'

export default function DrinksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showGrouped, setShowGrouped] = useState(true)
  const { data: drinks = [], isLoading, error } = useDrinks()

  const filteredDrinks = searchQuery
    ? drinks.filter(
        (drink) =>
          drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drink.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drink.spritbas?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : drinks

  const groupedDrinks = showGrouped ? groupDrinksBySpritbas(filteredDrinks) : null

  if (isLoading) return <Loading message="Laddar drinkar..." />

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mina Drinkar</h1>
          <p className="text-gray-600 mt-1">
            {drinks.length} {drinks.length === 1 ? 'drink' : 'drinkar'}
          </p>
        </div>
        <Link to="/drinks/new" className="shrink-0">
          <Button size="lg" className="w-full sm:w-auto shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Ny drink
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Sök drinkar..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showGrouped ? 'primary' : 'secondary'}
            onClick={() => setShowGrouped(true)}
            size="sm"
          >
            Grupperat
          </Button>
          <Button
            variant={!showGrouped ? 'primary' : 'secondary'}
            onClick={() => setShowGrouped(false)}
            size="sm"
          >
            Alla
          </Button>
        </div>
      </div>

      {/* Drinks list */}
      {filteredDrinks.length === 0 ? (
        <div className="text-center py-12">
          <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery
              ? `Inga drinkar hittades för "${searchQuery}"`
              : 'Inga drinkar ännu. Lägg till din första drink!'}
          </p>
        </div>
      ) : showGrouped && groupedDrinks ? (
        <div className="space-y-8">
          {groupedDrinks.map((group) => (
            <div key={group.spritbas}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Wine className="w-5 h-5 mr-2 text-primary-600" />
                {group.spritbas}
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({group.drinks.length})
                </span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.drinks.map((drink) => (
                  <DrinkCard key={drink.id} drink={drink} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrinks.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>
      )}
    </div>
  )
}
