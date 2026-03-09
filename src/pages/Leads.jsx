import { useState } from 'react'
import { Phone, MessageSquare, BarChart2, Send, X, Check } from 'lucide-react'
import probate from '../data/live/probate.js'
import foreclosures from '../data/live/foreclosures.js'
import cashBuyers from '../data/live/cashBuyers.js'
import dealerships from '../data/live/dealerships.js'
import fsbo from '../data/live/fsbo.js'
import agents from '../data/live/agents.js'
import DataTable from '../components/DataTable'
import TabNav from '../components/TabNav'
import StatusBadge from '../components/StatusBadge'

const tabs = ['Probate', 'Foreclosure', 'Cash Buyers', 'Dealerships', 'FSBO']

const probateCols = [
  { key: 'Case Number', label: 'Case #', sortable: true },
  { key: 'Decedent', label: 'Decedent', sortable: true },
  { key: 'Filed', label: 'Filed', sortable: true },
  { key: 'Executor', label: 'Executor' },
  { key: 'Attorney', label: 'Attorney' },
  { key: 'Property Address', label: 'Property' },
  { key: 'Lien Status', label: 'Lien', format: 'badge' },
  { key: 'Priority', label: 'Priority', sortable: true },
]

const foreclosureCols = [
  { key: 'Property_Address', label: 'Property', sortable: true },
  { key: 'Owner_Name', label: 'Owner', sortable: true },
  { key: 'ARV', label: 'ARV', sortable: true, format: 'currency' },
  { key: 'Equity', label: 'Equity' },
  { key: 'Trustee_Sale_Date', label: 'Sale Date', sortable: true },
  { key: 'Priority', label: 'Priority', sortable: true, format: 'badge' },
]

const cashBuyerCols = [
  { key: 'Tier', label: 'Tier', sortable: true, format: 'badge' },
  { key: 'Entity Name', label: 'Entity', sortable: true },
  { key: 'Purchases', label: 'Buys', sortable: true },
  { key: 'Cash Confirmed', label: 'Cash' },
  { key: 'Active Dates', label: 'Active' },
  { key: 'Notes', label: 'Notes' },
]

const dealerCols = [
  { key: 'Dealership', label: 'Dealership', sortable: true },
  { key: 'Brand', label: 'Brand', sortable: true },
  { key: 'City', label: 'City', sortable: true },
  { key: 'Phone', label: 'Phone' },
  { key: 'Size', label: 'Size' },
  { key: 'Priority', label: 'Priority', sortable: true, format: 'badge' },
  { key: 'Status', label: 'Status', format: 'badge' },
]

// ── FSBO Action Buttons ────────────────────────────────────────────────────────

function FsboActions({ lead, onSendAgent }) {
  const [loading, setLoading] = useState(null)

  async function launch(skill, inputs) {
    setLoading(skill)
    try {
      await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill, inputs }),
      })
    } finally {
      setLoading(null)
    }
  }

  const addr = lead.Address + ', ' + lead.City + ' AZ ' + lead.Zip
  const price = lead.Ask_Price ? '$' + lead.Ask_Price.toLocaleString() : 'TBD'

  return (
    <div className="fsbo-actions">
      <button
        className="fsbo-btn fsbo-btn--call"
        title="Open cold call script in Terminal"
        disabled={loading === 'seller-pitch'}
        onClick={() => launch('seller-pitch', `phoenix fsbo "${addr}"`)}
      >
        <Phone size={13} />
        {loading === 'seller-pitch' ? '...' : 'Call'}
      </button>
      <button
        className="fsbo-btn fsbo-btn--sms"
        title="Open SMS outreach script in Terminal"
        disabled={loading === 'auto-responder'}
        onClick={() => launch('auto-responder', `fsbo "${addr}"`)}
      >
        <MessageSquare size={13} />
        {loading === 'auto-responder' ? '...' : 'SMS'}
      </button>
      <button
        className="fsbo-btn fsbo-btn--analyze"
        title="Run deal analysis in Terminal"
        disabled={loading === 'deal-analyzer'}
        onClick={() => launch('deal-analyzer', `"${addr}" ${price}`)}
      >
        <BarChart2 size={13} />
        {loading === 'deal-analyzer' ? '...' : 'Analyze'}
      </button>
      <button
        className="fsbo-btn fsbo-btn--send"
        title="Send this lead to an agent"
        onClick={() => onSendAgent(lead)}
      >
        <Send size={13} />
        Send
      </button>
    </div>
  )
}

// ── FSBO Send-to-Agent Mini Modal ─────────────────────────────────────────────

