import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import ProductContainer from "./pages/ProductContainer"
import ProductForm from "./pages/ProductForm"
import ProductList from "./pages/ProductList"
import { LoginProvider } from "./context/LoginContext"
import './App.css'

const App = () => {
    return (
        <LoginProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/admin" element={<Admin />}/>
                    <Route path="/products" element={<ProductContainer />}>
                      <Route path="" element={<ProductList/>}/>
                      <Route path="new" element={<ProductForm/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </LoginProvider>
    )
}

export default App
