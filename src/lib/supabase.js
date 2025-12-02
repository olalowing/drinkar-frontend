import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket helpers
export const STORAGE_BUCKETS = {
  DRINK_IMAGES: 'drink-images',
  INGREDIENT_IMAGES: 'ingredient-images',
}

// Helper to upload image
export async function uploadImage(bucket, file, fileName) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { url: null, error }
  }
}

// Helper to delete image
export async function deleteImage(bucket, fileName) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { error }
  }
}

// Helper to get image URL
export function getImageUrl(bucket, fileName) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return data.publicUrl
}
