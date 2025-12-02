import { useState } from 'react'
import { Wine, Grid3x3, List } from 'lucide-react'
import { useDrinks } from '../hooks/useDrinks'
import { groupDrinksBySpritbas } from '../lib/utils'
import Button from '../components/ui/Button'
import SearchBar from '../components/ui/SearchBar'
import Loading from '../components/ui/Loading'
import DrinkCard from '../components/drinks/DrinkCard'
import DrinkListItem from '../components/drinks/DrinkListItem'

export default function DrinksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showGrouped, setShowGrouped] = useState(true)
  const [viewMode, setViewMode] = useState('list') // 'grid' or 'list'
  const [selectedSpirit, setSelectedSpirit] = useState(null) // Quick filter
  const { data: drinks = [], isLoading, error } = useDrinks()

  const filteredDrinks = drinks.filter((drink) => {
    // Search filter
    const matchesSearch = !searchQuery ||
      drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drink.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drink.spritbas?.toLowerCase().includes(searchQuery.toLowerCase())

    // Spirit filter
    const matchesSpirit = !selectedSpirit || drink.spritbas === selectedSpirit

    return matchesSearch && matchesSpirit
  })

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
        <div className="text-sm text-gray-600">
          Hantera drinkar via menyn högst upp.
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="w-64">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Sök drinkar..."
            />
          </div>

          {/* Quick spirit filters */}
          <div className="flex gap-2 items-center">
            {['Whisky', 'Gin', 'Vodka', 'Rom', 'Tequila', 'Cava', 'Prosecco'].map((spirit) => (
              <button
                key={spirit}
                onClick={() => setSelectedSpirit(selectedSpirit === spirit ? null : spirit)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSpirit === spirit
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spirit}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {/* View mode toggle */}
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Kortvy"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Listvy"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Grouping toggle */}
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
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
      ) : viewMode === 'list' ? (
        showGrouped && groupedDrinks ? (
          <div className="space-y-6">
            {groupedDrinks.map((group) => (
              <div key={group.spritbas}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Wine className="w-4 h-4 mr-2 text-primary-600" />
                  {group.spritbas}
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({group.drinks.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {group.drinks.map((drink) => (
                    <DrinkListItem key={drink.id} drink={drink} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDrinks.map((drink) => (
              <DrinkListItem key={drink.id} drink={drink} />
            ))}
          </div>
        )
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
