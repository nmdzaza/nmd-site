import { useState, useMemo } from 'react'

export default function useSort(data, defaultKey, defaultDir = 'asc') {
  const [sortKey, setSortKey] = useState(defaultKey)
  const [sortDir, setSortDir] = useState(defaultDir)

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      let aVal = a[sortKey] ?? ''
      let bVal = b[sortKey] ?? ''

      // Try numeric comparison (strip $ and commas)
      const aNum = parseFloat(String(aVal).replace(/[$,]/g, ''))
      const bNum = parseFloat(String(bVal).replace(/[$,]/g, ''))
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDir === 'asc' ? aNum - bNum : bNum - aNum
      }

      // String comparison
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return { sorted, sortKey, sortDir, toggleSort }
}
