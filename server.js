import express from 'express'
import { execFile, exec } from 'child_process'
import { writeFileSync, chmodSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { tmpdir, homedir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

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
      return res.status(500).json({ error: 'Failed to open Terminal' })
    }
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`NMD API server running on http://localhost:${PORT}`)
})
