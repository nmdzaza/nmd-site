import express from 'express'
import { execFile, exec } from 'child_process'
import { writeFileSync, chmodSync, readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { tmpdir, homedir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

// Helper: log a skill run to ~/skill-runs.csv
function logSkillRun(skill, inputs, status) {
  const csvPath = join(homedir(), 'skill-runs.csv')
  if (!existsSync(csvPath)) {
    writeFileSync(csvPath, 'timestamp,skill,inputs,status\n')
  }
  const row = [
    new Date().toISOString(),
    skill,
    `"${(inputs || '').replace(/"/g, '""')}"`,
    status,
  ].join(',')
  appendFileSync(csvPath, row + '\n')
}

// Helper: calculate lead package price
function calculatePrice(count) {
  const bundles = Math.floor(count / 5)
  const singles = count % 5
  return bundles * 150 + singles * 50
}

// POST /api/launch — Open Terminal with Claude CLI skill command
app.post('/api/launch', (req, res) => {
  const { skill, inputs } = req.body
  if (!skill || typeof skill !== 'string') {
    return res.status(400).json({ error: 'skill is required' })
  }

  // Sanitize: only allow alphanumeric, hyphens, spaces, commas, periods in inputs
  const safeInputs = (inputs || '').replace(/[^\w\s,.\-\/]/g, '')
  const command = safeInputs
    ? `claude "/${skill} ${safeInputs}"`
    : `claude "/${skill}"`

  // Write a temp script and open it in Terminal (avoids AppleScript permission issues)
  const scriptPath = join(tmpdir(), `nmd-launch-${Date.now()}.sh`)
  writeFileSync(scriptPath, `#!/bin/bash\n${command}\n`)
  chmodSync(scriptPath, '755')

  exec(`open -a Terminal "${scriptPath}"`, (err) => {
    if (err) {
      console.error('Terminal launch error:', err.message)
      logSkillRun(skill, safeInputs, 'FAILED')
      return res.status(500).json({ error: 'Failed to open Terminal' })
    }
    logSkillRun(skill, safeInputs, 'LAUNCHED')
    res.json({ ok: true, command })
  })
})

// POST /api/sync — Re-run data sync script
app.post('/api/sync', (req, res) => {
  const syncScript = join(__dirname, 'scripts', 'sync.js')
  execFile('node', [syncScript], (err, stdout, stderr) => {
    if (err) {
      console.error('Sync error:', stderr)
      return res.status(500).json({ error: 'Sync failed', details: stderr })
    }
    console.log('Sync output:', stdout)
    res.json({ ok: true, output: stdout.trim() })
  })
})

// POST /api/agents/update — Update status/notes for an agent in master_leads.csv
app.post('/api/agents/update', (req, res) => {
  const { hit, status, notes } = req.body
  if (!hit) return res.status(400).json({ error: 'hit (row number) is required' })

  const csvPath = join(homedir(), 'facebook_leads', 'master_leads.csv')
  let raw
  try {
    raw = readFileSync(csvPath, 'utf-8')
  } catch (err) {
    return res.status(500).json({ error: 'Could not read master_leads.csv' })
  }

  const lines = raw.split('\n')
  const header = lines[0]
  const headers = header.split(',')
  const statusIdx = headers.indexOf('Status')
  const notesIdx = headers.indexOf('Notes')

  let updated = false
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    // Parse CSV line respecting quotes
    const fields = []
    let current = ''
    let inQuotes = false
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue }
      if (ch === ',' && !inQuotes) { fields.push(current); current = ''; continue }
      current += ch
    }
    fields.push(current)

    if (fields[0] === String(hit)) {
      if (status) fields[statusIdx] = status
      if (notes !== undefined) {
        // Wrap notes in quotes if it contains commas
        fields[notesIdx] = notes.includes(',') ? `"${notes}"` : notes
      }
      lines[i] = fields.map((f, idx) => {
        if (idx === notesIdx && f.includes(',') && !f.startsWith('"')) return `"${f}"`
        return f
      }).join(',')
      updated = true
      break
    }
  }

  if (!updated) return res.status(404).json({ error: 'Agent not found' })

  try {
    writeFileSync(csvPath, lines.join('\n'))
  } catch (err) {
    return res.status(500).json({ error: 'Could not write master_leads.csv' })
  }

  res.json({ ok: true, hit, status, notes })
})

