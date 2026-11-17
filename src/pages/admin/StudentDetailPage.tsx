import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaArrowLeft } from 'react-icons/fa'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { useAuth } from '@/context/AuthContext'
import { APPLICATION_STATUS_LABELS, BRAND, REFERRAL_OPTIONS, ROUTES, USER_ROLES } from '@/constants'
import type { AdminStudentDetail } from '@/types/admin'

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return 'Not provided'
  if (typeof value === 'string' && value.trim() === '') return 'Not provided'
  return String(value)
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap break-words font-medium text-primary">{value}</dd>
    </div>
  )
}

function referralLabel(source?: string) {
  if (!source) return 'Not provided'
  return REFERRAL_OPTIONS.find((option) => option.value === source)?.label ?? source
}

export default function AdminStudentDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === USER_ROLES.ADMIN
  const [detail, setDetail] = useState<AdminStudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setDetail(await adminApi.getStudentDetail(id))
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    if (id) void load()
  }, [id])

  const toggleActive = async () => {
    if (!detail) return
    try {
      const updated = await adminApi.updateStudentStatus(detail.student.id, !detail.student.isActive)
      setDetail({
        ...detail,
        student: { ...detail.student, isActive: updated.isActive },
      })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const deleteStudent = async () => {
    if (!detail) return
    const { student } = detail
    const confirmed = window.confirm(
      `Permanently delete ${student.firstName} ${student.lastName} (${student.email})?\n\nThis removes their applications, documents, payments, appointments, messages, and follow-ups. This cannot be undone.`,
    )
    if (!confirmed) return

    const typed = window.prompt('Type DELETE to confirm permanent deletion:')
    if (typed?.trim().toUpperCase() !== 'DELETE') {
      setError('Deletion cancelled. You must type DELETE to confirm.')
      return
    }

    setDeleting(true)
    setError(null)
    try {
      await adminApi.deleteStudent(student.id)
      navigate(ROUTES.admin.students, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setDeleting(false)
    }
  }

  if (loading) return <PageLoader label="Loading student CRM..." />
  if (!detail) {
    return (
      <EmptyState
        title="Student not found"
        description={error ?? 'This student profile could not be loaded.'}
      />
    )
  }

  const { student } = detail

  return (
    <>
      <Helmet>
        <title>
          {student.firstName} {student.lastName} | CRM | {BRAND.name}
        </title>
      </Helmet>
      <PageIntro
        title={`${student.firstName} ${student.lastName}`}
        description="Full student record — profile, referral, applications, documents, payments, appointments, and messages."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTES.admin.students}>
              <Button variant="outline" size="sm">
                <FaArrowLeft />
                Back
              </Button>
            </Link>
            <Link to={ROUTES.admin.followUps}>
              <Button variant="outline" size="sm">
                Follow-ups
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => void toggleActive()}>
              {student.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                disabled={deleting}
                onClick={() => void deleteStudent()}
              >
                {deleting ? 'Deleting...' : 'Delete student'}
              </Button>
            )}
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Applications', value: detail.applications.length },
          { label: 'Documents', value: detail.documents.length },
          { label: 'Payments', value: detail.payments.length },
          { label: 'Appointments', value: detail.appointments.length },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-primary">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard title="Profile">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" value={displayValue(student.firstName)} />
            <Field label="Last name" value={displayValue(student.lastName)} />
            <Field label="Email" value={displayValue(student.email)} />
            <Field label="Phone" value={displayValue(student.phone)} />
            <Field label="Role" value={displayValue(student.role)} />
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="mt-0.5">
                <StatusBadge
                  label={student.isActive ? 'active' : 'inactive'}
                  tone={student.isActive ? 'success' : 'danger'}
                />
              </dd>
            </div>
            <Field label="Referral source" value={referralLabel(student.referralSource)} />
            <Field label="Referred by / code" value={displayValue(student.referralDetail)} />
            <Field
              label="Joined"
              value={student.createdAt ? new Date(student.createdAt).toLocaleString() : 'Not provided'}
            />
            <Field
              label="Last updated"
              value={
                student.updatedAt ? new Date(student.updatedAt).toLocaleString() : 'Not provided'
              }
            />
            <Field label="Student ID" value={displayValue(student.id)} />
          </dl>
        </PortalCard>

        <PortalCard title="Applications">
          {detail.applications.length === 0 ? (
            <EmptyState title="No applications" description="No university applications yet." />
          ) : (
            <div className="space-y-3">
              {detail.applications.map((app) => (
                <div key={app.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words font-medium text-primary">
                      {app.universityName}
                    </p>
                    <StatusBadge
                      label={APPLICATION_STATUS_LABELS[app.status] ?? app.status}
                      tone="info"
                    />
                  </div>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {app.programName} · {app.degreeLevel} · {app.country} · {app.intake}
                  </p>
                  {app.studentNote && (
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">
                      Student note: {app.studentNote}
                    </p>
                  )}
                  {app.notes && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      Internal notes: {app.notes}
                    </p>
                  )}
                  {app.nextAction && (
                    <p className="mt-1 break-words text-sm text-secondary">
                      Next action: {app.nextAction}
                      {app.nextActionDue ? ` (by ${app.nextActionDue})` : ''}
                    </p>
                  )}
                  {app.missingDocuments && (
                    <p className="mt-1 break-words text-sm text-destructive">
                      Missing documents: {app.missingDocuments}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated {new Date(app.updatedAt).toLocaleString()}
                  </p>
                  <Link
                    to={ROUTES.admin.applications}
                    className="mt-2 inline-block text-xs font-medium text-secondary hover:underline"
                  >
                    Manage in Applications
                  </Link>
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard title="Documents">
          {detail.documents.length === 0 ? (
            <EmptyState title="No documents" description="Uploaded documents will show here." />
          ) : (
            <div className="space-y-3">
              {detail.documents.map((doc) => (
                <div key={doc.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words font-medium text-primary">{doc.title}</p>
                    <StatusBadge label={doc.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {doc.documentType.replaceAll('_', ' ')}
                  </p>
                  {doc.notes && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {doc.notes}
                    </p>
                  )}
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block break-all text-xs font-medium text-secondary hover:underline"
                    >
                      Open file
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard title="Payments">
          {detail.payments.length === 0 ? (
            <EmptyState title="No payments" description="Issued fees and invoices appear here." />
          ) : (
            <div className="space-y-3">
              {detail.payments.map((payment) => (
                <div key={payment.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words font-medium text-primary">{payment.title}</p>
                    <StatusBadge label={payment.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {payment.currency} {payment.amount}
                    {payment.dueDate ? ` · due ${payment.dueDate}` : ''}
                  </p>
                  {payment.notes && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {payment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard title="Appointments">
          {detail.appointments.length === 0 ? (
            <EmptyState title="No appointments" description="Consultation bookings appear here." />
          ) : (
            <div className="space-y-3">
              {detail.appointments.map((item) => (
                <div key={item.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words font-medium text-primary">{item.topic}</p>
                    <StatusBadge label={item.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.preferredDate} · {item.preferredTime} · {item.meetingMode}
                  </p>
                  {item.notes && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard title="Messages">
          {detail.messages.length === 0 ? (
            <EmptyState title="No messages" description="Student and staff messages appear here." />
          ) : (
            <div className="space-y-3">
              {detail.messages.map((message) => (
                <div key={message.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words font-medium text-primary">{message.subject}</p>
                    <StatusBadge
                      label={message.isFromStudent ? 'student' : 'staff'}
                      tone={message.isFromStudent ? 'warning' : 'info'}
                    />
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                    {message.body}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>
      </div>
    </>
  )
}
