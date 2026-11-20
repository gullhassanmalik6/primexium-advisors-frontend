import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND, ROUTES } from '@/constants'
import type { CrmOverview, FinanceSummary, LeadStatus } from '@/types/admin'

function tone(status: LeadStatus) {
  if (status === 'converted' || status === 'qualified') return 'success'
  if (status === 'closed') return 'neutral'
  if (status === 'contacted') return 'info'
  return 'warning'
}

function money(amount: number) {
  return `PKR ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

function localDateISO(value = new Date()) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function monthBounds(d = new Date()) {
  const from = new Date(d.getFullYear(), d.getMonth(), 1)
  const to = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return { from: localDateISO(from), to: localDateISO(to) }
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<CrmOverview | null>(null)
  const [finance, setFinance] = useState<FinanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const range = monthBounds()
      try {
        const [crm, financeSummary] = await Promise.all([
          adminApi.getCrmOverview(),
          adminApi.getFinanceSummary(range).catch(() => null),
        ])
        setOverview(crm)
        setFinance(financeSummary)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) return <PageLoader label="Loading admin dashboard..." />

  const stats = overview?.stats
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

  const financeCards = [
    { label: 'Income (this month)', value: finance?.totalIncome ?? 0 },
    { label: 'Expense (this month)', value: finance?.totalExpense ?? 0 },
    { label: 'Profit / Loss', value: finance?.netProfitLoss ?? 0 },
    { label: 'Remaining', value: finance?.remainingAvailable ?? 0 },
  ]

  const pipeline = ['new', 'contacted', 'qualified', 'converted', 'closed'] as const

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="CRM Dashboard"
        description="Live overview of leads, students, applications, finance, and operations across Karachi and Paris."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-primary">Finance this month</h2>
          <Link to={ROUTES.admin.finance} className="text-sm font-medium text-secondary hover:underline">
            Open finance →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {financeCards.map((card) => (
            <Link
              key={card.label}
              to={ROUTES.admin.finance}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-secondary/40"
            >
              <p
                className={`text-2xl font-bold ${
                  card.label.includes('Profit') && card.value < 0 ? 'text-red-700' : 'text-primary'
                }`}
              >
                {money(card.value)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
            </Link>
          ))}
        </div>
      </div>

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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PortalCard title="Lead pipeline">
          <div className="grid gap-3 sm:grid-cols-2">
            {pipeline.map((status) => (
              <div key={status} className="rounded-xl border border-border px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {status}
                </p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {overview?.leadsByStatus[status] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCard title="Quick CRM actions">
          <div className="flex flex-col gap-3 text-sm">
            <Link to={ROUTES.admin.finance} className="text-secondary hover:underline">
              Record expenses and income →
            </Link>
            <Link to={ROUTES.admin.leads} className="text-secondary hover:underline">
              Review and convert leads →
            </Link>
            <Link to={ROUTES.admin.students} className="text-secondary hover:underline">
              Open student CRM profiles →
            </Link>
            <Link to={ROUTES.admin.applications} className="text-secondary hover:underline">
              Update application statuses →
            </Link>
            <Link to={ROUTES.admin.appointments} className="text-secondary hover:underline">
              Confirm appointment requests →
            </Link>
            <Link to={ROUTES.admin.messages} className="text-secondary hover:underline">
              Reply to student messages →
            </Link>
            <Link to={ROUTES.admin.reports} className="text-secondary hover:underline">
              View reports →
            </Link>
          </div>
        </PortalCard>
      </div>

      <div className="mt-6">
        <PortalCard title="Recent leads">
          {!overview?.recentLeads.length ? (
            <EmptyState
              title="No leads yet"
              description="Website contact, consultation, and eligibility forms will appear here."
            />
          ) : (
            <div className="space-y-3">
              {overview.recentLeads.map((lead) => (
                <article
                  key={lead.id}
                  className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-primary">{lead.fullName}</h3>
                      <StatusBadge label={lead.leadType} tone="info" />
                      <StatusBadge label={lead.status} tone={tone(lead.status)} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lead.email}
                      {lead.preferredCountry ? ` · ${lead.preferredCountry}` : ''}
                    </p>
                  </div>
                  <Link
                    to={ROUTES.admin.leads}
                    className="text-sm font-medium text-secondary hover:underline"
                  >
                    Manage →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </PortalCard>
      </div>
    </>
  )
}
