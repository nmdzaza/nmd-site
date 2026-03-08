import { Link } from 'react-router-dom'
import { metrics, recentWins, profile } from '../data/metrics'
import Breadcrumb from '../components/Breadcrumb'
import useReveal from '../hooks/useReveal'

export default function Metrics() {
  const statsRef = useReveal()
  const winsRef = useReveal()
  const profileRef = useReveal()

  return (
    <div className="metrics-page">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: 'Metrics' },
      ]} />

      <div className="metrics-hero">
        <h1 className="metrics-title">Results Dashboard</h1>
        <p className="metrics-subtitle">
          Real numbers from real deals. Updated {metrics.lastUpdated}.
        </p>
      </div>

      <div className="metrics-stats reveal-stagger" ref={statsRef}>
        <div className="metrics-stat-card">
          <span className="metrics-stat-value">{metrics.leadsDelivered}</span>
          <span className="metrics-stat-label">Leads Delivered</span>
        </div>
        <div className="metrics-stat-card">
          <span className="metrics-stat-value">{metrics.activeClients}</span>
          <span className="metrics-stat-label">Active Clients</span>
        </div>
        <div className="metrics-stat-card">
          <span className="metrics-stat-value">{metrics.closedDeals}</span>
          <span className="metrics-stat-label">Deals Closed</span>
        </div>
        <div className="metrics-stat-card">
          <span className="metrics-stat-value metrics-stat-value--accent">{metrics.avgLeadScore}</span>
          <span className="metrics-stat-label">Avg Lead Score</span>
        </div>
      </div>

      <section className="metrics-wins reveal-stagger" ref={winsRef}>
        <h2 className="section-title">Recent Wins</h2>
        {recentWins.map((win, i) => (
          <div key={i} className="win-card">
            <div className="win-tool">{win.tool}</div>
            <div className="win-result">{win.result}</div>
            <div className="win-meta">{win.market} — {win.date}</div>
          </div>
        ))}
      </section>

      <section className="metrics-profile reveal" ref={profileRef}>
        <h2 className="section-title">About</h2>
        <div className="profile-card">
          <div className="profile-avatar">CJ</div>
          <div className="profile-info">
            <h3 className="profile-name">{profile.name}</h3>
            <div className="profile-brand">{profile.brand}</div>
            <div className="profile-territory">{profile.territory}</div>
            <p className="profile-tagline">{profile.tagline}</p>
            <div className="profile-contact">{profile.contact}</div>
            <div className="profile-since">Operating since {profile.since}</div>
          </div>
        </div>
      </section>

      <div className="metrics-footer">
        <Link to="/" className="btn btn--secondary">{'\u2190'} Back to Dashboard</Link>
      </div>
    </div>
  )
}
