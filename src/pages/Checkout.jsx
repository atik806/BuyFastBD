import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import '../styles/Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryLocation: 'inside',
    paymentMethod: 'cod'
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/')
      } else {
        setUser(currentUser)
        setFormData(prev => ({
          ...prev,
          fullName: currentUser.displayName || '',
          email: currentUser.email || ''
        }))
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    const savedCart = localStorage.getItem('userCart')
    if (savedCart) {
      const cartData = JSON.parse(savedCart)
      setCart(cartData)
      const cartTotal = cartData.reduce((total, item) => {
        const discountedPrice = item.discount
          ? item.price * (1 - item.discount / 100)
          : item.price
        return total + (discountedPrice * item.quantity)
      }, 0)
      const deliveryCost = formData.deliveryLocation === 'inside' ? 80 : 120
      setTotal(Math.round(cartTotal + deliveryCost))
    }
  }, [formData.deliveryLocation])

  const getItemLineTotal = (item) => {
    const discountedPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price
    return Math.round(discountedPrice * item.quantity)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name')
      return false
    }
    if (!formData.phone.trim()) {
      alert('Please enter your phone number')
      return false
    }
    if (!formData.address.trim()) {
      alert('Please enter your address')
      return false
    }
    if (!formData.city.trim()) {
      alert('Please enter your city')
      return false
    }
    if (!formData.postalCode.trim()) {
      alert('Please enter your postal code')
      return false
    }
    return true
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const deliveryCost = formData.deliveryLocation === 'inside' ? 80 : 120
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      const discount = cart.reduce((total, item) => {
        const disc = item.discount ? (item.price * item.discount / 100) * item.quantity : 0
        return total + disc
      }, 0)
      const totalWithDelivery = Math.round(subtotal - discount + deliveryCost)

      const order = {
        userId: user.uid,
        userEmail: user.email,
        userName: formData.fullName,
        items: cart,
        subtotal: subtotal,
        discount: discount,
        deliveryCost: deliveryCost,
        deliveryLocation: formData.deliveryLocation,
        total: totalWithDelivery,
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        phone: formData.phone,
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }

      const docRef = await addDoc(collection(db, 'orders'), order)
      setOrderId(docRef.id)
      setOrderPlaced(true)

      // Clear cart
      localStorage.removeItem('userCart')

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 5000)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Error placing order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!orderPlaced && cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add items from the shop to checkout</p>
          <button className="continue-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button className="back-btn" style={{ marginTop: '10px' }} onClick={() => navigate('/cart')}>
            View Cart
          </button>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          <div className="success-details">
            <p>Thank you for your purchase!</p>
            <p>Your order has been confirmed and will be delivered within 2-3 days.</p>
            <p>You will receive a confirmation email shortly.</p>
          </div>
          <div className="success-info">
            <div className="info-item">
              <span className="icon">📧</span>
              <span>Confirmation sent to {user.email}</span>
            </div>
            <div className="info-item">
              <span className="icon">🚚</span>
              <span>Estimated delivery: 2-3 days</span>
            </div>
            <div className="info-item">
              <span className="icon">💵</span>
              <span>Payment: Cash on Delivery</span>
            </div>
          </div>
          <button className="continue-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
        <h1>💳 Checkout</h1>
        <div className="header-spacer"></div>
      </header>

      <div className="checkout-container">
        {/* Checkout Form */}
        <div className="checkout-form-section">
          <form onSubmit={handlePlaceOrder}>
            {/* Delivery Address */}
            <div className="form-section">
              <h2>📍 Delivery Address</h2>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="Your email"
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Delivery Location *</label>
                <select
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="inside">Inside Dhaka (৳80)</option>
                  <option value="outside">Outside Dhaka (৳120)</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>💳 Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-info">
                    <span className="payment-name">💵 Cash on Delivery</span>
                    <span className="payment-desc">Pay when you receive your order</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Review */}
            <div className="form-section">
              <h2>📦 Order Review</h2>
              <div className="order-items">
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-price">৳{getItemLineTotal(item)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="place-order-btn"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : '✅ Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>

            {/* Items */}
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>৳{getItemLineTotal(item)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>৳{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
              </div>
              {cart.some(item => item.discount > 0) && (
                <div className="total-row discount">
                  <span>Discount:</span>
                  <span>-৳{cart.reduce((total, item) => {
                    const discount = item.discount ? (item.price * item.discount / 100) * item.quantity : 0
                    return total + discount
                  }, 0)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Delivery:</span>
                <span>৳{formData.deliveryLocation === 'inside' ? 80 : 120}</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>৳{total}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <span>🛡️</span>
                <span>100% Authentic</span>
              </div>
              <div className="badge">
                <span>🔒</span>
                <span>Secure</span>
              </div>
              <div className="badge">
                <span>🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="badge">
                <span>🔄</span>
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="delivery-info">
              <h3>📦 Delivery Details</h3>
              <div className="info-item">
                <span className="label">Estimated Delivery:</span>
                <span className="value">2-3 days</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Method:</span>
                <span className="value">Cash on Delivery</span>
              </div>
              <div className="info-item">
                <span className="label">Return Policy:</span>
                <span className="value">7 days hassle-free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
