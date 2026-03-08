import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`} className="category-card" style={{ '--cat-color': category.color }}>
      <div className="category-card-icon">{category.icon}</div>
      <h3 className="category-card-name">{category.name}</h3>
      <p className="category-card-desc">{category.description}</p>
      <div className="category-card-footer">
        <span className="category-card-count">{category.toolCount} tools</span>
        <span className="category-card-arrow">{'\u2192'}</span>
      </div>
    </Link>
  )
}
