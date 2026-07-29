import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND, ROUTES } from '@/constants'
import type { AdminStudent } from '@/types/admin'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

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
    if (!q) return students
    return students.filter((student) => {
      const haystack = `${student.firstName} ${student.lastName} ${student.email} ${student.phone ?? ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [students, query])

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
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone"
            className="w-64"
          />
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
                <div>
                  <h3 className="font-semibold text-primary">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {student.email}
                    {student.phone ? ` · ${student.phone}` : ''}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {student.applicationsCount} application(s)
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
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
