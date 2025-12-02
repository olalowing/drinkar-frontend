// Filter drinks that can be made with home ingredients
export function filterDrinksByHomeIngredients(drinks, homeIngredients) {
  const homeIngredientNames = new Set(
    homeIngredients.map(ing => ing.name.toLowerCase())
  )

  return drinks.map(drink => {
    const matchingIngredients = []
    const missingIngredients = []

    drink.ingredients.forEach(ingredient => {
      const ingredientName = ingredient.ingredient_name.toLowerCase()
      
      // Check for exact match or fuzzy match
      if (homeIngredientNames.has(ingredientName) || 
          findFuzzyMatch(ingredientName, homeIngredientNames)) {
        matchingIngredients.push(ingredient.ingredient_name)
      } else {
        missingIngredients.push(ingredient.ingredient_name)
      }
    })

    const totalIngredients = drink.ingredients.length
    const matchPercentage = totalIngredients > 0 
      ? (matchingIngredients.length / totalIngredients) * 100 
      : 0

    return {
      drink,
      matchingIngredients,
      missingIngredients,
      matchPercentage,
      canMake: missingIngredients.length === 0 && totalIngredients > 0,
      hasPartialMatch: matchingIngredients.length > 0,
    }
  })
}

// Fuzzy matching for ingredient names
function findFuzzyMatch(ingredientName, homeIngredientNames) {
  const cleanName = ingredientName.trim()
  
  for (const homeName of homeIngredientNames) {
    const cleanHomeName = homeName.trim()
    
    // If drink ingredient contains home ingredient (e.g., "gin" matches "Hendricks gin")
    if (cleanName.includes(cleanHomeName) && cleanHomeName.length >= 3) {
      return true
    }
    
    // If home ingredient contains drink ingredient (e.g., "Hendricks gin" matches "gin")
    if (cleanHomeName.includes(cleanName) && cleanName.length >= 3) {
      return true
    }
  }
  
  return false
}

// Group drinks by spritbas
export function groupDrinksBySpritbas(drinks) {
  const grouped = {}
  
  drinks.forEach(drink => {
    const spritbas = drink.spritbas || 'Övrigt'
    if (!grouped[spritbas]) {
      grouped[spritbas] = []
    }
    grouped[spritbas].push(drink)
  })
  
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([spritbas, drinks]) => ({
      spritbas,
      drinks: drinks.sort((a, b) => a.name.localeCompare(b.name)),
    }))
}

// Group ingredients by category
export function groupIngredientsByCategory(ingredients) {
  const grouped = {}
  
  ingredients.forEach(ingredient => {
    const category = ingredient.category || 'other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(ingredient)
  })
  
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, ingredients]) => ({
      category,
      ingredients: ingredients.sort((a, b) => a.name.localeCompare(b.name)),
    }))
}

// Format date
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Class name helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Validate YouTube URL
export function isValidYouTubeUrl(url) {
  if (!url) return false
  return url.includes('youtube.com') || url.includes('youtu.be')
}

// Extract Systembolaget article number from URL
export function extractSystembolagetNumber(text) {
  const cleaned = text.trim()
  
  // If it's only numbers, return directly
  if (/^[0-9]{5,8}$/.test(cleaned)) {
    return cleaned
  }
  
  // Try to extract from URL
  const match = cleaned.match(/([0-9]{5,8})/)
  return match ? match[1] : null
}

// Parse CSV to drinks
export function parseCSVToDrinks(csvContent) {
  const drinks = []
  const lines = csvContent.split('\n')
  
  if (lines.length <= 1) return drinks
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const columns = parseCSVLine(line)
    if (columns.length < 8) continue
    
    const name = columns[0].trim()
    if (!name) continue
    
    const description = columns[1] || ''
    const spritbas = columns[2] || 'Övrigt'
    const glass_type = columns[3] || 'Cocktail'
    const serving_type = columns[4] || 'Shaker'
    const garnish = columns[5] || ''
    const youtube_url = columns[6] || ''
    const tagsString = columns[7] || ''
    const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean)
    
    const ingredients = []
    for (let j = 8; j < Math.min(columns.length, 18); j += 2) {
      const amount = columns[j]?.trim() || ''
      const ingredientName = columns[j + 1]?.trim() || ''
      
      if (amount && ingredientName) {
        ingredients.push({ amount, name: ingredientName })
      }
    }
    
    const instructions = []
    for (let j = 18; j < Math.min(columns.length, 23); j++) {
      const instruction = columns[j]?.trim() || ''
      if (instruction) {
        instructions.push(instruction)
      }
    }
    
    drinks.push({
      name,
      description,
      spritbas,
      glass_type,
      serving_type,
      garnish,
      youtube_url,
      tags,
      ingredients,
      instructions,
    })
  }
  
  return drinks
}

function parseCSVLine(line) {
  const columns = []
  let currentColumn = ''
  let insideQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      insideQuotes = !insideQuotes
    } else if (char === ';' && !insideQuotes) {
      columns.push(currentColumn)
      currentColumn = ''
    } else {
      currentColumn += char
    }
  }
  
  columns.push(currentColumn)
  
  return columns.map(col => col.replace(/"/g, '').trim())
}

// Export drinks to CSV
export function exportDrinksToCSV(drinks) {
  let csv = 'Name;Description;Spritbas;GlassType;ServingType;Garnish;YouTubeURL;Tags;'
  
  // Add ingredient columns
  for (let i = 1; i <= 5; i++) {
    csv += `Ingredient${i}_Amount;Ingredient${i}_Name;`
  }
  
  // Add instruction columns
  for (let i = 1; i <= 5; i++) {
    csv += `Instruction${i};`
  }
  
  csv += '\n'
  
  // Add drinks
  drinks.forEach(drink => {
    const row = [
      escapeCSV(drink.name),
      escapeCSV(drink.description),
      escapeCSV(drink.spritbas),
      escapeCSV(drink.glass_type),
      escapeCSV(drink.serving_type),
      escapeCSV(drink.garnish),
      escapeCSV(drink.youtube_url),
      escapeCSV(drink.tags?.join(',') || ''),
    ]
    
    // Add ingredients
    for (let i = 0; i < 5; i++) {
      if (i < drink.ingredients.length) {
        row.push(escapeCSV(drink.ingredients[i].amount))
        row.push(escapeCSV(drink.ingredients[i].ingredient_name))
      } else {
        row.push('')
        row.push('')
      }
    }
    
    // Add instructions
    for (let i = 0; i < 5; i++) {
      if (i < drink.instructions.length) {
        row.push(escapeCSV(drink.instructions[i]))
      } else {
        row.push('')
      }
    }
    
    csv += row.join(';') + '\n'
  })
  
  return csv
}

function escapeCSV(value) {
  if (!value) return ''
  const str = String(value)
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// Download file helper
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
