import {Link, useOutletContext} from "react-router-dom"
import React from 'react';
import ProductCard from "./ProductCard"

const ProductList = () => {
    const {filteredProducts, updateProduct} = useOutletContext();

    return (
        <ul className="cards">
        {filteredProducts.map((p) => (
            <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            description={p.description}
            price={p.price}
            onUpdate={updateProduct}
            />
        ))}
        </ul>
    );
}

export default ProductList;
