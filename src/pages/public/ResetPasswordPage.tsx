import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { FormField } from '@/components/ui/label'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { BRAND, ROUTES } from '@/constants'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/schemas/auth'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null)
    if (!token) {
      setServerError('Reset token is missing. Request a new password reset link.')
      return
    }
    try {
      await authApi.resetPassword(token, values.newPassword)
      navigate(ROUTES.login, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | {BRAND.name}</title>
      </Helmet>
      <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-gradient-to-br from-primary via-[#102A66] to-[#1a3a7a]">
        <div className="container-wide flex min-h-[calc(100vh-6rem)] items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h1 className="text-2xl font-bold text-primary">Reset password</h1>
            <p className="mt-2 text-sm text-muted-foreground">Choose a new password for your account.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField label="New Password" required error={errors.newPassword?.message}>
                <PasswordInput autoComplete="new-password" {...register('newPassword')} />
              </FormField>
              <FormField label="Confirm Password" required error={errors.confirmPassword?.message}>
                <PasswordInput autoComplete="new-password" {...register('confirmPassword')} />
              </FormField>
              {serverError && <p className="text-sm text-destructive">{serverError}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
                {isSubmitting ? 'Updating...' : 'Reset password'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to={ROUTES.forgotPassword} className="font-semibold text-primary hover:underline">
                Request a new link
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
