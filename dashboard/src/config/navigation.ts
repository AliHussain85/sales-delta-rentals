import type { LucideIcon } from 'lucide-react'
import { BarChart3, Handshake } from 'lucide-react'

export type DashboardPage = {
  id: string
  label: string
  description: string
  path: string
  icon: LucideIcon
}

export const dashboardPages: DashboardPage[] = [
  {
    id: 'daily-report',
    label: 'Daily Report',
    description: 'Inquiry reports by date range with CSV and image export.',
    path: '/daily-report',
    icon: BarChart3,
  },
  {
    id: 'close-deal',
    label: 'Close Deal',
    description: 'Match leads and close WhatsApp deals.',
    path: '/close-deal',
    icon: Handshake,
  },
]

export function findPageByPath(pathname: string) {
  return dashboardPages.find((page) => page.path === pathname)
}
