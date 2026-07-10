import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { LeadSelect, buildLeadOptions } from '../components/LeadSelect'
import { supabaseData } from '../lib/supabase'
import { formatDubaiDate, formatDubaiDateTime } from '../lib/dubai'
import {
  getClosedLeadsMap,
  markLeadClosed,
  type ClosedLeadRecord,
} from '../lib/closedLeads'
import {
  WEBHOOK_DEAL_CLOSED,
  type DealClosedPayload,
  type LeadFilter,
  type WhatsAppLead,
} from '../lib/types'

const FILTERS: { id: LeadFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: '30', label: 'Last 30 Days' },
  { id: 'date', label: 'By Date' },
]

const fieldClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-gold/50 focus:ring-2 focus:ring-gold/20'

function mapRow(row: Record<string, unknown>): WhatsAppLead {
  return {
    id: row.id as string | number,
    inquiry_time: row.inquiry_time as string,
    gclid: (row.gclid as string) || null,
    utm_source: (row.utm_source as string) || null,
    utm_campaign: (row.utm_campaign as string) || null,
    country: (row.country as string) || 'Unknown',
    country_code: String(row.country_code || '').toUpperCase(),
    city: (row.city as string) || '',
    region: (row.region as string) || '',
  }
}

function buildPayload(lead: WhatsAppLead, phone: string, amount: number): DealClosedPayload {
  return {
    event: 'deal_closed',
    closed_at: new Date().toISOString(),
    click_id: lead.id,
    inquiry_time: lead.inquiry_time,
    gclid: lead.gclid,
    utm_source: lead.utm_source,
    utm_campaign: lead.utm_campaign,
    country: lead.country,
    country_code: lead.country_code,
    city: lead.city,
    region: lead.region,
    phone,
    deal_amount: amount,
    deal_amount_currency: 'AED',
  }
}

export function CloseDealPage() {
  const [leads, setLeads] = useState<WhatsAppLead[]>([])
  const [closedMap, setClosedMap] = useState<Record<string, ClosedLeadRecord>>(() =>
    getClosedLeadsMap(),
  )
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<LeadFilter>('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; message: string } | null>(null)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    const { data, error } = await supabaseData
      .from('whatsapp_clicks')
      .select('id,inquiry_time,gclid,utm_source,utm_campaign,country,country_code,city,region')
      .order('inquiry_time', { ascending: false })
      .limit(2000)

    if (error) {
      setLeads([])
      setLoadError(error.message)
    } else {
      setLeads((data || []).map(mapRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const filteredLeads = useMemo(() => {
    const now = new Date()
    return leads
      .filter((lead) => {
        if (!lead.inquiry_time) return false
        const inquiryDate = new Date(lead.inquiry_time)
        if (activeFilter === 'today') {
          return formatDubaiDate(inquiryDate) === formatDubaiDate(now)
        }
        if (activeFilter === '30') {
          return now.getTime() - inquiryDate.getTime() <= 30 * 864e5
        }
        if (activeFilter === 'date') {
          return selectedDate ? formatDubaiDate(inquiryDate) === selectedDate : false
        }
        return true
      })
      .sort((a, b) => new Date(b.inquiry_time).getTime() - new Date(a.inquiry_time).getTime())
  }, [leads, activeFilter, selectedDate])

  const leadOptions = useMemo(
    () => buildLeadOptions(filteredLeads, closedMap),
    [filteredLeads, closedMap],
  )

  const closedInFilterCount = useMemo(
    () => leadOptions.filter((opt) => opt.closed).length,
    [leadOptions],
  )

  useEffect(() => {
    if (!leadOptions.some((opt) => opt.value === selectedLeadId)) {
      setSelectedLeadId('')
    }
  }, [leadOptions, selectedLeadId])

  const selectedLead = filteredLeads.find((lead) => String(lead.id) === selectedLeadId) ?? null

  async function handleSubmit() {
    const parsedAmount = parseFloat(amount)

    if (!selectedLead) {
      setStatus({ type: 'err', message: 'Select a lead first.' })
      return
    }
    if (!phone.trim()) {
      setStatus({ type: 'err', message: 'Enter a phone number.' })
      return
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setStatus({ type: 'err', message: 'Enter a valid AED amount.' })
      return
    }

    setSubmitting(true)
    setStatus(null)

    try {
      const payload = buildPayload(selectedLead, phone.trim(), parsedAmount)
      const res = await fetch(WEBHOOK_DEAL_CLOSED, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Webhook returned ${res.status}`)

      const record: ClosedLeadRecord = {
        leadId: String(selectedLead.id),
        phone: phone.trim(),
        amount: parsedAmount,
        closedAt: new Date().toISOString(),
      }
      markLeadClosed(record)
      setClosedMap(getClosedLeadsMap())

      setStatus({
        type: 'ok',
        message: `✓ Deal closed — AED ${parsedAmount.toLocaleString()} sent!`,
      })
    } catch {
      setStatus({ type: 'err', message: "Couldn't send to webhook. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Close Deal</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Match a WhatsApp lead and submit the closed deal.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:p-8">
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Filter By
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={[
                    'rounded-xl border px-2 py-3 text-[11px] font-semibold uppercase tracking-wide transition',
                    activeFilter === filter.id
                      ? 'border-transparent bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'border-border bg-neutral-50 text-neutral-600 hover:border-violet-300 hover:text-neutral-900',
                  ].join(' ')}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {activeFilter === 'date' && (
              <input
                type="date"
                value={selectedDate ?? ''}
                onChange={(event) => setSelectedDate(event.target.value || null)}
                className={fieldClass}
              />
            )}
          </section>

          <section className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Select Lead
            </p>
            <LeadSelect
              options={leadOptions}
              value={selectedLeadId}
              onChange={setSelectedLeadId}
              loading={loading}
              disabled={!loading && leadOptions.length === 0}
              placeholder={
                activeFilter === 'date' && !selectedDate
                  ? 'Pick a date above first…'
                  : 'Search leads by date, city, country, GCLID…'
              }
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
              <span>
                <span className="font-semibold text-gold-dark">{loading ? '…' : leadOptions.length}</span>{' '}
                leads in filter
              </span>
              {closedInFilterCount > 0 && (
                <span className="font-medium text-green-700">
                  {closedInFilterCount} marked as saved
                </span>
              )}
            </div>
            {selectedLead && (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                <span className="font-semibold text-neutral-900">Selected:</span>{' '}
                {formatDubaiDateTime(selectedLead.inquiry_time)} ·{' '}
                {selectedLead.city ? `${selectedLead.city}, ${selectedLead.country}` : selectedLead.country}
              </div>
            )}
            {loadError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                Couldn't load from Supabase: {loadError}
              </p>
            )}
          </section>

          <section className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Phone Number
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+971 56 669 9228"
              className={fieldClass}
            />
          </section>

          <section className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Deal Amount (AED)
            </p>
            <input
              type="number"
              min={0}
              step={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter AED amount"
              className={fieldClass}
            />
          </section>

          <button
            type="button"
            disabled={submitting || loading}
            onClick={handleSubmit}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-violet-200 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Closing…
              </>
            ) : (
              'Close Deal'
            )}
          </button>

          {status && (
            <p
              className={[
                'mt-4 text-center text-sm font-semibold',
                status.type === 'ok' ? 'text-green-600' : 'text-red-600',
              ].join(' ')}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
