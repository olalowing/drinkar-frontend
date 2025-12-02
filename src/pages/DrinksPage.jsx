import { useState, useMemo, useEffect, useRef } from 'react'
import { Wine, Grid3x3, List, Filter } from 'lucide-react'
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
  const [otherFiltersOpen, setOtherFiltersOpen] = useState(false)
  const otherFiltersRef = useRef(null)
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
  const PRIMARY_SPIRITS = ['Whisky', 'Vodka', 'Gin', 'Rom']
  const otherSpiritOptions = useMemo(() => {
    const unique = new Set(
      drinks
        .map(d => d.spritbas)
        .filter(Boolean)
    )
    PRIMARY_SPIRITS.forEach(sp => unique.delete(sp))
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [drinks])

  useEffect(() => {
    const handleClick = (event) => {
      if (otherFiltersRef.current && !otherFiltersRef.current.contains(event.target)) {
        setOtherFiltersOpen(false)
      }
    }
    if (otherFiltersOpen) {
      document.addEventListener('click', handleClick)
    }
    return () => document.removeEventListener('click', handleClick)
  }, [otherFiltersOpen])

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
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Sök drinkar..."
            />
          </div>

          {/* Quick spirit filters */}
          <div className="flex gap-2 items-center flex-wrap">
            {PRIMARY_SPIRITS.map((spirit) => (
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
            {otherSpiritOptions.length > 0 && (
              <div className="relative" ref={otherFiltersRef}>
                <button
                  onClick={() => setOtherFiltersOpen(!otherFiltersOpen)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Fler baser
                </button>
                {otherFiltersOpen && (
                  <div className="absolute z-20 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-2 space-y-1">
                    <button
                      onClick={() => {
                        setSelectedSpirit(null)
                        setOtherFiltersOpen(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Visa alla
                    </button>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {otherSpiritOptions.map((spirit) => (
                        <button
                          key={spirit}
                          onClick={() => {
                            setSelectedSpirit(spirit)
                            setOtherFiltersOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-lg ${
                            selectedSpirit === spirit
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {spirit}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
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
