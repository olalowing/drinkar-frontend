import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useDrink } from '../hooks/useDrinks'
import { deleteDrink } from '../lib/api/drinks'
import Loading from '../components/ui/Loading'

// Import all section components
import HeroSection from '../components/drink-detail/HeroSection'
import ImageGallerySection from '../components/drink-detail/ImageGallerySection'
import ClassicRecipeSection from '../components/drink-detail/ClassicRecipeSection'
import StyleProfileSection from '../components/drink-detail/StyleProfileSection'
import HistorySection from '../components/drink-detail/HistorySection'
import VariationsSection from '../components/drink-detail/VariationsSection'
import GarnishSection from '../components/drink-detail/GarnishSection'
import ServingDetailsSection from '../components/drink-detail/ServingDetailsSection'
import DifficultySection from '../components/drink-detail/DifficultySection'
import OccasionSection from '../components/drink-detail/OccasionSection'
import PairingSection from '../components/drink-detail/PairingSection'
import TipsSection from '../components/drink-detail/TipsSection'

export default function DrinkDetailPageNew() {
  const [actionsOpen, setActionsOpen] = useState(false)
  const actionsRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: drink, isLoading, error } = useDrink(id)

  const handleDelete = async () => {
    if (!confirm('Är du säker på att du vill ta bort denna drink?')) return

    try {
      await deleteDrink(id)
      navigate('/drinks')
    } catch (error) {
      alert('Kunde inte ta bort drink: ' + error.message)
    }
  }

  const handleEdit = () => {
    navigate(`/drinks/${id}/edit`)
  }

  useEffect(() => {
    const handleClick = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false)
      }
    }

    if (actionsOpen) {
      document.addEventListener('click', handleClick)
    }

    return () => document.removeEventListener('click', handleClick)
  }, [actionsOpen])

  if (isLoading) return <Loading message="Laddar drink..." />

  if (error || !drink) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Kunde inte ladda drink</p>
        <Link to="/drinks" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Tillbaka till drinkar
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <Link to="/drinks" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka till drinkar
      </Link>

      {/* Hero Section with Title, Emoji, Description, and Rating */}
      <HeroSection
        drink={drink}
        actionsOpen={actionsOpen}
        setActionsOpen={setActionsOpen}
        actionsRef={actionsRef}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Image Gallery */}
      <ImageGallerySection drink={drink} />

      {/* Classic Recipe: Ingredients + Method + Taste */}
      <ClassicRecipeSection drink={drink} />

      {/* Style & Taste Profile */}
      <StyleProfileSection drink={drink} />

      {/* History (collapsible) */}
      <HistorySection drink={drink} />

      {/* Variations */}
      <VariationsSection drink={drink} />

      {/* Garnish Options */}
      <GarnishSection drink={drink} />

      {/* Grid layout for smaller sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Serving Details & Glass */}
        <ServingDetailsSection drink={drink} />

        {/* Difficulty */}
        <DifficultySection drink={drink} />

        {/* Serving Occasions */}
        <OccasionSection drink={drink} />

        {/* Food Pairing */}
        <PairingSection drink={drink} />
      </div>

      {/* Professional Tips */}
      <TipsSection drink={drink} />

      {/* YouTube Link (if exists) */}
      {drink.youtube_url && (
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📹 Lär dig mer</h3>
          <a
            href={drink.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-2"
          >
            Se video på YouTube
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
