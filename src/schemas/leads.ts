import { z } from 'zod'

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const consultationFormSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Phone number is required'),
  preferredCountry: z.string().min(1, 'Select a preferred country'),
  preferredDegree: z.string().min(1, 'Select a preferred degree'),
  preferredIntake: z.string().min(1, 'Select a preferred intake'),
  message: z.string().optional(),
})

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>
