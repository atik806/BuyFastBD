import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import AdminDashboard from './AdminDashboard'
import '../styles/Dashboard.css'

export default function Dashboard({ user, role, onLogout }) {
  if (role === 'admin') {
    return <AdminDashboard user={user} onLogout={onLogout} />
  }

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.displayName || user.email}!</h1>
        <p className="role-badge">👤 User</p>
      </div>

      <div className="dashboard-content">
        <div className="user-dashboard">
          <h2>Your Account</h2>
          <div className="user-info">
            {user.photoURL && (
              <img src={user.photoURL} alt="Profile" className="profile-pic" />
            )}
            <div className="info-details">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Type:</strong> User</p>
              <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="user-grid">
            <div className="user-card">
              <h3>🛒 My Orders</h3>
              <p>View your purchase history</p>
            </div>
            <div className="user-card">
              <h3>❤️ Wishlist</h3>
              <p>Your saved items</p>
            </div>
            <div className="user-card">
              <h3>⚙️ Settings</h3>
              <p>Manage your account</p>
            </div>
            <div className="user-card">
              <h3>💬 Support</h3>
              <p>Contact customer service</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        🚪 Logout
      </button>
    </div>
  )
}
