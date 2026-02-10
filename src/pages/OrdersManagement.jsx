import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { generateOrderPDFDownload } from '../utils/generatePDF'
import '../styles/OrdersManagement.css'

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    setLoading(true)
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
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

    return () => unsubscribe()
  }, [])

  const handleAccept = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, { status: 'accepted' })
      alert('✅ Order accepted successfully!')
    } catch (err) {
      console.error('Error accepting order:', err)
      alert('❌ Error accepting order')
    }
  }

  const handleCancel = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, { status: 'cancelled' })
      alert('✅ Order cancelled successfully!')
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert('❌ Error cancelling order')
    }
  }

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm('⚠️ Are you sure you want to permanently delete this order? This action cannot be undone.')
    if (!confirmDelete) return

    try {
      const orderRef = doc(db, 'orders', orderId)
      await deleteDoc(orderRef)
      alert('✅ Order deleted successfully!')
    } catch (err) {
      console.error('Error deleting order:', err)
      alert('❌ Error deleting order')
    }
  }

  const handleDownloadPDF = (order) => {
    generateOrderPDFDownload(order)
  }

  // Filter and search logic
  useEffect(() => {
    let result = [...orders]

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.userName.toLowerCase().includes(term) ||
        order.userEmail.toLowerCase().includes(term) ||
        order.phone.includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => (order.status || 'pending').toLowerCase() === statusFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const orderDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          orderDate.setHours(0, 0, 0, 0)
          result = result.filter(order => {
            const date = new Date(order.createdAt.toDate())
            date.setHours(0, 0, 0, 0)
            return date.getTime() === orderDate.getTime()
          })
          break
        case 'week':
          orderDate.setDate(now.getDate() - 7)
          result = result.filter(order => new Date(order.createdAt.toDate()) >= orderDate)
          break
        case 'month':
          orderDate.setMonth(now.getMonth() - 1)
          result = result.filter(order => new Date(order.createdAt.toDate()) >= orderDate)
          break
        default:
          break
      }
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()))
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt.toDate()) - new Date(b.createdAt.toDate()))
        break
      case 'highest':
        result.sort((a, b) => b.total - a.total)
        break
      case 'lowest':
        result.sort((a, b) => a.total - b.total)
        break
      default:
        break
    }

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
    setSortBy('newest')
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  return (
    <div className="orders-management">
      <div className="orders-header">
        <h2>📋 Orders Management</h2>
        <p className="orders-count">Total Orders: {orders.length} | Showing: {filteredOrders.length}</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search by Order ID, Name, Email, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date:</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="filter-select">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            ✕ Clear Filters
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>{searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? '❌ No orders match your filters' : '📭 No orders yet'}</p>
          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className={`order-row status-${(order.status || 'pending').toLowerCase()}`}>
                  <td className="order-id">{order.id.substring(0, 12)}...</td>
                  <td>{order.userName}</td>
                  <td>{order.userEmail}</td>
                  <td>{order.phone}</td>
                  <td className="total">৳{order.total || 0}</td>
                  <td>
                    <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="date">
                    {order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-accept"
                      onClick={() => handleAccept(order.id)}
                      disabled={order.status === 'accepted' || order.status === 'cancelled'}
                      title="Accept Order"
                    >
                      Accept
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(order.id)}
                      disabled={order.status === 'cancelled'}
                      title="Cancel Order"
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-download"
                      onClick={() => handleDownloadPDF(order)}
                      title="Download PDF"
                    >
                      Download
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(order.id)}
                      title="Delete Order Permanently"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
