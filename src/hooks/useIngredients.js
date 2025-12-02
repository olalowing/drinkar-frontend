import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as ingredientsApi from '../lib/api/ingredients'

// Query keys
export const ingredientKeys = {
  all: ['ingredients'],
  lists: () => [...ingredientKeys.all, 'list'],
  list: (filters) => [...ingredientKeys.lists(), filters],
  details: () => [...ingredientKeys.all, 'detail'],
  detail: (id) => [...ingredientKeys.details(), id],
  home: ['ingredients', 'home'],
}

// Get all ingredients
export function useIngredients() {
  return useQuery({
    queryKey: ingredientKeys.lists(),
    queryFn: ingredientsApi.getIngredients,
  })
}

// Get single ingredient
export function useIngredient(id) {
  return useQuery({
    queryKey: ingredientKeys.detail(id),
    queryFn: () => ingredientsApi.getIngredient(id),
    enabled: !!id,
  })
}

// Get home ingredients
export function useHomeIngredients() {
  return useQuery({
    queryKey: ingredientKeys.home,
    queryFn: ingredientsApi.getHomeIngredients,
  })
}

// Create ingredient
export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ingredientsApi.createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ingredientKeys.home })
    },
  })
}

// Update ingredient
export function useUpdateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => ingredientsApi.updateIngredient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ingredientKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: ingredientKeys.home })
    },
  })
}

// Delete ingredient
export function useDeleteIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ingredientsApi.deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ingredientKeys.home })
    },
  })
}

// Toggle home status
export function useToggleHomeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, currentStatus }) =>
      ingredientsApi.toggleHomeStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ingredientKeys.home })
    },
  })
}

// Search ingredients
export function useSearchIngredients(query) {
  return useQuery({
    queryKey: [...ingredientKeys.lists(), 'search', query],
    queryFn: () => ingredientsApi.searchIngredients(query),
    enabled: !!query && query.length >= 2,
  })
}

// Get ingredients by category
export function useIngredientsByCategory(category) {
  return useQuery({
    queryKey: [...ingredientKeys.lists(), 'category', category],
    queryFn: () => ingredientsApi.getIngredientsByCategory(category),
    enabled: !!category,
  })
}
