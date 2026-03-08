import { metrics } from '../data/metrics'

export default function StatBar() {
  return (
    <div className="stat-bar">
      <div className="stat-item">
        <span className="stat-number">{metrics.leadsDelivered}</span>
        <span className="stat-label">Leads Delivered</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{metrics.activeClients}</span>
        <span className="stat-label">Active Clients</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{metrics.closedDeals}</span>
        <span className="stat-label">Closed Deals</span>
      </div>
      <div className="stat-item">
        <span className="stat-number stat-number--accent">{metrics.avgLeadScore}</span>
        <span className="stat-label">Avg Lead Score</span>
      </div>
    </div>
  )
}
