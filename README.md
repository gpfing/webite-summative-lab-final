# Product Management System

A warm, eye-friendly React application for managing products with admin authentication. Add or edit items while an admin, or just browse as a user!

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd website-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the json-server (backend)**
   ```bash
   npm run server
   ```
   This will start the API server on `http://localhost:4000`

4. **Start the React development server (frontend)**
   ```bash
   npm run dev
   ```
   This will start the frontend on `http://localhost:5173`

## Usage Guide

### For Regular Users

1. **Browse Products**
   - Visit the home page to see all available products
   - Use the search bar to find specific products by name
   - Products are displayed in cards with name, description, and price

### For Admin Users

1. **Login as Admin**
   - Navigate to the Admin page
   - Use these credentials:
     - **Username**: `admin`
     - **Password**: `password123`

2. **Add New Products**
   - After logging in, click "Add Product" in the navigation
   - Fill out all required fields (name, description, price)
   - Submit to add the product to the database

3. **Edit Existing Products**
   - When logged in, each product card shows an "Edit Product" button
   - Click to enter edit mode with inline form fields
   - Make your changes and click "Save Edit" or "Cancel" to abort

4. **Logout**
   - Click the red "Logout" button on the Admin page
   - You'll be automatically redirected to the home page