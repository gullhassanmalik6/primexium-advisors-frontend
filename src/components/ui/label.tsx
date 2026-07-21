import { forwardRef, type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  ),
)

Label.displayName = 'Label'

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function FormField({
  label,
  required,
  error,
  children,
  className,
}: {
  label?: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      <FieldError message={error} />
    </div>
  )
}
