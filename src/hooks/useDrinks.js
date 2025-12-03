import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as drinksApi from '../lib/api/drinks'

// Query keys
export const drinkKeys = {
  all: ['drinks'],
  lists: () => [...drinkKeys.all, 'list'],
  list: (filters) => [...drinkKeys.lists(), filters],
  details: () => [...drinkKeys.all, 'detail'],
  detail: (id) => [...drinkKeys.details(), id],
  tags: ['tags'],
  occasionTags: ['occasion-tags'],
}

// Get all drinks
export function useDrinks() {
  return useQuery({
    queryKey: drinkKeys.lists(),
    queryFn: drinksApi.getDrinks,
  })
}

// Get single drink
export function useDrink(id) {
  return useQuery({
    queryKey: drinkKeys.detail(id),
    queryFn: () => drinksApi.getDrink(id),
    enabled: !!id,
  })
}

// Create drink
export function useCreateDrink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: drinksApi.createDrink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drinkKeys.lists() })
    },
  })
}

// Update drink
export function useUpdateDrink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => drinksApi.updateDrink(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: drinkKeys.lists() })
      queryClient.invalidateQueries({ queryKey: drinkKeys.detail(id) })
    },
  })
}

// Delete drink
export function useDeleteDrink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: drinksApi.deleteDrink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drinkKeys.lists() })
    },
  })
}

// Search drinks
export function useSearchDrinks(query) {
  return useQuery({
    queryKey: [...drinkKeys.lists(), 'search', query],
    queryFn: () => drinksApi.searchDrinks(query),
    enabled: !!query && query.length >= 2,
  })
}

// Get all tags
export function useTags() {
  return useQuery({
    queryKey: drinkKeys.tags,
    queryFn: drinksApi.getTags,
  })
}

// Get all occasion tags
export function useOccasionTags() {
  return useQuery({
    queryKey: drinkKeys.occasionTags,
    queryFn: drinksApi.getOccasionTags,
  })
}
