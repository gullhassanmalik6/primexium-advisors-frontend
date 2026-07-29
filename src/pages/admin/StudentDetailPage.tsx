import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaArrowLeft } from 'react-icons/fa'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND, ROUTES } from '@/constants'
import type { AdminStudentDetail } from '@/types/admin'

export default function AdminStudentDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const [detail, setDetail] = useState<AdminStudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
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
        description="Student 360 CRM view — applications, documents, payments, appointments, and messages."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTES.admin.students}>
              <Button variant="outline" size="sm">
                <FaArrowLeft />
                Back
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => void toggleActive()}>
              {student.isActive ? 'Deactivate' : 'Activate'}
            </Button>
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
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-primary">{student.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium text-primary">{student.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge
                  label={student.isActive ? 'active' : 'inactive'}
                  tone={student.isActive ? 'success' : 'danger'}
                />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Joined</dt>
              <dd className="font-medium text-primary">
                {new Date(student.createdAt).toLocaleString()}
              </dd>
            </div>
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
                    <p className="font-medium text-primary">{app.universityName}</p>
                    <StatusBadge label={app.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {app.programName} · {app.country} · {app.intake}
                  </p>
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
                    <p className="font-medium text-primary">{doc.title}</p>
                    <StatusBadge label={doc.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{doc.documentType}</p>
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
                    <p className="font-medium text-primary">{payment.title}</p>
                    <StatusBadge label={payment.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {payment.currency} {payment.amount}
                  </p>
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
                    <p className="font-medium text-primary">{item.topic}</p>
                    <StatusBadge label={item.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.preferredDate} · {item.preferredTime} · {item.meetingMode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard title="Recent messages">
          {detail.messages.length === 0 ? (
            <EmptyState title="No messages" description="Student and staff messages appear here." />
          ) : (
            <div className="space-y-3">
              {detail.messages.slice(0, 8).map((message) => (
                <div key={message.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-primary">{message.subject}</p>
                    <StatusBadge
                      label={message.isFromStudent ? 'student' : 'staff'}
                      tone={message.isFromStudent ? 'warning' : 'info'}
                    />
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{message.body}</p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>
      </div>
    </>
  )
}
