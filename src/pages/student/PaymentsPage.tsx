import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { getErrorMessage } from '@/api/client'
import { studentApi } from '@/api/student'
import { BRAND } from '@/constants'
import type { StudentPayment } from '@/types/student'

function statusTone(status: StudentPayment['status']) {
  if (status === 'paid') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'refunded') return 'info'
  return 'warning'
}

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<StudentPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setPayments(await studentApi.listPayments())
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) return <PageLoader label="Loading payments..." />

  return (
    <>
      <Helmet>
        <title>Payments | {BRAND.name}</title>
      </Helmet>

      <PageIntro
        title="Payments"
        description="View invoices and payment status for consultancy and university fees."
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <PortalCard title="Payment history">
        {payments.length === 0 ? (
          <EmptyState
            title="No payments yet"
            description="When our finance team issues an invoice, it will appear here."
          />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <article
                key={payment.id}
                className="flex flex-col gap-3 rounded-xl border border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{payment.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {payment.currency} {payment.amount.toLocaleString()}
                    {payment.dueDate ? ` · Due ${payment.dueDate}` : ''}
                  </p>
                </div>
                <StatusBadge label={payment.status} tone={statusTone(payment.status)} />
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
