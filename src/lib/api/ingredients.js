import { api, uploadImage } from './client'

export async function getIngredients() {
  return api.get('/api/ingredients')
}

export async function getIngredient(id) {
  return api.get(`/api/ingredients/${id}`)
}

export async function getHomeIngredients() {
  return api.get('/api/ingredients?home=1')
}

export async function createIngredient(ingredientData) {
  const { image, ...rest } = ingredientData
  let image_url = null
  if (image) {
    const r = await uploadImage(image, 'ingredients')
    image_url = r.url
  }
  return api.post('/api/ingredients', { ...rest, image_url })
}

export async function updateIngredient(id, ingredientData) {
  const { image, existingImage, ...rest } = ingredientData
  const payload = { ...rest }
  if (image) {
    const r = await uploadImage(image, 'ingredients')
    payload.image_url = r.url
  } else if (!existingImage) {
    payload.image_url = null
  }
  return api.patch(`/api/ingredients/${id}`, payload)
}

export async function deleteIngredient(id) {
  return api.delete(`/api/ingredients/${id}`)
}

export async function toggleHomeStatus(id, currentStatus) {
  return api.patch(`/api/ingredients/${id}/home-status`, { has_at_home: !currentStatus })
}

export async function searchIngredients(query) {
  const items = await getIngredients()
  const q = query.toLowerCase()
  return items.filter(i =>
    i.name?.toLowerCase().includes(q) ||
    i.description?.toLowerCase().includes(q) ||
    i.notes?.toLowerCase().includes(q)
  )
}

export async function getIngredientsByCategory(category) {
  const items = await getIngredients()
  return items.filter(i => i.category === category)
}
