import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useDrink, drinkKeys } from '../hooks/useDrinks'
import { updateDrink, getOccasionTags } from '../lib/api/drinks'
import { SPRITBAS_OPTIONS, GLASS_TYPES, SERVING_TYPES } from '../lib/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'
import StarRating from '../components/ui/StarRating'

const DIFFICULTY_LEVELS = ['Enkel', 'Medel', 'Avancerad']
const TEMPERATURE_OPTIONS = ['Kylt', 'Rumstempererat', 'Varmt', 'Frusen']
const ICE_OPTIONS = ['Isbitar', 'Stor isbit', 'Crushed ice', 'Ingen is']

export default function EditDrinkPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: drink, isLoading } = useDrink(id)
  const [loading, setLoading] = useState(false)

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    template: false,
    history: false,
    serving: false,
    advanced: false,
  })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    spritbas: 'Övrigt',
    glass_type: 'Cocktail',
    serving_type: 'Shaker',
    garnish: '',
    youtube_url: '',
    rating: 0,
    // New template fields
    tagline: '',
    emoji: '',
    taste_profile: '',
    style_description: '',
    proportions_description: '',
    history_intro: '',
    history_theory_1: '',
    history_theory_2: '',
    history_conclusion: '',
    iba_classification: '',
    serving_occasion: '',
    difficulty_level: 'Medel',
    prep_time_minutes: 5,
    special_equipment: '',
    temperature: 'Kylt',
    ice_type: 'Isbitar',
    food_pairing: '',
  })

  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }])
  const [instructions, setInstructions] = useState([''])
  const [variations, setVariations] = useState([])
  const [garnishOptions, setGarnishOptions] = useState([])
  const [tips, setTips] = useState([])
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [selectedOccasionTags, setSelectedOccasionTags] = useState([])
  const [availableOccasionTags, setAvailableOccasionTags] = useState([])

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
        rating: drink.rating || 0,
        tagline: drink.tagline || '',
        emoji: drink.emoji || '',
        taste_profile: drink.taste_profile || '',
        style_description: drink.style_description || '',
        proportions_description: drink.proportions_description || '',
        history_intro: drink.history_intro || '',
        history_theory_1: drink.history_theory_1 || '',
        history_theory_2: drink.history_theory_2 || '',
        history_conclusion: drink.history_conclusion || '',
        iba_classification: drink.iba_classification || '',
        serving_occasion: drink.serving_occasion || '',
        difficulty_level: drink.difficulty_level || 'Medel',
        prep_time_minutes: drink.prep_time_minutes || 5,
        special_equipment: drink.special_equipment || '',
        temperature: drink.temperature || 'Kylt',
        ice_type: drink.ice_type || 'Isbitar',
        food_pairing: drink.food_pairing || '',
      })
      setIngredients(
        drink.ingredients?.length > 0
          ? drink.ingredients.map(i => ({ name: i.ingredient_name, amount: i.amount }))
          : [{ name: '', amount: '' }]
      )
      setInstructions(
        drink.instructions?.length > 0 ? drink.instructions : ['']
      )
      setVariations(drink.variations || [])
      setGarnishOptions(drink.garnish_options || [])
      setTips(drink.tips || [])
      setExistingImages(drink.images || [])
      setSelectedOccasionTags(drink.occasion_tags?.map(t => t.id) || [])
    }
  }, [drink])

  // Fetch available occasion tags
  useEffect(() => {
    const fetchOccasionTags = async () => {
      try {
        const tags = await getOccasionTags()
        setAvailableOccasionTags(tags)
      } catch (error) {
        console.error('Error fetching occasion tags:', error)
      }
    }
    fetchOccasionTags()
  }, [])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const drinkData = {
        ...formData,
        rating: formData.rating || null,
        ingredients: ingredients.filter(i => i.name && i.amount),
        instructions: instructions.filter(i => i && i.trim()),
        variations: variations.filter(v => v.name && v.description),
        garnish_options: garnishOptions.filter(g => g.name && g.description),
        tips: tips.filter(t => t && t.trim()),
        occasion_tags: selectedOccasionTags,
        images: images.length > 0 ? images : undefined,
        existingImages: existingImages,
      }

      await updateDrink(id, drinkData)

      await queryClient.invalidateQueries({ queryKey: drinkKeys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: drinkKeys.lists() })

      navigate(`/drinks/${id}`)
    } catch (error) {
      console.error('Full error:', error)
      alert('Kunde inte uppdatera drink: ' + error.message)
      setLoading(false)
    }
  }

  // Ingredient handlers
  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }])
  const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx))
  const updateIngredient = (idx, field, value) => {
    const updated = [...ingredients]
    updated[idx][field] = value
    setIngredients(updated)
  }

  // Instruction handlers
  const addInstruction = () => setInstructions([...instructions, ''])
  const removeInstruction = (idx) => setInstructions(instructions.filter((_, i) => i !== idx))
  const updateInstruction = (idx, value) => {
    const updated = [...instructions]
    updated[idx] = value
    setInstructions(updated)
  }

  // Variation handlers
  const addVariation = () => setVariations([...variations, { name: '', description: '', effect: '' }])
  const removeVariation = (idx) => setVariations(variations.filter((_, i) => i !== idx))
  const updateVariation = (idx, field, value) => {
    const updated = [...variations]
    updated[idx][field] = value
    setVariations(updated)
  }

  // Garnish option handlers
  const addGarnishOption = () => setGarnishOptions([...garnishOptions, { name: '', description: '', effect: '' }])
  const removeGarnishOption = (idx) => setGarnishOptions(garnishOptions.filter((_, i) => i !== idx))
  const updateGarnishOption = (idx, field, value) => {
    const updated = [...garnishOptions]
    updated[idx][field] = value
    setGarnishOptions(updated)
  }

  // Tips handlers
  const addTip = () => setTips([...tips, ''])
  const removeTip = (idx) => setTips(tips.filter((_, i) => i !== idx))
  const updateTip = (idx, value) => {
    const updated = [...tips]
    updated[idx] = value
    setTips(updated)
  }

  // Image handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImages([...images, ...files])
  }
  const removeNewImage = (idx) => setImages(images.filter((_, i) => i !== idx))
  const removeExistingImage = (idx) => setExistingImages(existingImages.filter((_, i) => i !== idx))

  if (isLoading) return <Loading message="Laddar drink..." />

  const CollapsibleCard = ({ title, section, children }) => (
    <Card>
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between text-left mb-4"
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && children}
    </Card>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link to={`/drinks/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Redigera drink</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information - Always visible */}
        <CollapsibleCard title="📋 Grundinformation" section="basic">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Emoji"
                placeholder="🍸"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              />
              <Input
                label="Namn"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Input
              label="Tagline (kort catchy text)"
              placeholder="t.ex. Den eleganta gin-klassikern"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivning (2-3 meningar)
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
                  Mitt betyg
                </label>
                <div className="flex items-center gap-3">
                  <StarRating
                    value={formData.rating}
                    onChange={(value) => setFormData({ ...formData, rating: value })}
                  />
                  {formData.rating > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: 0 })}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Rensa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        {/* Ingredients */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🥃 Ingredienser</h2>
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

        {/* Instructions */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📝 Instruktioner</h2>
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

        {/* Template Fields */}
        <CollapsibleCard title="📖 Mall-information (Drinkmall.pdf)" section="template">
          <div className="space-y-4">
            <Input
              label="Smakprofil (huvudsakliga smaknoter)"
              placeholder="t.ex. Syrlig, uppfriskande, botanisk, elegant"
              value={formData.taste_profile}
              onChange={(e) => setFormData({ ...formData, taste_profile: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stil och smakprofil (en bullet point per rad)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="4"
                placeholder="Gin ger en botanisk grund med enebär och citrusnoter.&#10;Campari bidrar med intensiv bitterhet och röd fruktighet."
                value={formData.style_description}
                onChange={(e) => setFormData({ ...formData, style_description: e.target.value })}
              />
            </div>
          </div>
        </CollapsibleCard>

        {/* History */}
        <CollapsibleCard title="📚 Historia" section="history">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Introduktion
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="2"
                placeholder="t.ex. Negroni uppstod i Florens år 1919."
                value={formData.history_intro}
                onChange={(e) => setFormData({ ...formData, history_intro: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teori 1
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="3"
                value={formData.history_theory_1}
                onChange={(e) => setFormData({ ...formData, history_theory_1: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teori 2
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="3"
                value={formData.history_theory_2}
                onChange={(e) => setFormData({ ...formData, history_theory_2: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avslutning
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="2"
                value={formData.history_conclusion}
                onChange={(e) => setFormData({ ...formData, history_conclusion: e.target.value })}
              />
            </div>
            <Input
              label="IBA-klassificering"
              placeholder="t.ex. Unforgettables"
              value={formData.iba_classification}
              onChange={(e) => setFormData({ ...formData, iba_classification: e.target.value })}
            />
          </div>
        </CollapsibleCard>

        {/* Variations */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🔄 Variationer</h2>
            <Button type="button" size="sm" onClick={addVariation}>
              <Plus className="w-4 h-4 mr-1" />
              Lägg till
            </Button>
          </div>
          <div className="space-y-3">
            {variations.map((variation, idx) => (
              <div key={idx} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Namn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    value={variation.name}
                    onChange={(e) => updateVariation(idx, 'name', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeVariation(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Beskrivning (vad som ändras)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={variation.description}
                  onChange={(e) => updateVariation(idx, 'description', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Effekt (hur smaken förändras)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={variation.effect}
                  onChange={(e) => updateVariation(idx, 'effect', e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Garnish Options */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🍒 Garneringsalternativ</h2>
            <Button type="button" size="sm" onClick={addGarnishOption}>
              <Plus className="w-4 h-4 mr-1" />
              Lägg till
            </Button>
          </div>
          <div className="space-y-3">
            {garnishOptions.map((option, idx) => (
              <div key={idx} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Namn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    value={option.name}
                    onChange={(e) => updateGarnishOption(idx, 'name', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeGarnishOption(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Beskrivning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={option.description}
                  onChange={(e) => updateGarnishOption(idx, 'description', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Effekt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={option.effect}
                  onChange={(e) => updateGarnishOption(idx, 'effect', e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Serving Details */}
        <CollapsibleCard title="🍷 Servering & Detaljer" section="serving">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Glas
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.glass_type}
                  onChange={(e) => setFormData({ ...formData, glass_type: e.target.value })}
                >
                  {GLASS_TYPES.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servering
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.serving_type}
                  onChange={(e) => setFormData({ ...formData, serving_type: e.target.value })}
                >
                  {SERVING_TYPES.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatur
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                >
                  {TEMPERATURE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Istillstånd
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.ice_type}
                  onChange={(e) => setFormData({ ...formData, ice_type: e.target.value })}
                >
                  {ICE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Garnering (enkel)"
              placeholder="t.ex. Citronskiva, Mynta"
              value={formData.garnish}
              onChange={(e) => setFormData({ ...formData, garnish: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Svårighetsgrad
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                >
                  {DIFFICULTY_LEVELS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Beredningstid (minuter)"
                type="number"
                value={formData.prep_time_minutes}
                onChange={(e) => setFormData({ ...formData, prep_time_minutes: parseInt(e.target.value) || 5 })}
              />
            </div>
            <Input
              label="Speciell utrustning"
              placeholder="t.ex. Muddler, Strainer"
              value={formData.special_equipment}
              onChange={(e) => setFormData({ ...formData, special_equipment: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serveringstillfällen (taggar)
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {availableOccasionTags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOccasionTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOccasionTags([...selectedOccasionTags, tag.id])
                        } else {
                          setSelectedOccasionTags(selectedOccasionTags.filter(id => id !== tag.id))
                        }
                      }}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-lg">{tag.icon}</span>
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
              {selectedOccasionTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableOccasionTags
                    .filter(tag => selectedOccasionTags.includes(tag.id))
                    .map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        <span>{tag.icon}</span>
                        <span>{tag.name}</span>
                      </span>
                    ))
                  }
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matpairing
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="2"
                placeholder="t.ex. Passar utmärkt med skaldjur, ostron..."
                value={formData.food_pairing}
                onChange={(e) => setFormData({ ...formData, food_pairing: e.target.value })}
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
        </CollapsibleCard>

        {/* Tips */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">⭐ Professionella tips</h2>
            <Button type="button" size="sm" onClick={addTip}>
              <Plus className="w-4 h-4 mr-1" />
              Lägg till
            </Button>
          </div>
          <div className="space-y-3">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tips"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={tip}
                  onChange={(e) => updateTip(idx, e.target.value)}
                />
                {tips.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeTip(idx)}
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
          <h2 className="text-xl font-semibold mb-4">📸 Bilder</h2>

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

        <div className="flex gap-4 sticky bottom-0 bg-white py-4 border-t">
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
