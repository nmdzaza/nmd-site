import express from 'express'
import { execFile, exec } from 'child_process'
import { writeFileSync, chmodSync, readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { tmpdir, homedir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

// Helper: parse a single CSV line respecting quoted fields
function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { fields.push(current); current = ''; continue }
    current += ch
  }
  fields.push(current)
  return fields
}

// Helper: serialize a CSV field — re-quotes if value contains comma, quote, or newline
function serializeCSVField(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

// Helper: normalize line endings (CRLF and bare CR → LF)
function normalizeLines(raw) {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

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
    ? `claude --model sonnet "/${skill} ${safeInputs}"`
    : `claude --model sonnet "/${skill}"`

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

// POST /api/agents/update — Update status/notes/email for an agent in master_leads.csv
app.post('/api/agents/update', (req, res) => {
  const { hit, status, notes, email } = req.body
  if (!hit) return res.status(400).json({ error: 'hit (row number) is required' })

  const csvPath = join(homedir(), 'facebook_leads', 'master_leads.csv')
  let raw
  try {
    raw = readFileSync(csvPath, 'utf-8')
  } catch (err) {
    return res.status(500).json({ error: 'Could not read master_leads.csv' })
  }

  const lines = normalizeLines(raw).split('\n')
  const headers = lines[0].split(',')
  const statusIdx = headers.indexOf('Status')
  const notesIdx  = headers.indexOf('Notes')
  const emailIdx  = headers.indexOf('Email')

  let updated = false
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const fields = parseCSVLine(lines[i])

    if (fields[0] === String(hit)) {
      if (status) fields[statusIdx] = status
      if (notes !== undefined) fields[notesIdx] = notes
      if (email !== undefined && emailIdx >= 0) fields[emailIdx] = email
      lines[i] = fields.map(serializeCSVField).join(',')
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

  res.json({ ok: true, hit, status, notes, email })
})

// POST /api/housing/save-email — Save a Craigslist reply-to email to a seeker or rental row
app.post('/api/housing/save-email', (req, res) => {
  const { type, link, email } = req.body
  if (!type || !link || email === undefined) {
    return res.status(400).json({ error: 'type, link, and email are required' })
  }

  const csvFile = type === 'seeker' ? 'seekers.csv' : 'rentals.csv'
  const csvPath = join(homedir(), 'rental-leads', csvFile)

  if (!existsSync(csvPath)) {
    return res.status(404).json({ error: `${csvFile} not found — run the scraper first` })
  }

  let raw
  try {
    raw = readFileSync(csvPath, 'utf-8')
  } catch {
    return res.status(500).json({ error: 'Could not read CSV' })
  }

  const lines = normalizeLines(raw).split('\n')
  let headers = lines[0].split(',')

  // Add email column if not present yet
  let emailIdx = headers.indexOf('email')
  if (emailIdx < 0) {
    headers.push('email')
    emailIdx = headers.length - 1
    lines[0] = headers.join(',')
    // Pad existing data rows with empty email field
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) lines[i] = lines[i] + ','
    }
  }

  const linkIdx = headers.indexOf('link')
  if (linkIdx < 0) return res.status(500).json({ error: 'No link column found in CSV' })

  let updated = false
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const fields = parseCSVLine(lines[i])
    while (fields.length < headers.length) fields.push('')

    if (fields[linkIdx] === link) {
      fields[emailIdx] = email
      lines[i] = fields.map(serializeCSVField).join(',')
      updated = true
      break
    }
  }

  if (!updated) return res.status(404).json({ error: 'Row not found — link may have changed' })

  try {
    writeFileSync(csvPath, lines.join('\n'))
  } catch {
    return res.status(500).json({ error: 'Could not write CSV' })
  }

  res.json({ ok: true, type, link, email })
})

