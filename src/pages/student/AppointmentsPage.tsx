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
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { studentApi } from '@/api/student'
import { BRAND } from '@/constants'
import type { StudentAppointment } from '@/types/student'

const schema = z.object({
  topic: z.string().min(2, 'Topic is required'),
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().min(1, 'Time is required'),
  meetingMode: z.string().min(1, 'Mode is required'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function statusTone(status: StudentAppointment['status']) {
  if (status === 'confirmed' || status === 'completed') return 'success'
  if (status === 'cancelled') return 'danger'
  return 'warning'
}

export default function StudentAppointmentsPage() {
  const [appointments, setAppointments] = useState<StudentAppointment[]>([])
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
    defaultValues: {
      topic: '',
      preferredDate: '',
      preferredTime: '',
      meetingMode: 'online',
      notes: '',
    },
  })

  const load = async () => {
    setError(null)
    try {
      setAppointments(await studentApi.listAppointments())
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
    setError(null)
    try {
      await studentApi.createAppointment(values)
      reset()
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onCancel = async (id: string) => {
    setError(null)
    try {
      const updated = await studentApi.cancelAppointment(id)
      setAppointments((prev) => prev.map((item) => (item.id === id ? updated : item)))
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

      <PageIntro
        title="Appointments"
        description="Book counselling sessions with our advisors."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'Book Appointment'}
          </Button>
        }
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {showForm && (
        <PortalCard title="Request an appointment" className="mb-6">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Topic" required error={errors.topic?.message} className="sm:col-span-2">
              <Input placeholder="e.g. University shortlisting" {...register('topic')} />
            </FormField>
            <FormField label="Preferred Date" required error={errors.preferredDate?.message}>
              <Input type="date" {...register('preferredDate')} />
            </FormField>
            <FormField label="Preferred Time" required error={errors.preferredTime?.message}>
              <Input type="time" {...register('preferredTime')} />
            </FormField>
            <FormField label="Meeting Mode" required error={errors.meetingMode?.message}>
              <Select {...register('meetingMode')}>
                <option value="online">Online</option>
                <option value="in_person">In Person</option>
                <option value="phone">Phone</option>
              </Select>
            </FormField>
            <FormField label="Notes" className="sm:col-span-2" error={errors.notes?.message}>
              <Textarea placeholder="Anything we should prepare for the call?" {...register('notes')} />
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </PortalCard>
      )}

      <PortalCard title="Your appointments">
        {appointments.length === 0 ? (
          <EmptyState
            title="No appointments scheduled"
            description="Book a session to discuss applications, documents, or visas."
          />
        ) : (
          <div className="space-y-3">
            {appointments.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{item.topic}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.preferredDate} at {item.preferredTime} · {item.meetingMode.replaceAll('_', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={item.status} tone={statusTone(item.status)} />
                  {(item.status === 'requested' || item.status === 'confirmed') && (
                    <Button variant="outline" size="sm" onClick={() => void onCancel(item.id)}>
                      Cancel
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
