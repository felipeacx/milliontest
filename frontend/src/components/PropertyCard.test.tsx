import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import PropertyCard from "./PropertyCard"
import { Property } from "../types/Property"

const mockProperty: Property = {
  id: "1",
  name: "Test Property",
  address: "123 Test Street",
  price: 500000,
  propertyType: "House",
  description: "A beautiful test property",
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1500,
  yearBuilt: 2020,
  isActive: true,
  features: ["garage", "garden"],
  image: "/images/test.jpg",
  createdDate: "2023-01-01T00:00:00Z",
  updatedDate: "2023-01-01T00:00:00Z",
  ownerId: "1",
  owner: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    photoUrl: "/images/john.jpg",
    createdDate: "2023-01-01T00:00:00Z",
    updatedDate: "2023-01-01T00:00:00Z",
  },
}

test("renders property card with basic information", () => {
  const mockOnClick = vi.fn()

  render(<PropertyCard property={mockProperty} onClick={mockOnClick} />)

  expect(screen.getByText("Test Property")).toBeInTheDocument()
  expect(screen.getByText("123 Test Street")).toBeInTheDocument()
  expect(screen.getByText("$500,000.00")).toBeInTheDocument()
})

test("handles click events", () => {
  const mockOnClick = vi.fn()

  render(<PropertyCard property={mockProperty} onClick={mockOnClick} />)

  const card = screen.getByText("Test Property").closest(".property-card")
  if (card) {
    fireEvent.click(card)
  }

  expect(mockOnClick).toHaveBeenCalledTimes(1)
})
