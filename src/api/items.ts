import { apiRequest } from './client'
import type { Item, ItemFormValues } from '../types'

const forRent = (items: Item[]) => items.filter((item) => !item.forSale)

export async function getItems(): Promise<Item[]> {
  return forRent(await apiRequest<Item[]>('/items'))
}

export async function getItemsByOwner(ownerId: string): Promise<Item[]> {
  return forRent(await apiRequest<Item[]>(`/items?ownerId=${encodeURIComponent(ownerId)}`))
}

export function getItem(id: string): Promise<Item> {
  return apiRequest<Item>(`/items/${id}`)
}

export function createItem(values: ItemFormValues, ownerId: string): Promise<Item> {
  return apiRequest<Item>('/items', {
    method: 'POST',
    body: JSON.stringify({ ...values, ownerId, minRentalUnit: 'Days' }),
  })
}

// השרת מחליף את כל השדות במה שנשלח, ולכן שולחים גם את מה שלא מופיע בטופס (תמונות, מחיר לשעה וכו')
export function updateItem(item: Item, values: ItemFormValues): Promise<Item> {
  return apiRequest<Item>(`/items/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...item, ...values, addVat: false }),
  })
}

export function deleteItem(id: string): Promise<void> {
  return apiRequest<void>(`/items/${id}`, { method: 'DELETE' })
}
