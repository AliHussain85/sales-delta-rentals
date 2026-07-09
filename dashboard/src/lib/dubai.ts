const DUBAI_TZ = 'Asia/Dubai'

export function getDubaiToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: DUBAI_TZ })
}

export function dubaiParts(date: Date): Record<string, string> {
  const parts: Record<string, string> = {}
  new Intl.DateTimeFormat('en-GB', {
    timeZone: DUBAI_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .formatToParts(date)
    .forEach((part) => {
      parts[part.type] = part.value
    })
  return parts
}

export function formatDubaiDate(date: Date): string {
  const parts = dubaiParts(date)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function formatDubaiDateTime(timestamp: string): string {
  const date = new Date(timestamp)
  const datePart = date.toLocaleDateString('en-CA', { timeZone: DUBAI_TZ })
  const timePart = date.toLocaleTimeString('en-US', {
    timeZone: DUBAI_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${datePart} ${timePart}`
}

/**
 * inquiry_time is stored as UAE wall-clock time but labeled UTC (+00:00).
 * Strip the wrong offset and re-interpret the value as +04:00 (Asia/Dubai)
 * to get the real moment in time.
 */
export function parseUaeStoredTimestamp(timestamp: string): Date {
  const wallClock = timestamp.replace(/(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/, '')
  return new Date(`${wallClock}+04:00`)
}

/** Format a UAE-stored timestamp in the viewer's local timezone (12-hour). */
export function formatLeadLocalDateTime(timestamp: string): string {
  const date = parseUaeStoredTimestamp(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  const datePart = date.toLocaleDateString('en-CA')
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${datePart} ${timePart}`
}

export function formatDateHeader(fromStr: string, toStr: string): string {
  const fmt = (str: string) =>
    new Date(`${str}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  if (fromStr === toStr) return fmt(fromStr)

  const fmtShort = (str: string) =>
    new Date(`${str}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return `${fmtShort(fromStr)} → ${fmtShort(toStr)}`
}

export function formatTimeUae(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: DUBAI_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatShortDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const normalized = dateStr.length === 16 ? `${dateStr}:00` : dateStr
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function getInquiryDatePart(dateStr?: string | null): string | null {
  if (!dateStr) return null
  return dateStr.slice(0, 10)
}
