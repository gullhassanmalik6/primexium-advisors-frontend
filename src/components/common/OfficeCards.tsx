import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import { OFFICES } from '@/constants'
import { cn } from '@/utils/cn'

type OfficeCardsVariant = 'light' | 'dark' | 'compact'

interface OfficeCardsProps {
  variant?: OfficeCardsVariant
  showMaps?: boolean
  className?: string
}

export function OfficeCards({
  variant = 'light',
  showMaps = true,
  className,
}: OfficeCardsProps) {
  const isDark = variant === 'dark'
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        'grid gap-5',
        isCompact ? 'gap-4' : 'sm:grid-cols-2',
        className,
      )}
    >
      {OFFICES.map((office) => (
        <article
          key={office.id}
          className={cn(
            'overflow-hidden rounded-2xl border transition-shadow',
            isDark
              ? 'border-white/15 bg-white/5 hover:bg-white/10'
              : 'border-border bg-card shadow-sm hover:shadow-md',
            isCompact && 'p-4',
          )}
        >
          <div className={cn(!isCompact && 'p-5 sm:p-6')}>
            <div className="flex items-start gap-3">
              <span
                className="text-3xl leading-none"
                role="img"
                aria-label={office.city}
              >
                {office.flag}
              </span>
              <div>
                <p
                  className={cn(
                    'text-xs font-semibold uppercase tracking-[0.16em]',
                    isDark ? 'text-secondary' : 'text-secondary',
                  )}
                >
                  {office.label}
                </p>
                <h3
                  className={cn(
                    'mt-1 text-lg font-semibold',
                    isDark ? 'text-white' : 'text-primary',
                  )}
                >
                  {office.city}
                </h3>
              </div>
            </div>

            <ul className={cn('mt-5 space-y-3', isCompact && 'mt-3 space-y-2')}>
              <li className="flex items-start gap-3">
                <FaPhone
                  className={cn(
                    'mt-0.5 shrink-0',
                    isDark ? 'text-secondary' : 'text-primary',
                  )}
                  size={14}
                />
                <a
                  href={`tel:${office.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'text-sm transition-colors hover:text-secondary',
                    isDark ? 'text-white/85' : 'text-foreground',
                  )}
                >
                  {office.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope
                  className={cn(
                    'mt-0.5 shrink-0',
                    isDark ? 'text-secondary' : 'text-primary',
                  )}
                  size={14}
                />
                <a
                  href={`mailto:${office.email}`}
                  className={cn(
                    'text-sm transition-colors hover:text-secondary',
                    isDark ? 'text-white/85' : 'text-foreground',
                  )}
                >
                  {office.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt
                  className={cn(
                    'mt-0.5 shrink-0',
                    isDark ? 'text-secondary' : 'text-primary',
                  )}
                  size={14}
                />
                <span className={cn('text-sm', isDark ? 'text-white/70' : 'text-muted-foreground')}>
                  {office.address}
                </span>
              </li>
            </ul>
          </div>

          {showMaps && !isCompact && (
            <div className={cn('relative min-h-[160px] overflow-hidden border-t', isDark ? 'border-white/10' : 'border-border')}>
              <iframe
                title={`Map of ${office.mapLabel}`}
                src={office.mapEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
