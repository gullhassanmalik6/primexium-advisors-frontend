import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND, ROUTES } from '@/constants'
import type { AdminLead, LeadStatus } from '@/types/admin'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'converted', 'closed']

function tone(status: LeadStatus) {
  if (status === 'converted' || status === 'qualified') return 'success'
  if (status === 'closed') return 'neutral'
  if (status === 'contacted') return 'info'
  return 'warning'
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filter, setFilter] = useState<LeadStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})
  const [convertingId, setConvertingId] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    try {
      const result = await adminApi.listLeads({
        status: filter || undefined,
        leadType: typeFilter || undefined,
      })
      setLeads(result.items)
      setNotesDraft(
        Object.fromEntries(result.items.map((lead) => [lead.id, lead.notes ?? ''])),
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    void load()
  }, [filter, typeFilter])

  const updateStatus = async (id: string, status: LeadStatus) => {
    setSuccess(null)
    try {
      const updated = await adminApi.updateLeadStatus(id, status, notesDraft[id])
      setLeads((prev) => prev.map((lead) => (lead.id === id ? updated : lead)))
      setSuccess(`Lead marked as ${status}.`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const saveNotes = async (id: string) => {
    const lead = leads.find((item) => item.id === id)
    if (!lead) return
    setSuccess(null)
    try {
      const updated = await adminApi.updateLeadStatus(id, lead.status, notesDraft[id])
      setLeads((prev) => prev.map((item) => (item.id === id ? updated : item)))
      setSuccess('CRM notes saved.')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const convertLead = async (id: string) => {
    setConvertingId(id)
    setError(null)
    setSuccess(null)
    try {
      const result = await adminApi.convertLead(id)
      setLeads((prev) => prev.map((lead) => (lead.id === id ? result.lead : lead)))
      const passwordNote = result.temporaryPassword
        ? ` Temporary password: ${result.temporaryPassword}`
        : ''
      setSuccess(`${result.message}${passwordNote}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setConvertingId(null)
    }
  }

  if (loading) return <PageLoader label="Loading leads..." />

  return (
    <>
      <Helmet>
        <title>Leads CRM | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Lead CRM"
        description="Manage website enquiries, add counsellor notes, and convert leads into student accounts."
        action={
          <div className="flex flex-wrap gap-2">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-40"
            >
              <option value="">All types</option>
              <option value="contact">Contact</option>
              <option value="consultation">Consultation</option>
              <option value="eligibility">Eligibility</option>
            </Select>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as LeadStatus | '')}
              className="w-40"
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {success && <p className="mb-4 text-sm text-emerald-600">{success}</p>}
      <PortalCard title={`Leads (${leads.length})`}>
        {leads.length === 0 ? (
          <EmptyState title="No leads found" description="New website submissions will appear here." />
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => {
              const expanded = expandedId === lead.id
              return (
                <article key={lead.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-primary">{lead.fullName}</h3>
                        <StatusBadge label={lead.leadType} tone="info" />
                        <StatusBadge label={lead.status} tone={tone(lead.status)} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lead.email}
                        {lead.phone ? ` · ${lead.phone}` : ''}
                      </p>
                      {(lead.preferredCountry || lead.preferredDegree || lead.preferredIntake) && (
                        <p className="mt-2 text-sm text-foreground">
                          {[lead.preferredCountry, lead.preferredDegree, lead.preferredIntake]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                      {lead.subject && <p className="mt-2 text-sm text-foreground">{lead.subject}</p>}
                      {lead.message && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{lead.message}</p>
                      )}
                      {lead.eligibilityScore != null && (
                        <p className="mt-2 text-sm text-secondary">
                          Eligibility: {lead.eligibilityTier} ({lead.eligibilityScore}/100)
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExpandedId(expanded ? null : lead.id)}
                      >
                        {expanded ? 'Hide CRM' : 'Open CRM'}
                      </Button>
                      {lead.status !== 'converted' && (
                        <Button
                          size="sm"
                          onClick={() => void convertLead(lead.id)}
                          disabled={convertingId === lead.id}
                        >
                          {convertingId === lead.id ? 'Converting...' : 'Convert to student'}
                        </Button>
                      )}
                      {lead.status === 'converted' && (
                        <Link to={ROUTES.admin.students}>
                          <Button size="sm" variant="outline">
                            View students
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      <div>
                        <p className="mb-2 text-sm font-medium text-primary">Pipeline status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={lead.status === status ? 'default' : 'outline'}
                              onClick={() => void updateStatus(lead.id, status)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-primary">Counsellor notes</p>
                        <Textarea
                          value={notesDraft[lead.id] ?? ''}
                          onChange={(e) =>
                            setNotesDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                          placeholder="Call notes, next follow-up, counsellor assignment..."
                          rows={4}
                        />
                        <Button
                          className="mt-2"
                          size="sm"
                          variant="outline"
                          onClick={() => void saveNotes(lead.id)}
                        >
                          Save notes
                        </Button>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </PortalCard>
    </>
  )
}
