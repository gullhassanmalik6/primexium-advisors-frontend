import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { cn } from '@/utils/cn'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn(
            'flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 pr-11 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
        >
          {visible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
