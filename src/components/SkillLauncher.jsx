import { useState } from 'react'
import { X, Terminal, Check, Info, Gift } from 'lucide-react'
import skillInputs from '../data/skillInputs'

export default function SkillLauncher({ skill, onClose }) {
  const inputs = skillInputs[skill.slug] || null
  const [values, setValues] = useState(() => {
    if (!inputs) return { freeform: '' }
    const init = {}
    inputs.forEach((f) => { init[f.name] = f.defaultValue || '' })
    return init
  })
  const [status, setStatus] = useState('idle') // idle | launching | launched | error

  function set(name, val) {
    setValues((prev) => ({ ...prev, [name]: val }))
  }

  async function handleLaunch() {
    setStatus('launching')
    const inputStr = inputs
      ? inputs.map((f) => values[f.name]).filter(Boolean).join(' ')
      : values.freeform.trim()

    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skill.slug, inputs: inputStr }),
      })
      if (!res.ok) throw new Error('Launch failed')
      setStatus('launched')
      fetch('/api/skill-runs/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skill.slug, inputs: inputStr, status: 'LAUNCHED' }),
      }).catch(() => {})
      setTimeout(onClose, 2500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal skill-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{skill.name}</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* What this does */}
        {skill.guide && (
          <div className="skill-guide-box">
            <div className="skill-guide-label">
              <Info size={14} />
              What this does
            </div>
            <p className="skill-guide-text">{skill.guide}</p>
          </div>
        )}

        {/* What you'll get */}
        {skill.youGet && (
          <div className="skill-output-box">
            <div className="skill-output-label">
              <Gift size={14} />
              What you'll get back
            </div>
            <p className="skill-output-text">{skill.youGet}</p>
          </div>
        )}

        {/* Inputs */}
        <div className="modal-body">
          <div className="skill-inputs-label">Fill in and hit Launch</div>
          {inputs ? (
            inputs.map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className="form-input"
                    value={values[field.name]}
                    onChange={(e) => set(field.name, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className="form-input form-textarea"
                    value={values[field.name]}
                    onChange={(e) => set(field.name, e.target.value)}
                    placeholder={field.placeholder || ''}
                    rows={3}
                  />
                ) : (
                  <input
                    className="form-input"
                    type="text"
                    value={values[field.name]}
                    onChange={(e) => set(field.name, e.target.value)}
                    placeholder={field.placeholder || ''}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="form-group">
              <label className="form-label">Additional Instructions (optional)</label>
              <textarea
                className="form-input form-textarea"
                value={values.freeform}
                onChange={(e) => set('freeform', e.target.value)}
                placeholder="Add any specific details or leave blank to run with defaults..."
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {status === 'launched' ? (
            <div className="launch-success">
              <Check size={18} />
              <span>Launched — check Terminal window</span>
            </div>
          ) : status === 'error' ? (
            <div className="launch-error">
              <span>Failed to launch. Is the server running?</span>
              <button className="btn btn-primary" onClick={handleLaunch}>Retry</button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-launch"
              onClick={handleLaunch}
              disabled={status === 'launching'}
            >
              <Terminal size={16} />
              {status === 'launching' ? 'Launching...' : 'Launch in Terminal'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
