import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { homedir } from 'os'

const HOME = homedir()
const OUT = resolve('src/data/live')
mkdirSync(OUT, { recursive: true })

// CSV parser that handles quoted fields with commas
function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = parseLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseLine(line)
    const obj = {}
    headers.forEach((h, i) => {
      obj[h.trim()] = (values[i] || '').trim()
    })
    return obj
  })
}

function parseLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

// Find most recent CSV in a directory
function latestCSV(dir) {
  if (!existsSync(dir)) return null
  const files = readdirSync(dir).filter((f) => f.endsWith('.csv')).sort()
  if (files.length === 0) return null
  return join(dir, files[files.length - 1])
}

// Read CSV file safely
function readCSV(path) {
  if (!path || !existsSync(path)) return []
  return parseCSV(readFileSync(path, 'utf-8'))
}

// Parse key=value markdown files
function parseKeyValue(path) {
  if (!existsSync(path)) return {}
  const obj = {}
  readFileSync(path, 'utf-8').split('\n').forEach((line) => {
    const eq = line.indexOf('=')
    if (eq > 0) {
      obj[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    }
  })
  return obj
}

// Write as ES module
function writeModule(name, data) {
  const path = join(OUT, `${name}.js`)
  writeFileSync(path, `export default ${JSON.stringify(data, null, 2)}\n`)
}

// --- Sync each source ---

// 1. Deals
const deals = readCSV(join(HOME, 'pipeline', 'deals.csv'))
writeModule('deals', deals)

// 2. Agents
const agents = readCSV(join(HOME, 'facebook_leads', 'master_leads.csv'))
writeModule('agents', agents)

// 3. Probate (latest file)
const probatePath = latestCSV(join(HOME, 'probate-leads'))
const probate = readCSV(probatePath)
writeModule('probate', probate)

// 4. Foreclosures (latest file)
const foreclosurePath = latestCSV(join(HOME, 'foreclosure-leads'))
const foreclosures = readCSV(foreclosurePath)
writeModule('foreclosures', foreclosures)

// 5. Cash buyers (latest file)
const cashBuyersPath = latestCSV(join(HOME, 'cash-buyers'))
const cashBuyers = readCSV(cashBuyersPath)
writeModule('cashBuyers', cashBuyers)

// 6. Dealership prospects
const dealerships = readCSV(join(HOME, 'car-sales-leads', 'dealership-prospects.csv'))
writeModule('dealerships', dealerships)

// 7. Bot status (merge state + config)
const botState = parseKeyValue(join(HOME, 'lead-bot-state.md'))
const botConfig = parseKeyValue(join(HOME, 'lead-bot-config.md'))
writeModule('botStatus', { ...botConfig, ...botState })

// 8. Meta
writeModule('meta', { lastSynced: new Date().toISOString() })

// 9. Invoices
const invoices = readCSV(join(HOME, 'invoices', 'invoices.csv'))
writeModule('invoices', invoices)

// 10. Skill runs
const skillRuns = readCSV(join(HOME, 'skill-runs.csv'))
writeModule('skillRuns', skillRuns)

// 11. Housing seekers (from craigslist-fsbo housing-wanted)
const seekers = readCSV(join(HOME, 'rental-leads', 'seekers.csv'))
writeModule('seekers', seekers)

// 12. Rental listings
const rentalListings = readCSV(join(HOME, 'rental-leads', 'rentals.csv'))
writeModule('rentalListings', rentalListings)

// 13. Rental matches
const rentalMatches = readCSV(join(HOME, 'rental-leads', 'matches.csv'))
writeModule('rentalMatches', rentalMatches)

// Summary
console.log(`Synced:`)
console.log(`  deals: ${deals.length}`)
console.log(`  agents: ${agents.length}`)
console.log(`  probate: ${probate.length}`)
console.log(`  foreclosures: ${foreclosures.length}`)
console.log(`  cashBuyers: ${cashBuyers.length}`)
console.log(`  dealerships: ${dealerships.length}`)
console.log(`  invoices: ${invoices.length}`)
console.log(`  skillRuns: ${skillRuns.length}`)
console.log(`  botStatus: ${Object.keys(botState).length + Object.keys(botConfig).length} keys`)
console.log(`  seekers: ${seekers.length}`)
console.log(`  rentalListings: ${rentalListings.length}`)
console.log(`  rentalMatches: ${rentalMatches.length}`)
console.log(`  → src/data/live/`)
