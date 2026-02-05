import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import '../styles/ProductDetail.css'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetchProduct()
    loadCart()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, 'products', productId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProduct({
          id: docSnap.id,
          ...docSnap.data()
        })
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item.id === product.id)
    let updatedCart

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      updatedCart = [...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: quantity
      }]
    }

    saveCart(updatedCart)
    alert(`✅ Added ${quantity} item(s) to cart!`)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  if (loading) {
    return <div className="loading">Loading product...</div>
  }

  if (!product) {
    return <div className="loading">Product not found</div>
  }

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const savings = product.discount
    ? product.price - discountedPrice
    : 0

  // Mock images and reviews
  const productImages = [
    '📦', '📦', '📦', '📦', '📦'
  ]

  const reviews = [
    { name: 'Fatima Ahmed', rating: 5, text: 'Excellent quality! Delivered on time.' },
    { name: 'Karim Hassan', rating: 5, text: 'Best product for the price. Highly recommend!' },
    { name: 'Nadia Khan', rating: 4, text: 'Good product, fast delivery.' },
  ]

  return (
    <div className="product-detail">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      <div className="product-container">
        {/* Image Gallery */}
        <div className="image-section">
          <div className="main-image">
            <div className="image-placeholder">{productImages[selectedImage]}</div>
          </div>
          <div className="thumbnail-gallery">
            {productImages.map((img, idx) => (
              <div
                key={idx}
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                {img}
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>

          {/* Rating */}
          <div className="rating">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="review-count">(127 reviews)</span>
          </div>

          {/* Price Section */}
          <div className="price-section">
            <div className="price-display">
              <span className="current-price">৳{discountedPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="original-price">৳{product.price}</span>
                  <span className="discount-badge">{product.discount}% OFF</span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p className="savings">You save ৳{savings}</p>
            )}
          </div>

          {/* Stock Urgency */}
          <div className="stock-section">
            <div className={`stock-status ${product.stock < 20 ? 'low' : 'high'}`}>
              {product.stock < 20 ? (
                <>
                  <span className="urgency-icon">⚠️</span>
                  <span>Only {product.stock} left in stock!</span>
                </>
              ) : (
                <>
                  <span className="urgency-icon">✅</span>
                  <span>In Stock ({product.stock} available)</span>
                </>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="delivery-section">
            <div className="delivery-item">
              <span className="delivery-icon">🚚</span>
              <div>
                <p className="delivery-label">Delivery Time</p>
                <p className="delivery-value">2-3 days</p>
              </div>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">💵</span>
              <div>
                <p className="delivery-label">Payment Method</p>
                <p className="delivery-value">Cash on Delivery</p>
              </div>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">🔄</span>
              <div>
                <p className="delivery-label">Easy Returns</p>
                <p className="delivery-value">7 days</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="description-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              💳 Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="badge">✅ 100% Authentic</div>
            <div className="badge">✅ Secure Payment</div>
            <div className="badge">✅ 24/7 Support</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-container">
          {reviews.map((review, idx) => (
            <div key={idx} className="review-item">
              <div className="review-header">
                <span className="reviewer-name">{review.name}</span>
                <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Buy Button */}
      <div className="sticky-buy-section">
        <div className="sticky-content">
          <div className="sticky-price">
            <span className="label">Price:</span>
            <span className="price">৳{discountedPrice}</span>
          </div>
          <button className="sticky-buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
