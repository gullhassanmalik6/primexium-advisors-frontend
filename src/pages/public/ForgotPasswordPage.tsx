import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { BRAND, ROUTES } from '@/constants'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth'

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugResetUrl, setDebugResetUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null)
    setSuccess(null)
    setDebugResetUrl(null)
    try {
      const result = await authApi.forgotPassword(values.email)
      setSuccess(result.message)
      if (result.reset_url) setDebugResetUrl(result.reset_url)
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password | {BRAND.name}</title>
      </Helmet>
      <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-gradient-to-br from-primary via-[#102A66] to-[#1a3a7a]">
        <div className="container-wide flex min-h-[calc(100vh-6rem)] items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h1 className="text-2xl font-bold text-primary">Forgot password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your account email and we&apos;ll send a reset link.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField label="Email" required error={errors.email?.message}>
                <Input type="email" placeholder="you@example.com" {...register('email')} />
              </FormField>
              {serverError && <p className="text-sm text-destructive">{serverError}</p>}
              {success && <p className="text-sm text-emerald-600">{success}</p>}
              {debugResetUrl && (
                <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                  Debug reset link:{' '}
                  <a href={debugResetUrl} className="text-secondary underline">
                    Open reset page
                  </a>
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
