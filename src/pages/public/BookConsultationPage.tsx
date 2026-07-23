import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { leadsApi } from '@/api/leads'
import {
  CONSULTATION_COUNTRIES,
  CONSULTATION_DEGREES,
  CONSULTATION_INTAKES,
} from '@/constants/content'
import { BRAND } from '@/constants'
import { consultationFormSchema, type ConsultationFormValues } from '@/schemas/leads'

export default function BookConsultationPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      preferredCountry: '',
      preferredDegree: '',
      preferredIntake: '',
      message: '',
    },
  })

  const onSubmit = async (values: ConsultationFormValues) => {
    setServerError(null)
    setSuccessMessage(null)
    try {
      const result = await leadsApi.submitConsultation({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        preferred_country: values.preferredCountry,
        preferred_degree: values.preferredDegree,
        preferred_intake: values.preferredIntake,
        message: values.message || undefined,
      })
      setSuccessMessage(result.message)
      reset()
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Book a Consultation | {BRAND.name}</title>
        <meta
          name="description"
          content="Book a free study abroad consultation with Primexium Consultants counsellors."
        />
      </Helmet>

      <PageHero
        eyebrow="Free Consultation"
        title="Book a Free Consultation"
        description="Share a few details and our counsellor will contact you to plan your next steps."
      />

      <section className="container-wide section-padding">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Full Name" required error={errors.fullName?.message}>
                <Input placeholder="Your full name" {...register('fullName')} />
              </FormField>
              <FormField label="Email" required error={errors.email?.message}>
                <Input type="email" placeholder="you@example.com" {...register('email')} />
              </FormField>
            </div>
            <FormField label="Phone (WhatsApp)" required error={errors.phone?.message}>
              <Input placeholder="+92 300 0000000" {...register('phone')} />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-3">
              <FormField label="Preferred Country" required error={errors.preferredCountry?.message}>
                <Select {...register('preferredCountry')} defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  {CONSULTATION_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Preferred Degree" required error={errors.preferredDegree?.message}>
                <Select {...register('preferredDegree')} defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  {CONSULTATION_DEGREES.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Preferred Intake" required error={errors.preferredIntake?.message}>
                <Select {...register('preferredIntake')} defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  {CONSULTATION_INTAKES.map((intake) => (
                    <option key={intake} value={intake}>
                      {intake}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="Additional Notes" error={errors.message?.message}>
              <Textarea
                placeholder="Tell us about your background or questions..."
                {...register('message')}
              />
            </FormField>
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
            {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Request Consultation'}
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}
