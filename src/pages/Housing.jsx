import { useState } from 'react'
import {
  Users, Building2, GitMerge, Terminal, ExternalLink,
  Phone, Star, ChevronDown, ChevronUp, Mail, MessageSquare,
} from 'lucide-react'
import seekers from '../data/live/seekers'
import rentalListings from '../data/live/rentalListings'
import rentalMatches from '../data/live/rentalMatches'
import SkillLauncher from '../components/SkillLauncher'

const CAMERON_EMAIL = 'camjohn816@gmail.com'

const SKILL_CONFIGS = {
  seekers: {
    slug: 'craigslist-fsbo',
    name: 'Craigslist FSBO',
    description: 'Scrapes Craigslist housing leads — FSBO homes, rooms for rent, or people looking for a room.',
    guide: 'Set mode to "housing-wanted" to pull people actively posting that they need a room or apartment.',
    youGet: 'Email with every housing-wanted poster\'s name, budget, area, description, phone (if listed), and post link. Saves to seekers database.',
  },
  rentals: {
    slug: 'rental-listings',
    name: 'Rental Listings',
    description: 'Scrapes all active Craigslist rentals — rooms, apartments, and houses.',
    guide: 'Pulls every active rental listing in your city. Extracts price, neighborhood, bedrooms, contact name, phone, and tenant requirements.',
    youGet: 'Email with full rental details + requirements for every listing. Saved to rentals database.',
  },
  matcher: {
    slug: 'rental-matcher',
    name: 'Rental Matcher',
    description: 'Matches housing seekers to available rentals and generates call scripts for both sides.',
    guide: 'Cross-references seekers vs rentals. Blocks mismatches. Scores compatible pairs 1–6. Generates call scripts.',
    youGet: 'Email with every matched pair ranked by score, with a call script for seeker and landlord. Saved to matches database.',
  },
}

/* ── Helpers ─────────────────────────────────────────────────── */

function hasPhone(phone) {
  return phone && phone !== 'Not listed' && !phone.includes('see link') && phone.replace(/\D/g, '').length >= 10
}

function PhoneLink({ phone }) {
  if (!hasPhone(phone)) return <span className="housing-no-phone">—</span>
  const digits = phone.replace(/\D/g, '')
  return (
    <a href={`tel:${digits}`} className="housing-phone-link">
      <Phone size={12} /> {phone}
    </a>
  )
}

function PostLink({ link, label = 'View Post' }) {
  if (!link) return <span className="housing-no-phone">—</span>
  return (
    <a href={link} target="_blank" rel="noreferrer" className="housing-post-link" title={link}>
      <ExternalLink size={12} /> {label}
    </a>
  )
}

function TextBtn({ phone, panelPhone }) {
  const p = panelPhone || phone
  if (!hasPhone(p)) return null
  const digits = p.replace(/\D/g, '')
  return (
    <a href={`sms:${digits}`} className="housing-action-btn housing-action-btn--text" title="Text in Messages">
      <MessageSquare size={11} /> Text
    </a>
  )
}

