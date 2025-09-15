import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import App from "./App"

// Mock the PropertyList component to avoid API calls in tests
vi.mock("./components/PropertyList", () => ({
  default: () => <div>Property List</div>,
}))

// Mock the PropertyDetail component
vi.mock("./components/PropertyDetail", () => ({
  default: () => <div>Property Detail</div>,
}))

test("renders property list application", async () => {
  render(<App />)

  // Wait for the lazy-loaded component to render
  await waitFor(() => {
    expect(screen.getByText("Property List")).toBeInTheDocument()
  })
})
