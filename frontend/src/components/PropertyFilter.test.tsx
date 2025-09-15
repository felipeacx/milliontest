import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import PropertyFilter from "./PropertyFilter"

test("renders filter form elements", () => {
  const mockOnFilterChange = vi.fn()

  render(<PropertyFilter onFilterChange={mockOnFilterChange} />)

  expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/search by address/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/min price/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/max price/i)).toBeInTheDocument()
  expect(screen.getByText("Apply Filters")).toBeInTheDocument()
  expect(screen.getByText("Clear Filters")).toBeInTheDocument()
})

test("calls onFilterChange when form is submitted", async () => {
  const mockOnFilterChange = vi.fn()

  render(<PropertyFilter onFilterChange={mockOnFilterChange} />)

  const nameInput = screen.getByPlaceholderText(/search by name/i)
  const submitButton = screen.getByText("Apply Filters")

  fireEvent.change(nameInput, { target: { value: "test property" } })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: "test property",
    })
  })
})
