import { Link } from 'react-router-dom'
import { comingSoon } from '../data/comingSoon'
import Breadcrumb from '../components/Breadcrumb'

export default function ComingSoon() {
  return (
    <div className="coming-soon-page">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: 'Coming Soon' },
      ]} />

      <div className="coming-soon-hero">
        <h1 className="coming-soon-title">Coming Soon</h1>
        <p className="coming-soon-subtitle">
          We're building the next wave of tools. Full Suite members get every new tool free when it launches.
        </p>
      </div>

      <div className="coming-soon-grid">
        {comingSoon.map((item) => (
          <div key={item.slug} className="coming-soon-card">
            <div className="coming-soon-card-header">
              <span className="coming-soon-card-icon">{item.icon}</span>
              <span className="coming-soon-card-eta">{item.eta}</span>
            </div>
            <h3 className="coming-soon-card-name">{item.name}</h3>
            <p className="coming-soon-card-desc">{item.description}</p>
            <div className="coming-soon-card-badge">IN DEVELOPMENT</div>
          </div>
        ))}
      </div>

      <section className="coming-soon-cta">
        <h2>Don't Miss Out</h2>
        <p>Full Suite members ($3,000) get every new tool added to their account free — as soon as it launches.</p>
        <Link to="/pricing" className="btn btn--primary">View Pricing {'\u2192'}</Link>
      </section>
    </div>
  )
}
