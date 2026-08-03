import { Link } from 'react-router-dom'
import logoImage from '@/assets/logo.png'
import { BRAND, ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

type LogoVariant = 'navbar' | 'footer' | 'auth'

const variantStyles: Record<LogoVariant, string> = {
  navbar: 'h-11 w-auto sm:h-12',
  footer: 'h-20 w-auto sm:h-24',
  auth: 'h-24 w-auto sm:h-28',
}

interface LogoProps {
  variant?: LogoVariant
  className?: string
  linkToHome?: boolean
}

export function Logo({ variant = 'navbar', className, linkToHome = true }: LogoProps) {
  const image = (
    <img
      src={logoImage}
      alt={`${BRAND.name} — Connecting Dreams to Destinations`}
      className={cn('object-contain object-left', variantStyles[variant], className)}
      width={220}
      height={220}
      loading="eager"
      decoding="async"
    />
  )

  if (!linkToHome) {
    return image
  }

  return (
    <Link
      to={ROUTES.home}
      className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-label={`${BRAND.name} — Home`}
    >
      {image}
    </Link>
  )
}
