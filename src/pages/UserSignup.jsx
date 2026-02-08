import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc } from 'firebase/firestore'
import '../styles/Auth.css'

export default function UserSignup({ onSignupSuccess, onSkip }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
        createdAt: new Date(),
      }, { merge: true })

      // Store user role in localStorage
      localStorage.setItem('userRole', 'user')
      localStorage.setItem('userId', user.uid)

      onSignupSuccess(user, 'user')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    onSkip()
    navigate('/', { replace: true })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>User Signup</h2>
        <p className="signup-subtitle">Sign up with your Google account to start shopping</p>
        
        {error && <p className="error-message">{error}</p>}
        
        <button 
          onClick={handleGoogleSignup} 
          disabled={loading} 
          className="google-btn"
        >
          {loading ? 'Signing up...' : '🔐 Sign up with Google'}
        </button>

        <p className="auth-note">
          We'll never post to Google without your permission
        </p>

        <div className="divider">OR</div>

        <button 
          onClick={handleSkip}
          className="skip-btn"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
