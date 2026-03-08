import { Activity } from 'lucide-react'
import skillRuns from '../data/live/skillRuns.js'
import StatusBadge from './StatusBadge'

export default function RecentActivity({ limit = 5 }) {
  // Sort by timestamp descending, take last N
  const recent = [...skillRuns]
    .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
    .slice(0, limit)

  if (recent.length === 0) {
    return (
      <section className="dash-section activity-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">
            <Activity size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
            Recent Activity
          </h2>
        </div>
        <div className="activity-empty">No skill runs yet. Launch a skill to see activity here.</div>
      </section>
    )
  }

  return (
    <section className="dash-section activity-section">
      <div className="dash-section-header">
        <h2 className="dash-section-title">
          <Activity size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
          Recent Activity
        </h2>
      </div>
      <div className="activity-list">
        {recent.map((run, i) => {
          const time = run.timestamp ? new Date(run.timestamp) : null
          const timeStr = time
            ? time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
              ' ' +
              time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : '--'
          const skillName = (run.skill || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          return (
            <div key={i} className="activity-item">
              <span className="activity-time">{timeStr}</span>
              <span className="activity-skill">{skillName}</span>
              {run.inputs && <span className="activity-inputs">{run.inputs}</span>}
              <StatusBadge status={run.status || 'LAUNCHED'} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
