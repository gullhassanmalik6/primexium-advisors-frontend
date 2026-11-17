import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { useAuth } from '@/context/AuthContext'
import { BRAND, USER_ROLES } from '@/constants'
import type {
  FinanceCategory,
  FinanceEntry,
  FinanceEntryType,
  FinancePaymentMethod,
  FinanceSummary,
} from '@/types/admin'

const ENTRY_TYPES: { value: FinanceEntryType; label: string }[] = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'saving', label: 'Saving' },
  { value: 'investment', label: 'Investment' },
]

const CATEGORIES: { value: FinanceCategory; label: string; types: FinanceEntryType[] }[] = [
  { value: 'client_fee', label: 'Client fee', types: ['income'] },
  { value: 'partner_payout', label: 'Partner payout', types: ['income'] },
  { value: 'other_income', label: 'Other income', types: ['income'] },
  { value: 'transport', label: 'Transport / pick & drop', types: ['expense'] },
  { value: 'subscription', label: 'Subscription (Railway, etc.)', types: ['expense'] },
  { value: 'domain', label: 'Domain / hosting', types: ['expense'] },
  { value: 'marketing', label: 'Marketing / ads', types: ['expense'] },
  { value: 'office_rent', label: 'Office rent', types: ['expense'] },
  { value: 'office_supplies', label: 'Office supplies', types: ['expense'] },
  { value: 'utilities', label: 'Utilities', types: ['expense'] },
  { value: 'salary', label: 'Salary / allowance', types: ['expense'] },
  { value: 'software', label: 'Software / tools', types: ['expense'] },
  { value: 'reserve', label: 'Reserve / savings transfer', types: ['saving'] },
  { value: 'equipment', label: 'Equipment', types: ['investment'] },
  { value: 'other', label: 'Other', types: ['income', 'expense', 'saving', 'investment'] },
]

const METHODS: { value: FinancePaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'easypaisa', label: 'Easypaisa' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
]

