import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
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
  const [filter, setFilter] = useState<LeadStatus | ''>('')

  const load = async () => {
    setError(null)
    try {
      const result = await adminApi.listLeads(filter ? { status: filter } : undefined)
      setLeads(result.items)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    void load()
  }, [filter])

  const updateStatus = async (id: string, status: LeadStatus) => {
    try {
      const updated = await adminApi.updateLeadStatus(id, status)
      setLeads((prev) => prev.map((lead) => (lead.id === id ? updated : lead)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading leads..." />

  return (
    <>
      <Helmet>
        <title>Leads | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Lead Management"
        description="Contact, consultation, and eligibility submissions from the public website."
        action={
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as LeadStatus | '')}
            className="w-44"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <PortalCard title={`Leads (${leads.length})`}>
        {leads.length === 0 ? (
          <EmptyState title="No leads found" description="New website submissions will appear here." />
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-primary">{lead.fullName}</h3>
                      <StatusBadge label={lead.leadType} tone="info" />
                      <StatusBadge label={lead.status} tone={tone(lead.status)} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lead.email}
                      {lead.phone ? ` · ${lead.phone}` : ''}
                    </p>
                    {lead.subject && <p className="mt-2 text-sm text-foreground">{lead.subject}</p>}
                    {lead.message && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{lead.message}</p>
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
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
