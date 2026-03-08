import { useState } from 'react'
import { X, Send, Check, Package } from 'lucide-react'
import probate from '../data/live/probate.js'
import foreclosures from '../data/live/foreclosures.js'
import StatusBadge from './StatusBadge'

function calculatePrice(count) {
  const bundles = Math.floor(count / 5)
  const singles = count % 5
  return bundles * 150 + singles * 50
}

// State abbreviation map for matching leads to agents
function matchesState(address, state) {
  if (!state || !address) return false
  const upper = address.toUpperCase()
  const st = state.toUpperCase().trim()
  // Match "AZ", " AZ ", " AZ,", etc in address
  return upper.includes(` ${st} `) || upper.includes(` ${st},`) || upper.endsWith(` ${st}`)
}

export default function SendLeadsModal({ agent, onClose, onSent }) {
  const [tab, setTab] = useState('probate')
  const [selected, setSelected] = useState(new Set())
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [result, setResult] = useState(null)

  // Filter leads by agent's state
  const stateLeads = {
    probate: probate.filter((l) => matchesState(l.property_address, agent.State)),
    foreclosure: foreclosures.filter((l) => matchesState(l.Property_Address, agent.State)),
  }

  const currentLeads = stateLeads[tab] || []
  const allLeads = [...stateLeads.probate, ...stateLeads.foreclosure]

  function leadKey(lead) {
    return lead.case_number || lead.Property_Address || JSON.stringify(lead)
  }

  function toggleLead(lead) {
    const key = leadKey(lead)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === currentLeads.length) {
      // Deselect all from current tab
      const tabKeys = new Set(currentLeads.map(leadKey))
      setSelected((prev) => {
        const next = new Set(prev)
        tabKeys.forEach((k) => next.delete(k))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        currentLeads.forEach((l) => next.add(leadKey(l)))
        return next
      })
    }
  }

  // Get selected lead objects
  function getSelectedLeads() {
    return allLeads.filter((l) => selected.has(leadKey(l)))
  }

  async function handleSend() {
    const leads = getSelectedLeads()
    if (leads.length === 0) return
    setStatus('sending')

    try {
      const res = await fetch('/api/leads/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.Name,
          agentEmail: agent.Email && agent.Email !== 'TBD' ? agent.Email : '',
          leads: leads.map((l) => ({
            ...l,
            type: l.case_number ? 'probate' : 'foreclosure',
          })),
        }),
      })
      if (!res.ok) throw new Error('Send failed')
      const data = await res.json()
      setResult(data)
      setStatus('sent')

      // Open the mailto URL in the user's mail client
      if (data.mailtoUrl) {
        window.open(data.mailtoUrl, '_blank')
      }

      setTimeout(() => {
        onSent && onSent()
      }, 3000)
    } catch {
      setStatus('error')
    }
  }

  const selectedCount = selected.size
  const price = calculatePrice(selectedCount)
  const tabCounts = {
    probate: stateLeads.probate.length,
    foreclosure: stateLeads.foreclosure.length,
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal send-leads-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Package size={18} />
            Send Leads to {agent.Name}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {status === 'sent' && result ? (
          <div className="send-leads-success">
            <Check size={32} className="send-leads-check" />
            <h3>Lead Package Ready!</h3>
            <p>{result.leadCount} leads — ${result.amount}</p>
            <p className="send-leads-invoice">Invoice #{result.invoiceId}</p>
            <p className="send-leads-hint">Your email client should open with the lead package. Check your mail app.</p>
          </div>
        ) : (
          <>
            {/* Tab nav */}
            <div className="send-leads-tabs">
              <button
                className={`send-leads-tab${tab === 'probate' ? ' send-leads-tab--active' : ''}`}
                onClick={() => setTab('probate')}
              >
                Probate ({tabCounts.probate})
              </button>
              <button
                className={`send-leads-tab${tab === 'foreclosure' ? ' send-leads-tab--active' : ''}`}
                onClick={() => setTab('foreclosure')}
              >
                Foreclosure ({tabCounts.foreclosure})
              </button>
            </div>

            {/* Lead table */}
            <div className="send-leads-table-wrap">
              {currentLeads.length === 0 ? (
                <div className="send-leads-empty">
                  No {tab} leads available in {agent.State || 'this state'} yet.
                </div>
              ) : (
                <table className="lead-select-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="lead-select-checkbox"
                          checked={currentLeads.length > 0 && currentLeads.every((l) => selected.has(leadKey(l)))}
                          onChange={toggleAll}
                        />
                      </th>
                      {tab === 'probate' ? (
                        <>
                          <th>Property</th>
                          <th>Decedent</th>
                          <th>Value</th>
                          <th>Lien</th>
                          <th>Priority</th>
                        </>
                      ) : (
                        <>
                          <th>Property</th>
                          <th>Owner</th>
                          <th>ARV</th>
                          <th>Sale Date</th>
                          <th>Priority</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentLeads.map((lead) => {
                      const key = leadKey(lead)
                      const isSelected = selected.has(key)
                      return (
                        <tr
                          key={key}
                          className={`lead-select-row${isSelected ? ' lead-select-row--selected' : ''}`}
                          onClick={() => toggleLead(lead)}
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="lead-select-checkbox"
                              checked={isSelected}
                              onChange={() => toggleLead(lead)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          {tab === 'probate' ? (
                            <>
                              <td className="truncate">{lead.property_address}</td>
                              <td>{lead.decedent}</td>
                              <td>${parseInt(lead.est_value || 0).toLocaleString()}</td>
                              <td><StatusBadge status={lead.lien_status?.includes('CLEAR') ? 'CLEAR' : lead.lien_status?.includes('MORTGAGE') ? 'MORTGAGE' : lead.lien_status} /></td>
                              <td><StatusBadge status={lead.priority === '1' ? 'HIGH' : lead.priority === '2' ? 'MEDIUM' : 'LOW'} /></td>
                            </>
                          ) : (
                            <>
                              <td className="truncate">{lead.Property_Address}</td>
                              <td>{lead.Owner_Name}</td>
                              <td>{lead.ARV}</td>
                              <td>{lead.Trustee_Sale_Date}</td>
                              <td><StatusBadge status={lead.Priority === '1' ? 'HIGH' : lead.Priority === '2' ? 'MEDIUM' : 'LOW'} /></td>
                            </>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer with pricing */}
            <div className="send-leads-footer">
              <div className="send-leads-summary">
                {selectedCount > 0 ? (
                  <>
                    {selectedCount} lead{selectedCount !== 1 ? 's' : ''} selected —{' '}
                    <span className="send-leads-price">${price}</span>
                    {selectedCount >= 5 && <span className="send-leads-bundle"> (bundle pricing)</span>}
                  </>
                ) : (
                  'Select leads to send'
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={selectedCount === 0 || status === 'sending'}
              >
                <Send size={16} />
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Retry' : 'Send Lead Package'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
