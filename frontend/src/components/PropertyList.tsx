import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Property, PropertyFilter } from "../types/Property"
import { propertyService } from "../services/apiService"
import PropertyCard from "./PropertyCard"
import PropertyFilterComponent from "./PropertyFilter"
import "./PropertyList.css"

const PropertyList: React.FC = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<PropertyFilter>({})

  const fetchProperties = useCallback(
    async (currentFilter?: PropertyFilter) => {
      try {
        setLoading(true)
        setError(null)
        const data = await propertyService.getProperties(currentFilter || filter)
        setProperties(data)
      } catch (err: any) {
        setError("Failed to load properties. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [filter]
  )

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleFilterChange = useCallback(
    async (newFilter: PropertyFilter) => {
      setFilter(newFilter)
      await fetchProperties(newFilter)
    },
    [fetchProperties]
  )

  const handlePropertyClick = useCallback(
    (property: Property) => {
      navigate(`/property/${property.id}`)
    },
    [navigate]
  )

  // Memoize the properties summary to avoid recalculation
  const propertiesSummary = useMemo(() => {
    return `${properties.length} properties found`
  }, [properties.length])

  // Memoize the retry handler
  const handleRetry = useCallback(() => {
    fetchProperties()
  }, [fetchProperties])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="property-list-container">
      <h1>Million Properties</h1>

      <PropertyFilterComponent onFilterChange={handleFilterChange} />

      <div className="properties-summary">
        <p>{propertiesSummary}</p>
      </div>

      {properties.length === 0 ? (
        <div className="no-properties">
          <p>No properties found matching your criteria.</p>
        </div>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyList
