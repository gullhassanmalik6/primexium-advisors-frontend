import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FormSectionProps {
  icon: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ icon, title, description, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8',
        className,
      )}
    >
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
          <span aria-hidden>{icon}</span>
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

interface CheckboxGroupProps<T extends string> {
  options: { value: T; label: string }[]
  values: T[]
  onChange: (values: T[]) => void
  columns?: 1 | 2 | 3
}

export function CheckboxGroup<T extends string>({
  options,
  values,
  onChange,
  columns = 2,
}: CheckboxGroupProps<T>) {
  const toggle = (value: T) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value))
    } else {
      onChange([...values, value])
    }
  }

  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {options.map((option) => {
        const checked = values.includes(option.value)
        return (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors',
              checked
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/40',
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(option.value)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

interface RadioGroupProps<T extends string> {
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  inline?: boolean
}

export function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  inline = false,
}: RadioGroupProps<T>) {
  return (
    <div className={cn('flex gap-3', inline ? 'flex-wrap' : 'flex-col')}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors',
            value === option.value
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border hover:border-primary/40',
            inline && 'min-w-[140px]',
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 border-border text-primary focus:ring-primary"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

interface BooleanRadioProps {
  name: string
  value: boolean
  onChange: (value: boolean) => void
  yesLabel?: string
  noLabel?: string
}

export function BooleanRadio({
  name,
  value,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
}: BooleanRadioProps) {
  return (
    <RadioGroup
      name={name}
      options={[
        { value: 'yes', label: yesLabel },
        { value: 'no', label: noLabel },
      ]}
      value={value ? 'yes' : 'no'}
      onChange={(v) => onChange(v === 'yes')}
      inline
    />
  )
}
