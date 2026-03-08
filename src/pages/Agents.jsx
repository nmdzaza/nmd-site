import { Users, Send, MessageCircle, AlertCircle } from 'lucide-react'
import agents from '../data/live/agents.js'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'

const columns = [
  { key: 'Name', label: 'Name', sortable: true },
  { key: 'Title', label: 'Title' },
  { key: 'Company', label: 'Company', sortable: true },
  { key: 'Phone', label: 'Phone' },
  { key: 'Email', label: 'Email', format: 'email' },
  { key: 'State', label: 'State', sortable: true },
  { key: 'Status', label: 'Status', sortable: true, format: 'badge' },
]

export default function Agents() {
  const sent = agents.filter((a) => a.Status === 'SENT').length
  const replied = agents.filter((a) => a.Status === 'REPLIED').length
  const noEmail = agents.filter((a) => a.Status === 'NO EMAIL').length

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Agents</h1>
        <p className="page-subtitle">{agents.length} total contacts</p>
      </div>
      <div className="stat-row">
        <StatCard icon={Users} label="Total" value={agents.length} />
        <StatCard icon={Send} label="Emailed" value={sent} />
        <StatCard icon={MessageCircle} label="Replied" value={replied} accent />
        <StatCard icon={AlertCircle} label="No Email" value={noEmail} />
      </div>
      <DataTable columns={columns} data={agents} defaultSort={{ key: 'Status', direction: 'asc' }} />
    </div>
  )
}
