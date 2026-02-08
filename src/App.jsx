import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminSetup from './pages/AdminSetup'
import UserSignup from './pages/UserSignup'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import HomePage from './pages/HomePage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import CartSidebar from './components/CartSidebar'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [flashDeals, setFlashDeals] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const role = localStorage.getItem('userRole')
        setUserRole(role)
        setCurrentPage('dashboard')
      } else {
        setUser(null)
        setUserRole(null)
        setCurrentPage('home')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Set up real-time listeners for products and flash deals
  useEffect(() => {
    setProductsLoading(true)

    // Real-time listener for products
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
      setProductsLoading(false)
    }, (err) => {
      console.error('Error fetching products:', err)
      setProductsLoading(false)
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

    // Cleanup listeners on unmount
    return () => {
      unsubscribeProducts()
      unsubscribeDeals()
    }
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (user && userRole === 'admin') {
    return <Dashboard user={user} role="admin" onLogout={() => setUser(null)} />
  }

  // Logged-in users (role 'user') stay in Routes so they can browse products, view product detail, and buy

  if (currentPage === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(user, role) => {
          setUser(user)
          setUserRole(role)
          setCurrentPage('dashboard')
        }}
        onSetupNeeded={() => setCurrentPage('admin-setup')}
      />
    )
  }

  if (currentPage === 'admin-setup') {
    return (
      <AdminSetup
        onSetupComplete={() => setCurrentPage('admin-login')}
      />
    )
  }

  if (currentPage === 'user-signup') {
    return (
      <UserSignup
        onSignupSuccess={(user, role) => {
          setUser(user)
          setUserRole(role)
          setCurrentPage('dashboard')
        }}
        onSkip={() => setCurrentPage('home')}
      />
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage products={products} flashDeals={flashDeals} productsLoading={productsLoading} setCurrentPage={setCurrentPage} user={user} />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/signup" element={<UserSignup onSignupSuccess={(u, role) => { setUser(u); setUserRole(role); }} onSkip={() => {}} />} />
      </Routes>
      <CartSidebar />
    </>
  )
}
