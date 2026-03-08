import { NavLink } from 'react-router-dom'
import { categories } from '../data/categories'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-logo">
        <span className="logo-text">NMD<span className="logo-dot">.</span>Solutions</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-icon">{'\uD83C\uDFE0'}</span>
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-section-label">Categories</div>
        {categories.map((cat) => (
          <NavLink
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="sidebar-link"
            onClick={onClose}
          >
            <span className="sidebar-icon">{cat.icon}</span>
            <span>{cat.name}</span>
            <span className="sidebar-badge">{cat.toolCount}</span>
          </NavLink>
        ))}

        <div className="sidebar-divider" />

        <NavLink to="/pricing" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-icon">{'\uD83D\uDCB0'}</span>
          <span>Pricing</span>
        </NavLink>

        <NavLink to="/coming-soon" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-icon">{'\uD83D\uDD2E'}</span>
          <span>Coming Soon</span>
          <span className="sidebar-badge sidebar-badge--new">6</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">NMD Solutions v1.0</div>
        <div className="sidebar-footer-text sidebar-footer-muted">42 tools. One platform.</div>
      </div>
    </aside>
  )
}
