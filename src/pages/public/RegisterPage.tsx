import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/api/client'
import { BRAND, ROUTES } from '@/constants'
import { registerSchema, type RegisterFormValues } from '@/schemas/auth'

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.student.dashboard} replace />
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      })
      navigate(ROUTES.student.dashboard, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Register | {BRAND.name}</title>
      </Helmet>

      <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-gradient-to-br from-primary via-[#0B1F4D] to-[#152a5c]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 30%, rgba(212,175,55,0.35), transparent 40%), radial-gradient(circle at 85% 70%, rgba(255,255,255,0.12), transparent 35%)',
          }}
        />

        <div className="container-wide relative flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/95 p-8 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Get started
              </p>
              <h1 className="mt-2 text-3xl font-bold text-primary">Create account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join Primexium and start your study abroad journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="First name" required error={errors.firstName?.message}>
                  <Input
                    autoComplete="given-name"
                    placeholder="Hassan"
                    {...register('firstName')}
                  />
                </FormField>
                <FormField label="Last name" required error={errors.lastName?.message}>
                  <Input
                    autoComplete="family-name"
                    placeholder="Malik"
                    {...register('lastName')}
                  />
                </FormField>
              </div>

              <FormField label="Email" required error={errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </FormField>

              <FormField label="Phone" error={errors.phone?.message}>
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+92 300 0000000"
                  {...register('phone')}
                />
              </FormField>

              <FormField label="Password" required error={errors.password?.message}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                />
              </FormField>

              <FormField label="Confirm password" required error={errors.confirmPassword?.message}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  {...register('confirmPassword')}
                />
              </FormField>

              {serverError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
