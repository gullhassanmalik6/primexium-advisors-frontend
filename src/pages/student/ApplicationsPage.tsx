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
import { APPLICATION_PIPELINE, APPLICATION_STATUS_LABELS, BRAND, ROUTES } from '@/constants'
import type { ApplicationTracking, StudentApplication } from '@/types/student'
import { Link } from 'react-router-dom'

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
  if (status === 'rejected' || status === 'withdrawn' || status === 'on_hold') return 'danger'
  if (status === 'under_review' || status === 'visa_stage' || status === 'campus_france') return 'info'
  if (status === 'submitted' || status === 'documents_pending') return 'warning'
  return 'neutral'
}

function progressIndex(status: string) {
  const idx = APPLICATION_PIPELINE.indexOf(status as (typeof APPLICATION_PIPELINE)[number])
  return idx >= 0 ? idx : 0
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [tracking, setTracking] = useState<ApplicationTracking | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)

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

  const openTracking = async (id: string) => {
    if (trackingId === id) {
      setTrackingId(null)
      setTracking(null)
      return
    }
    setTrackingId(id)
    setTrackingLoading(true)
    setError(null)
    try {
      setTracking(await studentApi.getApplicationTracking(id))
    } catch (err) {
      setError(getErrorMessage(err))
      setTrackingId(null)
    } finally {
      setTrackingLoading(false)
    }
  }

  if (loading) return <PageLoader label="Loading applications..." />

  return (
    <>
      <Helmet>
        <title>Applications | {BRAND.name}</title>
      </Helmet>

      <PageIntro
        title="Application Tracking"
        description="Check your live application status, completed stages, pending actions, and counsellor updates."
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
            {applications.map((app) => {
              const step = progressIndex(app.status)
              const pct = Math.round(((step + 1) / APPLICATION_PIPELINE.length) * 100)
              return (
                <article
                  key={app.id}
                  className="rounded-xl border border-border px-4 py-4 transition hover:border-primary/20"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-primary break-words">{app.universityName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground break-words">
                        {app.programName} · {app.degreeLevel}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {app.country} · {app.intake} intake
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        Current stage:{' '}
                        <span className="font-medium">
                          {APPLICATION_STATUS_LABELS[app.status] ?? app.status}
                        </span>
                      </p>
                      {app.studentNote && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                          {app.studentNote}
                        </p>
                      )}
                      {app.nextAction && (
                        <p className="mt-2 text-sm text-secondary">
                          Next action: {app.nextAction}
                          {app.nextActionDue ? ` (by ${app.nextActionDue})` : ''}
                        </p>
                      )}
                      {app.missingDocuments && (
                        <p className="mt-1 text-sm text-destructive">
                          Missing documents: {app.missingDocuments}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Last update: {new Date(app.updatedAt).toLocaleString()}
                      </p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-secondary transition-all"
                          style={{ width: `${pct}%` }}
                          aria-label={`Progress ${pct}%`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch gap-2 sm:items-end">
                      <StatusBadge
                        label={APPLICATION_STATUS_LABELS[app.status] ?? app.status}
                        tone={statusTone(app.status)}
                      />
                      <Button size="sm" variant="outline" onClick={() => void openTracking(app.id)}>
                        {trackingId === app.id ? 'Hide history' : 'View progress'}
                      </Button>
                    </div>
                  </div>

                  {trackingId === app.id && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      {trackingLoading && <p className="text-sm text-muted-foreground">Loading history...</p>}
                      {tracking && !trackingLoading && (
                        <>
                          <div>
                            <h4 className="text-sm font-semibold text-primary">Stage history</h4>
                            <ol className="mt-3 space-y-3">
                              {tracking.history.length === 0 ? (
                                <li className="text-sm text-muted-foreground">No history yet.</li>
                              ) : (
                                tracking.history.map((item) => (
                                  <li key={item.id} className="rounded-lg bg-muted/50 px-3 py-2">
                                    <p className="text-sm font-medium text-primary">
                                      {APPLICATION_STATUS_LABELS[item.toStatus] ?? item.toStatus}
                                    </p>
                                    {item.studentSafeNote && (
                                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                                        {item.studentSafeNote}
                                      </p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                  </li>
                                ))
                              )}
                            </ol>
                          </div>
                          {tracking.visibleFollowUps.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-primary">Updates from your counsellor</h4>
                              <ul className="mt-3 space-y-2">
                                {tracking.visibleFollowUps.map((item) => (
                                  <li key={item.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                                    <p className="whitespace-pre-wrap">
                                      {item.studentMessage || item.nextAction || 'Follow-up recorded'}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {item.followUpDate} · {item.method}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Questions?{' '}
                            <Link to={ROUTES.student.messages} className="font-medium text-secondary hover:underline">
                              Message your counsellor
                            </Link>{' '}
                            or{' '}
                            <Link to={ROUTES.contact} className="font-medium text-secondary hover:underline">
                              contact the office
                            </Link>
                            .
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </PortalCard>
    </>
  )
}
