export type ClosedLeadRecord = {
  leadId: string
  phone: string
  amount: number
  closedAt: string
}

const STORAGE_KEY = 'delta-rentals-closed-leads'

function readAll(): Record<string, ClosedLeadRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, ClosedLeadRecord>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function getClosedLeadsMap(): Record<string, ClosedLeadRecord> {
  return readAll()
}

export function getClosedLeadIds(): Set<string> {
  return new Set(Object.keys(readAll()))
}

export function markLeadClosed(record: ClosedLeadRecord) {
  const all = readAll()
  all[record.leadId] = record
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function isLeadClosed(leadId: string | number, closedMap?: Record<string, ClosedLeadRecord>): boolean {
  const map = closedMap ?? readAll()
  return Boolean(map[String(leadId)])
}
