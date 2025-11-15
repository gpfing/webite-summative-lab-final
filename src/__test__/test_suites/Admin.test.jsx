import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Admin from '../../pages/Admin.jsx'
import { LoginProvider } from '../../context/LoginContext.jsx'

// Mock fetch
global.fetch = vi.fn()

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Admin Login', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock successful admin fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        username: 'admin',
        password: 'password123'
      })
    })
  })

  it('should successfully login with correct credentials', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <LoginProvider>
          <Admin />
        </LoginProvider>
      </BrowserRouter>
    )

    // Fill in the form
    const usernameInput = screen.getByPlaceholderText(/Enter username/i)
    const passwordInput = screen.getByPlaceholderText(/Enter password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByText(/Welcome, Admin! You are logged in./i)).toBeInTheDocument()
    })

    // Check that logout button appears
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
    
    // Verify form is no longer visible
    expect(screen.queryByPlaceholderText(/Enter username/i)).not.toBeInTheDocument()
  })

  it('should show error message with incorrect credentials', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <LoginProvider>
          <Admin />
        </LoginProvider>
      </BrowserRouter>
    )

    // Fill in wrong credentials
    const usernameInput = screen.getByPlaceholderText(/Enter username/i)
    const passwordInput = screen.getByPlaceholderText(/Enter password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await user.type(usernameInput, 'wrong')
    await user.type(passwordInput, 'wrong123')
    await user.click(loginButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument()
    })

    // Verify still on login form
    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument()
  })

  it('should logout and redirect to home page', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <LoginProvider>
          <Admin />
        </LoginProvider>
      </BrowserRouter>
    )

    // Login first
    const usernameInput = screen.getByPlaceholderText(/Enter username/i)
    const passwordInput = screen.getByPlaceholderText(/Enter password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    // Wait for login success
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
    })

    // Click logout
    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    await user.click(logoutButton)

    // Verify navigate was called with '/'
    expect(mockNavigate).toHaveBeenCalledWith('/')
    
    // Verify back to login form
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument()
    })
  })
})
