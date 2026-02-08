import { useState, useEffect } from 'react'
import logoImg from '../../image/logo.png'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import ProductManagement from './ProductManagement'
import OrdersManagement from './OrdersManagement'
import Analytics from './Analytics'
import '../styles/AdminDashboard.css'

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [flashDeals, setFlashDeals] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Real-time listener for products
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
    }, (err) => {
      console.error('Error fetching products:', err)
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

    // Real-time listener for orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrders(ordersData)
    }, (err) => {
      console.error('Error fetching orders:', err)
    })

    // Cleanup listeners on unmount
    return () => {
      unsubscribeProducts()
      unsubscribeDeals()
      unsubscribeOrders()
    }
  }, [])

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

  const handleUpdateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0)
  const totalOrdersCount = orders.length
  const totalProductsCount = products.length
  const totalFlashDealsCount = flashDeals.length
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1 className="admin-dashboard-logo-wrap"><img src={logoImg} alt="BuyFastBD" className="admin-dashboard-logo" /> Admin Panel</h1>
          <p>Welcome, {user.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Products
        </button>
        <button 
          className={`nav-tab ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          ⚡ Flash Deals ({totalFlashDealsCount})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Orders
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <p className="stat-label">Total Orders</p>
                  <p className="stat-value">{totalOrdersCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <p className="stat-label">Total Revenue</p>
                  <p className="stat-value">৳{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <p className="stat-label">Total Products</p>
                  <p className="stat-value">{totalProductsCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <p className="stat-label">Flash Deals</p>
                  <p className="stat-value">{totalFlashDealsCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <p className="stat-label">Total Stock</p>
                  <p className="stat-value">{totalStock}</p>
                </div>
              </div>
            </div>

            {orders.length > 0 && (
              <div className="recent-section">
                <h3>Recent Orders</h3>
                <div className="recent-orders">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="recent-order-item">
                      <div className="order-info">
                        <p className="order-id">{order.id}</p>
                        <p className="order-customer">{order.customerName || 'Guest'}</p>
                      </div>
                      <div className="order-amount">৳{order.amount || 0}</div>
                      <div className={`order-status ${(order.status || 'pending').toLowerCase()}`}>
                        {order.status || 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {/* Flash Deals Tab */}
        {activeTab === 'deals' && (
          <div className="tab-content">
            <h2>⚡ Flash Deals Management</h2>
            {flashDeals.length === 0 ? (
              <div className="no-data">
                <p>No flash deals yet. Add products from the Products tab!</p>
              </div>
            ) : (
              <div className="flash-deals-grid">
                {flashDeals.map(deal => (
                  <div key={deal.id} className="flash-deal-card">
                    <div className="deal-card-header">
                      <h3>{deal.productName}</h3>
                    </div>
                    <div className="deal-card-body">
                      <p className="deal-price">৳{deal.price}</p>
                      {deal.discount > 0 && (
                        <p className="deal-discount">{deal.discount}% OFF</p>
                      )}
                      {deal.description && (
                        <p className="deal-desc">{deal.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <OrdersManagement />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Analytics />
        )}
      </div>
    </div>
  )
}
