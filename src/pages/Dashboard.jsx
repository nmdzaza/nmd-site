import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { tools } from '../data/tools'
import { pinnedSlugs } from '../data/pinned'
import CategoryCard from '../components/CategoryCard'
import StatBar from '../components/StatBar'
import useReveal from '../hooks/useReveal'

export default function Dashboard() {
  const featuredRef = useReveal()
  const gridRef = useReveal()
  const pinnedRef = useReveal()

  const featured = categories.filter((c) => c.featured)
  const rest = categories.filter((c) => !c.featured)
  const pinnedTools = pinnedSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean)

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="dashboard-hero-eyebrow">NMD Solutions — Phoenix Metro</div>
        <h1 className="dashboard-title">Command Center</h1>
        <p className="dashboard-subtitle">
          {tools.length} active tools across {categories.length} categories. Maricopa County.
        </p>
      </div>

      <StatBar />

      <section className="dashboard-featured reveal-stagger" ref={featuredRef}>
        <h2 className="section-title">Primary Toolkits</h2>
        <div className="featured-row">
          {featured.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="featured-category-card"
              style={{ '--cat-color': cat.color }}
            >
              <div className="featured-category-top">
                <span className="featured-category-icon">{cat.icon}</span>
                <span className="featured-category-count">{cat.toolCount} tools</span>
              </div>
              <h3 className="featured-category-name">{cat.name}</h3>
              <p className="featured-category-desc">{cat.description}</p>
              {cat.why && <p className="featured-category-why">{cat.why}</p>}
            </Link>
          ))}
        </div>
      </section>

      <section className="pinned-tools reveal-stagger" ref={pinnedRef}>
        <h2 className="section-title">Quick Access</h2>
        <div className="pinned-strip">
          {pinnedTools.map((tool) => (
            <Link key={tool.slug} to={`/tool/${tool.slug}`} className="pinned-tool-card">
              <span className="pinned-tool-icon">{tool.icon}</span>
              <div className="pinned-tool-info">
                <span className="pinned-tool-name">{tool.name}</span>
                <span className="pinned-tool-invoke">{tool.invokeHint}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-categories">
        <h2 className="section-title">All Categories</h2>
        <div className="category-grid reveal-stagger" ref={gridRef}>
          {rest.map((cat) => (
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
    </div>
  )
}
