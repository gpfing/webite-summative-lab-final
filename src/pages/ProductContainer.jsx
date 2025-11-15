import { useEffect, useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import ProductList from './ProductList';
import {Outlet, Link, useLocation} from "react-router-dom";
import Search from "./Search"
import { LoginContext } from '../context/LoginContext'
import './ProductContainer.css'

const ProductContainer = () => {
    const [products, setProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation()
    const { isLoggedIn } = useContext(LoginContext)

    useEffect(() => {
        // Fetch from local json-server API which serves /products as an array
        fetch("http://localhost:4000/products")
        .then(r => {
            if (!r.ok) { throw new Error("failed to fetch products") }
            return r.json()
        })
        .then(data => setProducts(data)) // setProducts to array from API
        .catch(console.log)
    }, []) 

    const addProduct = (newProduct) => {
        setProducts(previousProducts => [...previousProducts, newProduct])
    }

    const updateProduct = (updatedProduct) => {
        setProducts(previousProducts =>
            previousProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        )
    }

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <>
            <NavBar />
            <main>
                <h1>{location.pathname === '/products/new' ? 'Add a Product to Sell' : 'Check out our Products!'}</h1>
                {isLoggedIn && (
                    <Link to={location.pathname === '/products/new' ? '' : 'new'} className="product-link">
                        {location.pathname === '/products/new' ? 'Return to Products' : 'Add a new Product'}
                    </Link>
                )}
                {location.pathname === '/products' && <Search onSearchChange={setSearchQuery}/>}
                <Outlet context={{filteredProducts, addProduct, updateProduct}}/>
            </main>
        </>
    );
}

export default ProductContainer;
