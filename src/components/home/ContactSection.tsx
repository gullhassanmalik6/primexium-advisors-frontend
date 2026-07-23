import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { OfficeCards } from '@/components/common/OfficeCards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { leadsApi } from '@/api/leads'
import { BRAND, ROUTES } from '@/constants'
import { contactFormSchema, type ContactFormValues } from '@/schemas/leads'

export function ContactSection() {
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
    <section className="section-padding bg-primary text-white">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-secondary">
              Contact Us
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Get in touch with our international counsellors in Karachi and Paris for a free
              consultation.
            </p>

            <div className="mt-8">
              <OfficeCards variant="dark" showMaps={false} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${BRAND.email}`}
                className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-secondary"
              >
                <FaEnvelope className="text-secondary" />
                {BRAND.email}
              </a>
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-secondary"
              >
                <FaWhatsapp className="text-secondary" />
                WhatsApp
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 text-foreground shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-primary">Send us a Message</h3>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Your Name" required error={errors.fullName?.message}>
                  <Input placeholder="Your Name" {...register('fullName')} />
                </FormField>
                <FormField label="Email" required error={errors.email?.message}>
                  <Input type="email" placeholder="Email Address" {...register('email')} />
                </FormField>
              </div>
              <FormField label="Phone" error={errors.phone?.message}>
                <Input placeholder="Phone Number" {...register('phone')} />
              </FormField>
              <FormField label="Subject" required error={errors.subject?.message}>
                <Input placeholder="Subject" {...register('subject')} />
              </FormField>
              <FormField label="Message" required error={errors.message?.message}>
                <Textarea placeholder="Your Message" {...register('message')} />
              </FormField>
              {serverError && <p className="text-sm text-destructive">{serverError}</p>}
              {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Or{' '}
              <Link
                to={ROUTES.bookConsultation}
                className="font-medium text-secondary hover:underline"
              >
                book a free consultation
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
