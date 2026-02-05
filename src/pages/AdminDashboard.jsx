import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import ProductManagement from './ProductManagement'
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
          <h1>🛍️ BuyFastBD Admin Panel</h1>
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
          <div className="tab-content">
            <h2>Order Management</h2>
            {orders.length === 0 ? (
              <div className="no-data">
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="order-id-cell">{order.id}</td>
                        <td>{order.customerName || 'Guest'}</td>
                        <td>৳{order.amount || 0}</td>
                        <td>
                          <select 
                            value={order.status || 'Pending'}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`status-select ${(order.status || 'pending').toLowerCase()}`}
                          >
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                        <td>{order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <button className="view-btn">👁️ View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <h2>Analytics & Reports</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Top Selling Products</h3>
                <div className="analytics-list">
                  {products.length === 0 ? (
                    <p className="no-data-text">No products yet</p>
                  ) : (
                    products.slice(0, 5).map(product => (
                      <div key={product.id} className="analytics-item">
                        <span>{product.name}</span>
                        <span className="sales-count">{product.sales || 0} sales</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="analytics-card">
                <h3>Order Status Distribution</h3>
                <div className="analytics-list">
                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map(status => (
                    <div key={status} className="analytics-item">
                      <span>{status}</span>
                      <span className="count">{orders.filter(o => (o.status || 'Pending') === status).length}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analytics-card">
                <h3>Revenue Summary</h3>
                <div className="revenue-summary">
                  <p>Total Revenue: <strong>৳{totalRevenue.toLocaleString()}</strong></p>
                  <p>Average Order: <strong>৳{totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount).toLocaleString() : '0'}</strong></p>
                  <p>Total Orders: <strong>{totalOrdersCount}</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
