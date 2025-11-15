import { useState, useRef, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import './ProductForm.css'

function ProductForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const {addProduct} = useOutletContext()
  const nameInputRef = useRef(null)

  // Auto-focus name input when component mounts
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [])

const handleSubmit = (e) => {
    e.preventDefault()
  const newProduct = { name, description, price: Number(price) }
  // POST to the json-server endpoint so the product is persisted to db.json
  fetch("http://localhost:4000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
    })
    .then(r => {
        if (!r.ok) { throw new Error("failed to add product")}
        return r.json()
    })
    .then(data => {
    addProduct(data)
    })
    .catch(console.log)
    setName("");
    setPrice("");
    setDescription("");
  }

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={nameInputRef}
          type="text"
          placeholder="Product's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Products's Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product's Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  )
}

export default ProductForm