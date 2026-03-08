import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

export default function ToolCard({ tool }) {
  const category = categories.find((c) => c.slug === tool.category)

  return (
    <Link to={`/tool/${tool.slug}`} className="tool-card">
      {tool.priority === 'core' && <div className="tool-card-priority tool-card-priority--core" />}
      <div className="tool-card-header">
        <span className="tool-card-icon">{tool.icon}</span>
        <span className={`tool-card-status tool-card-status--${tool.status}`}>
          {tool.status === 'active' ? 'ACTIVE' : 'COMING SOON'}
        </span>
      </div>
      <h3 className="tool-card-name">{tool.name}</h3>
      <p className="tool-card-desc">{tool.description}</p>
      {tool.invokeHint && (
        <div className="tool-card-invoke">{tool.invokeHint}</div>
      )}
      <div className="tool-card-footer">
        <span className="tool-card-category" style={{ '--cat-color': category?.color || '#e63329' }}>
          {category?.name}
        </span>
        <span className="tool-card-arrow">{'\u2192'}</span>
      </div>
    </Link>
  )
}
