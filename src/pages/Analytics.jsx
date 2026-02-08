import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import '../styles/Analytics.css'

export default function Analytics() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // Fetch orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrders(ordersData)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching orders:', err)
      setLoading(false)
    })

    // Fetch products
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

    return () => {
      unsubscribeOrders()
      unsubscribeProducts()
    }
  }, [])

  // Calculate analytics
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const totalProducts = products.length

  // Order status breakdown
  const statusBreakdown = {
    pending: orders.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length,
    accepted: orders.filter(o => (o.status || 'pending').toLowerCase() === 'accepted').length,
    processing: orders.filter(o => (o.status || 'pending').toLowerCase() === 'processing').length,
    shipped: orders.filter(o => (o.status || 'pending').toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => (o.status || 'pending').toLowerCase() === 'delivered').length,
    cancelled: orders.filter(o => (o.status || 'pending').toLowerCase() === 'cancelled').length,
  }

  // Top selling products
  const topProducts = products
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5)

  // Revenue by status
  const revenueByStatus = {
    pending: orders
      .filter(o => (o.status || 'pending').toLowerCase() === 'pending')
      .reduce((sum, o) => sum + (o.total || 0), 0),
    accepted: orders
      .filter(o => (o.status || 'pending').toLowerCase() === 'accepted')
      .reduce((sum, o) => sum + (o.total || 0), 0),
    delivered: orders
      .filter(o => (o.status || 'pending').toLowerCase() === 'delivered')
      .reduce((sum, o) => sum + (o.total || 0), 0),
  }

  // Recent orders
  const recentOrders = orders.slice(0, 5)

  // Customer insights
  const uniqueCustomers = new Set(orders.map(o => o.userEmail)).size
  const totalItems = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0)

  if (loading) {
    return <div className="loading">Loading analytics...</div>
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Analytics & Reports</h2>
        <p className="analytics-subtitle">Real-time business insights</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <p className="metric-label">Total Orders</p>
            <p className="metric-value">{totalOrders}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <p className="metric-label">Total Revenue</p>
            <p className="metric-value">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <p className="metric-label">Average Order Value</p>
            <p className="metric-value">৳{averageOrderValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <p className="metric-label">Unique Customers</p>
            <p className="metric-value">{uniqueCustomers}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <p className="metric-label">Total Products</p>
            <p className="metric-value">{totalProducts}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛍️</div>
          <div className="metric-content">
            <p className="metric-label">Total Items Sold</p>
            <p className="metric-value">{totalItems}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Order Status Breakdown */}
        <div className="chart-card">
          <h3>Order Status Breakdown</h3>
          <div className="status-breakdown">
            <div className="status-item">
              <span className="status-label">Pending</span>
              <div className="status-bar">
                <div className="status-fill pending" style={{ width: `${totalOrders > 0 ? (statusBreakdown.pending / totalOrders) * 100 : 0}%` }}></div>
              </div>
              <span className="status-count">{statusBreakdown.pending}</span>
            </div>

            <div className="status-item">
              <span className="status-label">Accepted</span>
              <div className="status-bar">
                <div className="status-fill accepted" style={{ width: `${totalOrders > 0 ? (statusBreakdown.accepted / totalOrders) * 100 : 0}%` }}></div>
              </div>
              <span className="status-count">{statusBreakdown.accepted}</span>
            </div>

            <div className="status-item">
              <span className="status-label">Processing</span>
              <div className="status-bar">
                <div className="status-fill processing" style={{ width: `${totalOrders > 0 ? (statusBreakdown.processing / totalOrders) * 100 : 0}%` }}></div>
              </div>
              <span className="status-count">{statusBreakdown.processing}</span>
            </div>

            <div className="status-item">
              <span className="status-label">Shipped</span>
              <div className="status-bar">
                <div className="status-fill shipped" style={{ width: `${totalOrders > 0 ? (statusBreakdown.shipped / totalOrders) * 100 : 0}%` }}></div>
              </div>
              <span className="status-count">{statusBreakdown.shipped}</span>
            </div>

            <div className="status-item">
              <span className="status-label">Delivered</span>
              <div className="status-bar">
                <div className="status-fill delivered" style={{ width: `${totalOrders > 0 ? (statusBreakdown.delivered / totalOrders) * 100 : 0}%` }}></div>
              </div>
              <span className="status-count">{statusBreakdown.delivered}</span>
            </div>

            <div className="status-item">
              <span className="status-label">Cancelled</span>
              <div className="status-bar">
                <div className="status-fill cancelled" style={{ width: `${totalOrders > 0 ? (statusBreakdown.cancelled / totalOrders) * 100 : 0}%` }}></div>
              </div>
              <span className="status-count">{statusBreakdown.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Revenue by Status */}
        <div className="chart-card">
          <h3>Revenue by Status</h3>
          <div className="revenue-breakdown">
            <div className="revenue-item">
              <div className="revenue-label">
                <span className="label-text">Pending Orders</span>
                <span className="label-value">৳{revenueByStatus.pending.toLocaleString()}</span>
              </div>
              <div className="revenue-bar">
                <div className="revenue-fill" style={{ width: `${totalRevenue > 0 ? (revenueByStatus.pending / totalRevenue) * 100 : 0}%`, backgroundColor: '#ff9800' }}></div>
              </div>
            </div>

            <div className="revenue-item">
              <div className="revenue-label">
                <span className="label-text">Accepted Orders</span>
                <span className="label-value">৳{revenueByStatus.accepted.toLocaleString()}</span>
              </div>
              <div className="revenue-bar">
                <div className="revenue-fill" style={{ width: `${totalRevenue > 0 ? (revenueByStatus.accepted / totalRevenue) * 100 : 0}%`, backgroundColor: '#2196f3' }}></div>
              </div>
            </div>

            <div className="revenue-item">
              <div className="revenue-label">
                <span className="label-text">Delivered Orders</span>
                <span className="label-value">৳{revenueByStatus.delivered.toLocaleString()}</span>
              </div>
              <div className="revenue-bar">
                <div className="revenue-fill" style={{ width: `${totalRevenue > 0 ? (revenueByStatus.delivered / totalRevenue) * 100 : 0}%`, backgroundColor: '#4caf50' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="insights-grid">
        {/* Top Selling Products */}
        <div className="insight-card">
          <h3>🏆 Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="no-data">No products yet</p>
          ) : (
            <div className="products-list">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">{idx + 1}</div>
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-sales">{product.sales || 0} sales</p>
                  </div>
                  <p className="product-price">৳{product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="insight-card">
          <h3>📋 Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="no-data">No orders yet</p>
          ) : (
            <div className="orders-list">
              {recentOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <p className="order-customer">{order.userName}</p>
                    <p className="order-id">ID: {order.id.substring(0, 8)}...</p>
                  </div>
                  <div className="order-details">
                    <p className="order-amount">৳{order.total || 0}</p>
                    <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-section">
        <h3>📈 Summary Statistics</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <p className="summary-label">Conversion Rate</p>
            <p className="summary-value">{totalOrders > 0 ? ((statusBreakdown.delivered / totalOrders) * 100).toFixed(1) : 0}%</p>
            <p className="summary-desc">Delivered orders</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Cancellation Rate</p>
            <p className="summary-value">{totalOrders > 0 ? ((statusBreakdown.cancelled / totalOrders) * 100).toFixed(1) : 0}%</p>
            <p className="summary-desc">Cancelled orders</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Pending Orders</p>
            <p className="summary-value">{statusBreakdown.pending}</p>
            <p className="summary-desc">Awaiting action</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Avg Items/Order</p>
            <p className="summary-value">{totalOrders > 0 ? (totalItems / totalOrders).toFixed(1) : 0}</p>
            <p className="summary-desc">Items per order</p>
          </div>
        </div>
      </div>
    </div>
  )
}
