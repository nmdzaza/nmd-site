import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="bottom-nav-tab" end>
        <span className="bottom-nav-icon">{'\uD83C\uDFE0'}</span>
        <span className="bottom-nav-label">Home</span>
      </NavLink>
      <NavLink to="/category/lead-generation" className="bottom-nav-tab">
        <span className="bottom-nav-icon">{'\uD83C\uDFAF'}</span>
        <span className="bottom-nav-label">Tools</span>
      </NavLink>
      <NavLink to="/metrics" className="bottom-nav-tab">
        <span className="bottom-nav-icon">{'\uD83D\uDCC8'}</span>
        <span className="bottom-nav-label">Metrics</span>
      </NavLink>
      <NavLink to="/coming-soon" className="bottom-nav-tab">
        <span className="bottom-nav-icon">{'\uD83D\uDD2E'}</span>
        <span className="bottom-nav-label">Soon</span>
      </NavLink>
    </nav>
  )
}
