import { useState } from 'react'
import '../styles/SearchBar.css'

export default function SearchBar({ products, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🛍️' },
    { id: 'gadgets', name: 'Gadgets & Accessories', icon: '🔌' },
    { id: 'fashion', name: 'Fashion / Lifestyle', icon: '👕' },
    { id: 'pets', name: 'Pet Products', icon: '🐶' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠' },
    { id: 'trending', name: 'Trending Items', icon: '💡' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const results = products.filter(product => {
      const matchesQuery = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || 
                             (product.category && product.category.toLowerCase() === selectedCategory)
      return matchesQuery && matchesCategory
    })
    onSearch(results, searchQuery, selectedCategory)
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setIsDropdownOpen(false)
    // Trigger search with new category
    setTimeout(() => {
      const results = products.filter(product => {
        const matchesQuery = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCategory = categoryId === 'all' || 
                               (product.category && product.category.toLowerCase() === categoryId)
        return matchesQuery && matchesCategory
      })
      onSearch(results, searchQuery, categoryId)
    }, 0)
  }

  const currentCategory = categories.find(cat => cat.id === selectedCategory)

  return (
    <form className="search-bar-container" onSubmit={handleSearch}>
      <div className="category-dropdown">
        <button
          type="button"
          className={`category-toggle ${isDropdownOpen ? 'open' : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onMouseEnter={() => setIsDropdownOpen(true)}
        >
          <span className="category-option-icon">{currentCategory?.icon}</span>
          <span>{currentCategory?.name}</span>
          <span className="category-toggle-icon">▼</span>
        </button>
        <div
          className={`category-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              className={`category-option ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className="category-option-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button type="submit" className="search-button">
        🔍 Search
      </button>
    </form>
  )
}
