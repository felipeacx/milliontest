import React, { useState, useCallback, useEffect, memo } from "react"
import { PropertyFilter } from "../types/Property"
import "./PropertyFilter.css"

interface PropertyFilterProps {
  onFilterChange: (filter: PropertyFilter) => void
}

const PropertyFilterComponent: React.FC<PropertyFilterProps> = memo(({ onFilterChange }) => {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  // Unified function to create filter object with current state
  const createFilter = useCallback(
    (
      overrides: Partial<{ name: string; address: string; minPrice: string; maxPrice: string }> = {}
    ) => {
      const filter: PropertyFilter = {}
      const currentName = overrides.name !== undefined ? overrides.name : name
      const currentAddress = overrides.address !== undefined ? overrides.address : address
      const currentMinPrice = overrides.minPrice !== undefined ? overrides.minPrice : minPrice
      const currentMaxPrice = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice

      if (currentName.trim()) filter.name = currentName.trim()
      if (currentAddress.trim()) filter.address = currentAddress.trim()
      if (currentMinPrice && !isNaN(Number(currentMinPrice)))
        filter.minPrice = Number(currentMinPrice)
      if (currentMaxPrice && !isNaN(Number(currentMaxPrice)))
        filter.maxPrice = Number(currentMaxPrice)

      return filter
    },
    [name, address, minPrice, maxPrice]
  )

  const applyFilters = useCallback(() => {
    onFilterChange(createFilter())
  }, [createFilter, onFilterChange])

  const handleFilterSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      applyFilters()
    },
    [applyFilters]
  )

  const handleClearFilters = useCallback(() => {
    setName("")
    setAddress("")
    setMinPrice("")
    setMaxPrice("")
    onFilterChange({})
  }, [onFilterChange])

  const handlePriceChange = useCallback(
    (type: "min" | "max", value: string) => {
      // Update state first
      if (type === "min") {
        setMinPrice(value)
      } else {
        setMaxPrice(value)
      }
    },
    [createFilter, onFilterChange]
  )

  return (
    <div className="property-filter">
      <h3>Filter Properties</h3>
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="name">Property Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search by name..."
            />
          </div>

          <div className="filter-field">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Search by address..."
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="minPrice">Min Price ($)</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="maxPrice">Max Price ($)</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              placeholder="1000000"
              min="0"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="apply-button">
            Apply Filters
          </button>
          <button type="button" onClick={handleClearFilters} className="clear-button">
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  )
})

PropertyFilterComponent.displayName = "PropertyFilterComponent"

export default PropertyFilterComponent
