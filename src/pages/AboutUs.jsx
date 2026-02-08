import { useNavigate } from 'react-router-dom'
import '../styles/AboutUs.css'

export default function AboutUs() {
  const navigate = useNavigate()

  return (
    <div className="about-us">
      {/* Header */}
      <header className="about-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>About BuyFastBD</h1>
        <p className="tagline">Your Trusted Online Shopping Destination in Bangladesh</p>
      </header>

      {/* Main Content */}
      <div className="about-container">
        {/* Our Story */}
        <section className="about-section">
          <h2>📖 Our Story</h2>
          <p>
            BuyFastBD was founded with a simple mission: to make online shopping fast, reliable, and accessible to everyone in Bangladesh. We started as a small team with a big dream to revolutionize e-commerce in our country.
          </p>
          <p>
            Today, we've grown into a trusted platform serving thousands of customers across Bangladesh, offering a wide range of quality products at competitive prices.
          </p>
        </section>

        {/* Our Mission */}
        <section className="about-section">
          <h2>🎯 Our Mission</h2>
          <p>
            To provide a seamless, secure, and satisfying online shopping experience for every customer in Bangladesh. We believe in:
          </p>
          <ul className="mission-list">
            <li>✅ Quality products at fair prices</li>
            <li>✅ Fast and reliable delivery</li>
            <li>✅ Excellent customer service</li>
            <li>✅ Secure and transparent transactions</li>
            <li>✅ Supporting local businesses</li>
          </ul>
        </section>

        {/* Our Values */}
        <section className="about-section">
          <h2>💎 Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Trust</h3>
              <p>We build lasting relationships with our customers through transparency and reliability.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Speed</h3>
              <p>Fast delivery and quick customer service are at the heart of what we do.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💯</div>
              <h3>Quality</h3>
              <p>Every product is carefully selected and verified for quality before reaching you.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Excellence</h3>
              <p>We continuously strive to improve and exceed customer expectations.</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="about-section">
          <h2>🏆 Why Choose BuyFastBD?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <h3>Fast Delivery</h3>
              <p>2-3 days delivery across Bangladesh</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💵</span>
              <h3>Cash on Delivery</h3>
              <p>Pay when you receive - no risk</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <h3>Easy Returns</h3>
              <p>7-day hassle-free return policy</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📞</span>
              <h3>24/7 Support</h3>
              <p>Always here to help you</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <h3>Authentic Products</h3>
              <p>100% genuine items guaranteed</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h3>Secure Shopping</h3>
              <p>Your data is safe with us</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-section">
          <h2>👥 Our Team</h2>
          <p>
            We're a dedicated team of professionals passionate about delivering the best online shopping experience. From customer service to logistics, every team member is committed to your satisfaction.
          </p>
        </section>

        {/* Stats */}
        <section className="about-section stats-section">
          <h2>📊 By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <p className="stat-number">10,000+</p>
              <p className="stat-label">Happy Customers</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">50,000+</p>
              <p className="stat-label">Orders Delivered</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">5,000+</p>
              <p className="stat-label">Products Available</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">64</p>
              <p className="stat-label">Districts Covered</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h2>Ready to Shop?</h2>
          <p>Join thousands of satisfied customers and experience the BuyFastBD difference.</p>
          <button className="cta-btn" onClick={() => navigate('/')}>
            Start Shopping Now
          </button>
        </section>

        {/* Links */}
        <section className="about-links">
          <h3>Learn More</h3>
          <div className="links-grid">
            <button onClick={() => navigate('/contact')} className="link-btn">
              📧 Contact Us
            </button>
            <button onClick={() => navigate('/faq')} className="link-btn">
              ❓ FAQ
            </button>
            <button onClick={() => navigate('/')} className="link-btn">
              🏠 Home
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