// Helper: build a Gmail compose URL (opens Gmail in new tab, not Mail.app)
function gmailUrl(to, subject, body) {
  return (
    'https://mail.google.com/mail/u/0/?view=cm&fs=1' +
    (to ? `&to=${encodeURIComponent(to)}` : '') +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}` +
    `&cc=${encodeURIComponent(CAMERON_EMAIL)}`
  )
}

// Pre-written email template for contacting a SEEKER (someone looking for housing)
function SeekerEmailBtn({ seeker, toEmail }) {
  const areas  = seeker.areas_wanted || 'your area'
  const budget = seeker.price || 'your budget'
  const subject = 'Housing options available — NMD Solutions'
  const body = `Hi,\n\nCame across your post on Craigslist — looks like you're looking for housing in ${areas} around ${budget}/mo.\n\nI work with NMD Solutions and I have a few available listings in Phoenix that could be a great fit. Ready to share details right away.\n\nJust reply here and I'll send them over.\n\nCameron Johnson\nNMD Solutions\n${CAMERON_EMAIL}`
  return (
    <a
      href={gmailUrl(toEmail, subject, body)}
      target="_blank" rel="noreferrer"
      className={`housing-action-btn housing-action-btn--email${toEmail ? ' housing-action-btn--ready' : ''}`}
      title={toEmail ? `Gmail → ${toEmail}` : 'Save CL email first to auto-fill To:'}
    >
      <Mail size={11} /> Email{toEmail ? '' : ' (no addr)'}
    </a>
  )
}

// Pre-written email template for contacting a LANDLORD (someone with a rental)
function LandlordEmailBtn({ rental, toEmail }) {
  const contact = rental.contact_name || 'there'
  const subject = `Qualified tenant for your ${rental.location || 'listing'} — NMD Solutions`
  const body = `Hi ${contact},\n\nSaw your ${rental.type || 'rental'} listing on Craigslist for ${rental.price || 'your asking price'}/mo in ${rental.location || 'your area'}.\n\nI work with NMD Solutions — I have a qualified tenant looking in your area right around your price range. They're motivated to move and can meet your requirements.\n\nWant me to send over their information?\n\nCameron Johnson\nNMD Solutions\n${CAMERON_EMAIL}`
  return (
    <a
      href={gmailUrl(toEmail, subject, body)}
      target="_blank" rel="noreferrer"
      className={`housing-action-btn housing-action-btn--email${toEmail ? ' housing-action-btn--ready' : ''}`}
      title={toEmail ? `Gmail → ${toEmail}` : 'Save CL email first to auto-fill To:'}
    >
      <Mail size={11} /> Email{toEmail ? '' : ' (no addr)'}
    </a>
  )
}

function ScoreBadge({ score }) {
  const s = parseInt(score) || 0
  const cls = s >= 5 ? 'score-perfect' : s >= 4 ? 'score-strong' : s >= 3 ? 'score-good' : 'score-weak'
  return (
    <span className={`housing-score-badge ${cls}`}>
      {'★'.repeat(s)}{'☆'.repeat(Math.max(0, 6 - s))}
      <span className="score-num">{s}/6</span>
    </span>
  )
}

/* ── Match Card ──────────────────────────────────────────────── */

