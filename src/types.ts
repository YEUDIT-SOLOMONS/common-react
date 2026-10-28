export type Role = 'Admin' | 'Owner' | 'Renter'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  address: string | null
  city: string | null
}

export interface AddressValues {
  address: string
  city: string
  addressFloor: string
  addressApartment: string
}

export interface AuthResponse {
  token: string
  expiresAtUtc: string
  user: User
}

export interface LoginValues {
  email: string
  password: string
}

export interface RegisterValues {
  name: string
  email: string
  phone: string
  password: string
  termsAccepted: boolean
}

export interface Category {
  id: string
  name: string
  order: number
  parentId: string | null
}

export interface Item {
  id: string
  name: string
  description: string
  dailyPrice: number
  hourlyPrice: number | null
  quantity: number
  minRentalAmount: number
  minRentalUnit: string
  status: string
  categoryId: string | null
  extraCategoryId: string | null
  ownerId: string | null
  city: string | null
  imageDataUrl: string | null
  imageDataUrls: string[]
  forSale: boolean
  createdAtUtc: string | null
}

export interface ItemFormValues {
  name: string
  description: string
  dailyPrice: number
  quantity: number
  minRentalAmount: number
  categoryId: string
}

export type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'name'

export interface ItemFilterValues {
  search: string
  categoryId: string
  city: string
  sort: SortOption
}
