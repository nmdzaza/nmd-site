import { useParams, useOutletContext } from 'react-router-dom'
import { categories } from '../data/categories'
import { tools } from '../data/tools'
import ToolCard from '../components/ToolCard'
import Breadcrumb from '../components/Breadcrumb'
import useReveal from '../hooks/useReveal'

export default function CategoryPage() {
  const { slug } = useParams()
  const { searchQuery } = useOutletContext()
  const category = categories.find((c) => c.slug === slug)
  const gridRef = useReveal()

  if (!category) {
    return <div className="not-found">Category not found.</div>
  }

  let categoryTools = tools.filter((t) => t.category === slug)

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    categoryTools = categoryTools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
  }

  return (
    <div className="category-page">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: category.name },
      ]} />

      <div className="category-page-header" style={{ '--cat-color': category.color }}>
        <span className="category-page-icon">{category.icon}</span>
        <div>
          <h1 className="category-page-title">{category.name}</h1>
          <p className="category-page-desc">{category.description}</p>
        </div>
        <span className="category-page-count">{categoryTools.length} tools</span>
      </div>

      <div className="tool-grid reveal-stagger" ref={gridRef}>
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {categoryTools.length === 0 && searchQuery && (
        <div className="empty-state">
          No tools match "{searchQuery}" in this category.
        </div>
      )}
    </div>
  )
}
