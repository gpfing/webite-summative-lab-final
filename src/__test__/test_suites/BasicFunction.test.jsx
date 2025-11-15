import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Home from '../../pages/Home.jsx'
import Admin from '../../pages/Admin.jsx'
import ProductContainer from '../../pages/ProductContainer.jsx'
import ProductList from '../../pages/ProductList.jsx'
import { LoginProvider } from '../../context/LoginContext.jsx'

// Mock fetch
global.fetch = vi.fn()

// Mock useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn()
    }
})

describe('Basic User Experience', () => {
    beforeEach(() => {
            vi.clearAllMocks()
            // Mock localStorage
            global.localStorage.getItem = vi.fn((key) => {
            if (key === 'isAdminLoggedIn') return 'false'
            return null
            })
            global.localStorage.setItem = vi.fn()
    })

  describe('Navigation', () => {
        it('should navigate between pages using NavBar links', async () => {
            const user = userEvent.setup()

            // Mock products fetch
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => [{ id: '1', name: 'Test Product', description: 'Test', price: 10 }]
            })

            render(
                <MemoryRouter initialEntries={['/']}>
                    <LoginProvider>
                        <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/products" element={<ProductContainer />}>
                            <Route path="" element={<ProductList />} />
                        </Route>
                        </Routes>
                    </LoginProvider>
                </MemoryRouter>
            )

            // Check we start on Home page
            expect(screen.getByText(/welcome/i)).toBeInTheDocument()

            // Click "Browse Products" link
            const browseLink = screen.getByRole('link', { name: /Browse Products/i })
            await user.click(browseLink)

            // Verify we're on products page
            await waitFor(() => {
                expect(screen.getByText('Test Product')).toBeInTheDocument()
            })

            // Click "Admin" link
            const adminLink = screen.getByRole('link', { name: /Admin/i })
            await user.click(adminLink)

            // Verify we're on admin page
            await waitFor(() => {
                expect(screen.getByText('Admin Login')).toBeInTheDocument()
            })

            // Click "Home" link
            const homeLink = screen.getByRole('link', { name: /Home/i })
            await user.click(homeLink)

            // Verify we're back on home page
            await waitFor(() => {
                expect(screen.getByText(/welcome/i)).toBeInTheDocument()
            })
        })
    })

  describe('Product Display', () => {
    it('should display all products from db.json', async () => {
        // Mock the products data from db.json
        const mockProducts = [
            { id: '1', name: 'Keyboard', description: 'Clickity-clackity', price: 220 },
            { id: '2', name: 'Mouse', description: 'Click \'n scroll a lot', price: 60 },
            { id: '3', name: 'Headphones', description: 'Ya heard?', price: 90 },
            { id: '4', name: 'Mouse Pad', description: 'Pillow for your hardware', price: 15 },
            { id: '5', name: 'Gamer Glasses', description: 'These make you look badass', price: 32 },
            { id: '6', name: 'Monitor', description: 'See stuff', price: 450 },
            { id: '7', name: 'Gamer Fuel', description: 'Gets you hydrated for more gaming!', price: 5 }
        ]

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        })

        render(
            <MemoryRouter initialEntries={['/products']}>
            <LoginProvider>
                <Routes>
                <Route path="/products" element={<ProductContainer />}>
                    <Route path="" element={<ProductList />} />
                </Route>
                </Routes>
            </LoginProvider>
            </MemoryRouter>
        )

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Keyboard')).toBeInTheDocument()
        })

        // Verify all products are displayed
        expect(screen.getByText('Keyboard')).toBeInTheDocument()
        expect(screen.getByText('Mouse')).toBeInTheDocument()
        expect(screen.getByText('Headphones')).toBeInTheDocument()
        expect(screen.getByText('Mouse Pad')).toBeInTheDocument()
        expect(screen.getByText('Gamer Glasses')).toBeInTheDocument()
        expect(screen.getByText('Monitor')).toBeInTheDocument()
        expect(screen.getByText('Gamer Fuel')).toBeInTheDocument()

        // Verify correct number of products
        const productCards = screen.getAllByRole('listitem')
        expect(productCards).toHaveLength(7)
    })

    it('should display product details correctly', async () => {
        const mockProducts = [
            { id: '1', name: 'Keyboard', description: 'Clickity-clackity', price: 220 }
        ]

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        })

        render(
            <MemoryRouter initialEntries={['/products']}>
                <LoginProvider>
                    <Routes>
                    <Route path="/products" element={<ProductContainer />}>
                        <Route path="" element={<ProductList />} />
                    </Route>
                    </Routes>
                </LoginProvider>
            </MemoryRouter>
        )

        // Wait for product to load
        await waitFor(() => {
            expect(screen.getByText('Keyboard')).toBeInTheDocument()
        })

        // Verify product name, description, and price are displayed
        expect(screen.getByText('Keyboard')).toBeInTheDocument()
        expect(screen.getByText('Description: Clickity-clackity')).toBeInTheDocument()
        expect(screen.getByText('$220')).toBeInTheDocument()
    })

    it('should not show edit buttons when not logged in', async () => {
        const mockProducts = [
            { id: '1', name: 'Keyboard', description: 'Clickity-clackity', price: 220 }
        ]

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        })

        render(
            <MemoryRouter initialEntries={['/products']}>
                <LoginProvider>
                    <Routes>
                    <Route path="/products" element={<ProductContainer />}>
                        <Route path="" element={<ProductList />} />
                    </Route>
                    </Routes>
                </LoginProvider>
            </MemoryRouter>
        )

        // Wait for product to load
        await waitFor(() => {
            expect(screen.getByText('Keyboard')).toBeInTheDocument()
        })

        // Verify no edit buttons are visible
        expect(screen.queryByRole('button', { name: /Edit Product/i })).not.toBeInTheDocument()
    })
  })
})
