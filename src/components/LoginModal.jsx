import '../styles/LoginModal.css'

export default function LoginModal({ onClose, onSignUp }) {
  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-content">
          <div className="modal-icon">🔐</div>
          <h2>Login Required</h2>
          <p>Please sign up to add items to cart and make purchases</p>
          
          <div className="modal-buttons">
            <button className="modal-btn signup-btn" onClick={onSignUp}>
              👤 Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
