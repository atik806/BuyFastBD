import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import '../styles/Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [removedToast, setRemovedToast] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/')
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('userCart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const saveCart = (updatedCart) => {
    localStorage.setItem('userCart', JSON.stringify(updatedCart))
    setCart(updatedCart)
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const handleRemoveFromCart = (productId, itemName) => {
    const updatedCart = cart.filter(item => item.id !== productId)
    saveCart(updatedCart)
    setRemovedToast(itemName || 'Item')
    setTimeout(() => setRemovedToast(null), 2500)
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      const item = cart.find(i => i.id === productId)
      handleRemoveFromCart(productId, item?.name)
    } else {
      const updatedCart = cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
      saveCart(updatedCart)
    }
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateDiscount = () => {
    return cart.reduce((total, item) => {
      const discount = item.discount ? (item.price * item.discount / 100) * item.quantity : 0
      return total + discount
    }, 0)
  }

  const calculateTotal = () => {
    return Math.round(calculateSubtotal() - calculateDiscount())
  }

  const getItemLineTotal = (item) => {
    const discountedPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price
    return Math.round(discountedPrice * item.quantity)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }
    navigate('/checkout', { state: { cart, subtotal: calculateSubtotal(), discount: calculateDiscount(), total: calculateTotal() } })
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          ← Continue shopping
        </button>
        <h1>🛒 Your cart</h1>
        {cart.length > 0 && (
          <span className="cart-header-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        )}
        <div className="header-spacer"></div>
      </header>

      {removedToast && (
          <div className="cart-toast" role="status">
            “{removedToast}” removed from cart
          </div>
        )}

      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add items from the shop and they’ll show up here. You can then checkout with Cash on Delivery.</p>
            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              Browse products
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              <h2>Order Summary ({cart.length} items)</h2>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <Link to={`/product/${item.id}`} className="item-image-wrap" onClick={(e) => e.stopPropagation()}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="item-image-img" />
                      ) : (
                        <div className="item-image">📦</div>
                      )}
                    </Link>
                    <div className="item-details">
                      <h3>
                        <Link to={`/product/${item.id}`} className="item-name-link">{item.name}</Link>
                      </h3>
                      {item.discount > 0 ? (
                        <>
                          <p className="item-price">৳{Math.round(item.price * (1 - item.discount / 100))} <span className="item-original-price">৳{item.price}</span></p>
                          <p className="item-discount">{item.discount}% OFF</p>
                        </>
                      ) : (
                        <p className="item-price">৳{item.price}</p>
                      )}
                    </div>
                    <div className="item-quantity">
                      <button type="button" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                        aria-label={`Quantity for ${item.name}`}
                      />
                      <button type="button" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <div className="item-total">
                      <p className="total-price">৳{getItemLineTotal(item)}</p>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        title="Remove from cart"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-box">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>৳{calculateSubtotal()}</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="summary-row discount">
                    <span>You save:</span>
                    <span>-৳{calculateDiscount()}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span className="free">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>৳{calculateTotal()}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="trust-section">
                <div className="trust-item">
                  <span>✅</span>
                  <span>100% Authentic Products</span>
                </div>
                <div className="trust-item">
                  <span>🔒</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="trust-item">
                  <span>🚚</span>
                  <span>Free Delivery</span>
                </div>
                <div className="trust-item">
                  <span>🔄</span>
                  <span>7-Day Returns</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="checkout-btn" onClick={handleCheckout}>
                💳 Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button className="continue-btn" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
