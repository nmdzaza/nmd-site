import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="breadcrumb-item">
          {i > 0 && <span className="breadcrumb-sep">/</span>}
          {item.to ? (
            <Link to={item.to} className="breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
