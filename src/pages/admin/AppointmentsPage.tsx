import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Select } from '@/components/ui/select'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
import type { AdminAppointment } from '@/types/admin'
import type { AppointmentStatus } from '@/types/student'

const STATUSES: AppointmentStatus[] = ['requested', 'confirmed', 'completed', 'cancelled']

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setAppointments(await adminApi.listAppointments())
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await adminApi.updateAppointmentStatus(id, status)
      setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading appointments..." />

  return (
    <>
      <Helmet>
        <title>Appointments | {BRAND.name}</title>
      </Helmet>
      <PageIntro title="Appointments" description="Confirm and manage counselling appointment requests." />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <PortalCard title={`Appointments (${appointments.length})`}>
        {appointments.length === 0 ? (
          <EmptyState title="No appointments" description="Student booking requests will appear here." />
        ) : (
          <div className="space-y-3">
            {appointments.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{item.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.preferredDate} at {item.preferredTime} · {item.meetingMode}
                  </p>
                  <p className="mt-1 text-sm">
                    {item.studentName} · {item.studentEmail}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={item.status} tone="info" />
                  <Select
                    value={item.status}
                    onChange={(e) => void updateStatus(item.id, e.target.value as AppointmentStatus)}
                    className="w-40"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
