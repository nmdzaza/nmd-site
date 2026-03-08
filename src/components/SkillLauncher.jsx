import { useState } from 'react'
import { X, Terminal, Check } from 'lucide-react'
import skillInputs from '../data/skillInputs'

export default function SkillLauncher({ skill, onClose }) {
  const inputs = skillInputs[skill.slug] || null
  const [values, setValues] = useState(() => {
    if (!inputs) return { freeform: '' }
    const init = {}
    inputs.forEach((f) => {
      init[f.name] = f.defaultValue || ''
    })
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
      setTimeout(onClose, 2000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{skill.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {skill.description && (
          <p className="modal-desc">{skill.description}</p>
        )}

        <div className="modal-body">
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
                    rows={4}
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
              <label className="form-label">Instructions</label>
              <textarea
                className="form-input form-textarea"
                value={values.freeform}
                onChange={(e) => set('freeform', e.target.value)}
                placeholder="Describe what you need..."
                rows={4}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          {status === 'launched' ? (
            <div className="launch-success">
              <Check size={18} />
              <span>Launched — check Terminal</span>
            </div>
          ) : status === 'error' ? (
            <div className="launch-error">
              <span>Failed to launch. Is the dev server running?</span>
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
