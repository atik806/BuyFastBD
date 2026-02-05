import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import '../styles/Auth.css'

export default function AdminLogin({ onLoginSuccess, onSetupNeeded }) {
  const [email, setEmail] = useState('admin@buyfastbd.com')
  const [password, setPassword] = useState('admin123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Store admin role in localStorage
      localStorage.setItem('userRole', 'admin')
      localStorage.setItem('userId', user.uid)
      
      onLoginSuccess(user, 'admin')
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Admin account not found. Please create it first.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Login</h2>
        <p className="demo-note">Demo Credentials:</p>
        <p className="demo-creds">Email: admin@buyfastbd.com</p>
        <p className="demo-creds">Password: admin123456</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button 
          onClick={onSetupNeeded}
          className="skip-btn"
        >
          🔧 Create Admin Account
        </button>
      </div>
    </div>
  )
}
