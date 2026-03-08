import { DollarSign, TrendingUp, Hash } from 'lucide-react'
import deals from '../data/live/deals.js'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'

const columns = [
  { key: 'Priority', label: '#', sortable: true },
  { key: 'Decedent', label: 'Decedent', sortable: true },
  { key: 'Property_Address', label: 'Property', sortable: true },
  { key: 'Executor', label: 'Executor' },
  { key: 'Lien_Status', label: 'Lien', sortable: true, format: 'badge' },
  { key: 'ARV', label: 'ARV', sortable: true, format: 'currency' },
  { key: 'MAO', label: 'MAO', sortable: true, format: 'currency' },
  { key: 'Spread', label: 'Spread', sortable: true, format: 'currency' },
  { key: 'Deal_Grade', label: 'Grade', sortable: true, format: 'badge' },
  { key: 'Stage', label: 'Stage', format: 'badge' },
]

function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K'
  return '$' + n.toLocaleString()
}

export default function Pipeline() {
  const totalARV = deals.reduce((s, d) => s + parseFloat(String(d.ARV).replace(/[$,]/g, '') || 0), 0)
  const totalSpread = deals.reduce((s, d) => s + parseFloat(String(d.Spread).replace(/[$,]/g, '') || 0), 0)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Deal Pipeline</h1>
        <p className="page-subtitle">{deals.length} active deals</p>
      </div>
      <div className="stat-row">
        <StatCard icon={DollarSign} label="Total ARV" value={fmt(totalARV)} />
        <StatCard icon={TrendingUp} label="Total Spread" value={fmt(totalSpread)} accent />
        <StatCard icon={Hash} label="Deals" value={deals.length} />
      </div>
      <DataTable columns={columns} data={deals} defaultSort={{ key: 'Priority', direction: 'asc' }} />
    </div>
  )
}
