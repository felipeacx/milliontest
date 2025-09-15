import React, { memo, useMemo } from "react"
import { Property } from "../types/Property"
import "./PropertyCard.css"
import { API_BASE_URL } from "../utils/const"

interface PropertyCardProps {
  property: Property
  onClick?: () => void
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({ property, onClick }) => {
  // Memoize the formatted price to avoid recalculation on every render
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(property.price)
  }, [property.price])

  return (
    <div className="property-card" onClick={onClick}>
      <div className="property-image">
        {property.image ? (
          <img
            src={`${API_BASE_URL}${property.image}`}
            alt={property.name}
            loading="lazy" // Lazy load images for better performance
          />
        ) : (
          <div className="no-image">
            <span>No Image Available</span>
          </div>
        )}
      </div>

      <div className="property-details">
        <h3 className="property-name">{property.name}</h3>
        <p className="property-address">{property.address}</p>
        <p className="property-price">{formattedPrice}</p>

        {property.description && (
          <p className="property-description">{property.description.substring(0, 100)}...</p>
        )}

        <div className="property-specs">
          {property.bedrooms && <span className="spec">🛏️ {property.bedrooms} bed</span>}
          {property.bathrooms && <span className="spec">🚿 {property.bathrooms} bath</span>}
          {property.squareFootage && (
            <span className="spec">📐 {property.squareFootage} sq ft</span>
          )}
        </div>

        {property.owner && (
          <div className="property-owner">
            <small>Owner: {property.owner.name}</small>
          </div>
        )}
      </div>
    </div>
  )
})

export default PropertyCard
