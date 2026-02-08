import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FAQ.css'

export default function FAQ() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState(null)

  const faqs = [
    {
      id: 1,
      category: 'Ordering',
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout. Fill in your delivery address and confirm your order. You\'ll receive an order confirmation via email.'
    },
    {
      id: 2,
      category: 'Ordering',
      question: 'Do I need to create an account to shop?',
      answer: 'Yes, you need to sign up for an account to place orders. This helps us track your orders and provide better customer service.'
    },
    {
      id: 3,
      category: 'Ordering',
      question: 'What payment methods do you accept?',
      answer: 'We currently accept Cash on Delivery (COD). You can pay when you receive your order. No advance payment is required.'
    },
    {
      id: 4,
      category: 'Delivery',
      question: 'How long does delivery take?',
      answer: 'We deliver within 2-3 days across Bangladesh. Delivery time may vary depending on your location and current order volume.'
    },
    {
      id: 5,
      category: 'Delivery',
      question: 'Do you deliver to all areas in Bangladesh?',
      answer: 'Yes, we deliver to all 64 districts in Bangladesh. However, delivery times may vary for remote areas.'
    },
    {
      id: 6,
      category: 'Delivery',
      question: 'Can I track my order?',
      answer: 'Yes, you can track your order status in your account dashboard. You\'ll also receive updates via email.'
    },
    {
      id: 7,
      category: 'Returns & Refunds',
      question: 'What is your return policy?',
      answer: 'We offer a 7-day hassle-free return policy. If you\'re not satisfied with your purchase, you can return it within 7 days for a full refund.'
    },
    {
      id: 8,
      category: 'Returns & Refunds',
      question: 'How do I return a product?',
      answer: 'Contact our customer service team with your order ID. We\'ll arrange a free pickup from your location and process your return.'
    },
    {
      id: 9,
      category: 'Returns & Refunds',
      question: 'How long does refund processing take?',
      answer: 'Refunds are processed within 5-7 business days after we receive and verify your returned item.'
    },
    {
      id: 10,
      category: 'Products',
      question: 'Are all products authentic?',
      answer: 'Yes, we guarantee 100% authentic products. Every item is carefully selected and verified before being listed on our platform.'
    },
    {
      id: 11,
      category: 'Products',
      question: 'What if I receive a damaged product?',
      answer: 'If you receive a damaged product, contact us immediately with photos. We\'ll replace it or provide a full refund at no cost to you.'
    },
    {
      id: 12,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your email.'
    },
    {
      id: 13,
      category: 'Account',
      question: 'Can I change my delivery address after placing an order?',
      answer: 'If your order hasn\'t been processed yet, you can contact us to change the address. Once processing has started, address changes may not be possible.'
    },
    {
      id: 14,
      category: 'Support',
      question: 'How can I contact customer support?',
      answer: 'You can reach us via email at support@buyfastbd.com or call +880 1234-567890. We\'re available 24/7 to help you.'
    },
    {
      id: 15,
      category: 'Support',
      question: 'What should I do if I have a complaint?',
      answer: 'Please contact our customer service team with details of your complaint. We take all feedback seriously and will work to resolve the issue quickly.'
    }
  ]

  const categories = ['All', ...new Set(faqs.map(faq => faq.category))]
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="faq">
      {/* Header */}
      <header className="faq-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>Frequently Asked Questions</h1>
        <p className="tagline">Find answers to common questions about BuyFastBD</p>
      </header>

      <div className="faq-container">
        {/* Category Filter */}
        <div className="category-filter">
          <h3>Filter by Category</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="faq-items">
          {filteredFaqs.map(faq => (
            <div key={faq.id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleExpand(faq.id)}
              >
                <span className="question-text">{faq.question}</span>
                <span className={`toggle-icon ${expandedId === faq.id ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedId === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <section className="faq-contact">
          <h2>Still Have Questions?</h2>
          <p>Can't find the answer you're looking for? Our customer service team is here to help.</p>
          <div className="contact-buttons">
            <button onClick={() => navigate('/contact')} className="contact-btn">
              📧 Contact Us
            </button>
            <button onClick={() => navigate('/about')} className="contact-btn">
              ℹ️ About Us
            </button>
          </div>
        </section>

        {/* Navigation */}
        <section className="faq-nav">
          <h3>Quick Links</h3>
          <div className="nav-links">
            <button onClick={() => navigate('/')} className="nav-btn">
              🏠 Home
            </button>
            <button onClick={() => navigate('/about')} className="nav-btn">
              ℹ️ About Us
            </button>
            <button onClick={() => navigate('/contact')} className="nav-btn">
              📧 Contact
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
