import { api, uploadImage } from './client'

async function uploadAll(files) {
  if (!files || !files.length) return []
  const results = await Promise.all(files.map(f => uploadImage(f, 'drinks')))
  return results.map(r => r.url)
}

export async function getDrinks() {
  return api.get('/api/drinks')
}

export async function getDrink(id) {
  return api.get(`/api/drinks/${id}`)
}

export async function createDrink(drinkData) {
  const { images, ...rest } = drinkData
  const uploadedUrls = await uploadAll(images)
  return api.post('/api/drinks', { ...rest, images: uploadedUrls })
}

export async function updateDrink(id, drinkData) {
  const { images, ...rest } = drinkData
  const uploadedUrls = await uploadAll(images)
  return api.patch(`/api/drinks/${id}`, { ...rest, images: uploadedUrls })
}

export async function deleteDrink(id) {
  return api.delete(`/api/drinks/${id}`)
}

export async function searchDrinks(query) {
  const drinks = await getDrinks()
  const q = query.toLowerCase()
  return drinks.filter(d =>
    d.name?.toLowerCase().includes(q) ||
    d.description?.toLowerCase().includes(q) ||
    d.spritbas?.toLowerCase().includes(q)
  )
}

export async function getTags() {
  return api.get('/api/drinks/_/tags')
}

export async function getOccasionTags() {
  return api.get('/api/drinks/_/occasion-tags')
}
