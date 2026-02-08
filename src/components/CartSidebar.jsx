import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/CartSidebar.css'

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('userCart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveCartToStorage(cart) {
  localStorage.setItem('userCart', JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

export default function CartSidebar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('openCartSidebar', handler)
    return () => window.removeEventListener('openCartSidebar', handler)
  }, [])

  useEffect(() => {
    const handler = () => setCart(loadCartFromStorage())
    setCart(loadCartFromStorage())
    window.addEventListener('cartUpdated', handler)
    return () => window.removeEventListener('cartUpdated', handler)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setCart(loadCartFromStorage())
      document.body.classList.add('cart-sidebar-open')
    } else {
      document.body.classList.remove('cart-sidebar-open')
    }
    return () => document.body.classList.remove('cart-sidebar-open')
  }, [isOpen])

  const saveCart = (updatedCart) => {
    saveCartToStorage(updatedCart)
    setCart(updatedCart)
  }

  const handleRemove = (productId) => {
    saveCart(cart.filter(item => item.id !== productId))
  }

  const handleQuantity = (productId, quantity) => {
    if (quantity < 1) {
      saveCart(cart.filter(item => item.id !== productId))
      return
    }
    saveCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const getItemLineTotal = (item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price
    return Math.round(price * item.quantity)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = cart.reduce((sum, item) => {
    if (!item.discount) return sum
    return sum + (item.price * item.discount / 100) * item.quantity
  }, 0)
  const total = Math.round(subtotal - discount)

  const handleClose = () => setIsOpen(false)

  const handleCheckout = () => {
    if (cart.length === 0) return
    handleClose()
    navigate('/checkout')
  }

  const handleViewCart = () => {
    handleClose()
    navigate('/cart')
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="cart-sidebar-overlay"
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className="cart-sidebar"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="cart-sidebar-header">
          <h2>Your cart</h2>
          <button
            type="button"
            className="cart-sidebar-close"
            onClick={handleClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-sidebar-body">
          {cart.length === 0 ? (
            <div className="cart-sidebar-empty">
              <p>Your cart is empty</p>
              <button type="button" className="cart-sidebar-btn secondary" onClick={handleClose}>
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="cart-sidebar-items">
                {cart.map(item => (
                  <li key={item.id} className="cart-sidebar-item">
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-sidebar-item-image"
                      onClick={handleClose}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                      ) : (
                        <span className="cart-sidebar-item-placeholder">📦</span>
                      )}
                    </Link>
                    <div className="cart-sidebar-item-details">
                      <Link
                        to={`/product/${item.id}`}
                        className="cart-sidebar-item-name"
                        onClick={handleClose}
                      >
                        {item.name}
                      </Link>
                      <div className="cart-sidebar-item-price">
                        ৳{getItemLineTotal(item)}
                        {item.discount > 0 && (
                          <span className="cart-sidebar-item-discount"> {item.discount}% OFF</span>
                        )}
                      </div>
                      <div className="cart-sidebar-item-actions">
                        <div className="cart-sidebar-qty">
                          <button
                            type="button"
                            onClick={() => handleQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-sidebar-remove"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-sidebar-summary">
              {discount > 0 && (
                <div className="cart-sidebar-row discount">
                  <span>You save</span>
                  <span>−৳{Math.round(discount)}</span>
                </div>
              )}
              <div className="cart-sidebar-row total">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
            </div>
            <button
              type="button"
              className="cart-sidebar-btn primary"
              onClick={handleCheckout}
            >
              Proceed to checkout
            </button>
            <button
              type="button"
              className="cart-sidebar-btn secondary"
              onClick={handleViewCart}
            >
              View full cart
            </button>
            <button
              type="button"
              className="cart-sidebar-btn secondary"
              onClick={handleClose}
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
