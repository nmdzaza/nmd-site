import { useState } from 'react'
import { Users, Send, MessageCircle, AlertCircle, Search, X, Save, Phone } from 'lucide-react'
import agents from '../data/live/agents.js'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import AgentQuickActions from '../components/AgentQuickActions'
import SendLeadsModal from '../components/SendLeadsModal'

const STATUS_OPTIONS = ['SENT', 'REPLIED', 'INTERESTED', 'CLIENT', 'NOT INTERESTED', 'NO EMAIL', 'NO ANSWER']

export default function Agents() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [showSendLeads, setShowSendLeads] = useState(false)

  const sent = agents.filter((a) => a.Status === 'SENT').length
  const replied = agents.filter((a) => a.Status === 'REPLIED').length
  const noEmail = agents.filter((a) => a.Status === 'NO EMAIL').length

  // Filter by name, phone, company, or state
  const query = search.toLowerCase().replace(/[()-\s]/g, '')
  const filtered = search.trim()
    ? agents.filter((a) => {
        const name = (a.Name || '').toLowerCase()
        const phone = (a.Phone || '').replace(/[()-\s]/g, '')
        const company = (a.Company || '').toLowerCase()
        const state = (a.State || '').toLowerCase()
        return (
          name.includes(query) ||
          phone.includes(query) ||
          company.includes(search.toLowerCase()) ||
          state.includes(search.toLowerCase())
        )
      })
    : agents

  function openAgent(agent) {
    setSelected(agent)
    setEditStatus(agent.Status || '')
    setEditNotes(agent.Notes || '')
    setSaveMsg('')
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/agents/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hit: selected['Hit#'],
          status: editStatus,
          notes: editNotes,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveMsg('Saved')
      // Update local data so it shows immediately
      selected.Status = editStatus
      selected.Notes = editNotes
      setTimeout(() => setSaveMsg(''), 2000)
    } catch {
      setSaveMsg('Error — is dev server running?')
    }
    setSaving(false)
  }

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

      {/* Search bar */}
      <div className="agent-search-wrap">
        <Search size={16} className="agent-search-icon" />
        <input
          className="agent-search"
          type="text"
          placeholder="Search by name, phone, company, or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="agent-search-clear" onClick={() => setSearch('')}>
            <X size={14} />
          </button>
        )}
      </div>

      {search.trim() && (
        <p className="agent-search-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* Agent table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>State</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a['Hit#']}
                className={`agent-row${selected && selected['Hit#'] === a['Hit#'] ? ' agent-row-active' : ''}`}
                onClick={() => openAgent(a)}
              >
                <td>{a['Hit#']}</td>
                <td className="agent-name-cell">{a.Name}</td>
                <td>{a.Company || '--'}</td>
                <td>{a.Phone || '--'}</td>
                <td>{a.State || '--'}</td>
                <td><StatusBadge status={a.Status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agent detail panel */}
      {selected && (
        <div className="agent-panel-overlay" onClick={() => setSelected(null)}>
          <div className="agent-panel" onClick={(e) => e.stopPropagation()}>
            <div className="agent-panel-header">
              <h2 className="agent-panel-name">{selected.Name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="agent-panel-info">
              <div className="agent-detail-row">
                <span className="agent-detail-label">Title</span>
                <span>{selected.Title || '--'}</span>
              </div>
              <div className="agent-detail-row">
                <span className="agent-detail-label">Company</span>
                <span>{selected.Company || '--'}</span>
              </div>
              <div className="agent-detail-row">
                <span className="agent-detail-label">Phone</span>
                <span className="agent-detail-phone">
                  <Phone size={14} />
                  {selected.Phone || '--'}
                </span>
              </div>
              <div className="agent-detail-row">
                <span className="agent-detail-label">Email</span>
                <span>{selected.Email && selected.Email !== 'TBD' ? (
                  <a href={`mailto:${selected.Email}`} className="table-email">{selected.Email}</a>
                ) : '--'}</span>
              </div>
              <div className="agent-detail-row">
                <span className="agent-detail-label">Location</span>
                <span>{selected.Location || '--'}</span>
              </div>
              <div className="agent-detail-row">
                <span className="agent-detail-label">Source</span>
                <span>{selected.Source || '--'}</span>
              </div>
            </div>

            <AgentQuickActions
              agent={selected}
              onSendLeads={() => setShowSendLeads(true)}
            />

            <div className="agent-panel-edit">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes about this agent..."
                  rows={3}
                />
              </div>
              <div className="agent-panel-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                {saveMsg && (
                  <span className={`save-msg${saveMsg === 'Saved' ? ' save-ok' : ' save-err'}`}>
                    {saveMsg}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSendLeads && selected && (
        <SendLeadsModal
          agent={selected}
          onClose={() => setShowSendLeads(false)}
          onSent={() => setShowSendLeads(false)}
        />
      )}
    </div>
  )
}
