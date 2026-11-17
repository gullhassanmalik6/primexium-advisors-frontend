import { useEffect, useMemo, useState } from 'react'
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
import type { AdminApplication, AdminFollowUp, AdminStudent } from '@/types/admin'

const METHODS = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'in_person', label: 'In person' },
  { value: 'other', label: 'Other' },
] as const

const EMPTY_FORM = {
  studentId: '',
  applicationId: '',
  followUpDate: new Date().toISOString().slice(0, 10),
  method: 'phone',
  summary: '',
  nextAction: '',
  nextFollowUpDate: '',
  visibleToStudent: false,
  studentMessage: '',
  relatedStatus: '',
}

export default function AdminFollowUpsPage() {
  const [followUps, setFollowUps] = useState<AdminFollowUp[]>([])
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming' | 'completed'>('all')

  const load = async () => {
    try {
      const [followUpRows, studentRows, applicationRows] = await Promise.all([
        adminApi.listFollowUps(),
        adminApi.listStudents(),
        adminApi.listApplications(),
      ])
      setFollowUps(followUpRows)
      setStudents(studentRows)
      setApplications(applicationRows)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const studentApplications = useMemo(
    () => applications.filter((app) => app.studentId === form.studentId),
    [applications, form.studentId],
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return followUps
    if (filter === 'overdue') return followUps.filter((item) => item.isOverdue)
    if (filter === 'upcoming') {
      return followUps.filter((item) => item.status === 'pending' && !item.isOverdue)
    }
    return followUps.filter((item) => item.status === 'completed')
  }, [filter, followUps])

  const overdueCount = followUps.filter((item) => item.isOverdue).length
  const upcomingCount = followUps.filter(
    (item) => item.status === 'pending' && !item.isOverdue,
  ).length

  const onCreate = async () => {
    if (!form.studentId || !form.summary.trim()) {
      setError('Student and summary are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const created = await adminApi.createFollowUp({
        studentId: form.studentId,
        applicationId: form.applicationId || undefined,
        followUpDate: form.followUpDate,
        method: form.method,
        summary: form.summary.trim(),
        nextAction: form.nextAction.trim() || undefined,
        nextFollowUpDate: form.nextFollowUpDate || undefined,
        visibleToStudent: form.visibleToStudent,
        studentMessage: form.studentMessage.trim() || undefined,
        relatedStatus: form.relatedStatus || undefined,
      })
      setFollowUps((prev) => [created, ...prev])
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const markCompleted = async (id: string) => {
    try {
      const updated = await adminApi.updateFollowUp(id, { status: 'completed' })
      setFollowUps((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading follow-ups..." />

  return (
    <>
      <Helmet>
        <title>Follow-ups | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Follow-ups"
        description="Track overdue and upcoming student contacts. Student-visible messages appear on their application tracking page."
        action={
          <Button onClick={() => setShowForm((value) => !value)}>
            {showForm ? 'Close form' : 'Record follow-up'}
          </Button>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Overdue', value: overdueCount, tone: 'danger' as const },
          { label: 'Upcoming', value: upcomingCount, tone: 'warning' as const },
          { label: 'Total', value: followUps.length, tone: 'info' as const },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-primary">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <PortalCard title="New follow-up" className="mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Student" required>
              <Select
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value, applicationId: '' })
                }
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} · {student.email}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Application (optional)">
              <Select
                value={form.applicationId}
                onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
                disabled={!form.studentId}
              >
                <option value="">None</option>
                {studentApplications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.universityName} · {APPLICATION_STATUS_LABELS[app.status] ?? app.status}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Follow-up date" required>
              <Input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
              />
            </FormField>
            <FormField label="Method" required>
              <Select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                {METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Next follow-up date">
              <Input
                type="date"
                value={form.nextFollowUpDate}
                onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })}
              />
            </FormField>
            <FormField label="Related status">
              <Select
                value={form.relatedStatus}
                onChange={(e) => setForm({ ...form, relatedStatus: e.target.value })}
              >
                <option value="">None</option>
                {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Summary (internal)" required className="md:col-span-2">
              <Textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                rows={3}
                placeholder="What was discussed / outcome"
              />
            </FormField>
            <FormField label="Next action" className="md:col-span-2">
              <Input
                value={form.nextAction}
                onChange={(e) => setForm({ ...form, nextAction: e.target.value })}
                placeholder="What should happen next"
              />
            </FormField>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.visibleToStudent}
                  onChange={(e) => setForm({ ...form, visibleToStudent: e.target.checked })}
                />
                Visible to student
              </label>
            </div>
            {form.visibleToStudent && (
              <FormField label="Student message" className="md:col-span-2">
                <Textarea
                  value={form.studentMessage}
                  onChange={(e) => setForm({ ...form, studentMessage: e.target.value })}
                  rows={3}
                  placeholder="Message the student will see"
                />
              </FormField>
            )}
          </div>
          <Button className="mt-4" disabled={saving} onClick={() => void onCreate()}>
            {saving ? 'Saving...' : 'Save follow-up'}
          </Button>
        </PortalCard>
      )}

      <PortalCard
        title="Follow-up queue"
        action={
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="w-40"
          >
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </Select>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState title="No follow-ups" description="Record a follow-up to start tracking." />
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <article key={item.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={ROUTES.admin.studentDetail.replace(':id', item.studentId)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {item.studentName ?? 'Student'}
                      </Link>
                      <StatusBadge
                        label={item.isOverdue ? 'overdue' : item.status}
                        tone={item.isOverdue ? 'danger' : item.status === 'completed' ? 'success' : 'warning'}
                      />
                      {item.visibleToStudent && <StatusBadge label="student-visible" tone="info" />}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.studentEmail}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground break-words">
                      {item.summary}
                    </p>
                    {item.nextAction && (
                      <p className="mt-2 text-sm text-secondary break-words">
                        Next action: {item.nextAction}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.followUpDate} · {item.method.replaceAll('_', ' ')}
                      {item.nextFollowUpDate ? ` · next ${item.nextFollowUpDate}` : ''}
                      {item.relatedStatus
                        ? ` · ${APPLICATION_STATUS_LABELS[item.relatedStatus] ?? item.relatedStatus}`
                        : ''}
                    </p>
                  </div>
                  {item.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => void markCompleted(item.id)}>
                      Mark completed
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
