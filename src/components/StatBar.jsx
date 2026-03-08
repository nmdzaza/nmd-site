import { tools } from '../data/tools'
import { categories } from '../data/categories'
import { comingSoon } from '../data/comingSoon'

export default function StatBar() {
  return (
    <div className="stat-bar">
      <div className="stat-item">
        <span className="stat-number">{tools.length}</span>
        <span className="stat-label">Active Tools</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{categories.length}</span>
        <span className="stat-label">Categories</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{tools.filter(t => t.category === 'lead-generation').length}</span>
        <span className="stat-label">Lead Types</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{comingSoon.length}</span>
        <span className="stat-label">Coming Soon</span>
      </div>
    </div>
  )
}
