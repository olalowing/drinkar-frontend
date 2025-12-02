import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wine, CheckCircle } from 'lucide-react'
import { useDrinks } from '../hooks/useDrinks'
import { useIngredients } from '../hooks/useIngredients'
import SearchBar from '../components/ui/SearchBar'
import Loading from '../components/ui/Loading'
import DrinkCard from '../components/drinks/DrinkCard'
import Button from '../components/ui/Button'

export default function CanMakePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: drinks = [], isLoading: drinksLoading } = useDrinks()
  const { data: ingredients = [], isLoading: ingredientsLoading } = useIngredients()

  const myIngredients = useMemo(
    () => new Set(ingredients.filter(i => i.has_at_home).map(i => i.name.toLowerCase())),
    [ingredients]
  )

  const analyzeDrink = (drink) => {
    if (!drink.ingredients || drink.ingredients.length === 0) {
      return { canMake: false, missing: [], matchPercentage: 0 }
    }

    const requiredIngredients = drink.ingredients.map(i => i.ingredient_name.toLowerCase())
    const missing = requiredIngredients.filter(req => !myIngredients.has(req))
    const canMake = missing.length === 0
    const matchPercentage = ((requiredIngredients.length - missing.length) / requiredIngredients.length) * 100

    return { canMake, missing, matchPercentage }
  }

  const categorizedDrinks = useMemo(() => {
    const canMake = []
    const almostCanMake = []

    drinks.forEach(drink => {
      const analysis = analyzeDrink(drink)
      if (analysis.canMake) {
        canMake.push({ ...drink, ...analysis })
      } else if (analysis.missing.length <= 2) {
        almostCanMake.push({ ...drink, ...analysis })
      }
    })

    return { canMake, almostCanMake }
  }, [drinks, myIngredients])

  const filteredCanMake = searchQuery
    ? categorizedDrinks.canMake.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.spritbas?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categorizedDrinks.canMake

  const filteredAlmost = searchQuery
    ? categorizedDrinks.almostCanMake.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.spritbas?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categorizedDrinks.almostCanMake

  if (drinksLoading || ingredientsLoading) {
    return <Loading message="Analyserar vad du kan göra..." />
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Sök drinkar..."
        />
        <p className="text-sm text-gray-500">
          Baserat på dina {myIngredients.size} ingredienser hemma
        </p>
      </div>

      {/* Can make now */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Kan göra nu
          </h2>
          <span className="text-gray-500">({filteredCanMake.length})</span>
        </div>

        {filteredCanMake.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {myIngredients.size === 0
                ? 'Markera några ingredienser i "Min Bar" för att se vad du kan göra!'
                : searchQuery
                ? `Inga drinkar hittades för "${searchQuery}"`
                : 'Du har inga drinkar som du kan göra med dina ingredienser än.'}
            </p>
            {myIngredients.size === 0 && (
              <Link to="/my-bar">
                <Button>Gå till Min Bar</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCanMake.map(drink => (
              <div key={drink.id} className="relative">
                <DrinkCard drink={drink} />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  100%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Almost can make */}
      {filteredAlmost.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wine className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Nästan kan göra
            </h2>
            <span className="text-gray-500">({filteredAlmost.length})</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAlmost.map(drink => (
              <div key={drink.id} className="relative">
                <DrinkCard drink={drink} />
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {Math.round(drink.matchPercentage)}%
                </div>
                <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Saknar {drink.missing.length} {drink.missing.length === 1 ? 'ingrediens' : 'ingredienser'}:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1">
                    {drink.missing.map((ing, idx) => (
                      <li key={idx}>• {ing}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
