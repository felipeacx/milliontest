import axios, { AxiosResponse } from "axios"
import { Property, PropertyFilter, CreateProperty, UpdateProperty } from "../types/Property"
import { withAPIPerformanceMonitoring } from "../utils/performance"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    const keysToDelete: string[] = []
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => this.cache.delete(key))
  }
}

const cache = new APICache()

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => resolve(func(...args)), wait)
    })
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 429) {
      // Rate limit exceeded
    }
    return Promise.reject(error)
  }
)

const getPropertiesInternal = async (filter?: PropertyFilter): Promise<Property[]> => {
  const params = new URLSearchParams()

  // The backend expects a single 'search' parameter for both name and address
  if (filter?.name || filter?.address) {
    const searchTerm = filter?.name || filter?.address || ""
    if (searchTerm) {
      params.append("search", searchTerm)
    }
  }
  if (filter?.propertyType) params.append("propertyType", filter.propertyType)
  if (filter?.minPrice !== undefined) params.append("minPrice", filter.minPrice.toString())
  if (filter?.maxPrice !== undefined) params.append("maxPrice", filter.maxPrice.toString())

  const response = await api.get<Property[]>(`/properties?${params.toString()}`)
  return response.data
}

// Debounced version for search filtering
const debouncedGetProperties = debounce(getPropertiesInternal, 300)

export const propertyService = {
  // Get all properties with optional filtering and caching
  getProperties: withAPIPerformanceMonitoring(
    async (filter?: PropertyFilter): Promise<Property[]> => {
      const cacheKey = `properties_${JSON.stringify(filter || {})}`

      // Check cache first
      const cachedData = cache.get<Property[]>(cacheKey)
      if (cachedData) {
        return cachedData
      }

      try {
        // Use debounced version if filter has search terms
        const hasSearchTerms = filter?.name || filter?.address
        const data = hasSearchTerms
          ? await debouncedGetProperties(filter)
          : await getPropertiesInternal(filter)

        // Cache the result
        cache.set(cacheKey, data)
        return data
      } catch (error) {
        throw error
      }
    },
    "getProperties"
  ),

  // Get a single property by ID with caching
  getProperty: withAPIPerformanceMonitoring(async (id: string): Promise<Property> => {
    const cacheKey = `property_${id}`

    // Check cache first
    const cachedData = cache.get<Property>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      const response = await api.get<Property>(`/properties/${id}`)

      // Cache the result for shorter time (individual properties change more often)
      cache.set(cacheKey, response.data, 2 * 60 * 1000) // 2 minutes
      return response.data
    } catch (error) {
      throw error
    }
  }, "getProperty"),

  // Create a new property
  createProperty: withAPIPerformanceMonitoring(
    async (property: CreateProperty): Promise<Property> => {
      try {
        const response = await api.post<Property>("/properties", property)

        // Invalidate properties list cache
        cache.invalidate("properties_")

        return response.data
      } catch (error) {
        throw error
      }
    },
    "createProperty"
  ),

  // Update an existing property
  updateProperty: withAPIPerformanceMonitoring(
    async (id: string, property: UpdateProperty): Promise<void> => {
      try {
        await api.put(`/properties/${id}`, property)

        // Invalidate related cache entries
        cache.invalidate("properties_")
        cache.invalidate(`property_${id}`)
      } catch (error) {
        throw error
      }
    },
    "updateProperty"
  ),

  // Delete a property
  deleteProperty: withAPIPerformanceMonitoring(async (id: string): Promise<void> => {
    try {
      await api.delete(`/properties/${id}`)

      // Invalidate related cache entries
      cache.invalidate("properties_")
      cache.invalidate(`property_${id}`)
    } catch (error) {
      throw error
    }
  }, "deleteProperty"),

  // Utility methods for cache management
  clearCache: (): void => {
    cache.invalidate()
  },

  invalidatePropertiesCache: (): void => {
    cache.invalidate("properties_")
  },
}

export default api
