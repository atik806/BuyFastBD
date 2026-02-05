import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import SearchBar from '../components/SearchBar'
import LoginModal from '../components/LoginModal'

export default function HomePage({ products, flashDeals, productsLoading, setCurrentPage, user }) {
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleSearch = (results, query) => {
    setSearchResults(results)
    setSearchQuery(query)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setCurrentPage('home')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const reviews = [
    { name: 'Fatima Ahmed', rating: 5, text: 'Excellent service! Delivered in 2 days.' },
    { name: 'Karim Hassan', rating: 5, text: 'Best quality products at great prices.' },
    { name: 'Nadia Khan', rating: 5, text: 'Cash on delivery made it so easy!' },
  ]

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">🛍️ BuyFastBD</div>
          <div className="nav-links">
            <a href="#products">Products</a>
            <a href="#deals">Deals</a>
            <a href="#reviews">Reviews</a>
            <a href="#contact">Contact</a>
            {user ? (
              <>
                <div className="user-profile">
                  <span className="user-name">👤 {getUserDisplayName()}</span>
                  <button className="nav-auth-btn logout-btn" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to BuyFastBD</h1>
          <p className="hero-tagline">Fast Delivery | Trusted Products | Cash on Delivery</p>
          <button 
            className="shop-now-btn"
            onClick={() => {
              if (!user) {
                setShowLoginModal(true)
              } else {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            🛒 Shop Now
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <section className="search-section">
        <SearchBar products={products} onSearch={handleSearch} />
      </section>

      {/* Why BuyFastBD */}
      <section className="why-buyfastbd">
        <h2>Why BuyFastBD?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">🚚</span>
            <h3>Fast Delivery All Over Bangladesh</h3>
            <p>Get your orders delivered quickly to your doorstep</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">💯</span>
            <h3>Quality Checked Products</h3>
            <p>Every product is verified for quality before shipping</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">💸</span>
            <h3>Cash on Delivery</h3>
            <p>Pay when you receive your order - no risk</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🔁</span>
            <h3>Easy Return Policy</h3>
            <p>Hassle-free returns within 7 days</p>
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="flash-deals" id="deals">
        <h2>⚡ Today's Flash Deals</h2>
        <div className="deals-grid">
          {productsLoading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>Loading deals...</p>
          ) : flashDeals.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>No deals available yet</p>
          ) : (
            flashDeals.map(deal => (
              <div key={deal.id} className="deal-card" onClick={() => navigate(`/product/${deal.productId}`)}>
                <div className="product-image">📦</div>
                {deal.discount && deal.discount > 0 && <div className="discount-badge">{deal.discount}% OFF</div>}
                <h3>{deal.productName}</h3>
                <p className="price">৳{deal.price}</p>
                <button 
                  className="add-to-cart" 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!user) {
                      setShowLoginModal(true)
                    }
                  }}
                >
                  {user ? 'Add to Cart' : 'Login to Buy'}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products" id="products">
        <h2>{searchResults ? `Search Results for "${searchQuery}"` : 'Featured Products'}</h2>
        <div className="products-grid">
          {productsLoading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>Loading products...</p>
          ) : (searchResults || products).length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
              {searchResults ? 'No products found matching your search' : 'No products available'}
            </p>
          ) : (
            (searchResults || products)
              .filter(product => !flashDeals.some(deal => deal.productId === product.id))
              .map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image">📦</div>
                  <h3>{product.name}</h3>
                  <p className="price">৳{product.price}</p>
                  <button 
                    className="buy-btn" 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!user) {
                        setShowLoginModal(true)
                      }
                    }}
                  >
                    {user ? 'Add to Cart' : 'Login to Buy'}
                  </button>
                </div>
              ))
          )}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="customer-reviews" id="reviews">
        <h2>Customer Reviews ⭐⭐⭐⭐⭐</h2>
        <div className="reviews-grid">
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="stars">{'⭐'.repeat(review.rating)}</div>
              <p className="review-text">"{review.text}"</p>
              <p className="reviewer-name">- {review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <h2>Why Trust Us?</h2>
        <div className="trust-badges">
          <div className="badge">
            <div className="badge-icon">👥</div>
            <div>10,000+ Happy Customers</div>
          </div>
          <div className="badge">
            <div className="badge-icon">✨</div>
            <div>100% Authentic Products</div>
          </div>
          <div className="badge">
            <div className="badge-icon">🔒</div>
            <div>Secure Payment</div>
          </div>
          <div className="badge">
            <div className="badge-icon">📞</div>
            <div>24/7 Customer Support</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About BuyFastBD</h4>
            <p>Your trusted online shopping destination in Bangladesh</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#facebook">📘 Facebook</a>
              <a href="#instagram">📷 Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 BuyFastBD. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSignUp={() => {
            setShowLoginModal(false)
            setCurrentPage('user-signup')
          }}
        />
      )}
    </div>
  )
}
