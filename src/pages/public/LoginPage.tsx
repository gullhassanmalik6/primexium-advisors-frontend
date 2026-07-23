import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { FormField } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/api/client'
import { BRAND, ROUTES, USER_ROLES } from '@/constants'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'
import type { UserRole } from '@/types'

function redirectForRole(role: UserRole) {
  if (role === USER_ROLES.STUDENT) return ROUTES.student.dashboard
  return ROUTES.admin.dashboard
}

export default function LoginPage() {
  const { login, isAuthenticated, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (!isLoading && isAuthenticated && user) {
    return <Navigate to={from || redirectForRole(user.role)} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      const loggedInUser = await login(values)
      navigate(from || redirectForRole(loggedInUser.role), { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Login | {BRAND.name}</title>
      </Helmet>

      <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-gradient-to-br from-primary via-[#102A66] to-[#1a3a7a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12), transparent 35%)',
          }}
        />

        <div className="container-wide relative flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-white/95 p-8 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Welcome back
              </p>
              <h1 className="mt-2 text-3xl font-bold text-primary">Sign in</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Access your Primexium account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FormField label="Email" required error={errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </FormField>

              <FormField label="Password" required error={errors.password?.message}>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
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
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm">
              <Link to={ROUTES.forgotPassword} className="font-medium text-secondary hover:underline">
                Forgot password?
              </Link>
            </p>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.register} className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
