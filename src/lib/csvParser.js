import Papa from 'papaparse'
import { SPRITBAS_OPTIONS, GLASS_TYPES, SERVING_TYPES } from './constants'

// Character encoding fixes for Windows-1252 to UTF-8
const encodingMap = {
  'Ã¶': 'ö', 'Ã¤': 'ä', 'Ã¥': 'å',
  'Ã–': 'Ö', 'Ã„': 'Ä', 'Ã…': 'Å',
  'Ã©': 'é', 'Ã¨': 'è', 'Ã ': 'à',
  'â': "'", 'âÂ©': 'é', 'âÂ': '',
  'Â': '', // Remove standalone  character
}

// Normalize text by fixing encoding issues
export function normalizeText(text) {
  if (!text) return ''
  let normalized = text
  Object.entries(encodingMap).forEach(([bad, good]) => {
    normalized = normalized.replaceAll(bad, good)
  })
  return normalized.trim()
}

// Map CSV glass types to app constants
const glassTypeMap = {
  'Whiskyglas': 'Old Fashioned',
  'Highballglas': 'Highball',
  'Cocktailglas': 'Cocktail',
  'Flöjtglas': 'Flöjt',
  'Vinglas': 'Vinglas',
  'Cocktail': 'Cocktail',
  'Hurricaneglas': 'Hurricane',
  'Kopparmugg eller highballglas': 'Kopparmugg',
}

// Map CSV serving types to app constants
const servingTypeMap = {
  'Skaka': 'Shaker',
  'Bygg': 'Build',
  'Rör om': 'Stir',
  'Muddla & bygg': 'Build',
  'Skaka + toppa': 'Shaker',
  'Bygg och muddla': 'Build',
  'Bygg och rör om': 'Build',
  'Shaker': 'Shaker',
  'Build': 'Build',
  'Stir': 'Stir',
  'Blend': 'Blend',
}

// Normalize spritbas
export function normalizeSpritbas(value) {
  const normalized = normalizeText(value)

  // Direct match
  if (SPRITBAS_OPTIONS.includes(normalized)) {
    return normalized
  }

  // Check if it's close to any option (case insensitive)
  const lowerValue = normalized.toLowerCase()
  const match = SPRITBAS_OPTIONS.find(opt => opt.toLowerCase() === lowerValue)
  if (match) return match

  // Default fallback
  return 'Övrigt'
}

// Normalize glass type
export function normalizeGlassType(value) {
  const normalized = normalizeText(value)

  // Check mapping first
  if (glassTypeMap[normalized]) {
    return glassTypeMap[normalized]
  }

  // Direct match
  if (GLASS_TYPES.includes(normalized)) {
    return normalized
  }

  // Case insensitive match
  const lowerValue = normalized.toLowerCase()
  const match = GLASS_TYPES.find(opt => opt.toLowerCase() === lowerValue)
  if (match) return match

  // Default fallback
  return 'Cocktail'
}

// Normalize serving type
export function normalizeServingType(value) {
  const normalized = normalizeText(value)

  // Check mapping first
  if (servingTypeMap[normalized]) {
    return servingTypeMap[normalized]
  }

  // Direct match
  if (SERVING_TYPES.includes(normalized)) {
    return normalized
  }

  // Default fallback
  return 'Build'
}

// Extract ingredients from CSV row
export function extractIngredients(row) {
  const ingredients = []

  // CSV has Ingredient1_Amount, Ingredient1_Name, ... up to Ingredient5
  for (let i = 1; i <= 5; i++) {
    const amountKey = `Ingredient${i}_Amount`
    const nameKey = `Ingredient${i}_Name`

    const amount = normalizeText(row[amountKey])
    const name = normalizeText(row[nameKey])

    if (amount && name) {
      ingredients.push({ name, amount })
    }
  }

  return ingredients
}

// Extract instructions from CSV row
export function extractInstructions(row) {
  const instructions = []

  // CSV has Instruction1, Instruction2, ... up to Instruction5
  for (let i = 1; i <= 5; i++) {
    const instructionKey = `Instruction${i}`
    const instruction = normalizeText(row[instructionKey])

    if (instruction) {
      instructions.push(instruction)
    }
  }

  return instructions
}

function parseRatingValue(value) {
  if (value === undefined || value === null) return null
  const normalized = normalizeText(value)
  if (!normalized) return null
  const numberValue = Number(normalized.replace(',', '.'))
  if (!Number.isFinite(numberValue)) return null
  const rounded = Math.round(numberValue)
  if (rounded < 1 || rounded > 5) return null
  return rounded
}

// Transform CSV row to drink object
export function transformDrinkData(row) {
  return {
    name: normalizeText(row.Name),
    description: normalizeText(row.Description) || '',
    spritbas: normalizeSpritbas(row.Spritbas),
    glass_type: normalizeGlassType(row.GlassType),
    serving_type: normalizeServingType(row.ServingType),
    garnish: normalizeText(row.Garnish) || '',
    youtube_url: normalizeText(row.YouTubeURL) || '',
    rating: parseRatingValue(row.Rating),
    ingredients: extractIngredients(row),
    instructions: extractInstructions(row),
    tags: row.Tags ? normalizeText(row.Tags).split(';').filter(t => t.trim()) : [],
  }
}

// Validate drink data
export function validateDrinkData(drink) {
  const errors = []
  const warnings = []

  // Required fields
  if (!drink.name || drink.name.trim() === '') {
    errors.push('Namn saknas')
  }

  if (!drink.spritbas) {
    errors.push('Spritbas saknas')
  }

  if (!drink.glass_type) {
    errors.push('Glastyp saknas')
  }

  if (!drink.serving_type) {
    errors.push('Serveringstyp saknas')
  }

  // Warnings for optional fields
  if (!drink.ingredients || drink.ingredients.length === 0) {
    warnings.push('Inga ingredienser')
  }

  if (!drink.instructions || drink.instructions.length === 0) {
    warnings.push('Inga instruktioner')
  }

  if (drink.youtube_url && !isValidYouTubeUrl(drink.youtube_url)) {
    warnings.push('Ogiltig YouTube URL')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// Check if YouTube URL is valid
function isValidYouTubeUrl(url) {
  if (!url) return true // Empty is OK
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return youtubeRegex.test(url)
}

// Parse CSV file
export async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      delimiter: ';',
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          return
        }

        // Transform and validate each row
        const drinks = results.data.map((row, index) => {
          const drink = transformDrinkData(row)
          const validation = validateDrinkData(drink)

          return {
            ...drink,
            _rowIndex: index + 1,
            _validation: validation,
          }
        })

        resolve(drinks)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

// Check for duplicate drinks by name
export async function checkForDuplicates(drinks, existingDrinks) {
  const existingNames = new Set(existingDrinks.map(d => d.name.toLowerCase()))

  return drinks.map(drink => ({
    ...drink,
    _isDuplicate: existingNames.has(drink.name.toLowerCase()),
  }))
}
