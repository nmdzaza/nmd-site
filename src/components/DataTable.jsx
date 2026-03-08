import { ChevronUp, ChevronDown } from 'lucide-react'
import useSort from '../hooks/useSort'
import StatusBadge from './StatusBadge'

export default function DataTable({ columns, data, defaultSort, emptyMessage = 'No data' }) {
  const { sorted, sortKey, sortDir, toggleSort } = useSort(
    data,
    defaultSort?.key || null,
    defaultSort?.direction || 'asc'
  )

  function renderCell(row, col) {
    const val = row[col.key]
    if (col.render) return col.render(val, row)
    if (col.format === 'currency') {
      const num = parseFloat(String(val).replace(/[$,]/g, ''))
      if (isNaN(num)) return val || '--'
      return '$' + num.toLocaleString()
    }
    if (col.format === 'badge') return <StatusBadge status={val} />
    if (col.format === 'email') {
      if (!val || val === 'TBD' || val === '') return '--'
      return <a href={`mailto:${val}`} className="table-email">{val}</a>
    }
    return val || '--'
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={col.sortable ? () => toggleSort(col.key) : undefined}
              >
                <span className="th-content">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="sort-icon">
                      {sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key}>{renderCell(row, col)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
