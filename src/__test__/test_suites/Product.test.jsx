import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ProductForm from '../../pages/ProductForm.jsx'
import ProductCard from '../../pages/ProductCard.jsx'
import { LoginProvider } from '../../context/LoginContext.jsx'

// Mock fetch
global.fetch = vi.fn()

// Mock useOutletContext for ProductForm
const mockAddProduct = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useOutletContext: () => ({ addProduct: mockAddProduct }),
    useNavigate: () => vi.fn()
  }
})

describe('Product Management', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Mock localStorage to return 'true' for admin login
        global.localStorage.getItem = vi.fn((key) => {
        if (key === 'isAdminLoggedIn') return 'true'
        return null
        })
        global.localStorage.setItem = vi.fn()
    })

    describe('Add Product', () => {
        it('should add a new product when logged in as admin', async () => {
            const user = userEvent.setup()

            // Mock successful POST request
            const newProduct = {
            id: 4,
            name: 'New Product',
            description: 'Test description',
            price: 29.99
            }

            global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newProduct
            })

            render(
            <BrowserRouter>
                <LoginProvider>
                <ProductForm />
                </LoginProvider>
            </BrowserRouter>
            )

            // Fill out the form
            const nameInput = screen.getByPlaceholderText(/Product's Name/i)
            const descriptionInput = screen.getByPlaceholderText(/Products's Description/i)
            const priceInput = screen.getByPlaceholderText(/Product's Price/i)
            const submitButton = screen.getByRole('button', { name: /Add Product/i })

            await user.type(nameInput, 'New Product')
            await user.type(descriptionInput, 'Test description')
            await user.type(priceInput, '29.99')
            await user.click(submitButton)

            // Verify addProduct callback was called with the new product
            await waitFor(() => {
                expect(mockAddProduct).toHaveBeenCalledWith(newProduct)
            })
        })
    })

    describe('Edit Product', () => {
        const mockOnUpdate = vi.fn()
        const testProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Original description',
        price: 19.99
        }

        it('should edit an existing product when logged in as admin', async () => {
            const user = userEvent.setup()

            // Mock successful PATCH request
            const updatedProduct = {
                id: 1,
                name: 'Updated Product',
                description: 'Updated description',
                price: 24.99
            }

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => updatedProduct
            })

            render(
                <BrowserRouter>
                <LoginProvider>
                    <ProductCard
                    id={testProduct.id}
                    name={testProduct.name}
                    description={testProduct.description}
                    price={testProduct.price}
                    onUpdate={mockOnUpdate}
                    />
                </LoginProvider>
                </BrowserRouter>
            )

            // Check edit button is displayed
            expect(screen.getByRole('button', { name: /Edit Product/i })).toBeInTheDocument()

            // Click edit button
            const editButton = screen.getByRole('button', { name: /Edit Product/i })
            await user.click(editButton)

            // Wait for edit form to appear (Save/Cancel buttons visible)
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Save Edit/i })).toBeInTheDocument()
            })

            // Edit the fields
            const nameInput = screen.getByDisplayValue('Test Product')
            const descriptionInput = screen.getByDisplayValue('Original description')
            const priceInput = screen.getByDisplayValue('19.99')

            await user.clear(nameInput)
            await user.type(nameInput, 'Updated Product')
            
            await user.clear(descriptionInput)
            await user.type(descriptionInput, 'Updated description')
            
            await user.clear(priceInput)
            await user.type(priceInput, '24.99')

            // Click save
            const saveButton = screen.getByRole('button', { name: /Save Edit/i })
            await user.click(saveButton)

            // Wait for PATCH request
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:4000/products/1',
                expect.objectContaining({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProduct)
                })
                )
            })

            // Verify onUpdate callback was called
            await waitFor(() => {
                expect(mockOnUpdate).toHaveBeenCalledWith(updatedProduct)
            })
            })

        it('should cancel editing and revert changes', async () => {
            const user = userEvent.setup()

            render(
                <BrowserRouter>
                <LoginProvider>
                    <ProductCard
                    id={testProduct.id}
                    name={testProduct.name}
                    description={testProduct.description}
                    price={testProduct.price}
                    onUpdate={mockOnUpdate}
                    />
                </LoginProvider>
                </BrowserRouter>
            )

            // Click edit button
            const editButton = screen.getByRole('button', { name: /Edit Product/i })
            await user.click(editButton)

            // Make some changes
            const nameInput = screen.getByDisplayValue('Test Product')
            await user.clear(nameInput)
            await user.type(nameInput, 'Changed Name')

            // Click cancel
            const cancelButton = screen.getByRole('button', { name: /Cancel/i })
            await user.click(cancelButton)

            // Verify original values are displayed
            await waitFor(() => {
                expect(screen.getByText('Test Product')).toBeInTheDocument()
            })

            // Verify no PATCH request was made
            expect(global.fetch).not.toHaveBeenCalled()
        })

        it('should not show edit button when not logged in', () => {
            // Mock localStorage to return 'false' for this test
            global.localStorage.getItem = vi.fn((key) => {
                if (key === 'isAdminLoggedIn') return 'false'
                return null
            })

        render(
            <BrowserRouter>
            <LoginProvider>
                <ProductCard
                id={testProduct.id}
                name={testProduct.name}
                description={testProduct.description}
                price={testProduct.price}
                onUpdate={mockOnUpdate}
                />
            </LoginProvider>
            </BrowserRouter>
        )

        // Check product is displayed but no edit button
        expect(screen.getByText('Test Product')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /Edit Product/i })).not.toBeInTheDocument()
        })
    })
})
