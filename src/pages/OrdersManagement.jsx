import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import '../styles/OrdersManagement.css'

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
    const pdfContent = `
ORDER RECEIPT
═══════════════════════════════════════════════════════════════

Order ID: ${order.id}
Date: ${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'N/A'}
Status: ${order.status || 'Pending'}

CUSTOMER INFORMATION
───────────────────────────────────────────────────────────────
Name: ${order.userName}
Email: ${order.userEmail}
Phone: ${order.phone}
Address: ${order.deliveryAddress}

ORDER ITEMS
───────────────────────────────────────────────────────────────
${order.items?.map((item, idx) => `
${idx + 1}. ${item.name}
   Quantity: ${item.quantity}
   Price: ৳${item.price}
   Subtotal: ৳${item.price * item.quantity}
`).join('')}

ORDER SUMMARY
───────────────────────────────────────────────────────────────
Subtotal: ৳${order.subtotal || 0}
Discount: -৳${order.discount || 0}
Delivery: Free
───────────────────────────────────────────────────────────────
TOTAL: ৳${order.total || 0}

PAYMENT METHOD
───────────────────────────────────────────────────────────────
${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}

ESTIMATED DELIVERY
───────────────────────────────────────────────────────────────
${order.estimatedDelivery ? new Date(order.estimatedDelivery.toDate()).toLocaleDateString() : '2-3 days'}

═══════════════════════════════════════════════════════════════
Thank you for your order!
BuyFastBD - Your trusted online shopping destination
═══════════════════════════════════════════════════════════════
    `

    const element = document.createElement('a')
    const file = new Blob([pdfContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `Order_${order.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  return (
    <div className="orders-management">
      <div className="orders-header">
        <h2>📋 Orders Management</h2>
        <p className="orders-count">Total Orders: {orders.length}</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet</p>
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
              {orders.map(order => (
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
