import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link to={`/tool/${tool.slug}`} className="tool-card">
      <div className="tool-card-header">
        <span className="tool-card-icon">{tool.icon}</span>
        <span className={`tool-card-status tool-card-status--${tool.status}`}>
          {tool.status === 'active' ? 'ACTIVE' : 'COMING SOON'}
        </span>
      </div>
      <h3 className="tool-card-name">{tool.name}</h3>
      <p className="tool-card-desc">{tool.description}</p>
      <div className="tool-card-footer">
        <span className="tool-card-price">${tool.price}</span>
        <span className="tool-card-arrow">{'\u2192'}</span>
      </div>
    </Link>
  )
}
