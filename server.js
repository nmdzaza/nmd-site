import express from 'express'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

  const script = `tell application "Terminal"
  activate
  do script "${command.replace(/"/g, '\\"')}"
end tell`

  execFile('osascript', ['-e', script], (err) => {
    if (err) {
      console.error('AppleScript error:', err.message)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`NMD API server running on http://localhost:${PORT}`)
})
