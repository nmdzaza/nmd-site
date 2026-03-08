const colorMap = {
  'SENT': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  'REPLIED': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'NO EMAIL': { bg: 'var(--gray-bg)', color: 'var(--gray)' },
  'ACTIVE': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'CONTACTED': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  'TO CONTACT': { bg: 'var(--gray-bg)', color: 'var(--gray)' },
  'DEAD': { bg: 'var(--red-bg)', color: 'var(--red)' },
  'PITCHED': { bg: 'var(--yellow-bg)', color: 'var(--yellow)' },
  'CLEAR': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'CLEAR TITLE': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'MORTGAGE': { bg: 'var(--yellow-bg)', color: 'var(--yellow)' },
  'LIEN': { bg: 'var(--red-bg)', color: 'var(--red)' },
  'A+': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'A': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'B+': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  'B': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  'C': { bg: 'var(--gray-bg)', color: 'var(--gray)' },
  'HIGH': { bg: 'var(--red-bg)', color: 'var(--red)' },
  'MEDIUM': { bg: 'var(--yellow-bg)', color: 'var(--yellow)' },
  'LOW': { bg: 'var(--gray-bg)', color: 'var(--gray)' },
}

export default function StatusBadge({ status }) {
  if (!status) return null
  const upper = status.toUpperCase().trim()
  const colors = colorMap[upper] || { bg: 'var(--gray-bg)', color: 'var(--gray)' }
  return (
    <span
      className="status-badge"
      style={{ background: colors.bg, color: colors.color }}
    >
      {status}
    </span>
  )
}
