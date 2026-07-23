import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND, USER_ROLES } from '@/constants'
import type { User, UserRole } from '@/types'

const STAFF_ROLES: Exclude<UserRole, 'student'>[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.COUNSELLOR,
  USER_ROLES.DOCUMENTATION_OFFICER,
  USER_ROLES.FINANCE,
  USER_ROLES.MARKETING,
]

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum([
    'admin',
    'counsellor',
    'documentation_officer',
    'finance',
    'marketing',
  ]),
})

type FormValues = z.infer<typeof schema>

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'counsellor',
    },
  })

  const load = async () => {
    setError(null)
    try {
      setEmployees(await adminApi.listEmployees())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSubmit = async (values: FormValues) => {
    try {
      await adminApi.createEmployee({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      })
      reset()
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const toggleActive = async (employee: User) => {
    try {
      const updated = await adminApi.updateEmployee(employee.id, { isActive: !employee.isActive })
      setEmployees((prev) => prev.map((item) => (item.id === employee.id ? updated : item)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading employees..." />

  return (
    <>
      <Helmet>
        <title>Employees | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Employees"
        description="Create and manage staff accounts. Admin access only."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'Add Employee'}
          </Button>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {showForm && (
        <PortalCard title="New employee" className="mb-6">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="First Name" required error={errors.firstName?.message}>
              <Input {...register('firstName')} />
            </FormField>
            <FormField label="Last Name" required error={errors.lastName?.message}>
              <Input {...register('lastName')} />
            </FormField>
            <FormField label="Email" required error={errors.email?.message}>
              <Input type="email" {...register('email')} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <Input {...register('phone')} />
            </FormField>
            <FormField label="Password" required error={errors.password?.message}>
              <PasswordInput autoComplete="new-password" {...register('password')} />
            </FormField>
            <FormField label="Role" required>
              <Select {...register('role')}>
                {STAFF_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.replaceAll('_', ' ')}
                  </option>
                ))}
              </Select>
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </form>
        </PortalCard>
      )}
      <PortalCard title={`Staff (${employees.length})`}>
        {employees.length === 0 ? (
          <EmptyState title="No employees" description="Create your first staff account." />
        ) : (
          <div className="space-y-3">
            {employees.map((employee) => (
              <article
                key={employee.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {employee.email} · {employee.role.replaceAll('_', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    label={employee.isActive ? 'active' : 'inactive'}
                    tone={employee.isActive ? 'success' : 'danger'}
                  />
                  <Button variant="outline" size="sm" onClick={() => void toggleActive(employee)}>
                    {employee.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
