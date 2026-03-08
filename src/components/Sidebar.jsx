import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GitBranch, Target, Users, Wrench, Receipt } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/leads', icon: Target, label: 'Leads' },
  { to: '/agents', icon: Users, label: 'Agents' },
  { to: '/invoices', icon: Receipt, label: 'Invoices' },
  { to: '/skills', icon: Wrench, label: 'Skills' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar-brand">
        <span className="sidebar-logo">NMD</span>
        <span className="sidebar-brand-name">Solutions</span>
      </div>
      <nav className="sidebar-nav">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="sidebar-link"
            onClick={onClose}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-brand">NMD Solutions</div>
        <div className="sidebar-footer-territory">Phoenix, AZ</div>
      </div>
    </aside>
  )
}
