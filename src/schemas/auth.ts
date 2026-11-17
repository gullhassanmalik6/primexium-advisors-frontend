import { z } from 'zod'
import { REFERRAL_OPTIONS } from '@/constants'

const phoneSchema = z
  .string()
  .trim()
  .max(30, 'Phone number is too long')
  .refine(
    (value) => {
      if (!value) return true
      const digits = value.replace(/\D/g, '')
      return digits.length >= 7 && digits.length <= 15
    },
    { message: 'Enter a valid international phone number' },
  )
  .optional()
  .or(z.literal(''))

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .max(100, 'First name is too long'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .max(100, 'Last name is too long'),
    email: z.string().trim().email('Enter a valid email address').max(255),
    phone: phoneSchema,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    referralSource: z.string().optional().or(z.literal('')),
    referralDetail: z.string().trim().max(255).optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.referralSource === 'other') {
        return Boolean(data.referralDetail && data.referralDetail.trim().length > 0)
      }
      return true
    },
    {
      message: 'Please tell us how you heard about us',
      path: ['referralDetail'],
    },
  )
  .refine(
    (data) => {
      if (!data.referralSource || data.referralSource === '') return true
      return REFERRAL_OPTIONS.some((option) => option.value === data.referralSource)
    },
    { message: 'Select a valid referral source', path: ['referralSource'] },
  )

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters').max(128),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