// POST /api/housing/save-phone — Save a manually found phone number to a seeker or rental row
app.post('/api/housing/save-phone', (req, res) => {
  const { type, link, phone } = req.body
  if (!type || !link || phone === undefined) {
    return res.status(400).json({ error: 'type, link, and phone are required' })
  }

  const csvFile = type === 'seeker' ? 'seekers.csv' : 'rentals.csv'
  const csvPath = join(homedir(), 'rental-leads', csvFile)

  if (!existsSync(csvPath)) {
    return res.status(404).json({ error: `${csvFile} not found` })
  }

  let raw
  try {
    raw = readFileSync(csvPath, 'utf-8')
  } catch {
    return res.status(500).json({ error: 'Could not read CSV' })
  }

  const lines = normalizeLines(raw).split('\n')
  const headers = lines[0].split(',')
  const linkIdx  = headers.indexOf('link')
  const phoneIdx = headers.indexOf('phone')

  if (linkIdx  < 0) return res.status(500).json({ error: 'No link column in CSV' })
  if (phoneIdx < 0) return res.status(500).json({ error: 'No phone column in CSV' })

  let updated = false
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const fields = parseCSVLine(lines[i])
    while (fields.length < headers.length) fields.push('')
    if (fields[linkIdx] === link) {
      fields[phoneIdx] = phone
      lines[i] = fields.map(serializeCSVField).join(',')
      updated = true
      break
    }
  }

  if (!updated) return res.status(404).json({ error: 'Row not found' })

  try {
    writeFileSync(csvPath, lines.join('\n'))
  } catch {
    return res.status(500).json({ error: 'Could not write CSV' })
  }

  res.json({ ok: true, type, link, phone })
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

// POST /api/housing/fetch-post — Fetch and analyze a live Craigslist post
app.post('/api/housing/fetch-post', async (req, res) => {
  const { url } = req.body
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' })
  }
  let parsedUrl
  try {
    parsedUrl = new URL(url)
    if (!parsedUrl.hostname.endsWith('craigslist.org')) {
      return res.status(400).json({ error: 'Only Craigslist URLs are supported' })
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    })
    if (!resp.ok) {
      return res.status(502).json({ error: `Post returned HTTP ${resp.status} — it may have expired` })
    }
    const html = await resp.text()

    // Title
    const titleMatch = html.match(/<span id="titletextonly">([^<]+)<\/span>/)
    const title = titleMatch ? titleMatch[1].trim() : ''

    // Posting body
    const bodyMatch = html.match(/<section[^>]*id="postingbody"[^>]*>([\s\S]*?)<\/section>/)
    let bodyText = ''
    if (bodyMatch) {
      bodyText = bodyMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/QR Code Link to This Post/gi, '')
        .trim()
    }

    // Price
    const priceMatch = html.match(/<span class="price">(\$[\d,]+)<\/span>/)
    const price = priceMatch ? priceMatch[1] : ''

    // Phone numbers visible in body
    const phoneRaw = bodyText.match(/(\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4})/g) || []
    const phones = [...new Set(phoneRaw)]

    // Areas / neighborhoods mentioned
    const areaSet = new Set()
    const neighborhoodRx = /\b(downtown|midtown|uptown|east valley|west valley|north phoenix|south phoenix|central phoenix|scottsdale|tempe|mesa|chandler|gilbert|glendale|peoria|avondale|goodyear|surprise|ahwatukee|arcadia|biltmore|camelback|fountain hills|cave creek|queen creek|buckeye|laveen|tolleson)\b/gi
    const zipRx = /\b85\d{3}\b/g;
    (bodyText.match(neighborhoodRx) || []).forEach(a => areaSet.add(a.trim().toLowerCase()))
    ;(bodyText.match(zipRx) || []).forEach(a => areaSet.add(a.trim()))
    const areas = [...areaSet]

    // Requirements / preferences detected
    const reqMap = {
      'No pets': /no pets?|no animals|pet[- ]?free/i,
      'Pets OK': /\bpets (ok|okay|allowed|welcome)\b/i,
      'No smoking': /no smok|non-?smok|smoke[- ]?free/i,
      'Employed only': /must be employed|employment (required|verif)|verif.{0,10}employment/i,
      'Credit check': /credit check|credit score|good credit/i,
      'Background check': /background check/i,
      'References required': /references (required|needed)/i,
      'First + last + deposit': /first.{0,15}last.{0,15}deposit/i,
      'Income 3x rent': /3x.{0,10}(rent|monthly)/i,
      'Students welcome': /students (ok|okay|welcome)/i,
      'Professionals only': /professionals? only|working professional/i,
      'Quiet/clean lifestyle': /quiet.{0,25}clean|clean.{0,25}quiet/i,
      'Section 8 OK': /section 8|housing voucher/i,
      'Short-term OK': /short.?term|month.to.month|m2m/i,
      'Utilities included': /utilities (included|incl\.?|paid)/i,
    }
    const requirements = []
    for (const [label, pattern] of Object.entries(reqMap)) {
      if (pattern.test(bodyText)) requirements.push(label)
    }

    res.json({
      ok: true,
      title,
      body: bodyText.slice(0, 2500),
      phones,
      price,
      areas,
      requirements,
    })
  } catch (err) {
    console.error('fetch-post error:', err.message)
    res.status(500).json({ error: 'Failed to fetch post: ' + err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`NMD API server running on http://localhost:${PORT}`)
})
