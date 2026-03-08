import { Link } from 'react-router-dom'
import { DollarSign, TrendingUp, Target, Users, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import deals from '../data/live/deals.js'
import agents from '../data/live/agents.js'
import probate from '../data/live/probate.js'
import foreclosures from '../data/live/foreclosures.js'
import cashBuyers from '../data/live/cashBuyers.js'
import botStatus from '../data/live/botStatus.js'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import QuickActions from '../components/QuickActions'

function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + n.toLocaleString()
}

function num(val) {
  return parseFloat(String(val).replace(/[$,]/g, '') || 0)
}

export default function Dashboard() {
  const totalARV = deals.reduce((s, d) => s + num(d.ARV), 0)
  const totalSpread = deals.reduce((s, d) => s + num(d.Spread), 0)
  const sent = agents.filter((a) => a.Status === 'SENT').length
  const replied = agents.filter((a) => a.Status === 'REPLIED').length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const topDeals = [...deals]
    .sort((a, b) => num(a.Priority) - num(b.Priority))
    .slice(0, 5)

  const botKeys = [
    ['PIPELINE_LOADED', 'Pipeline Loaded'],
    ['COMPS_PULLED', 'Comps Pulled'],
    ['DEALS_ANALYZED', 'Deals Analyzed'],
    ['SKIP_TRACE_COMPLETED', 'Skip Traces'],
    ['MAILERS_GENERATED', 'Mailers Generated'],
    ['FULL_PIPELINE_COMPLETE', 'Pipeline Complete'],
  ]

  return (
    <div className="page">
      <div className="dash-header">
        <h1 className="dash-greeting">{greeting}</h1>
        <p className="dash-date">{dateStr}</p>
      </div>

      <div className="stat-row">
        <StatCard icon={DollarSign} label="Pipeline ARV" value={fmt(totalARV)} />
        <StatCard icon={TrendingUp} label="Total Spread" value={fmt(totalSpread)} accent />
        <StatCard icon={Target} label="Active Deals" value={deals.length} />
        <StatCard icon={Users} label="Agents Contacted" value={sent + replied} />
      </div>

      <QuickActions />

      <div className="dash-grid">
        <section className="dash-section">
          <div className="dash-section-header">
            <h2 className="dash-section-title">Top Deals</h2>
            <Link to="/pipeline" className="dash-section-link">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="mini-table-wrap">
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Decedent</th>
                  <th>Property</th>
                  <th>ARV</th>
                  <th>Spread</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {topDeals.map((d, i) => (
                  <tr key={i}>
                    <td>{d.Decedent}</td>
                    <td className="truncate">{d.Property_Address}</td>
                    <td>{fmt(num(d.ARV))}</td>
                    <td className="text-accent">{fmt(num(d.Spread))}</td>
                    <td><StatusBadge status={d.Deal_Grade} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dash-section">
          <div className="dash-section-header">
            <h2 className="dash-section-title">Lead Sources</h2>
            <Link to="/leads" className="dash-section-link">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="lead-counts">
            <Link to="/leads" className="lead-count-card">
              <span className="lead-count-num">{probate.length}</span>
              <span className="lead-count-label">Probate</span>
            </Link>
            <Link to="/leads" className="lead-count-card">
              <span className="lead-count-num">{foreclosures.length}</span>
              <span className="lead-count-label">Foreclosure</span>
            </Link>
            <Link to="/leads" className="lead-count-card">
              <span className="lead-count-num">{cashBuyers.length}</span>
              <span className="lead-count-label">Cash Buyers</span>
            </Link>
          </div>

          <div className="dash-section-header" style={{ marginTop: '1.5rem' }}>
            <h2 className="dash-section-title">Agent Outreach</h2>
            <Link to="/agents" className="dash-section-link">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="lead-counts">
            <div className="lead-count-card">
              <span className="lead-count-num">{agents.length}</span>
              <span className="lead-count-label">Total</span>
            </div>
            <div className="lead-count-card">
              <span className="lead-count-num">{sent}</span>
              <span className="lead-count-label">Emailed</span>
            </div>
            <div className="lead-count-card lead-count-card--accent">
              <span className="lead-count-num">{replied}</span>
              <span className="lead-count-label">Replied</span>
            </div>
          </div>

          <div className="dash-section-header" style={{ marginTop: '1.5rem' }}>
            <h2 className="dash-section-title">Bot Status</h2>
          </div>
          <div className="bot-status-grid">
            {botKeys.map(([key, label]) => {
              const val = botStatus[key]
              const active = val && val !== 'false' && val !== '0'
              return (
                <div key={key} className="bot-status-item">
                  {active ? <CheckCircle size={16} className="bot-check" /> : <XCircle size={16} className="bot-x" />}
                  <span className="bot-status-label">{label}</span>
                  {val && val !== 'true' && val !== 'false' && <span className="bot-status-val">{val}</span>}
                </div>
              )
            })}
          </div>
          {botStatus.LAST_MSG_PROCESSED && (
            <p className="bot-last-msg">Last activity: {botStatus.LAST_MSG_PROCESSED}</p>
          )}
        </section>
      </div>
    </div>
  )
}
