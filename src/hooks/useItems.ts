import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createItem, deleteItem, getItem, getItems, getItemsByOwner, updateItem } from '../api/items'
import type { Item, ItemFormValues } from '../types'

export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: getItems })
}

export function useMyItems(ownerId: string) {
  return useQuery({ queryKey: ['items', 'owner', ownerId], queryFn: () => getItemsByOwner(ownerId) })
}

export function useItem(id: string) {
  return useQuery({ queryKey: ['items', id], queryFn: () => getItem(id) })
}

export function useCreateItem(ownerId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ItemFormValues) => createItem(values, ownerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}

export function useUpdateItem(item: Item) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ItemFormValues) => updateItem(item, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}
