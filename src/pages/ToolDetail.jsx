import { useParams, Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { categories } from '../data/categories'
import Breadcrumb from '../components/Breadcrumb'

export default function ToolDetail() {
  const { slug } = useParams()
  const tool = tools.find((t) => t.slug === slug)

  if (!tool) {
    return <div className="not-found">Tool not found.</div>
  }

  const category = categories.find((c) => c.slug === tool.category)

  return (
    <div className="tool-detail">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: category?.name || 'Category', to: `/category/${tool.category}` },
        { label: tool.name },
      ]} />

      <div className="tool-detail-header">
        <div className="tool-detail-icon-wrap">
          <span className="tool-detail-icon">{tool.icon}</span>
        </div>
        <div className="tool-detail-meta">
          <h1 className="tool-detail-title">{tool.name}</h1>
          <p className="tool-detail-desc">{tool.description}</p>
          <div className="tool-detail-tags">
            <span className="tag tag--active">ACTIVE</span>
            <span className="tag tag--category" style={{ '--cat-color': category?.color || '#e63329' }}>
              {category?.name}
            </span>
            <span className="tag tag--price">${tool.price}</span>
          </div>
        </div>
      </div>

      <div className="tool-detail-grid">
        <section className="tool-detail-section">
          <h2 className="tool-detail-section-title">Use Cases</h2>
          <ul className="tool-detail-list">
            {tool.useCases.map((uc, i) => (
              <li key={i}>{uc}</li>
            ))}
          </ul>
        </section>

        <section className="tool-detail-section">
          <h2 className="tool-detail-section-title">How It Works</h2>
          <ol className="tool-detail-steps">
            {tool.howItWorks.map((step, i) => (
              <li key={i}>
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="tool-detail-section">
        <h2 className="tool-detail-section-title">Sample Output</h2>
        <div className="sample-output">
          {Object.entries(tool.sampleOutput).map(([key, val]) => (
            <div key={key} className="sample-row">
              <span className="sample-key">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
              <span className="sample-val">{val}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="tool-detail-actions">
        <Link to={`/category/${tool.category}`} className="btn btn--secondary">
          {'\u2190'} Back to {category?.name}
        </Link>
        <Link to="/pricing" className="btn btn--primary">
          View Pricing {'\u2192'}
        </Link>
      </div>
    </div>
  )
}
