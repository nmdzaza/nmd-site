import { useState } from 'react'
import probate from '../data/live/probate.js'
import foreclosures from '../data/live/foreclosures.js'
import cashBuyers from '../data/live/cashBuyers.js'
import dealerships from '../data/live/dealerships.js'
import DataTable from '../components/DataTable'
import TabNav from '../components/TabNav'

const tabs = ['Probate', 'Foreclosure', 'Cash Buyers', 'Dealerships']

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
          {probate.length} probate, {foreclosures.length} foreclosure, {cashBuyers.length} cash buyers, {dealerships.length} dealerships
        </p>
      </div>
      <TabNav tabs={tabs} active={active} onChange={setActive} />
      <DataTable columns={config.columns} data={config.data} defaultSort={config.sort} />
    </div>
  )
}
