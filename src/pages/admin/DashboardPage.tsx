import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PageIntro, PortalCard } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND, ROUTES } from '@/constants'
import type { AdminDashboardStats } from '@/types/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setStats(await adminApi.getDashboard())
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) return <PageLoader label="Loading admin dashboard..." />

  const cards = [
    { label: 'New Leads', value: stats?.leadsNew ?? 0, href: ROUTES.admin.leads },
    { label: 'Students', value: stats?.studentsTotal ?? 0, href: ROUTES.admin.students },
    { label: 'Active Applications', value: stats?.applicationsActive ?? 0, href: ROUTES.admin.applications },
    { label: 'Documents to Review', value: stats?.documentsPending ?? 0, href: ROUTES.admin.documents },
    { label: 'Pending Payments', value: stats?.paymentsPending ?? 0, href: ROUTES.admin.payments },
    { label: 'Appointment Requests', value: stats?.appointmentsRequested ?? 0, href: ROUTES.admin.appointments },
    { label: 'Unread Student Messages', value: stats?.messagesUnreadFromStudents ?? 0, href: ROUTES.admin.messages },
    { label: 'Total Leads', value: stats?.leadsTotal ?? 0, href: ROUTES.admin.leads },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Admin Dashboard"
        description="Overview of leads, students, applications, and operations."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-secondary/40"
          >
            <p className="text-3xl font-bold text-primary">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <PortalCard title="Quick actions">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to={ROUTES.admin.leads} className="text-secondary hover:underline">
              Review leads →
            </Link>
            <Link to={ROUTES.admin.applications} className="text-secondary hover:underline">
              Update applications →
            </Link>
            <Link to={ROUTES.admin.payments} className="text-secondary hover:underline">
              Issue payment →
            </Link>
            <Link to={ROUTES.admin.reports} className="text-secondary hover:underline">
              View reports →
            </Link>
          </div>
        </PortalCard>
      </div>
    </>
  )
}
