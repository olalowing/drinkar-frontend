import { supabase, uploadImage, deleteImage, STORAGE_BUCKETS } from '../supabase'

// ============================================
// DRINKS API
// ============================================

// Get all drinks with their related data
export async function getDrinks() {
  try {
    const { data: drinks, error } = await supabase
      .from('drinks')
      .select(`
        *,
        drink_images (
          id,
          image_url,
          sort_order
        ),
        drink_ingredients (
          id,
          ingredient_name,
          amount,
          sort_order
        ),
        drink_instructions (
          id,
          instruction,
          sort_order
        ),
        drink_tags (
          tags (
            id,
            name
          )
        ),
        drink_occasions (
          occasion_tags (
            id,
            name,
            icon
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform the data to match app structure
    return drinks.map(drink => ({
      ...drink,
      images: drink.drink_images
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url) || [],
      ingredients: drink.drink_ingredients
        ?.sort((a, b) => a.sort_order - b.sort_order) || [],
      instructions: drink.drink_instructions
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(inst => inst.instruction) || [],
      tags: drink.drink_tags?.map(dt => dt.tags.name) || [],
      occasion_tags: drink.drink_occasions?.map(oc => oc.occasion_tags) || [],
    }))
  } catch (error) {
    console.error('Error fetching drinks:', error)
    throw error
  }
}

// Get single drink by ID
export async function getDrink(id) {
  try {
    const { data, error } = await supabase
      .from('drinks')
      .select(`
        *,
        drink_images (
          id,
          image_url,
          sort_order
        ),
        drink_ingredients (
          id,
          ingredient_name,
          amount,
          sort_order
        ),
        drink_instructions (
          id,
          instruction,
          sort_order
        ),
        drink_tags (
          tags (
            id,
            name
          )
        ),
        drink_variations (
          id,
          name,
          description,
          effect,
          sort_order
        ),
        garnish_options (
          id,
          name,
          description,
          effect,
          sort_order
        ),
        proportion_examples (
          id,
          name,
          description,
          sort_order
        ),
        drink_tips (
          id,
          tip,
          sort_order
        ),
        drink_occasions (
          occasion_tags (
            id,
            name,
            icon
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      ...data,
      images: data.drink_images
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url) || [],
      ingredients: data.drink_ingredients
        ?.sort((a, b) => a.sort_order - b.sort_order) || [],
      instructions: data.drink_instructions
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(inst => inst.instruction) || [],
      tags: data.drink_tags?.map(dt => dt.tags.name) || [],
      variations: data.drink_variations
        ?.sort((a, b) => a.sort_order - b.sort_order) || [],
      garnish_options: data.garnish_options
        ?.sort((a, b) => a.sort_order - b.sort_order) || [],
      proportion_examples: data.proportion_examples
        ?.sort((a, b) => a.sort_order - b.sort_order) || [],
      tips: data.drink_tips
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(tip => tip.tip) || [],
      occasion_tags: data.drink_occasions?.map(oc => oc.occasion_tags) || [],
    }
  } catch (error) {
    console.error('Error fetching drink:', error)
    throw error
  }
}

// Create new drink
export async function createDrink(drinkData) {
  try {
    const { images, ingredients, instructions, tags, ...drinkInfo } = drinkData

    // 1. Create drink
    const sanitizedDrinkInfo = {
      ...drinkInfo,
      rating: normalizeRating(drinkInfo.rating),
    }

    const { data: drink, error: drinkError } = await supabase
      .from('drinks')
      .insert([sanitizedDrinkInfo])
      .select()
      .single()

    if (drinkError) throw drinkError

    // 2. Upload images
    if (images && images.length > 0) {
      const imagePromises = images.map(async (imageFile, index) => {
        const fileName = `${drink.id}/${Date.now()}-${index}.jpg`
        const { url, error } = await uploadImage(
          STORAGE_BUCKETS.DRINK_IMAGES,
          imageFile,
          fileName
        )

        if (error) throw error

        return {
          drink_id: drink.id,
          image_url: url,
          sort_order: index,
        }
      })

      const imageData = await Promise.all(imagePromises)
      
      const { error: imagesError } = await supabase
        .from('drink_images')
        .insert(imageData)

      if (imagesError) throw imagesError
    }

    // 3. Add ingredients
    if (ingredients && ingredients.length > 0) {
      const ingredientsData = ingredients.map((ing, index) => ({
        drink_id: drink.id,
        ingredient_name: ing.name,
        amount: ing.amount,
        sort_order: index,
      }))

      const { error: ingredientsError } = await supabase
        .from('drink_ingredients')
        .insert(ingredientsData)

      if (ingredientsError) throw ingredientsError
    }

    // 4. Add instructions
    if (instructions && instructions.length > 0) {
      const instructionsData = instructions.map((inst, index) => ({
        drink_id: drink.id,
        instruction: inst,
        sort_order: index,
      }))

      const { error: instructionsError } = await supabase
        .from('drink_instructions')
        .insert(instructionsData)

      if (instructionsError) throw instructionsError
    }

    // 5. Add tags
    if (tags && tags.length > 0) {
      await addTagsToDrink(drink.id, tags)
    }

    return drink
  } catch (error) {
    console.error('Error creating drink:', error)
    throw error
  }
}

// Update drink
export async function updateDrink(id, drinkData) {
  try {
    const {
      images,
      existingImages,
      ingredients,
      instructions,
      tags,
      variations,
      garnish_options,
      proportion_examples,
      tips,
      occasion_tags,
      ...drinkInfo
    } = drinkData

    // 1. Update drink info
    const sanitizedDrinkInfo = {
      ...drinkInfo,
      rating: normalizeRating(drinkInfo.rating),
    }

    const { error: drinkError } = await supabase
      .from('drinks')
      .update(sanitizedDrinkInfo)
      .eq('id', id)

    if (drinkError) throw drinkError

    // 2. Handle images
    // Get all current images from database
    const { data: currentImages } = await supabase
      .from('drink_images')
      .select('id, image_url')
      .eq('drink_id', id)

    // Delete images that are not in existingImages array
    if (currentImages && currentImages.length > 0) {
      const imagesToDelete = currentImages.filter(
        img => !existingImages?.includes(img.image_url)
      )

      for (const img of imagesToDelete) {
        // Delete from storage
        const fileName = img.image_url.split('/').pop()
        await deleteImage(STORAGE_BUCKETS.DRINK_IMAGES, `${id}/${fileName}`)

        // Delete from database
        await supabase
          .from('drink_images')
          .delete()
          .eq('id', img.id)
      }
    }

    // Upload new images
    if (images && images.length > 0) {
      const currentCount = existingImages?.length || 0
      const imagePromises = images.map(async (imageFile, index) => {
        const fileName = `${id}/${Date.now()}-${index}.jpg`
        const { url, error } = await uploadImage(
          STORAGE_BUCKETS.DRINK_IMAGES,
          imageFile,
          fileName
        )

        if (error) throw error

        return {
          drink_id: id,
          image_url: url,
          sort_order: currentCount + index,
        }
      })

      const imageData = await Promise.all(imagePromises)

      const { error: imagesError } = await supabase
        .from('drink_images')
        .insert(imageData)

      if (imagesError) throw imagesError
    }

    // 3. Delete existing related data
    await supabase.from('drink_ingredients').delete().eq('drink_id', id)
    await supabase.from('drink_instructions').delete().eq('drink_id', id)
    await supabase.from('drink_tags').delete().eq('drink_id', id)
    await supabase.from('drink_variations').delete().eq('drink_id', id)
    await supabase.from('garnish_options').delete().eq('drink_id', id)
    await supabase.from('proportion_examples').delete().eq('drink_id', id)
    await supabase.from('drink_tips').delete().eq('drink_id', id)
    await supabase.from('drink_occasions').delete().eq('drink_id', id)

    // 4. Add new ingredients
    if (ingredients && ingredients.length > 0) {
      const ingredientsData = ingredients.map((ing, index) => ({
        drink_id: id,
        ingredient_name: ing.name,
        amount: ing.amount,
        sort_order: index,
      }))

      await supabase.from('drink_ingredients').insert(ingredientsData)
    }

    // 5. Add new instructions
    if (instructions && instructions.length > 0) {
      const instructionsData = instructions.map((inst, index) => ({
        drink_id: id,
        instruction: inst,
        sort_order: index,
      }))

      const { error: instructionsError } = await supabase.from('drink_instructions').insert(instructionsData)
      if (instructionsError) throw instructionsError
    }

    // 6. Add new variations
    if (variations && variations.length > 0) {
      const variationsData = variations.map((variation, index) => ({
        drink_id: id,
        name: variation.name,
        description: variation.description,
        effect: variation.effect,
        sort_order: index,
      }))

      await supabase.from('drink_variations').insert(variationsData)
    }

    // 7. Add new garnish options
    if (garnish_options && garnish_options.length > 0) {
      const garnishData = garnish_options.map((option, index) => ({
        drink_id: id,
        name: option.name,
        description: option.description,
        effect: option.effect,
        sort_order: index,
      }))

      await supabase.from('garnish_options').insert(garnishData)
    }

    // 8. Add new proportion examples
    if (proportion_examples && proportion_examples.length > 0) {
      const proportionData = proportion_examples.map((example, index) => ({
        drink_id: id,
        name: example.name,
        description: example.description || '',
        sort_order: index,
      }))

      await supabase.from('proportion_examples').insert(proportionData)
    }

    // 9. Add new tips
    if (tips && tips.length > 0) {
      const tipsData = tips.map((tip, index) => ({
        drink_id: id,
        tip: tip,
        sort_order: index,
      }))

      await supabase.from('drink_tips').insert(tipsData)
    }

    // 10. Add new tags
    if (tags && tags.length > 0) {
      await addTagsToDrink(id, tags)
    }

    // 11. Add occasion tags
    if (occasion_tags && occasion_tags.length > 0) {
      await addOccasionTagsToDrink(id, occasion_tags)
    }

    return { id }
  } catch (error) {
    console.error('Error updating drink:', error)
    throw error
  }
}

// Delete drink
export async function deleteDrink(id) {
  try {
    // Delete images from storage
    const { data: images } = await supabase
      .from('drink_images')
      .select('image_url')
      .eq('drink_id', id)

    if (images) {
      for (const img of images) {
        const fileName = img.image_url.split('/').pop()
        await deleteImage(STORAGE_BUCKETS.DRINK_IMAGES, `${id}/${fileName}`)
      }
    }

    // Delete drink (cascade will handle related records)
    const { error } = await supabase
      .from('drinks')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting drink:', error)
    throw error
  }
}

// Search drinks
export async function searchDrinks(query) {
  try {
    const { data, error } = await supabase
      .from('drinks')
      .select(`
        *,
        drink_images (image_url, sort_order),
        drink_ingredients (ingredient_name, amount, sort_order),
        drink_instructions (instruction, sort_order),
        drink_tags (tags (name))
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,spritbas.ilike.%${query}%`)

    if (error) throw error

    return data.map(drink => ({
      ...drink,
      images: drink.drink_images
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url) || [],
      ingredients: drink.drink_ingredients
        ?.sort((a, b) => a.sort_order - b.sort_order) || [],
      instructions: drink.drink_instructions
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map(inst => inst.instruction) || [],
      tags: drink.drink_tags?.map(dt => dt.tags.name) || [],
    }))
  } catch (error) {
    console.error('Error searching drinks:', error)
    throw error
  }
}

