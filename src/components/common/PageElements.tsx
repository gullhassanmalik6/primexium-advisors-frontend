import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageLoaderProps {
  className?: string
  label?: string
}

export function PageLoader({ className, label = 'Loading...' }: PageLoaderProps) {
  return (
    <div
      className={cn('flex min-h-[50vh] flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-secondary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
