import { ROUTES, USER_ROLES } from '@/constants'
import type { UserRole } from '@/types'

export const STAFF_ROLES: UserRole[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.COUNSELLOR,
  USER_ROLES.DOCUMENTATION_OFFICER,
  USER_ROLES.FINANCE,
  USER_ROLES.MARKETING,
]

export function isStaffRole(role: UserRole | string | null | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role as UserRole)
}

/** Redirect destination after login — driven by DB role, never by email. */
export function getHomePath(role: UserRole | string): string {
  if (role === USER_ROLES.STUDENT) return ROUTES.student.dashboard
  if (isStaffRole(role)) return ROUTES.admin.dashboard
  return ROUTES.home
}