// POST /api/leads/send — Send lead package to agent + auto-create invoice
app.post('/api/leads/send', (req, res) => {
  const { agentName, agentEmail, leads } = req.body
  if (!agentName || !leads || !leads.length) {
    return res.status(400).json({ error: 'agentName and leads[] are required' })
  }

  const amount = calculatePrice(leads.length)
  const invoiceId = `INV-${Date.now()}`
  const date = new Date().toISOString().split('T')[0]

  // Build lead package email body
  let body = `${agentName},\n\nHere's your lead package from NMD Solutions. ${leads.length} qualified lead${leads.length > 1 ? 's' : ''} in your market:\n\n`

  leads.forEach((lead, i) => {
    body += `--- LEAD ${i + 1} ---\n`
    body += `Property: ${lead.property_address || lead.Property_Address || '--'}\n`
    if (lead.case_number) body += `Case #: ${lead.case_number}\n`
    if (lead.type) body += `Type: ${lead.type}\n`
    if (lead.decedent) body += `Decedent: ${lead.decedent}\n`
    if (lead.Owner_Name) body += `Owner: ${lead.Owner_Name}\n`
    if (lead.executor) body += `Executor: ${lead.executor}\n`
    if (lead.attorney) body += `Attorney: ${lead.attorney}\n`
    const value = lead.est_value || lead.ARV || ''
    if (value) body += `Est. Value: $${parseInt(value).toLocaleString()}\n`
    if (lead.lien_status || lead.Lien_Status) body += `Lien Status: ${lead.lien_status || lead.Lien_Status}\n`
    if (lead.priority || lead.Priority) body += `Priority: ${lead.priority || lead.Priority}\n`
    if (lead.lien_notes) body += `Notes: ${lead.lien_notes}\n`
    if (lead.Notes) body += `Notes: ${lead.Notes}\n`
    body += `---\n\n`
  })

  body += `Total: ${leads.length} lead${leads.length > 1 ? 's' : ''} — $${amount}\n`
  body += `Invoice #: ${invoiceId}\n\n`
  body += `Cameron Johnson\nNMD Solutions\ncamjohn816@gmail.com\n`

  // Create invoice CSV
  const invoicesDir = join(homedir(), 'invoices')
  if (!existsSync(invoicesDir)) mkdirSync(invoicesDir, { recursive: true })

  const invoicesPath = join(invoicesDir, 'invoices.csv')
  if (!existsSync(invoicesPath)) {
    writeFileSync(invoicesPath, 'invoice_id,agent_name,agent_email,date,leads_sent,lead_details,amount,status,notes\n')
  }

  const leadDetails = leads.map(l => l.case_number || l.Property_Address || 'unknown').join(';')
  const leadType = leads[0]?.type ? 'probate' : 'foreclosure'
  const invoiceRow = [
    invoiceId,
    `"${agentName}"`,
    agentEmail || '',
    date,
    leads.length,
    `"${leadDetails}"`,
    amount,
    'PENDING',
    `"${leads.length} ${leadType} leads"`,
  ].join(',')
  appendFileSync(invoicesPath, invoiceRow + '\n')

  // Build mailto URL
  const subject = encodeURIComponent(`Lead Package from NMD Solutions — ${leads.length} leads`)
  const encodedBody = encodeURIComponent(body)
  const cc = encodeURIComponent('camjohn816@gmail.com')
  const to = encodeURIComponent(agentEmail || '')
  const mailtoUrl = `mailto:${to}?cc=${cc}&subject=${subject}&body=${encodedBody}`

  res.json({ ok: true, invoiceId, amount, mailtoUrl, leadCount: leads.length })
})

// POST /api/invoices/update — Update invoice status/notes
app.post('/api/invoices/update', (req, res) => {
  const { invoice_id, status, notes } = req.body
  if (!invoice_id) return res.status(400).json({ error: 'invoice_id is required' })

  const csvPath = join(homedir(), 'invoices', 'invoices.csv')
  let raw
  try {
    raw = readFileSync(csvPath, 'utf-8')
  } catch {
    return res.status(500).json({ error: 'Could not read invoices.csv' })
  }

  const lines = raw.split('\n')
  const headers = lines[0].split(',')
  const idIdx = headers.indexOf('invoice_id')
  const statusIdx = headers.indexOf('status')
  const notesIdx = headers.indexOf('notes')

  let updated = false
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const fields = []
    let current = ''
    let inQuotes = false
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue }
      if (ch === ',' && !inQuotes) { fields.push(current); current = ''; continue }
      current += ch
    }
    fields.push(current)

    if (fields[idIdx] === invoice_id) {
      if (status) fields[statusIdx] = status
      if (notes !== undefined) {
        fields[notesIdx] = notes.includes(',') ? `"${notes}"` : notes
      }
      lines[i] = fields.map((f, idx) => {
        if ((idx === notesIdx || idx === headers.indexOf('lead_details') || idx === headers.indexOf('agent_name')) && f.includes(',') && !f.startsWith('"')) return `"${f}"`
        return f
      }).join(',')
      updated = true
      break
    }
  }

  if (!updated) return res.status(404).json({ error: 'Invoice not found' })

  try {
    writeFileSync(csvPath, lines.join('\n'))
  } catch {
    return res.status(500).json({ error: 'Could not write invoices.csv' })
  }

  res.json({ ok: true, invoice_id, status, notes })
})

// POST /api/skill-runs/log — Record a skill execution
app.post('/api/skill-runs/log', (req, res) => {
  const { skill, inputs, status } = req.body
  if (!skill) return res.status(400).json({ error: 'skill is required' })
  logSkillRun(skill, inputs || '', status || 'LAUNCHED')
  res.json({ ok: true })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`NMD API server running on http://localhost:${PORT}`)
})
