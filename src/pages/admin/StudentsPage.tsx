import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { useAuth } from '@/context/AuthContext'
import { BRAND, REFERRAL_OPTIONS, ROUTES, USER_ROLES } from '@/constants'
import type { AdminStudent } from '@/types/admin'

function referralLabel(source?: string) {
  if (!source) return null
  return REFERRAL_OPTIONS.find((option) => option.value === source)?.label ?? source
}

export default function AdminStudentsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === USER_ROLES.ADMIN
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [referralFilter, setReferralFilter] = useState('')

  const load = async () => {
    try {
      setStudents(await adminApi.listStudents())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((student) => {
      if (referralFilter && student.referralSource !== referralFilter) return false
      if (!q) return true
      const haystack =
        `${student.firstName} ${student.lastName} ${student.email} ${student.phone ?? ''} ${student.referralSource ?? ''} ${student.referralDetail ?? ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [students, query, referralFilter])

  const toggleActive = async (student: AdminStudent) => {
    try {
      const updated = await adminApi.updateStudentStatus(student.id, !student.isActive)
      setStudents((prev) =>
        prev.map((item) =>
          item.id === student.id ? { ...item, isActive: updated.isActive } : item,
        ),
      )
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const deleteStudent = async (student: AdminStudent) => {
    const confirmed = window.confirm(
      `Permanently delete ${student.firstName} ${student.lastName} (${student.email})?\n\nThis removes their applications, documents, payments, appointments, messages, and follow-ups. This cannot be undone.`,
    )
    if (!confirmed) return

    const typed = window.prompt('Type DELETE to confirm permanent deletion:')
    if (typed?.trim().toUpperCase() !== 'DELETE') {
      setError('Deletion cancelled. You must type DELETE to confirm.')
      return
    }

    setDeletingId(student.id)
    setError(null)
    try {
      await adminApi.deleteStudent(student.id)
      setStudents((prev) => prev.filter((item) => item.id !== student.id))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <PageLoader label="Loading students..." />

  return (
    <>
      <Helmet>
        <title>Students CRM | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Students CRM"
        description="Search student accounts and open a full 360 profile for CRM management."
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, referral"
              className="w-64"
            />
            <Select
              value={referralFilter}
              onChange={(e) => setReferralFilter(e.target.value)}
              className="w-48"
              aria-label="Filter by referral source"
            >
              <option value="">All referral sources</option>
              {REFERRAL_OPTIONS.filter((option) => option.value !== 'not_specified').map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <PortalCard title={`Students (${filtered.length})`}>
        {filtered.length === 0 ? (
          <EmptyState title="No students found" description="Try another search or wait for registrations." />
        ) : (
          <div className="space-y-3">
            {filtered.map((student) => (
              <article
                key={student.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-primary">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="break-words text-sm text-muted-foreground">
                    {student.email}
                    {student.phone ? ` · ${student.phone}` : ''}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {student.applicationsCount} application(s)
                    {referralLabel(student.referralSource)
                      ? ` · Referral: ${referralLabel(student.referralSource)}`
                      : ''}
                    {student.referralDetail ? ` (${student.referralDetail})` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge
                    label={student.isActive ? 'active' : 'inactive'}
                    tone={student.isActive ? 'success' : 'danger'}
                  />
                  <Link to={`${ROUTES.admin.students}/${student.id}`}>
                    <Button size="sm">Open CRM</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => void toggleActive(student)}>
                    {student.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      disabled={deletingId === student.id}
                      onClick={() => void deleteStudent(student)}
                    >
                      {deletingId === student.id ? 'Deleting...' : 'Delete'}
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
