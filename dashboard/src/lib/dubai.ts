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

/**
 * Format booking inquiry_start_date (UAE wall-clock, e.g. "2026-08-05T00:57")
 * as 12-hour time. No timezone conversion — value is already Dubai local.
 */
export function formatInquiryStartTime(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const match = dateStr.match(/T(\d{2}):(\d{2})/)
  if (!match) return '—'
  let hour = Number(match[1])
  const minute = match[2]
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${ampm}`
}