// Helper function to add tags to drink
async function addTagsToDrink(drinkId, tagNames) {
  try {
    // Get or create tags
    const tagIds = []
    
    for (const tagName of tagNames) {
      // Check if tag exists
      let { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single()

      if (existingTag) {
        tagIds.push(existingTag.id)
      } else {
        // Create new tag
        const { data: newTag, error } = await supabase
          .from('tags')
          .insert([{ name: tagName }])
          .select()
          .single()

        if (error) throw error
        tagIds.push(newTag.id)
      }
    }

    // Link tags to drink
    const drinkTagsData = tagIds.map(tagId => ({
      drink_id: drinkId,
      tag_id: tagId,
    }))

    const { error } = await supabase
      .from('drink_tags')
      .insert(drinkTagsData)

    if (error) throw error
  } catch (error) {
    console.error('Error adding tags:', error)
    throw error
  }
}

// Get all tags
export async function getTags() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}

// Get all occasion tags
export async function getOccasionTags() {
  try {
    const { data, error } = await supabase
      .from('occasion_tags')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching occasion tags:', error)
    throw error
  }
}

// Helper function to add occasion tags to drink
async function addOccasionTagsToDrink(drinkId, occasionTagIds) {
  try {
    // Link occasion tags to drink
    const drinkOccasionsData = occasionTagIds.map(tagId => ({
      drink_id: drinkId,
      occasion_tag_id: tagId,
    }))

    const { error } = await supabase
      .from('drink_occasions')
      .insert(drinkOccasionsData)

    if (error) throw error
  } catch (error) {
    console.error('Error adding occasion tags:', error)
    throw error
  }
}

function normalizeRating(value) {
  if (value === undefined || value === null) return null
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return null
  if (numberValue < 1 || numberValue > 5) return null
  return Math.round(numberValue)
}
