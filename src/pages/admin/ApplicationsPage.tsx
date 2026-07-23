import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Select } from '@/components/ui/select'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
import type { AdminApplication } from '@/types/admin'
import type { ApplicationStatus } from '@/types/student'

const STATUSES: ApplicationStatus[] = [
  'draft',
  'submitted',
  'under_review',
  'offer_received',
  'visa_stage',
  'completed',
  'rejected',
  'withdrawn',
]

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setApplications(await adminApi.listApplications())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await adminApi.updateApplicationStatus(id, status)
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading applications..." />

  return (
    <>
      <Helmet>
        <title>Applications | {BRAND.name}</title>
      </Helmet>
      <PageIntro title="Applications" description="Review and update student university applications." />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <PortalCard title={`Applications (${applications.length})`}>
        {applications.length === 0 ? (
          <EmptyState title="No applications" description="Student applications will show up here." />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <article key={app.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">{app.universityName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {app.programName} · {app.country} · {app.intake}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {app.studentName} · {app.studentEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge label={app.status} tone="info" />
                    <Select
                      value={app.status}
                      onChange={(e) => void updateStatus(app.id, e.target.value as ApplicationStatus)}
                      className="w-44"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll('_', ' ')}
                        </option>
                      ))}
                    </Select>
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
