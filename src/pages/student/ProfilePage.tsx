import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaExclamationTriangle } from 'react-icons/fa'
import { PageIntro, PortalCard } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { authApi } from '@/api/auth'
import { studentApi } from '@/api/student'
import { useAuth } from '@/context/AuthContext'
import { BRAND, ROUTES } from '@/constants'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const deleteSchema = z.object({
  confirmation: z
    .string()
    .refine((value) => value.trim().toUpperCase() === 'DELETE', {
      message: 'Type DELETE to confirm',
    }),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>
type DeleteFormValues = z.infer<typeof deleteSchema>

export default function StudentProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [email, setEmail] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const deleteForm = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { confirmation: '' },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await studentApi.getProfile()
        setEmail(profile.email)
        reset({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone ?? '',
        })
      } catch (err) {
        setError(getErrorMessage(err))
        if (user) {
          setEmail(user.email)
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: '',
          })
        }
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [reset, user])

  const onSubmit = async (values: ProfileFormValues) => {
    setError(null)
    setSuccess(null)
    try {
      await studentApi.updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || undefined,
      })
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordError(null)
    setPasswordSuccess(null)
    try {
      const message = await authApi.changePassword(values.currentPassword, values.newPassword)
      setPasswordSuccess(message)
      passwordForm.reset()
    } catch (err) {
      setPasswordError(getErrorMessage(err))
    }
  }

  const onDeleteAccount = async (values: DeleteFormValues) => {
    setDeleteError(null)
    const confirmed = window.confirm(
      'WARNING: This will permanently delete your account, applications, documents, messages, and appointments. This cannot be undone.\n\nDo you still want to delete your account?',
    )
    if (!confirmed) return

    try {
      await authApi.deleteAccount(values.confirmation)
      logout()
      navigate(ROUTES.home, { replace: true })
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading profile..." />

  return (
    <>
      <Helmet>
        <title>Profile | {BRAND.name}</title>
      </Helmet>

      <PageIntro
        title="Profile"
        description="Update your personal details and password."
      />

      <div className="space-y-6">
        <PortalCard title="Account details">
          <form className="grid max-w-xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="First Name" required error={errors.firstName?.message}>
              <Input {...register('firstName')} />
            </FormField>
            <FormField label="Last Name" required error={errors.lastName?.message}>
              <Input {...register('lastName')} />
            </FormField>
            <FormField label="Email" className="sm:col-span-2">
              <Input value={email} disabled />
            </FormField>
            <FormField label="Phone" className="sm:col-span-2" error={errors.phone?.message}>
              <Input placeholder="+92 300 0000000" {...register('phone')} />
            </FormField>
            {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
            {success && <p className="text-sm text-emerald-600 sm:col-span-2">{success}</p>}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </PortalCard>

        <PortalCard title="Change password">
          <form
            className="grid max-w-xl gap-4"
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            noValidate
          >
            <FormField
              label="Current Password"
              required
              error={passwordForm.formState.errors.currentPassword?.message}
            >
              <PasswordInput
                autoComplete="current-password"
                {...passwordForm.register('currentPassword')}
              />
            </FormField>
            <FormField
              label="New Password"
              required
              error={passwordForm.formState.errors.newPassword?.message}
            >
              <PasswordInput
                autoComplete="new-password"
                {...passwordForm.register('newPassword')}
              />
            </FormField>
            <FormField
              label="Confirm New Password"
              required
              error={passwordForm.formState.errors.confirmPassword?.message}
            >
              <PasswordInput
                autoComplete="new-password"
                {...passwordForm.register('confirmPassword')}
              />
            </FormField>
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-emerald-600">{passwordSuccess}</p>}
            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </PortalCard>

        <section className="rounded-2xl border border-destructive/30 bg-red-50/60 p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <FaExclamationTriangle className="mt-1 shrink-0 text-destructive" />
            <div>
              <h2 className="text-lg font-semibold text-destructive">Delete account</h2>
              <p className="mt-1 text-sm text-red-800/80">
                Permanently delete your profile and all related data. This action cannot be undone.
              </p>
            </div>
          </div>

          {!showDeleteWarning ? (
            <Button
              type="button"
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
              onClick={() => setShowDeleteWarning(true)}
            >
              I want to delete my account
            </Button>
          ) : (
            <div className="space-y-4">
              <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-white px-4 py-3 text-sm text-red-900"
              >
                <p className="font-semibold">Warning before you continue</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Your profile and login access will be removed forever.</li>
                  <li>Applications, documents, payments, appointments, and messages will be deleted.</li>
                  <li>You will need to register again if you want to use the portal later.</li>
                </ul>
              </div>

              <form
                className="grid max-w-xl gap-4"
                onSubmit={deleteForm.handleSubmit(onDeleteAccount)}
                autoComplete="off"
                noValidate
              >
                <FormField
                  label='Type DELETE to confirm'
                  required
                  error={deleteForm.formState.errors.confirmation?.message}
                >
                  <Input
                    placeholder="DELETE"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    {...deleteForm.register('confirmation')}
                  />
                </FormField>
                {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    className="bg-destructive text-white hover:bg-destructive/90"
                    disabled={deleteForm.formState.isSubmitting}
                  >
                    {deleteForm.formState.isSubmitting
                      ? 'Deleting...'
                      : 'Permanently delete my account'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDeleteWarning(false)
                      setDeleteError(null)
                      deleteForm.reset()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
