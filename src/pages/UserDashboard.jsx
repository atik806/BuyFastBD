import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import '../styles/UserDashboard.css'

export default function UserDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [flashDeals, setFlashDeals] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [activeTab, setActiveTab] = useState('shop')
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Load products and deals
  useEffect(() => {
    setProductsLoading(true)

    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
      setProductsLoading(false)
    }, (err) => {
      console.error('Error fetching products:', err)
      setProductsLoading(false)
    })

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

    return () => {
      unsubscribeProducts()
      unsubscribeDeals()
    }
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('userCart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('userCart', JSON.stringify(cart))
  }, [cart])

  const handleSearch = (results, query) => {
    setSearchResults(results)
    setSearchQuery(query)
  }

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    try {
      const order = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        items: cart,
        total: calculateTotal(),
        status: 'pending',
        createdAt: new Date(),
        deliveryAddress: 'To be confirmed',
        paymentMethod: 'Cash on Delivery'
      }

      await addDoc(collection(db, 'orders'), order)
      setOrderSuccess(true)
      setCart([])
      localStorage.removeItem('userCart')

      setTimeout(() => {
        setOrderSuccess(false)
        setShowCart(false)
      }, 3000)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Error placing order. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      onLogout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="user-dashboard-header">
        <div className="header-left">
          <h1>🛍️ BuyFastBD</h1>
        </div>
        <div className="header-center">
          <SearchBar products={products} onSearch={handleSearch} />
        </div>
        <div className="header-right">
          <div className="user-info-header">
            <span className="user-greeting">👤 {getUserDisplayName()}</span>
            <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
              🛒 Cart ({cart.length})
            </button>
            <button className="logout-btn-header" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="user-dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🛒 Shop
        </button>
        <button
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          👤 My Account
        </button>
      </div>

      {/* Shop Tab */}
      {activeTab === 'shop' && (
        <div className="shop-section">
          {/* Flash Deals */}
          <section className="flash-deals-section">
            <h2>⚡ Today's Flash Deals</h2>
            <div className="deals-grid">
              {productsLoading ? (
                <p>Loading deals...</p>
              ) : flashDeals.length === 0 ? (
                <p>No deals available</p>
              ) : (
                flashDeals.map(deal => (
                  <div key={deal.id} className="deal-card">
                    <div className="product-image">📦</div>
                    {deal.discount && deal.discount > 0 && (
                      <div className="discount-badge">{deal.discount}% OFF</div>
                    )}
                    <h3>{deal.productName}</h3>
                    <p className="price">৳{deal.price}</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        const product = products.find(p => p.id === deal.productId)
                        if (product) handleAddToCart(product)
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Category Filter */}
          <section className="products-section">
            <h2>{searchResults ? `Search Results for "${searchQuery}"` : 'Featured Products'}</h2>

            <div className="products-grid">
              {productsLoading ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading products...</p>
              ) : (searchResults || products).length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  {searchResults ? 'No products found' : 'No products available'}
                </p>
              ) : (
                (searchResults || products)
                  .filter(product => !flashDeals.some(deal => deal.productId === product.id))
                  .map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">📦</div>
                      <h3>{product.name}</h3>
                      <p className="category-tag">{product.category}</p>
                      <p className="price">৳{product.price}</p>
                      {product.stock > 0 ? (
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button className="out-of-stock-btn" disabled>
                          Out of Stock
                        </button>
                      )}
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="account-section">
          <div className="account-card">
            <h2>My Account</h2>
            <div className="account-info">
              <p><strong>Name:</strong> {getUserDisplayName()}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Type:</strong> Regular User</p>
              <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="account-features">
            <div className="feature-card">
              <h3>🛒 My Orders</h3>
              <p>View your purchase history and track orders</p>
            </div>
            <div className="feature-card">
              <h3>❤️ Wishlist</h3>
              <p>Save your favorite items for later</p>
            </div>
            <div className="feature-card">
              <h3>📍 Addresses</h3>
              <p>Manage your delivery addresses</p>
            </div>
            <div className="feature-card">
              <h3>💬 Support</h3>
              <p>Contact our customer service team</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>🛒 Shopping Cart</h2>
            <button className="close-cart" onClick={() => setShowCart(false)}>✕</button>
          </div>

          {orderSuccess && (
            <div className="order-success">
              ✅ Order placed successfully! Thank you for shopping with us.
            </div>
          )}

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p className="empty-cart-hint">Add products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-price">৳{item.price}</p>
                    </div>
                    <div className="item-quantity">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="item-total">
                      <p>৳{item.price * item.quantity}</p>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>৳{calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>৳{calculateTotal()}</span>
                </div>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                💳 Checkout (Cash on Delivery)
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
