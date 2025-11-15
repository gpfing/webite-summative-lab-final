import NavBar from "../components/NavBar"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../context/LoginContext"
import { useLogin } from "../hooks/useLogin"
import './ProductForm.css'

function Admin() {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext)
  const { adminName, setAdminName, adminPassword, setAdminPassword, loginError, isLoading, login } = useLogin()
  const navigate = useNavigate()

const handleSubmit = (e) => {
    e.preventDefault()
    login(() => setIsLoggedIn(true))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/')
  }

    return (
        <>
            <NavBar />
            <div className="product-form-container">
                <h2>Admin Login</h2>
                {isLoggedIn ? (
                    <div className="success-message">
                        <p>Welcome, Admin! You are logged in.</p>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Admin Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Admin Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                        />
                        {loginError && <p className="error-message">{loginError}</p>}
                        <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                    </form>
                )}
            </div>
        </>
        )
  }
  
  export default Admin