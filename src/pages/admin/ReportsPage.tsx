import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { PageIntro, PortalCard } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
import type { ReportSummary } from '@/types/admin'

function StatGroup({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data)
  return (
    <PortalCard title={title}>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map(([key, value]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="capitalize text-muted-foreground">{key.replaceAll('_', ' ')}</span>
              <span className="font-semibold text-primary">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  )
}

export default function AdminReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setReport(await adminApi.getReportSummary())
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) return <PageLoader label="Loading reports..." />

  return (
    <>
      <Helmet>
        <title>Reports | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Reports"
        description={
          report
            ? `Generated ${new Date(report.generatedAt).toLocaleString()}`
            : 'Operational summary across leads, applications, and payments.'
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {report && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <PortalCard title="Students">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">{report.studentsActive}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{report.studentsInactive}</p>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                </div>
              </div>
            </PortalCard>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <StatGroup title="Leads by type" data={report.leadsByType} />
            <StatGroup title="Leads by status" data={report.leadsByStatus} />
            <StatGroup title="Applications by status" data={report.applicationsByStatus} />
            <StatGroup title="Payments by status" data={report.paymentsByStatus} />
          </div>
        </>
      )}
    </>
  )
}
