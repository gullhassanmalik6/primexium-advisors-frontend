import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
import type { AdminPayment, AdminStudent } from '@/types/admin'
import type { PaymentStatus } from '@/types/student'

const STATUSES: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded']

const schema = z.object({
  studentId: z.string().min(1, 'Select a student'),
  title: z.string().min(2, 'Title is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, 'Amount must be positive'),
  currency: z.string().min(1),
  dueDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { studentId: '', title: '', amount: '', currency: 'PKR', dueDate: '' },
  })

  const load = async () => {
    setError(null)
    try {
      const [paymentItems, studentItems] = await Promise.all([
        adminApi.listPayments(),
        adminApi.listStudents(),
      ])
      setPayments(paymentItems)
      setStudents(studentItems)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSubmit = async (values: FormValues) => {
    try {
      await adminApi.createPayment({
        studentId: values.studentId,
        title: values.title,
        amount: Number(values.amount),
        currency: values.currency,
        dueDate: values.dueDate || undefined,
      })
      reset()
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const updateStatus = async (id: string, status: PaymentStatus) => {
    try {
      await adminApi.updatePaymentStatus(id, status)
      setPayments((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading payments..." />

  return (
    <>
      <Helmet>
        <title>Payments | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Payments"
        description="Create invoices and update payment status for students."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'Create Payment'}
          </Button>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {showForm && (
        <PortalCard title="New payment" className="mb-6">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Student" required error={errors.studentId?.message} className="sm:col-span-2">
              <Select {...register('studentId')} defaultValue="">
                <option value="" disabled>
                  Select student
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Title" required error={errors.title?.message}>
              <Input placeholder="Consultancy fee" {...register('title')} />
            </FormField>
            <FormField label="Amount" required error={errors.amount?.message}>
              <Input type="number" step="0.01" {...register('amount')} />
            </FormField>
            <FormField label="Currency" required>
              <Select {...register('currency')}>
                <option value="PKR">PKR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
              </Select>
            </FormField>
            <FormField label="Due Date">
              <Input type="date" {...register('dueDate')} />
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </PortalCard>
      )}
      <PortalCard title={`Payments (${payments.length})`}>
        {payments.length === 0 ? (
          <EmptyState title="No payments" description="Create an invoice for a student to get started." />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <article
                key={payment.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{payment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {payment.currency} {payment.amount.toLocaleString()}
                    {payment.dueDate ? ` · Due ${payment.dueDate}` : ''}
                  </p>
                  <p className="mt-1 text-sm">
                    {payment.studentName} · {payment.studentEmail}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={payment.status} tone="warning" />
                  <Select
                    value={payment.status}
                    onChange={(e) => void updateStatus(payment.id, e.target.value as PaymentStatus)}
                    className="w-36"
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
