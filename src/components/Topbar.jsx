import { Menu } from 'lucide-react'
import meta from '../data/live/meta.js'

export default function Topbar({ onMenuClick }) {
  const synced = new Date(meta.lastSynced)
  const timeStr = synced.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="topbar-info">
          <span className="topbar-name">Cameron Johnson</span>
          <span className="topbar-territory">Maricopa County</span>
        </div>
      </div>
      <div className="topbar-right">
        <span className="topbar-sync">Synced {timeStr}</span>
      </div>
    </header>
  )
}