const schema = z.object({
  entryDate: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense', 'saving', 'investment']),
  category: z.string().min(1, 'Category is required'),
  title: z.string().trim().min(2, 'Title is required').max(255),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, 'Amount must be positive'),
  currency: z.string().min(1),
  paidByName: z.string().trim().max(120).optional().or(z.literal('')),
  paymentMethod: z.enum(['cash', 'bank', 'jazzcash', 'easypaisa', 'card', 'other']),
  notes: z.string().trim().max(5000).optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

function money(amount: number, currency = 'PKR') {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function typeTone(type: FinanceEntryType) {
  if (type === 'income') return 'success'
  if (type === 'expense') return 'danger'
  if (type === 'saving') return 'info'
  return 'warning'
}

function monthBounds(d = new Date()) {
  const from = new Date(d.getFullYear(), d.getMonth(), 1)
  const to = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  const iso = (value: Date) => value.toISOString().slice(0, 10)
  return { from: iso(from), to: iso(to) }
}

export default function AdminFinancePage() {
  const { user } = useAuth()
  const canWrite = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.FINANCE
  const defaults = monthBounds()

  const [summary, setSummary] = useState<FinanceSummary | null>(null)
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [from, setFrom] = useState(defaults.from)
  const [to, setTo] = useState(defaults.to)
  const [typeFilter, setTypeFilter] = useState<'' | FinanceEntryType>('')
  const [paidByFilter, setPaidByFilter] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      entryDate: new Date().toISOString().slice(0, 10),
      type: 'expense',
      category: 'transport',
      title: '',
      amount: '',
      currency: 'PKR',
      paidByName: '',
      paymentMethod: 'cash',
      notes: '',
    },
  })

  const selectedType = useWatch({ control, name: 'type' })
  const selectedCategory = useWatch({ control, name: 'category' })
  const categoryOptions = useMemo(
    () => CATEGORIES.filter((item) => item.types.includes(selectedType)),
    [selectedType],
  )

  useEffect(() => {
    if (!categoryOptions.some((item) => item.value === selectedCategory)) {
      setValue('category', categoryOptions[0]?.value ?? 'other')
    }
  }, [categoryOptions, selectedCategory, setValue])

  const load = async () => {
    setError(null)
    try {
      const [summaryData, entryData] = await Promise.all([
        adminApi.getFinanceSummary({ from, to }),
        adminApi.listFinanceEntries({
          from,
          to,
          type: typeFilter || undefined,
          paidBy: paidByFilter.trim() || undefined,
        }),
      ])
      setSummary(summaryData)
      setEntries(entryData)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, typeFilter, paidByFilter])

  const onSubmit = async (values: FormValues) => {
    if (!canWrite) return
    try {
      await adminApi.createFinanceEntry({
        entryDate: values.entryDate,
        type: values.type,
        category: values.category as FinanceCategory,
        title: values.title.trim(),
        amount: Number(values.amount),
        currency: values.currency,
        paidByName: values.paidByName?.trim() || undefined,
        paymentMethod: values.paymentMethod,
        notes: values.notes?.trim() || undefined,
      })
      reset({
        entryDate: new Date().toISOString().slice(0, 10),
        type: 'expense',
        category: 'transport',
        title: '',
        amount: '',
        currency: 'PKR',
        paidByName: '',
        paymentMethod: 'cash',
        notes: '',
      })
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const deleteEntry = async (entry: FinanceEntry) => {
    if (!canWrite) return
    const confirmed = window.confirm(`Delete “${entry.title}” (${money(entry.amount, entry.currency)})?`)
    if (!confirmed) return
    setDeletingId(entry.id)
    try {
      await adminApi.deleteFinanceEntry(entry.id)
      setEntries((prev) => prev.filter((item) => item.id !== entry.id))
      setSummary(await adminApi.getFinanceSummary({ from, to }))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading && !summary) return <PageLoader label="Loading finance analytics..." />

  const cards = [
    { label: 'Income', value: summary?.totalIncome ?? 0, tone: 'text-emerald-700' },
    { label: 'Expense', value: summary?.totalExpense ?? 0, tone: 'text-red-700' },
    { label: 'Saving', value: summary?.totalSaving ?? 0, tone: 'text-sky-700' },
    { label: 'Investment', value: summary?.totalInvestment ?? 0, tone: 'text-amber-700' },
    {
      label: 'Profit / Loss',
      value: summary?.netProfitLoss ?? 0,
      tone: (summary?.netProfitLoss ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-700',
    },
    { label: 'Remaining', value: summary?.remainingAvailable ?? 0, tone: 'text-primary' },
  ]

  return (
    <>
      <Helmet>
        <title>Finance Analytics | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Consultancy Finance"
        description="Shared ledger for income, expenses, savings, and investments — so the whole team stays aligned on budget and profit."
        action={
          canWrite ? (
            <Button onClick={() => setShowForm((value) => !value)}>
              {showForm ? 'Close form' : 'Add entry'}
            </Button>
          ) : undefined
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <FormField label="From">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </FormField>
        <FormField label="To">
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </FormField>
        <FormField label="Type">
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as '' | FinanceEntryType)}>
            <option value="">All types</option>
            {ENTRY_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Paid by / taken by" className="sm:col-span-2 lg:col-span-3">
          <Input
            value={paidByFilter}
            onChange={(e) => setPaidByFilter(e.target.value)}
            placeholder="Filter by name (e.g. Sania)"
          />
        </FormField>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4">
            <p className={`text-2xl font-bold ${card.tone}`}>{money(card.value)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Student fees marked paid (reference only):{' '}
        <span className="font-medium text-primary">
          {money(summary?.studentFeesPaidReference ?? 0)}
        </span>
        . Profit uses the company ledger, not this reference total.
      </p>

      {showForm && canWrite && (
        <PortalCard title="New ledger entry" className="mb-6">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Date" required error={errors.entryDate?.message}>
              <Input type="date" {...register('entryDate')} />
            </FormField>
            <FormField label="Type" required error={errors.type?.message}>
              <Select {...register('type')}>
                {ENTRY_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Category" required error={errors.category?.message}>
              <Select {...register('category')}>
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Amount (PKR)" required error={errors.amount?.message}>
              <Input type="number" step="0.01" min="0" placeholder="e.g. 5000" {...register('amount')} />
            </FormField>
            <FormField label="Title" required error={errors.title?.message} className="md:col-span-2">
              <Input
                placeholder="e.g. Sania — pick & drop / Railway subscription / Office rent"
                {...register('title')}
              />
            </FormField>
            <FormField label="Paid by / taken by" error={errors.paidByName?.message}>
              <Input placeholder="e.g. Sania, Ali, Office" {...register('paidByName')} />
            </FormField>
            <FormField label="Payment method" error={errors.paymentMethod?.message}>
              <Select {...register('paymentMethod')}>
                {METHODS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Notes" error={errors.notes?.message} className="md:col-span-2">
              <Textarea rows={3} placeholder="Optional details for the team" {...register('notes')} />
            </FormField>
            <input type="hidden" {...register('currency')} value="PKR" />
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save entry'}
              </Button>
            </div>
          </form>
        </PortalCard>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <PortalCard title="By category">
          {(summary?.byCategory.length ?? 0) === 0 ? (
            <EmptyState title="No breakdown" description="Add ledger entries to see category totals." />
          ) : (
            <ul className="space-y-2">
              {summary?.byCategory.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="min-w-0 break-words text-foreground">
                    {item.label} <span className="text-muted-foreground">({item.count})</span>
                  </span>
                  <span className="shrink-0 font-medium text-primary">{money(item.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </PortalCard>
        <PortalCard title="By team member">
          {(summary?.byMember.length ?? 0) === 0 ? (
            <EmptyState title="No member totals" description="Add a “paid by” name on entries." />
          ) : (
            <ul className="space-y-2">
              {summary?.byMember.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="min-w-0 break-words text-foreground">
                    {item.label} <span className="text-muted-foreground">({item.count})</span>
                  </span>
                  <span className="shrink-0 font-medium text-primary">{money(item.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </PortalCard>
      </div>

      <PortalCard title={`Ledger (${entries.length})`}>
        {entries.length === 0 ? (
          <EmptyState
            title="No entries in this range"
            description="Record income, expenses, savings, and investments for the team."
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words font-semibold text-primary">{entry.title}</h3>
                      <StatusBadge label={entry.type} tone={typeTone(entry.type)} />
                    </div>
                    <p className="mt-1 break-words text-sm text-muted-foreground">
                      {entry.entryDate} · {entry.category.replaceAll('_', ' ')} ·{' '}
                      {entry.paymentMethod.replaceAll('_', ' ')}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {entry.paidByName ? `By ${entry.paidByName}` : 'Paid by: Not provided'}
                      {entry.createdByName ? ` · Logged by ${entry.createdByName}` : ''}
                    </p>
                    {entry.notes && (
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    <p
                      className={`text-lg font-bold ${
                        entry.type === 'income'
                          ? 'text-emerald-700'
                          : entry.type === 'expense'
                            ? 'text-red-700'
                            : 'text-primary'
                      }`}
                    >
                      {entry.type === 'income' ? '+' : '−'}
                      {money(entry.amount, entry.currency)}
                    </p>
                    {canWrite && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        disabled={deletingId === entry.id}
                        onClick={() => void deleteEntry(entry)}
                      >
                        {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
