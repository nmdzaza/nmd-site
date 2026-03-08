export default function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <Icon size={20} />
      </div>
      <div className="stat-card-value" style={accent ? { color: 'var(--accent)' } : undefined}>
        {value}
      </div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}
