import { useState } from 'react'
import { Search, AlertTriangle, Crosshair, BarChart3, FileText, Mail, MapPin, Phone } from 'lucide-react'
import SkillLauncher from './SkillLauncher'

const actions = [
  { slug: 'probate-hunter', name: 'Probate Hunter', description: 'Pull probate leads from court filings', icon: Search },
  { slug: 'foreclosure-tracker', name: 'Foreclosure Tracker', description: 'Find pre-foreclosure properties', icon: AlertTriangle },
  { slug: 'skip-tracer', name: 'Skip Tracer', description: 'Find contact info for any owner', icon: Crosshair },
  { slug: 'deal-analyzer', name: 'Deal Analyzer', description: 'Run the numbers on any deal', icon: BarChart3 },
  { slug: 'listing-generator', name: 'Listing Generator', description: 'Generate a full listing package', icon: FileText },
  { slug: 'email-campaign-engine', name: 'Email Campaign', description: 'Build drip campaigns and sequences', icon: Mail },
  { slug: 'market-report', name: 'Market Report', description: 'Branded report for any zip code', icon: MapPin },
  { slug: 'seller-pitch', name: 'Seller Pitch', description: 'Outreach scripts for every channel', icon: Phone },
]

export default function QuickActions() {
  const [activeSkill, setActiveSkill] = useState(null)

  return (
    <>
      <div className="quick-actions-header">
        <h2 className="dash-section-title">Quick Actions</h2>
      </div>
      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.slug}
              className="quick-action-card"
              onClick={() => setActiveSkill(action)}
            >
              <div className="quick-action-icon">
                <Icon size={20} />
              </div>
              <div className="quick-action-info">
                <span className="quick-action-name">{action.name}</span>
                <span className="quick-action-desc">{action.description}</span>
              </div>
            </button>
          )
        })}
      </div>

      {activeSkill && (
        <SkillLauncher
          skill={activeSkill}
          onClose={() => setActiveSkill(null)}
        />
      )}
    </>
  )
}
