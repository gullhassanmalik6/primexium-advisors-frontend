import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa'
import { PageHero } from '@/components/common/PageHero'
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
          content="Contact Primexium Advisors for study abroad counselling, visas, and admissions support."
        />
      </Helmet>

      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Send us a message or book a free consultation with our expert counsellors."
      />

      <section className="container-wide section-padding">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Contact Details</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Our team typically responds within one business day.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { icon: FaPhone, label: 'Phone', value: BRAND.phone },
                { icon: FaEnvelope, label: 'Email', value: BRAND.email },
                { icon: FaMapMarkerAlt, label: 'Address', value: BRAND.address },
                { icon: FaWhatsapp, label: 'WhatsApp', value: BRAND.whatsapp },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to={ROUTES.bookConsultation} className="mt-8 inline-block">
              <Button variant="outline">Prefer a consultation call?</Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-primary">Send us a Message</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full Name" required error={errors.fullName?.message}>
                  <Input placeholder="Your name" {...register('fullName')} />
                </FormField>
                <FormField label="Email" required error={errors.email?.message}>
                  <Input type="email" placeholder="you@example.com" {...register('email')} />
                </FormField>
              </div>
              <FormField label="Phone" error={errors.phone?.message}>
                <Input placeholder="+92 300 0000000" {...register('phone')} />
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
      </section>
    </>
  )
}
