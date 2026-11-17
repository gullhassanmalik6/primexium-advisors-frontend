import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { APPLICATION_STATUS_LABELS, BRAND, ROUTES } from '@/constants'
import type { AdminApplication, ApplicationHistoryItem } from '@/types/admin'
import type { ApplicationStatus } from '@/types/student'

const STATUSES = Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[]

function statusTone(status: ApplicationStatus) {
  if (status === 'completed' || status === 'offer_received') return 'success'
  if (status === 'rejected' || status === 'withdrawn' || status === 'on_hold') return 'danger'
  if (status === 'under_review' || status === 'visa_stage' || status === 'campus_france') return 'info'
  if (status === 'submitted' || status === 'documents_pending') return 'warning'
  return 'neutral'
}

interface EditState {
  status: ApplicationStatus
  notes: string
  studentNote: string
  nextAction: string
  nextActionDue: string
  missingDocuments: string
}

function toEditState(app: AdminApplication): EditState {
  return {
    status: app.status,
    notes: app.notes ?? '',
    studentNote: app.studentNote ?? '',
    nextAction: app.nextAction ?? '',
    nextActionDue: app.nextActionDue ?? '',
    missingDocuments: app.missingDocuments ?? '',
  }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [edit, setEdit] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState<ApplicationHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

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

  const openEditor = async (app: AdminApplication) => {
    if (expandedId === app.id) {
      setExpandedId(null)
      setEdit(null)
      setHistory([])
      return
    }
    setExpandedId(app.id)
    setEdit(toEditState(app))
    setHistoryLoading(true)
    setError(null)
    try {
      setHistory(await adminApi.getApplicationHistory(app.id))
    } catch (err) {
      setError(getErrorMessage(err))
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const saveUpdate = async (id: string) => {
    if (!edit) return
    setSaving(true)
    setError(null)
    try {
      const updated = await adminApi.updateApplication(id, {
        status: edit.status,
        notes: edit.notes || undefined,
        studentNote: edit.studentNote || undefined,
        nextAction: edit.nextAction || undefined,
        nextActionDue: edit.nextActionDue || undefined,
        missingDocuments: edit.missingDocuments || undefined,
      })
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, ...updated } : app)))
      setHistory(await adminApi.getApplicationHistory(id))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader label="Loading applications..." />

  return (
    <>
      <Helmet>
        <title>Applications | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Applications"
        description="Update application stages, student-visible notes, next actions, and missing documents."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <PortalCard title={`Applications (${applications.length})`}>
        {applications.length === 0 ? (
          <EmptyState title="No applications" description="Student applications will show up here." />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <article key={app.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-primary break-words">{app.universityName}</h3>
                    <p className="text-sm text-muted-foreground break-words">
                      {app.programName} · {app.country} · {app.intake}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      <Link
                        to={ROUTES.admin.studentDetail.replace(':id', app.studentId)}
                        className="font-medium text-secondary hover:underline"
                      >
                        {app.studentName}
                      </Link>
                      {' · '}
                      {app.studentEmail}
                    </p>
                    {app.nextAction && (
                      <p className="mt-2 text-sm text-secondary break-words">
                        Next: {app.nextAction}
                        {app.nextActionDue ? ` (by ${app.nextActionDue})` : ''}
                      </p>
                    )}
                    {app.missingDocuments && (
                      <p className="mt-1 text-sm text-destructive break-words">
                        Missing: {app.missingDocuments}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {new Date(app.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    <StatusBadge
                      label={APPLICATION_STATUS_LABELS[app.status] ?? app.status}
                      tone={statusTone(app.status)}
                    />
                    <Button size="sm" variant="outline" onClick={() => void openEditor(app)}>
                      {expandedId === app.id ? 'Close' : 'Manage'}
                    </Button>
                  </div>
                </div>

                {expandedId === app.id && edit && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Status" required>
                        <Select
                          value={edit.status}
                          onChange={(e) =>
                            setEdit({ ...edit, status: e.target.value as ApplicationStatus })
                          }
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {APPLICATION_STATUS_LABELS[status] ?? status}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                      <FormField label="Next action due">
                        <Input
                          type="date"
                          value={edit.nextActionDue}
                          onChange={(e) => setEdit({ ...edit, nextActionDue: e.target.value })}
                        />
                      </FormField>
                      <FormField label="Next action">
                        <Input
                          value={edit.nextAction}
                          onChange={(e) => setEdit({ ...edit, nextAction: e.target.value })}
                          placeholder="e.g. Upload IELTS / Confirm university choice"
                        />
                      </FormField>
                      <FormField label="Missing documents">
                        <Input
                          value={edit.missingDocuments}
                          onChange={(e) => setEdit({ ...edit, missingDocuments: e.target.value })}
                          placeholder="Passport, transcripts, bank statement..."
                        />
                      </FormField>
                      <FormField label="Student-visible note">
                        <Textarea
                          value={edit.studentNote}
                          onChange={(e) => setEdit({ ...edit, studentNote: e.target.value })}
                          rows={3}
                          placeholder="Shown to the student on their tracking page"
                        />
                      </FormField>
                      <FormField label="Internal staff notes">
                        <Textarea
                          value={edit.notes}
                          onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
                          rows={3}
                          placeholder="Private staff notes (not shown to students)"
                        />
                      </FormField>
                    </div>
                    <Button disabled={saving} onClick={() => void saveUpdate(app.id)}>
                      {saving ? 'Saving...' : 'Save update'}
                    </Button>

                    <div>
                      <h4 className="text-sm font-semibold text-primary">Status history</h4>
                      {historyLoading ? (
                        <p className="mt-2 text-sm text-muted-foreground">Loading history...</p>
                      ) : history.length === 0 ? (
                        <p className="mt-2 text-sm text-muted-foreground">No status changes recorded yet.</p>
                      ) : (
                        <ol className="mt-3 space-y-2">
                          {history.map((item) => (
                            <li key={item.id} className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
                              <p className="font-medium text-primary">
                                {item.fromStatus
                                  ? `${APPLICATION_STATUS_LABELS[item.fromStatus] ?? item.fromStatus} → `
                                  : ''}
                                {APPLICATION_STATUS_LABELS[item.toStatus] ?? item.toStatus}
                              </p>
                              {item.studentSafeNote && (
                                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                                  Student note: {item.studentSafeNote}
                                </p>
                              )}
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleString()}
                                {item.changedByName ? ` · ${item.changedByName}` : ''}
                              </p>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
