// Drink constants
export const GLASS_TYPES = [
  'Cocktail',
  'Highball',
  'Old Fashioned',
  'Martini',
  'Wine',
  'Shot',
  'Vinglas',
  'Coupe',
  'Nick & Nora',
  'Balloon',
]

export const SERVING_TYPES = ['Shaker', 'Build', 'Stir', 'Blend']

export const SPRITBAS_OPTIONS = [
  'Gin',
  'Vodka',
  'Whisky',
  'Rom',
  'Tequila',
  'Brandy',
  'Cognac',
  'Likör',
  'Öl',
  'Vin',
  'Cava',
  'Champagne',
  'Prosecco',
  'Övrigt',
]

// Alias for backwards compatibility
export const SPRITBASER = SPRITBAS_OPTIONS

// Simple array of ingredient categories for forms
export const INGREDIENT_CATEGORY_LIST = [
  'spirits',
  'gin',
  'vodka',
  'whisky',
  'rum',
  'tequila',
  'brandy',
  'cognac',
  'liqueur',
  'vermouth',
  'wine',
  'beer',
  'syrup',
  'juice',
  'mixer',
  'soda',
  'bitters',
  'garnish',
  'other',
]

// Alias for simpler usage
export const INGREDIENT_CATEGORIES_ARRAY = INGREDIENT_CATEGORY_LIST

// Detailed ingredient categories with metadata
export const INGREDIENT_CATEGORIES = {
  // Spirits
  gin: { label: 'Gin', group: 'spirits', icon: '🌿', color: '#10b981' },
  vodka: { label: 'Vodka', group: 'spirits', icon: '❄️', color: '#3b82f6' },
  whisky: { label: 'Whisky', group: 'spirits', icon: '🔥', color: '#92400e' },
  bourbon: { label: 'Bourbon', group: 'spirits', icon: '🔥', color: '#92400e' },
  scotch: { label: 'Scotch', group: 'spirits', icon: '🔥', color: '#92400e' },
  rye: { label: 'Rye Whisky', group: 'spirits', icon: '🔥', color: '#92400e' },
  rum: { label: 'Rom', group: 'spirits', icon: '☀️', color: '#f59e0b' },
  darkRum: { label: 'Mörk Rom', group: 'spirits', icon: '☀️', color: '#f59e0b' },
  whiteRum: { label: 'Vit Rom', group: 'spirits', icon: '☀️', color: '#f59e0b' },
  spicedRum: { label: 'Kryddad Rom', group: 'spirits', icon: '☀️', color: '#f59e0b' },
  tequila: { label: 'Tequila', group: 'spirits', icon: '🌵', color: '#eab308' },
  mezcal: { label: 'Mezcal', group: 'spirits', icon: '🌵', color: '#eab308' },
  brandy: { label: 'Brandy', group: 'spirits', icon: '👑', color: '#dc2626' },
  cognac: { label: 'Cognac', group: 'spirits', icon: '👑', color: '#dc2626' },
  armagnac: { label: 'Armagnac', group: 'spirits', icon: '👑', color: '#dc2626' },
  calvados: { label: 'Calvados', group: 'spirits', icon: '👑', color: '#dc2626' },
  aquavit: { label: 'Aquavit', group: 'spirits', icon: '🌊', color: '#06b6d4' },
  absinthe: { label: 'Absint', group: 'spirits', icon: '🌙', color: '#10b981' },
  pisco: { label: 'Pisco', group: 'spirits', icon: '🏔️', color: '#a855f7' },
  grappa: { label: 'Grappa', group: 'spirits', icon: '🏔️', color: '#a855f7' },
  sake: { label: 'Sake', group: 'spirits', icon: '🍶', color: '#ec4899' },

  // Liqueurs
  liqueur: { label: 'Likör', group: 'liqueurs', icon: '💜', color: '#a855f7' },
  amaro: { label: 'Amaro', group: 'liqueurs', icon: '🌿', color: '#92400e' },
  aperitif: { label: 'Aperitif', group: 'liqueurs', icon: '🌿', color: '#92400e' },
  digestif: { label: 'Digestif', group: 'liqueurs', icon: '🌿', color: '#92400e' },
  herbalLiqueur: {
    label: 'Örtkryddig Likör',
    group: 'liqueurs',
    icon: '🌿',
    color: '#a855f7',
  },
  fruitLiqueur: { label: 'Fruktlikör', group: 'liqueurs', icon: '🍓', color: '#dc2626' },
  creamLiqueur: { label: 'Gräddelikör', group: 'liqueurs', icon: '🥛', color: '#f59e0b' },
  coffeeLiqueur: { label: 'Kaffelikör', group: 'liqueurs', icon: '☕', color: '#92400e' },

  // Wine & Vermouth
  vermouth: { label: 'Vermouth', group: 'wineAndVermouth', icon: '🍷', color: '#6366f1' },
  dryVermouth: {
    label: 'Torr Vermouth',
    group: 'wineAndVermouth',
    icon: '🍷',
    color: '#6366f1',
  },
  sweetVermouth: {
    label: 'Söt Vermouth',
    group: 'wineAndVermouth',
    icon: '🍷',
    color: '#6366f1',
  },
  wine: { label: 'Vin', group: 'wineAndVermouth', icon: '🍇', color: '#a855f7' },
  champagne: { label: 'Champagne', group: 'wineAndVermouth', icon: '🍾', color: '#eab308' },
  prosecco: { label: 'Prosecco', group: 'wineAndVermouth', icon: '🍾', color: '#eab308' },
  cava: { label: 'Cava', group: 'wineAndVermouth', icon: '🍾', color: '#eab308' },
  sherry: { label: 'Sherry', group: 'wineAndVermouth', icon: '🍷', color: '#dc2626' },
  port: { label: 'Portvin', group: 'wineAndVermouth', icon: '🍷', color: '#dc2626' },

  // Beer
  beer: { label: 'Öl', group: 'beer', icon: '🍺', color: '#f59e0b' },
  ipa: { label: 'IPA', group: 'beer', icon: '🍺', color: '#f59e0b' },
  lager: { label: 'Lager', group: 'beer', icon: '🍺', color: '#f59e0b' },
  stout: { label: 'Stout', group: 'beer', icon: '🍺', color: '#f59e0b' },

  // Mixers & Accessories
  syrup: { label: 'Sockelag/Sirap', group: 'mixers', icon: '💧', color: '#f59e0b' },
  juice: { label: 'Juice', group: 'mixers', icon: '🍋', color: '#10b981' },
  citrusJuice: { label: 'Citrusjuice', group: 'mixers', icon: '🍋', color: '#10b981' },
  mixer: { label: 'Mixer', group: 'mixers', icon: '✨', color: '#3b82f6' },
  soda: { label: 'Läsk/Soda', group: 'mixers', icon: '✨', color: '#3b82f6' },
  tonic: { label: 'Tonic', group: 'mixers', icon: '✨', color: '#06b6d4' },
  bitters: { label: 'Bitters', group: 'mixers', icon: '💊', color: '#92400e' },
  garnish: { label: 'Garnering', group: 'other', icon: '⭐', color: '#eab308' },
  ice: { label: 'Is', group: 'other', icon: '🧊', color: '#3b82f6' },
  salt: { label: 'Salt/Socker', group: 'other', icon: '🧂', color: '#6b7280' },
  other: { label: 'Övrigt', group: 'other', icon: '❓', color: '#6b7280' },
}