function FsboSendModal({ lead, onClose }) {
  const [selectedAgent, setSelectedAgent] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const agentList = agents.filter((a) => a.Email && a.Email !== 'TBD')

  async function handleSend() {
    const agent = agentList.find((a) => a.Name === selectedAgent)
    if (!agent) return
    setStatus('sending')

    try {
      const res = await fetch('/api/leads/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.Name,
          agentEmail: agent.Email,
          leads: [{
            type: 'fsbo',
            property_address: `${lead.Address}, ${lead.City} AZ ${lead.Zip}`,
            Ask_Price: lead.Ask_Price,
            Beds: lead.Beds,
            Baths: lead.Baths,
            Sqft: lead.Sqft,
            Platform: lead.Platform,
            Assessment: lead.Assessment,
            Condition: lead.Condition,
            Notes: lead.Notes,
          }],
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStatus('sent')
      if (data.mailtoUrl) window.open(data.mailtoUrl, '_blank')
      setTimeout(onClose, 2500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fsbo-send-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title"><Send size={16} /> Send FSBO Lead to Agent</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {status === 'sent' ? (
          <div className="send-leads-success">
            <Check size={32} className="send-leads-check" />
            <h3>Lead Sent!</h3>
            <p>Check your email app to deliver to the agent.</p>
          </div>
        ) : (
          <div className="fsbo-send-body">
            <div className="fsbo-send-property">
              <strong>{lead.Address}</strong>
              <span>{lead.City}, AZ {lead.Zip}</span>
              <span className="fsbo-send-price">
                {lead.Ask_Price ? '$' + lead.Ask_Price.toLocaleString() : 'Price TBD'}
              </span>
              <StatusBadge status={lead.Assessment} />
            </div>

            <label className="fsbo-send-label">Select Agent</label>
            <select
              className="fsbo-send-select"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">-- Pick an agent --</option>
              {agentList.map((a) => (
                <option key={a['Hit#']} value={a.Name}>
                  {a.Name} — {a.Company} ({a.State})
                </option>
              ))}
            </select>

            {status === 'error' && (
              <p className="fsbo-send-error">Send failed — try again</p>
            )}

            <div className="fsbo-send-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={!selectedAgent || status === 'sending'}
                onClick={handleSend}
              >
                <Send size={15} />
                {status === 'sending' ? 'Sending...' : 'Send Lead'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── FSBO Table ────────────────────────────────────────────────────────────────

function FsboTable() {
  const [sendTarget, setSendTarget] = useState(null)

  const columns = [
    { key: 'Tier', label: 'Tier', sortable: true, format: 'badge' },
    { key: 'Address', label: 'Address', sortable: true },
    { key: 'Zip', label: 'Zip' },
    {
      key: 'Ask_Price',
      label: 'Ask Price',
      sortable: true,
      render: (val) => val ? '$' + val.toLocaleString() : 'TBD',
    },
    {
      key: 'Beds',
      label: 'Bed/Bath',
      render: (val, row) => `${val}bd / ${row.Baths}ba`,
    },
    {
      key: 'Sqft',
      label: 'Sqft',
      render: (val) => val ? val.toLocaleString() : '--',
    },
    {
      key: 'Price_Per_Sqft',
      label: '$/sqft',
      render: (val) => val ? '$' + val : '--',
    },
    { key: 'Platform', label: 'Source' },
    { key: 'Assessment', label: 'Assessment', format: 'badge' },
    { key: 'Notes', label: 'Notes' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <FsboActions lead={row} onSendAgent={(lead) => setSendTarget(lead)} />
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={fsbo}
        defaultSort={{ key: 'Tier', direction: 'asc' }}
      />
      {sendTarget && (
        <FsboSendModal lead={sendTarget} onClose={() => setSendTarget(null)} />
      )}
    </>
  )
}

// ── Main Leads Page ───────────────────────────────────────────────────────────

const tabConfig = {
  Probate: { data: probate, columns: probateCols, sort: { key: 'Priority', direction: 'asc' } },
  Foreclosure: { data: foreclosures, columns: foreclosureCols, sort: { key: 'Priority', direction: 'asc' } },
  'Cash Buyers': { data: cashBuyers, columns: cashBuyerCols, sort: { key: 'Tier', direction: 'asc' } },
  Dealerships: { data: dealerships, columns: dealerCols, sort: { key: 'Priority', direction: 'asc' } },
}

export default function Leads() {
  const [active, setActive] = useState('Probate')
  const config = tabConfig[active]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Leads</h1>
        <p className="page-subtitle">
          {probate.length} probate · {foreclosures.length} foreclosure · {cashBuyers.length} cash buyers · {dealerships.length} dealerships · {fsbo.length} FSBO
        </p>
      </div>
      <TabNav tabs={tabs} active={active} onChange={setActive} />
      {active === 'FSBO' ? (
        <FsboTable />
      ) : (
        <DataTable columns={config.columns} data={config.data} defaultSort={config.sort} />
      )}
    </div>
  )
}
