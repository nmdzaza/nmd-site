import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'

export default function Pricing() {
  return (
    <div className="pricing-page">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: 'Pricing' },
      ]} />

      <div className="pricing-hero">
        <h1 className="pricing-title">Simple, Transparent Pricing</h1>
        <p className="pricing-subtitle">No recurring fees. No contracts. No commission splits. Just tools that work.</p>
      </div>

      <div className="pricing-grid">
        <div className="price-card">
          <div className="price-card-header">
            <h3 className="price-card-name">Single Tool</h3>
            <div className="price-card-price">
              <span className="price-amount">$500</span>
              <span className="price-period">one-time</span>
            </div>
          </div>
          <ul className="price-features">
            <li>Pick any 1 tool from the catalog</li>
            <li>Unlimited use</li>
            <li>Setup + training included</li>
            <li>90-day support included</li>
          </ul>
          <div className="price-card-footer">
            <span className="price-per">Best for trying one tool</span>
          </div>
        </div>

        <div className="price-card price-card--featured">
          <div className="price-card-badge">MOST POPULAR</div>
          <div className="price-card-header">
            <h3 className="price-card-name">Pro Bundle</h3>
            <div className="price-card-price">
              <span className="price-amount">$1,500</span>
              <span className="price-period">one-time</span>
            </div>
          </div>
          <ul className="price-features">
            <li>Pick any 5 tools</li>
            <li>Unlimited use</li>
            <li>Save $1,000 vs buying individually</li>
            <li>Setup + training included</li>
            <li>90-day support included</li>
            <li>Priority support queue</li>
          </ul>
          <div className="price-card-footer">
            <span className="price-per">$300 per tool</span>
          </div>
        </div>

        <div className="price-card price-card--premium">
          <div className="price-card-badge">BEST VALUE</div>
          <div className="price-card-header">
            <h3 className="price-card-name">Full Suite</h3>
            <div className="price-card-price">
              <span className="price-amount">$3,000</span>
              <span className="price-period">one-time</span>
            </div>
          </div>
          <ul className="price-features">
            <li>ALL 42+ tools included</li>
            <li>Unlimited use forever</li>
            <li>Territory exclusivity included FREE</li>
            <li>Setup + training included</li>
            <li>90-day support included</li>
            <li>New tools added free as they launch</li>
            <li>VIP support</li>
          </ul>
          <div className="price-card-footer">
            <span className="price-per">~$71 per tool</span>
          </div>
        </div>
      </div>

      <section className="pricing-section">
        <h2 className="section-title">Individual Leads</h2>
        <div className="leads-pricing">
          <div className="lead-price-item">
            <span className="lead-price">$50</span>
            <span className="lead-desc">per verified lead with skip trace</span>
          </div>
          <div className="lead-price-item">
            <span className="lead-price">$150</span>
            <span className="lead-desc">Starter Pack — 5 leads, any type</span>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2 className="section-title">Add-Ons</h2>
        <div className="addons-grid">
          <div className="addon-card">
            <h4 className="addon-name">Territory Exclusivity</h4>
            <div className="addon-price">$200/month</div>
            <p className="addon-desc">Exclusive territory lock — one agent per city/zip per specialty. 90-day minimum. FREE with Full Suite.</p>
          </div>
          <div className="addon-card">
            <h4 className="addon-name">Ongoing Support</h4>
            <div className="addon-price">$100/month</div>
            <p className="addon-desc">Monthly support, updates, and new features as they drop. FREE for first 90 days with any bundle.</p>
          </div>
        </div>
      </section>

      <section className="pricing-cta">
        <h2>Ready to Get Started?</h2>
        <p>Choose your package and start generating leads in 24 hours.</p>
        <Link to="/" className="btn btn--primary">Browse All Tools {'\u2192'}</Link>
      </section>
    </div>
  )
}
