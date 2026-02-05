export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'gadgets', name: 'Gadgets & Accessories', icon: '🔌' },
    { id: 'fashion', name: 'Fashion / Lifestyle', icon: '👕' },
    { id: 'pets', name: 'Pet Products', icon: '🐶' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠' },
    { id: 'trending', name: 'Trending Items', icon: '💡' },
  ]

  return (
    <div className="category-filter">
      <h3>Shop by Category</h3>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
