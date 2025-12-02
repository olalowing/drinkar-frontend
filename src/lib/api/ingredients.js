import { supabase, uploadImage, deleteImage, STORAGE_BUCKETS } from '../supabase'

// ============================================
// INGREDIENTS API
// ============================================

// Get all ingredients
export async function getIngredients() {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('category')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    throw error
  }
}

// Get single ingredient
export async function getIngredient(id) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching ingredient:', error)
    throw error
  }
}

// Get ingredients at home
export async function getHomeIngredients() {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('has_at_home', true)
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching home ingredients:', error)
    throw error
  }
}

// Create ingredient
export async function createIngredient(ingredientData) {
  try {
    const { image, ...ingredientInfo } = ingredientData

    // Upload image if provided
    let imageUrl = null
    if (image) {
      const fileName = `${Date.now()}-${image.name}`
      const { url, error } = await uploadImage(
        STORAGE_BUCKETS.INGREDIENT_IMAGES,
        image,
        fileName
      )

      if (error) throw error
      imageUrl = url
    }

    // Create ingredient
    const { data, error } = await supabase
      .from('ingredients')
      .insert([{ ...ingredientInfo, image_url: imageUrl }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating ingredient:', error)
    throw error
  }
}

// Update ingredient
export async function updateIngredient(id, ingredientData) {
  try {
    const { image, existingImage, ...ingredientInfo } = ingredientData

    // Get current image from database
    const { data: currentIngredient } = await supabase
      .from('ingredients')
      .select('image_url')
      .eq('id', id)
      .single()

    // Handle image deletion (user removed existing image and didn't upload new one)
    if (currentIngredient?.image_url && !existingImage && !image) {
      const oldFileName = currentIngredient.image_url.split('/').pop()
      await deleteImage(STORAGE_BUCKETS.INGREDIENT_IMAGES, oldFileName)
      ingredientInfo.image_url = null
    }

    // Upload new image if provided
    if (image) {
      // Delete old image if exists
      if (currentIngredient?.image_url) {
        const oldFileName = currentIngredient.image_url.split('/').pop()
        await deleteImage(STORAGE_BUCKETS.INGREDIENT_IMAGES, oldFileName)
      }

      // Upload new image
      const fileName = `${Date.now()}-${image.name}`
      const { url, error } = await uploadImage(
        STORAGE_BUCKETS.INGREDIENT_IMAGES,
        image,
        fileName
      )

      if (error) throw error
      ingredientInfo.image_url = url
    } else if (existingImage) {
      // Keep existing image (don't update image_url field)
      delete ingredientInfo.image_url
    }

    const { data, error } = await supabase
      .from('ingredients')
      .update(ingredientInfo)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating ingredient:', error)
    throw error
  }
}

// Delete ingredient
export async function deleteIngredient(id) {
  try {
    // Delete image from storage
    const { data: ingredient } = await supabase
      .from('ingredients')
      .select('image_url')
      .eq('id', id)
      .single()

    if (ingredient?.image_url) {
      const fileName = ingredient.image_url.split('/').pop()
      await deleteImage(STORAGE_BUCKETS.INGREDIENT_IMAGES, fileName)
    }

    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    throw error
  }
}

// Toggle home status
export async function toggleHomeStatus(id, currentStatus) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .update({ has_at_home: !currentStatus })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error toggling home status:', error)
    throw error
  }
}

// Search ingredients
export async function searchIngredients(query) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`)
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching ingredients:', error)
    throw error
  }
}

// Get ingredients by category
export async function getIngredientsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('category', category)
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching ingredients by category:', error)
    throw error
  }
}