function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false)

  // Seeker → landlord email
  const landlordSubject = encodeURIComponent(`Qualified tenant for your ${match.rental_location || 'listing'}`)
  const landlordBody = encodeURIComponent(
    `Hi ${match.rental_contact || 'there'},\n\nI have a tenant — ${match.seeker_name || 'they'} — looking in your area with a budget of $${match.seeker_budget}/mo. Your listing at ${match.rental_price}/mo in ${match.rental_location || 'your area'} looks like a strong fit.\n\nWant me to connect you?\n\nCameron Johnson\nNMD Solutions\n${CAMERON_EMAIL}`
  )
  const landlordMailto = `mailto:?subject=${landlordSubject}&body=${landlordBody}&cc=${CAMERON_EMAIL}`

  // Landlord → seeker email
  const seekerSubject = encodeURIComponent(`Rental available in ${match.rental_location || 'your area'}`)
  const seekerBody = encodeURIComponent(
    `Hi ${match.seeker_name || 'there'},\n\nI came across your post looking for housing in ${match.seeker_areas || 'your area'} around $${match.seeker_budget}/mo.\n\nI have a ${match.rental_type || 'rental'} in ${match.rental_location || 'your area'} for ${match.rental_price}/mo. Based on what you wrote, this looks like a strong fit.\n\nWant me to send over the full details?\n\nCameron Johnson\nNMD Solutions\n${CAMERON_EMAIL}`
  )
  const seekerMailto = `mailto:?subject=${seekerSubject}&body=${seekerBody}&cc=${CAMERON_EMAIL}`

  return (
    <div className="match-card">
      <div className="match-card-header" onClick={() => setExpanded(e => !e)}>
        <ScoreBadge score={match.score} />
        <div className="match-names">
          <span className="match-seeker-name">{match.seeker_name || 'Seeker'}</span>
          <span className="match-arrow">→</span>
          <span className="match-rental-loc">{match.rental_location || match.rental_type || 'Rental'}</span>
        </div>
        <div className="match-prices">
          <span className="match-seeker-budget">${match.seeker_budget}/mo budget</span>
          <span className="match-dot">·</span>
          <span className="match-rental-price">{match.rental_price}/mo rent</span>
        </div>

        {/* Quick action buttons on header */}
        <div className="match-header-actions" onClick={e => e.stopPropagation()}>
          {hasPhone(match.seeker_phone) && (
            <a href={`sms:${match.seeker_phone.replace(/\D/g,'')}`} className="housing-action-btn housing-action-btn--text" title="Text seeker">
              <MessageSquare size={11} /> Seeker
            </a>
          )}
          {hasPhone(match.rental_phone) && (
            <a href={`sms:${match.rental_phone.replace(/\D/g,'')}`} className="housing-action-btn housing-action-btn--text" title="Text landlord">
              <MessageSquare size={11} /> Landlord
            </a>
          )}
          <a href={seekerMailto} className="housing-action-btn housing-action-btn--email" title="Email seeker">
            <Mail size={11} /> Seeker
          </a>
          <a href={landlordMailto} className="housing-action-btn housing-action-btn--email" title="Email landlord">
            <Mail size={11} /> Landlord
          </a>
        </div>

        <button className="match-expand-btn" aria-label="expand">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="match-card-body">
          <div className="match-two-col">
            <div className="match-side match-side--seeker">
              <div className="match-side-label">👤 Seeker</div>
              <div className="match-detail-row"><span>Name</span><span>{match.seeker_name || '—'}</span></div>
              <div className="match-detail-row"><span>Budget</span><span>${match.seeker_budget}/mo</span></div>
              <div className="match-detail-row"><span>Wants</span><span>{match.seeker_areas || '—'}</span></div>
              <div className="match-detail-row"><span>About</span><span>{match.seeker_about || '—'}</span></div>
              <div className="match-detail-row"><span>Tags</span><span className="match-tags">{match.seeker_tags || '—'}</span></div>
              <div className="match-detail-row"><span>Phone</span><span><PhoneLink phone={match.seeker_phone} /></span></div>
              <div className="match-detail-row"><span>Post</span><span><PostLink link={match.seeker_link} label="View" /></span></div>
            </div>
            <div className="match-side match-side--rental">
              <div className="match-side-label">🏠 Rental</div>
              <div className="match-detail-row"><span>Type</span><span>{match.rental_type || '—'}</span></div>
              <div className="match-detail-row"><span>Price</span><span>{match.rental_price}/mo</span></div>
              <div className="match-detail-row"><span>Location</span><span>{match.rental_location || '—'}</span></div>
              <div className="match-detail-row"><span>Contact</span><span>{match.rental_contact || '—'}</span></div>
              <div className="match-detail-row"><span>Phone</span><span><PhoneLink phone={match.rental_phone} /></span></div>
              <div className="match-detail-row"><span>Requires</span><span>{match.rental_reqs || 'None stated'}</span></div>
              <div className="match-detail-row"><span>Post</span><span><PostLink link={match.rental_link} label="View" /></span></div>
            </div>
          </div>

          {match.match_reasons && (
            <div className="match-reasons">
              <div className="match-reasons-label">✓ Why they match</div>
              {match.match_reasons.split(' | ').filter(Boolean).map((r, i) => (
                <div key={i} className="match-reason-item">{r}</div>
              ))}
            </div>
          )}

          <div className="match-scripts">
            <div className="match-script-block">
              <div className="match-script-label">📞 Call script — SEEKER</div>
              <div className="match-script-text">{match.msg_to_seeker || '—'}</div>
            </div>
            <div className="match-script-block">
              <div className="match-script-label">📞 Call script — LANDLORD</div>
              <div className="match-script-text">{match.msg_to_landlord || '—'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────── */

export default function Housing() {
  const [activeLaunch, setActiveLaunch] = useState(null)
  const [topMatchOnly, setTopMatchOnly] = useState(true)
  const [emailPanels, setEmailPanels] = useState({})
  const [phonePanels, setPhonePanels] = useState({})

  const getEP  = (key) => emailPanels[key] || { open: false, value: '', saving: false, saved: false }
  const setEP  = (key, update) => setEmailPanels(prev => ({ ...prev, [key]: { ...getEP(key),  ...update } }))
  const getPhP = (key) => phonePanels[key] || { open: false, value: '', saving: false, saved: false }
  const setPhP = (key, update) => setPhonePanels(prev => ({ ...prev, [key]: { ...getPhP(key), ...update } }))

  function saveEmail(key, type, link) {
    const ep = getEP(key)
    const value = ep.value.trim()
    if (!value || !link) return
    // Optimistic: show saved pill immediately
    setEP(key, { open: false, saving: false, saved: true })
    // Background persist to CSV (fire-and-forget)
    fetch('/api/housing/save-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, link, email: value }),
    }).catch(() => {})
  }

  function savePhone(key, type, link) {
    const pp = getPhP(key)
    const value = pp.value.trim()
    if (!value || !link) return
    // Optimistic: show saved pill immediately
    setPhP(key, { open: false, saving: false, saved: true })
    // Background persist to CSV (fire-and-forget)
    fetch('/api/housing/save-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, link, phone: value }),
    }).catch(() => {})
  }

  const withPhone = (arr) => arr.filter(r => hasPhone(r.phone)).length

  const perfectMatches = rentalMatches.filter(m => parseInt(m.score) >= 5).length
  const goodMatches    = rentalMatches.filter(m => parseInt(m.score) >= 3).length

  // Deduplicate: best match per seeker
  const topMatchPerSeeker = () => {
    const seen = new Map()
    const sorted = [...rentalMatches].sort((a, b) => (parseInt(b.score) || 0) - (parseInt(a.score) || 0))
    for (const m of sorted) {
      const key = m.seeker_link || m.seeker_name || 'unknown'
      if (!seen.has(key)) seen.set(key, m)
    }
    return [...seen.values()].sort((a, b) => (parseInt(b.score) || 0) - (parseInt(a.score) || 0))
  }

  const displayMatches = topMatchOnly ? topMatchPerSeeker() : [...rentalMatches].sort((a, b) => (parseInt(b.score) || 0) - (parseInt(a.score) || 0))

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Housing Leads</h1>
        <p className="page-subtitle">People looking for housing · Available rentals · Matched pairs + email templates</p>
      </div>

      {/* Stats */}
      <div className="housing-stats-row">
        <div className="housing-stat-card">
          <div className="housing-stat-icon housing-stat-icon--seekers"><Users size={20} /></div>
          <div className="housing-stat-info">
            <div className="housing-stat-number">{seekers.length}</div>
            <div className="housing-stat-label">Housing Seekers</div>
          </div>
        </div>
        <div className="housing-stat-card">
          <div className="housing-stat-icon housing-stat-icon--rentals"><Building2 size={20} /></div>
          <div className="housing-stat-info">
            <div className="housing-stat-number">{rentalListings.length}</div>
            <div className="housing-stat-label">Active Rentals</div>
          </div>
        </div>
        <div className="housing-stat-card">
          <div className="housing-stat-icon housing-stat-icon--matches"><GitMerge size={20} /></div>
          <div className="housing-stat-info">
            <div className="housing-stat-number">{rentalMatches.length}</div>
            <div className="housing-stat-label">Total Matches</div>
          </div>
        </div>
        <div className="housing-stat-card">
          <div className="housing-stat-icon housing-stat-icon--perfect"><Star size={20} /></div>
          <div className="housing-stat-info">
            <div className="housing-stat-number">{perfectMatches}</div>
            <div className="housing-stat-label">Perfect Matches (5-6★)</div>
          </div>
        </div>
      </div>

      {/* ── SEEKERS ────────────────────────────────────────────── */}
      <section className="housing-section">
        <div className="housing-section-header">
          <div className="housing-section-title">
            <Users size={18} />
            <h2>People Looking for Housing</h2>
            <span className="housing-section-count">{seekers.length}</span>
            {seekers.length > 0 && (
              <span className="housing-section-sub">{withPhone(seekers)} with phone</span>
            )}
          </div>
          <button className="btn btn-primary housing-launch-btn" onClick={() => setActiveLaunch(SKILL_CONFIGS.seekers)}>
            <Terminal size={14} /> Run Housing-Wanted Scrape
          </button>
        </div>

        {seekers.length === 0 ? (
          <div className="housing-empty">
            <p>No seekers yet.</p>
            <p className="housing-empty-hint">Run <strong>Craigslist FSBO</strong> → mode: <strong>housing-wanted</strong> → your city → Launch.</p>
          </div>
        ) : (
          <div className="housing-table-wrap">
            <table className="housing-table">
              <thead>
                <tr>
                  <th>What They Want</th>
                  <th>Budget/mo</th>
                  <th>About Them</th>
                  <th>Phone</th>
                  <th>Post</th>
                  <th>CL Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seekers.map((s, i) => {
                  const key    = `seeker-${s.link || i}`
                  const ep     = getEP(key)
                  const pp     = getPhP(key)
                  const curPhone = pp.saved ? pp.value : (hasPhone(s.phone) ? s.phone : '')
                  const curEmail = ep.saved ? ep.value : (s.email || '')
                  return (
                    <tr key={i}>
                      <td className="housing-td-area">{s.areas_wanted || '—'}</td>
                      <td className="housing-td-price">{s.price || '—'}</td>
                      <td className="housing-td-about">{s.about_them?.slice(0, 120) || '—'}</td>

                      {/* ── Editable Phone ── */}
                      <td className="housing-td-cl-email">
                        {pp.open ? (
                          <div className="housing-cl-input-row">
                            <input
                              className="housing-cl-input"
                              type="tel"
                              autoFocus
                              placeholder="(602) 555-1234"
                              value={pp.value}
                              onChange={e => setPhP(key, { value: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') savePhone(key, 'seeker', s.link)
                                if (e.key === 'Escape') setPhP(key, { open: false })
                              }}
                            />
                            <button className="housing-cl-save-btn" onClick={() => savePhone(key, 'seeker', s.link)} disabled={pp.saving}>{pp.saving ? '…' : '✓'}</button>
                            <button className="housing-cl-cancel-btn" onClick={() => setPhP(key, { open: false })}>✕</button>
                          </div>
                        ) : curPhone ? (
                          <span className="housing-cl-saved housing-cl-editable" title="Click to edit" onClick={() => setPhP(key, { open: true, value: curPhone })}>
                            <Phone size={11} /> {curPhone.slice(0, 16)}{curPhone.length > 16 ? '…' : ''}
                          </span>
                        ) : (
                          <button className="housing-cl-add-btn" onClick={() => setPhP(key, { open: true })}>+ Add</button>
                        )}
                      </td>

                      <td><PostLink link={s.link} /></td>

                      {/* ── Editable CL Email ── */}
                      <td className="housing-td-cl-email">
                        {ep.open ? (
                          <div className="housing-cl-input-row">
                            <input
                              className="housing-cl-input"
                              type="email"
                              autoFocus
                              placeholder="paste CL email…"
                              value={ep.value}
                              onChange={e => setEP(key, { value: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveEmail(key, 'seeker', s.link)
                                if (e.key === 'Escape') setEP(key, { open: false })
                              }}
                            />
                            <button className="housing-cl-save-btn" onClick={() => saveEmail(key, 'seeker', s.link)} disabled={ep.saving}>{ep.saving ? '…' : '✓'}</button>
                            <button className="housing-cl-cancel-btn" onClick={() => setEP(key, { open: false })}>✕</button>
                          </div>
                        ) : curEmail ? (
                          <span className="housing-cl-saved housing-cl-editable" title="Click to edit" onClick={() => setEP(key, { open: true, value: curEmail })}>
                            <Mail size={11} /> {curEmail.slice(0, 22)}{curEmail.length > 22 ? '…' : ''}
                          </span>
                        ) : (
                          <button className="housing-cl-add-btn" onClick={() => setEP(key, { open: true })}>+ Add</button>
                        )}
                      </td>

                      <td>
                        <div className="housing-row-btns">
                          <TextBtn phone={s.phone} panelPhone={curPhone} />
                          <SeekerEmailBtn seeker={s} toEmail={curEmail} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── RENTALS ─────────────────────────────────────────────── */}
      <section className="housing-section">
        <div className="housing-section-header">
          <div className="housing-section-title">
            <Building2 size={18} />
            <h2>Available Rentals</h2>
            <span className="housing-section-count">{rentalListings.length}</span>
            {rentalListings.length > 0 && (
              <span className="housing-section-sub">{withPhone(rentalListings)} with phone</span>
            )}
          </div>
          <button className="btn btn-primary housing-launch-btn" onClick={() => setActiveLaunch(SKILL_CONFIGS.rentals)}>
            <Terminal size={14} /> Run Rental Listings Scrape
          </button>
        </div>

        {rentalListings.length === 0 ? (
          <div className="housing-empty">
            <p>No rental listings yet.</p>
            <p className="housing-empty-hint">Run <strong>Rental Listings</strong> → pick type → your city → Launch.</p>
          </div>
        ) : (
          <div className="housing-table-wrap">
            <table className="housing-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price/mo</th>
                  <th>What They Want (Tenant Requirements)</th>
                  <th>Phone</th>
                  <th>Post</th>
                  <th>CL Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentalListings.map((r, i) => {
                  const key      = `rental-${r.link || i}`
                  const ep       = getEP(key)
                  const pp       = getPhP(key)
                  const curPhone = pp.saved ? pp.value : (hasPhone(r.phone) ? r.phone : '')
                  const curEmail = ep.saved ? ep.value : (r.email || '')
                  return (
                    <tr key={i}>
                      <td>
                        <span className={`housing-type-badge type-${r.type?.toLowerCase().replace(/[^a-z]/g,'') || 'other'}`}>
                          {r.type || '—'}
                        </span>
                      </td>
                      <td className="housing-td-area">{r.location || '—'}</td>
                      <td className="housing-td-price">{r.price || '—'}</td>
                      <td className="housing-td-reqs">{r.requirements?.slice(0, 120) || 'None stated'}</td>

                      {/* ── Editable Phone ── */}
                      <td className="housing-td-cl-email">
                        {pp.open ? (
                          <div className="housing-cl-input-row">
                            <input
                              className="housing-cl-input"
                              type="tel"
                              autoFocus
                              placeholder="(602) 555-1234"
                              value={pp.value}
                              onChange={e => setPhP(key, { value: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') savePhone(key, 'rental', r.link)
                                if (e.key === 'Escape') setPhP(key, { open: false })
                              }}
                            />
                            <button className="housing-cl-save-btn" onClick={() => savePhone(key, 'rental', r.link)} disabled={pp.saving}>{pp.saving ? '…' : '✓'}</button>
                            <button className="housing-cl-cancel-btn" onClick={() => setPhP(key, { open: false })}>✕</button>
                          </div>
                        ) : curPhone ? (
                          <span className="housing-cl-saved housing-cl-editable" title="Click to edit" onClick={() => setPhP(key, { open: true, value: curPhone })}>
                            <Phone size={11} /> {curPhone.slice(0, 16)}{curPhone.length > 16 ? '…' : ''}
                          </span>
                        ) : (
                          <button className="housing-cl-add-btn" onClick={() => setPhP(key, { open: true })}>+ Add</button>
                        )}
                      </td>

                      <td><PostLink link={r.link} /></td>

                      {/* ── Editable CL Email ── */}
                      <td className="housing-td-cl-email">
                        {ep.open ? (
                          <div className="housing-cl-input-row">
                            <input
                              className="housing-cl-input"
                              type="email"
                              autoFocus
                              placeholder="paste CL email…"
                              value={ep.value}
                              onChange={e => setEP(key, { value: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveEmail(key, 'rental', r.link)
                                if (e.key === 'Escape') setEP(key, { open: false })
                              }}
                            />
                            <button className="housing-cl-save-btn" onClick={() => saveEmail(key, 'rental', r.link)} disabled={ep.saving}>{ep.saving ? '…' : '✓'}</button>
                            <button className="housing-cl-cancel-btn" onClick={() => setEP(key, { open: false })}>✕</button>
                          </div>
                        ) : curEmail ? (
                          <span className="housing-cl-saved housing-cl-editable" title="Click to edit" onClick={() => setEP(key, { open: true, value: curEmail })}>
                            <Mail size={11} /> {curEmail.slice(0, 22)}{curEmail.length > 22 ? '…' : ''}
                          </span>
                        ) : (
                          <button className="housing-cl-add-btn" onClick={() => setEP(key, { open: true })}>+ Add</button>
                        )}
                      </td>

                      <td>
                        <div className="housing-row-btns">
                          <TextBtn phone={r.phone} panelPhone={curPhone} />
                          <LandlordEmailBtn rental={r} toEmail={curEmail} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── MATCHES ─────────────────────────────────────────────── */}
      <section className="housing-section">
        <div className="housing-section-header">
          <div className="housing-section-title">
            <GitMerge size={18} />
            <h2>Rental Matches</h2>
            <span className="housing-section-count">{displayMatches.length}</span>
            {rentalMatches.length > 0 && (
              <span className="housing-section-sub">{perfectMatches} perfect · {goodMatches} good</span>
            )}
          </div>
          <div className="housing-section-title-right">
            {rentalMatches.length > 0 && (
              <div className="housing-toggle">
                <button
                  className={`housing-toggle-btn ${topMatchOnly ? 'housing-toggle-btn--active' : ''}`}
                  onClick={() => setTopMatchOnly(true)}
                >
                  Best per seeker ({topMatchPerSeeker().length})
                </button>
                <button
                  className={`housing-toggle-btn ${!topMatchOnly ? 'housing-toggle-btn--active' : ''}`}
                  onClick={() => setTopMatchOnly(false)}
                >
                  All matches ({rentalMatches.length})
                </button>
              </div>
            )}
            <button className="btn btn-primary housing-launch-btn" onClick={() => setActiveLaunch(SKILL_CONFIGS.matcher)}>
              <Terminal size={14} /> Run Rental Matcher
            </button>
          </div>
        </div>

        {rentalMatches.length === 0 ? (
          <div className="housing-empty">
            <p>No matches yet.</p>
            <p className="housing-empty-hint">
              <strong>Run in order:</strong><br />
              1. Craigslist FSBO → housing-wanted → seekers<br />
              2. Rental Listings → rentals<br />
              3. Rental Matcher → generates matched pairs + call scripts
            </p>
          </div>
        ) : (
          <div className="match-list">
            {displayMatches.map((m, i) => <MatchCard key={i} match={m} />)}
          </div>
        )}
      </section>

      {activeLaunch && (
        <SkillLauncher skill={activeLaunch} onClose={() => setActiveLaunch(null)} />
      )}
    </div>
  )
}
