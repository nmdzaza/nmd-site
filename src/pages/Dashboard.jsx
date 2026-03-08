import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import CategoryCard from '../components/CategoryCard'
import StatBar from '../components/StatBar'
import useReveal from '../hooks/useReveal'

export default function Dashboard() {
  const gridRef = useReveal()
  const ctaRef = useReveal()

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1 className="dashboard-title">Your Command Center</h1>
        <p className="dashboard-subtitle">
          42 AI-powered tools to dominate your real estate market. Pick a category to get started.
        </p>
      </div>

      <StatBar />

      <section className="dashboard-categories">
        <h2 className="section-title">Tool Categories</h2>
        <div className="category-grid reveal-stagger" ref={gridRef}>
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
          <Link to="/coming-soon" className="category-card category-card--coming-soon" style={{ '--cat-color': '#f5a623' }}>
            <div className="category-card-icon">{'\uD83D\uDD2E'}</div>
            <h3 className="category-card-name">Coming Soon</h3>
            <p className="category-card-desc">6 new tools in development. AI dialer, IDX websites, predictive analytics, and more.</p>
            <div className="category-card-footer">
              <span className="category-card-count">6 upcoming</span>
              <span className="category-card-arrow">{'\u2192'}</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="dashboard-cta reveal" ref={ctaRef}>
        <div className="cta-box">
          <h2 className="cta-title">Get the Full Suite</h2>
          <p className="cta-text">All 42+ tools, unlimited use, territory included. One price, no recurring fees.</p>
          <Link to="/pricing" className="cta-button">View Pricing {'\u2192'}</Link>
        </div>
      </section>
    </div>
  )
}
