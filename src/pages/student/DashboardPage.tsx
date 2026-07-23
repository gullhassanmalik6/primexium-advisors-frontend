import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaGraduationCap,
  FaMoneyBillWave,
} from 'react-icons/fa'
import { EmptyState, PageIntro, PortalCard } from '@/components/student/PortalUI'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/common/PageElements'
import { getErrorMessage } from '@/api/client'
import { studentApi } from '@/api/student'
import { useAuth } from '@/context/AuthContext'
import { BRAND, ROUTES } from '@/constants'
import type { DashboardStats, StudentApplication } from '@/types/student'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboard, apps] = await Promise.all([
          studentApi.getDashboard(),
          studentApi.listApplications(),
        ])
        setStats(dashboard)
        setApplications(apps.slice(0, 5))
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) return <PageLoader label="Loading dashboard..." />

  const cards = [
    {
      label: 'Active Applications',
      value: stats?.applicationsActive ?? 0,
      href: ROUTES.student.applications,
      icon: FaGraduationCap,
    },
    {
      label: 'Documents Pending',
      value: stats?.documentsPending ?? 0,
      href: ROUTES.student.documents,
      icon: FaFileAlt,
    },
    {
      label: 'Payments Due',
      value: stats?.paymentsPending ?? 0,
      href: ROUTES.student.payments,
      icon: FaMoneyBillWave,
    },
    {
      label: 'Upcoming Appointments',
      value: stats?.appointmentsUpcoming ?? 0,
      href: ROUTES.student.appointments,
      icon: FaCalendarAlt,
    },
    {
      label: 'Unread Messages',
      value: stats?.messagesUnread ?? 0,
      href: ROUTES.student.messages,
      icon: FaComments,
    },
  ]

  return (
    <>
      <Helmet>
        <title>Student Dashboard | {BRAND.name}</title>
      </Helmet>

      <PageIntro
        title={`Welcome back, ${user?.firstName ?? 'Student'}`}
        description="Track your applications, documents, payments, and counselling appointments in one place."
        action={
          <Link to={ROUTES.student.applications}>
            <Button>New Application</Button>
          </Link>
        }
      />

      {error && (
        <p className="mb-4 rounded-xl border border-destructive/20 bg-red-50 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-secondary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <card.icon className="text-secondary" />
              <span className="text-2xl font-bold text-primary">{card.value}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <PortalCard
          title="Recent Applications"
          description="Your latest university applications"
          action={
            <Link to={ROUTES.student.applications}>
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          }
        >
          {applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Start your first university application to begin tracking progress."
            />
          ) : (
            <ul className="divide-y divide-border">
              {applications.map((app) => (
                <li key={app.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-primary">{app.universityName}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.programName} · {app.country}
                    </p>
                  </div>
                  <p className="text-sm capitalize text-secondary">{app.status.replaceAll('_', ' ')}</p>
                </li>
              ))}
            </ul>
          )}
        </PortalCard>
      </div>
    </>
  )
}
