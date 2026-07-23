import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { PageHero } from '@/components/common/PageHero'
import { OfficeCards } from '@/components/common/OfficeCards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { leadsApi } from '@/api/leads'
import { BRAND, ROUTES } from '@/constants'
import { contactFormSchema, type ContactFormValues } from '@/schemas/leads'

export default function ContactPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null)
    setSuccessMessage(null)
    try {
      const result = await leadsApi.submitContact({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        subject: values.subject,
        message: values.message,
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
        <title>Contact Us | {BRAND.name}</title>
        <meta
          name="description"
          content="Contact Primexium Advisors in Karachi, Pakistan and Paris, France for study abroad counselling, visas, and admissions support."
        />
      </Helmet>

      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach our international team in Karachi and Paris, or send a message for a free consultation."
      />

      <section className="container-wide section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Our Offices</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {BRAND.name} operates internationally from France and Pakistan. Our team typically
            responds within one business day.
          </p>
        </div>

        <div className="mt-10">
          <OfficeCards />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`mailto:${BRAND.email}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary shadow-sm transition-colors hover:border-secondary"
          >
            <FaEnvelope className="text-secondary" />
            {BRAND.email}
          </a>
          <a
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary shadow-sm transition-colors hover:border-secondary"
          >
            <FaWhatsapp className="text-secondary" />
            WhatsApp {BRAND.whatsapp}
          </a>
        </div>
      </section>

      <section className="bg-muted section-padding">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold text-primary">Send us a Message</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Tell us about your study goals and preferred destination. We will connect you with
                the right counsellor from our Karachi or Paris office.
              </p>
              <Link to={ROUTES.bookConsultation} className="mt-6 inline-block">
                <Button variant="outline">Prefer a consultation call?</Button>
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Full Name" required error={errors.fullName?.message}>
                    <Input placeholder="Your name" {...register('fullName')} />
                  </FormField>
                  <FormField label="Email" required error={errors.email?.message}>
                    <Input type="email" placeholder="you@example.com" {...register('email')} />
                  </FormField>
                </div>
                <FormField label="Phone" error={errors.phone?.message}>
                  <Input placeholder="+33 or +92..." {...register('phone')} />
                </FormField>
                <FormField label="Subject" required error={errors.subject?.message}>
                  <Input placeholder="How can we help?" {...register('subject')} />
                </FormField>
                <FormField label="Message" required error={errors.message?.message}>
                  <Textarea placeholder="Tell us about your goals..." {...register('message')} />
                </FormField>
                {serverError && <p className="text-sm text-destructive">{serverError}</p>}
                {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
