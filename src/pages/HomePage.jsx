import { useNavigate } from 'react-router-dom'

export default function HomePage({ products, flashDeals, productsLoading, setCurrentPage }) {
  const navigate = useNavigate()

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
            <button 
              className="nav-auth-btn admin-btn"
              onClick={() => setCurrentPage('admin-login')}
            >
              👨‍💼 Admin
            </button>
            <button 
              className="nav-auth-btn user-btn"
              onClick={() => setCurrentPage('user-signup')}
            >
              👤 Sign Up
            </button>
            <button 
              className="nav-auth-btn guest-btn"
              onClick={() => setCurrentPage('home')}
            >
              🛒 Continue as Guest
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to BuyFastBD</h1>
          <p className="hero-tagline">Fast Delivery | Trusted Products | Cash on Delivery</p>
          <button className="shop-now-btn">🛒 Shop Now</button>
        </div>
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
                <button className="add-to-cart" onClick={(e) => { e.stopPropagation() }}>View Details</button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products" id="products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {productsLoading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>No products available yet</p>
          ) : (
            products
              .filter(product => !flashDeals.some(deal => deal.productId === product.id))
              .map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image">📦</div>
                  <h3>{product.name}</h3>
                  <p className="price">৳{product.price}</p>
                  <button className="buy-btn" onClick={(e) => { e.stopPropagation() }}>View Details</button>
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
          <div className="badge">✅ 10,000+ Happy Customers</div>
          <div className="badge">✅ 100% Authentic Products</div>
          <div className="badge">✅ Secure Payment</div>
          <div className="badge">✅ 24/7 Customer Support</div>
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
    </div>
  )
}
