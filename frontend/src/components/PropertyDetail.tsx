import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Property } from "../types/Property"
import { propertyService } from "../services/apiService"
import "./PropertyDetail.css"
import { API_BASE_URL } from "../utils/const"

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID not provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await propertyService.getProperty(id)
        setProperty(data)
      } catch (err) {
        setError("Failed to fetch property details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Properties
        </button>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="error-container">
        <p className="error-message">Property not found</p>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Properties
        </button>
      </div>
    )
  }

  return (
    <div className="property-detail-container">
      <button onClick={() => navigate("/")} className="back-button">
        ← Back to Properties
      </button>

      <div className="property-detail">
        <div className="property-image-large">
          {property.image ? (
            <img src={`${API_BASE_URL}${property.image}`} alt={property.name} />
          ) : (
            <div className="no-image-large">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="property-info">
          <h1>{property.name}</h1>
          <p className="property-address-large">{property.address}</p>
          <p className="property-price-large">{formatPrice(property.price)}</p>
          <p className="property-type-large">Type: {property.propertyType}</p>
          <p className="property-description-large">
            <b>Description:</b> {property.description}
          </p>
          <p className="property-location-large">
            <b>bedrooms:</b> {property.bedrooms} | <b>bathrooms:</b> {property.bathrooms} |{" "}
            <b>area:</b> {property.squareFootage} sqft
          </p>
          <p className="property-location-large">
            <b>Year Built:</b> {property.yearBuilt}
          </p>
          <p className="property-status-large">
            <b>Features:</b> {property.features?.join(", ") || "No features available"}
          </p>
          <p className="property-status-large">
            <b>Created:</b> {property.createdDate.slice(11, 16)} {property.createdDate.slice(0, 10)}
            | <b>Updated:</b> {property.updatedDate.slice(11, 16)}{" "}
            {property.updatedDate.slice(0, 10)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
