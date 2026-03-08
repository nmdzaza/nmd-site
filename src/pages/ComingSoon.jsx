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
          These tools are being built and will integrate directly into the NMD Solutions skill library.
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
        <h2>In Development</h2>
        <p>New tools ship as Claude CLI skills — ready to use the moment they launch.</p>
        <Link to="/" className="btn btn--secondary">{'\u2190'} Back to Dashboard</Link>
      </section>
    </div>
  )
}
