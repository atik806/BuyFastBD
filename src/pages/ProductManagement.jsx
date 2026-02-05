import { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import '../styles/ProductManagement.css'

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [flashDeals, setFlashDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    discount: '',
    description: '',
    category: 'Electronics'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Set up real-time listeners
  useEffect(() => {
    setLoading(true)
    
    // Real-time listener for products
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching products:', err)
      setLoading(false)
    })

    // Real-time listener for flash deals
    const dealsQuery = query(collection(db, 'bestDeals'), orderBy('createdAt', 'desc'))
    const unsubscribeDeals = onSnapshot(dealsQuery, (snapshot) => {
      const dealsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setFlashDeals(dealsData)
    }, (err) => {
      console.error('Error fetching flash deals:', err)
    })

    // Cleanup listeners on unmount
    return () => {
      unsubscribeProducts()
      unsubscribeDeals()
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'discount' ? parseInt(value) || '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        // Update existing product
        await updateDoc(doc(db, 'products', editingId), {
          ...formData,
          updatedAt: new Date()
        })
        setSuccess('Product updated successfully!')
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        setSuccess('Product added successfully!')
      }

      // Reset form (real-time listener will update automatically)
      setFormData({ name: '', price: '', stock: '', discount: '', description: '', category: 'Electronics' })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError('Error saving product: ' + err.message)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      discount: product.discount || '',
      description: product.description || '',
      category: product.category || 'Electronics'
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id))
        setSuccess('Product deleted successfully!')
      } catch (err) {
        setError('Error deleting product: ' + err.message)
      }
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', price: '', stock: '', discount: '', description: '', category: 'Electronics' })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleAddToBestDeals = async (product) => {
    try {
      setError('')
      // Check if already in flash deals
      const alreadyExists = flashDeals.some(deal => deal.productId === product.id)
      if (alreadyExists) {
        setError('This product is already in Flash Deals')
        return
      }

      await addDoc(collection(db, 'bestDeals'), {
        productId: product.id,
        productName: product.name,
        price: product.price,
        discount: product.discount || 0,
        description: product.description || '',
        createdAt: new Date()
      })
      setSuccess('Product added to Flash Deals!')
    } catch (err) {
      setError('Error adding to Flash Deals: ' + err.message)
    }
  }

  const handleRemoveFromBestDeals = async (dealId) => {
    if (window.confirm('Remove this product from Flash Deals?')) {
      try {
        await deleteDoc(doc(db, 'bestDeals', dealId))
        setSuccess('Product removed from Flash Deals!')
      } catch (err) {
        setError('Error removing from Flash Deals: ' + err.message)
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  return (
    <div className="product-management">
      <div className="pm-header">
        <h2>📦 Product Management</h2>
        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '➕ Add Product'}
        </button>
      </div>

      {/* Tabs */}
      <div className="pm-tabs">
        <button
          className={`pm-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 All Products
        </button>
        <button
          className={`pm-tab ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          ⚡ Flash Deals ({flashDeals.length})
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {showForm && (
        <div className="product-form">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Wireless Headphones"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Clothing</option>
                  <option>Home & Garden</option>
                  <option>Sports</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (৳) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="2499"
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="50"
                  required
                />
              </div>
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description..."
                rows="3"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-btn">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="products-table">
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products yet. Click "Add Product" to get started!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category || 'N/A'}</td>
                    <td className="price">৳{product.price}</td>
                    <td>
                      <span className={`stock-badge ${product.stock < 20 ? 'low' : product.stock < 50 ? 'medium' : 'high'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.discount ? `${product.discount}%` : '-'}</td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="deal-btn"
                        onClick={() => handleAddToBestDeals(product)}
                        disabled={flashDeals.some(deal => deal.productId === product.id)}
                      >
                        ⚡ Flash Deal
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Flash Deals Tab */}
      {activeTab === 'deals' && (
        <div className="best-deals-section">
          <h3>⚡ Flash Deals</h3>
          {flashDeals.length === 0 ? (
            <div className="no-products">
              <p>No flash deals yet. Add products from the All Products tab!</p>
            </div>
          ) : (
            <div className="deals-grid">
              {flashDeals.map(deal => (
                <div key={deal.id} className="deal-item">
                  <div className="deal-header">
                    <h4>{deal.productName}</h4>
                    <button
                      className="remove-deal-btn"
                      onClick={() => handleRemoveFromBestDeals(deal.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="deal-info">
                    <p className="deal-price">৳{deal.price}</p>
                    {deal.discount > 0 && (
                      <p className="deal-discount">{deal.discount}% OFF</p>
                    )}
                  </div>
                  {deal.description && (
                    <p className="deal-description">{deal.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
