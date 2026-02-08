import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Contact.css'

export default function Contact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields')
      return
    }
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="contact">
      {/* Header */}
      <header className="contact-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>Contact Us</h1>
        <p className="tagline">We'd love to hear from you. Get in touch with us today!</p>
      </header>

      <div className="contact-container">
        {/* Contact Info */}
        <section className="contact-info-section">
          <h2>Get In Touch</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>Dhaka, Bangladesh</p>
              <p className="info-desc">Serving all 64 districts</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone</h3>
              <p>+880 1234-567890</p>
              <p className="info-desc">Available 24/7</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>support@buyfastbd.com</p>
              <p className="info-desc">Response within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Business Hours</h3>
              <p>24/7 Online Support</p>
              <p className="info-desc">Always available for you</p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              ✅ Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </section>

        {/* FAQ Link */}
        <section className="contact-faq">
          <h2>Have Questions?</h2>
          <p>Check out our FAQ section for quick answers to common questions.</p>
          <button onClick={() => navigate('/faq')} className="faq-link-btn">
            ❓ Visit FAQ
          </button>
        </section>

        {/* Social Links */}
        <section className="contact-social">
          <h2>Follow Us</h2>
          <div className="social-links">
            <a href="#facebook" className="social-btn">📘 Facebook</a>
            <a href="#instagram" className="social-btn">📷 Instagram</a>
            <a href="#twitter" className="social-btn">🐦 Twitter</a>
            <a href="#youtube" className="social-btn">📺 YouTube</a>
          </div>
        </section>

        {/* Navigation */}
        <section className="contact-nav">
          <h3>More Information</h3>
          <div className="nav-links">
            <button onClick={() => navigate('/')} className="nav-btn">
              🏠 Home
            </button>
            <button onClick={() => navigate('/about')} className="nav-btn">
              ℹ️ About Us
            </button>
            <button onClick={() => navigate('/faq')} className="nav-btn">
              ❓ FAQ
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
