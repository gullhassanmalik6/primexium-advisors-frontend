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
import { CONSULTATION_COUNTRIES, CONSULTATION_DEGREES, CONSULTATION_INTAKES } from '@/constants/content'
import { BRAND } from '@/constants'
import type { StudentApplication } from '@/types/student'

const schema = z.object({
  universityName: z.string().min(2, 'University is required'),
  country: z.string().min(2, 'Country is required'),
  programName: z.string().min(2, 'Program is required'),
  degreeLevel: z.string().min(2, 'Degree is required'),
  intake: z.string().min(2, 'Intake is required'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function statusTone(status: StudentApplication['status']) {
  if (status === 'completed' || status === 'offer_received') return 'success'
  if (status === 'rejected' || status === 'withdrawn') return 'danger'
  if (status === 'under_review' || status === 'visa_stage') return 'info'
  if (status === 'submitted') return 'warning'
  return 'neutral'
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<StudentApplication[]>([])
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
      universityName: '',
      country: '',
      programName: '',
      degreeLevel: '',
      intake: '',
      notes: '',
    },
  })

  const load = async () => {
    setError(null)
    try {
      setApplications(await studentApi.listApplications())
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
      await studentApi.createApplication(values)
      reset()
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading applications..." />

  return (
    <>
      <Helmet>
        <title>Applications | {BRAND.name}</title>
      </Helmet>

      <PageIntro
        title="Applications"
        description="Create and track your university applications."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'New Application'}
          </Button>
        }
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {showForm && (
        <PortalCard title="Start a new application" className="mb-6">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="University" required error={errors.universityName?.message}>
              <Input placeholder="e.g. University of Helsinki" {...register('universityName')} />
            </FormField>
            <FormField label="Country" required error={errors.country?.message}>
              <Select {...register('country')} defaultValue="">
                <option value="" disabled>
                  Select country
                </option>
                {CONSULTATION_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Program" required error={errors.programName?.message}>
              <Input placeholder="e.g. MSc Computer Science" {...register('programName')} />
            </FormField>
            <FormField label="Degree Level" required error={errors.degreeLevel?.message}>
              <Select {...register('degreeLevel')} defaultValue="">
                <option value="" disabled>
                  Select degree
                </option>
                {CONSULTATION_DEGREES.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Intake" required error={errors.intake?.message}>
              <Select {...register('intake')} defaultValue="">
                <option value="" disabled>
                  Select intake
                </option>
                {CONSULTATION_INTAKES.map((intake) => (
                  <option key={intake} value={intake}>
                    {intake}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Notes" className="sm:col-span-2" error={errors.notes?.message}>
              <Textarea placeholder="Any preferences or notes for your counsellor..." {...register('notes')} />
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </PortalCard>
      )}

      <PortalCard title="Your applications">
        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Use New Application to submit your first university choice."
          />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <article
                key={app.id}
                className="rounded-xl border border-border px-4 py-4 transition hover:border-primary/20"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">{app.universityName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {app.programName} · {app.degreeLevel}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {app.country} · {app.intake} intake
                    </p>
                  </div>
                  <StatusBadge label={app.status} tone={statusTone(app.status)} />
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
