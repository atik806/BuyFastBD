import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc } from 'firebase/firestore'
import '../styles/Auth.css'

export default function AdminSetup({ onSetupComplete }) {
  const [email, setEmail] = useState('admin@buyfastbd.com')
  const [password, setPassword] = useState('admin123456')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Create admin user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Save admin data to Firestore
      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        email: user.email,
        role: 'admin',
        createdAt: new Date(),
      })

      setSuccess('✅ Admin account created successfully! You can now login.')
      setTimeout(() => {
        onSetupComplete()
      }, 2000)
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setSuccess('✅ Admin account already exists! You can now login.')
        setTimeout(() => {
          onSetupComplete()
        }, 2000)
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
        <h2>🔧 Admin Setup</h2>
        <p className="signup-subtitle">Create admin account for BuyFastBD</p>
        
        <form onSubmit={handleCreateAdmin}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="auth-note" style={{ marginTop: '20px', color: '#666' }}>
          This will create the admin account in Firebase. After creation, you can login with these credentials.
        </p>
      </div>
    </div>
  )
}
