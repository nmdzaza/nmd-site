import { useState } from 'react'
import { DollarSign, TrendingUp, Clock, AlertTriangle } from 'lucide-react'
import invoices from '../data/live/invoices.js'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000).toLocaleString() + 'K'
  return '$' + n.toLocaleString()
}

function num(val) {
  return parseFloat(String(val).replace(/[$,]/g, '') || 0)
}

export default function Invoices() {
  const [updating, setUpdating] = useState(null)

  const totalInvoiced = invoices.reduce((s, inv) => s + num(inv.amount), 0)
  const totalPaid = invoices.filter((i) => (i.status || '').toUpperCase() === 'PAID').reduce((s, inv) => s + num(inv.amount), 0)
  const totalPending = invoices.filter((i) => (i.status || '').toUpperCase() === 'PENDING').reduce((s, inv) => s + num(inv.amount), 0)
  const totalOverdue = invoices.filter((i) => (i.status || '').toUpperCase() === 'OVERDUE').reduce((s, inv) => s + num(inv.amount), 0)

  async function updateStatus(invoice, newStatus) {
    setUpdating(invoice.invoice_id)
    try {
      const res = await fetch('/api/invoices/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoice.invoice_id, status: newStatus }),
      })
      if (res.ok) {
        invoice.status = newStatus
      }
    } catch {
      // Server not running
    }
    setUpdating(null)
  }

  const sorted = [...invoices].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <p className="page-subtitle">{invoices.length} total invoice{invoices.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="stat-row">
        <StatCard icon={DollarSign} label="Total Invoiced" value={fmt(totalInvoiced)} />
        <StatCard icon={TrendingUp} label="Paid" value={fmt(totalPaid)} accent />
        <StatCard icon={Clock} label="Pending" value={fmt(totalPending)} />
        <StatCard icon={AlertTriangle} label="Overdue" value={fmt(totalOverdue)} />
      </div>

      {invoices.length === 0 ? (
        <div className="table-empty">No invoices yet. Send leads to an agent to create your first invoice.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Agent</th>
                <th>Date</th>
                <th>Leads</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((inv) => (
                <tr key={inv.invoice_id}>
                  <td className="invoice-id">{inv.invoice_id}</td>
                  <td>{inv.agent_name}</td>
                  <td>{inv.date}</td>
                  <td>{inv.leads_sent}</td>
                  <td className="text-accent">${num(inv.amount).toLocaleString()}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <div className="invoice-status-actions">
                      {(inv.status || '').toUpperCase() !== 'PAID' && (
                        <button
                          className="invoice-status-btn invoice-status-btn--paid"
                          onClick={() => updateStatus(inv, 'PAID')}
                          disabled={updating === inv.invoice_id}
                        >
                          Mark Paid
                        </button>
                      )}
                      {(inv.status || '').toUpperCase() === 'PENDING' && (
                        <button
                          className="invoice-status-btn invoice-status-btn--overdue"
                          onClick={() => updateStatus(inv, 'OVERDUE')}
                          disabled={updating === inv.invoice_id}
                        >
                          Overdue
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
