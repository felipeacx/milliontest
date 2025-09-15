export interface Owner {
  id: string
  name: string
  email: string
  phone: string
  photoUrl: string
  createdDate: string
  updatedDate: string
}

export interface Property {
  id: string
  name: string
  address: string
  price: number
  description: string
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  yearBuilt: number
  isActive: boolean
  createdDate: string
  updatedDate: string
  ownerId: string
  image?: string
  owner?: Owner
  features?: string[]
}

export interface PropertyFilter {
  name?: string
  address?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
}

export interface CreateProperty {
  name: string
  address: string
  price: number
  description: string
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  yearBuilt: number
  ownerId: string
}

export interface UpdateProperty {
  name?: string
  address?: string
  price?: number
  codeInternal?: string
  year?: number
}
