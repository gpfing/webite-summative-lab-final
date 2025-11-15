import React, { useContext, useState, useRef, useEffect } from 'react'
import { LoginContext } from '../context/LoginContext'

function ProductCard({ id, name, description, price, onUpdate }) {
    const { isLoggedIn } = useContext(LoginContext)
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(name)
    const [editDescription, setEditDescription] = useState(description)
    const [editPrice, setEditPrice] = useState(price)
    const [isLoading, setIsLoading] = useState(false)
    const nameInputRef = useRef(null)

    // Auto-focus name input when edit mode is activated
    useEffect(() => {
        if (isEditing && nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }, [isEditing])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async () => {
        setIsLoading(true)
        const updatedProduct = {
            id,
            name: editName,
            description: editDescription,
            price: Number(editPrice)
        }

        try {
            const response = await fetch(`http://localhost:4000/products/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            })

            if (!response.ok) throw new Error('failed to update product')
            const data = await response.json()
            onUpdate(data)
            setIsEditing(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setEditName(name)
        setEditDescription(description)
        setEditPrice(price)
        setIsEditing(false)
    }

    return (
        <li className="card">
            {isEditing ? (
                <div className="card-edit">
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Product Name"
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="Price"
                        min="0"
                        step="0.01"
                    />
                    <div className="edit-buttons">
                        <button onClick={handleSave} disabled={isLoading} className="save-btn">
                            {isLoading ? 'Saving...' : 'Save Edit'}
                        </button>
                        <button onClick={handleCancel} className="cancel-btn" disabled={isLoading}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h2>{editName}</h2>
                    <p>Description: {editDescription}</p>
                    <p>${editPrice}</p>
                    {isLoggedIn && (
                        <button onClick={handleEdit} className="edit-btn">
                            Edit Product
                        </button>
                    )}
                </>
            )}
        </li>
    )
}

export default ProductCard