export const CATEGORY_GROUPS = {
  spirits: { label: 'Sprit', icon: '🥃', color: '#dc2626' },
  liqueurs: { label: 'Likör', icon: '💜', color: '#a855f7' },
  wineAndVermouth: { label: 'Vin & Vermouth', icon: '🍷', color: '#6366f1' },
  beer: { label: 'Öl', icon: '🍺', color: '#f59e0b' },
  mixers: { label: 'Mixers & Tillbehör', icon: '✨', color: '#3b82f6' },
  other: { label: 'Övrigt', icon: '❓', color: '#6b7280' },
}

// Get category label
export function getCategoryLabel(categoryKey) {
  return INGREDIENT_CATEGORIES[categoryKey]?.label || categoryKey
}

// Get category icon
export function getCategoryIcon(categoryKey) {
  return INGREDIENT_CATEGORIES[categoryKey]?.icon || '❓'
}

// Get category color
export function getCategoryColor(categoryKey) {
  return INGREDIENT_CATEGORIES[categoryKey]?.color || '#6b7280'
}

// Get category group
export function getCategoryGroup(categoryKey) {
  return INGREDIENT_CATEGORIES[categoryKey]?.group || 'other'
}

// Get all categories in a group
export function getCategoriesByGroup(groupKey) {
  return Object.entries(INGREDIENT_CATEGORIES)
    .filter(([, config]) => config.group === groupKey)
    .map(([key, config]) => ({ key, ...config }))
}
