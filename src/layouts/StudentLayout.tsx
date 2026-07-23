import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaGraduationCap,
  FaHome,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.student.dashboard, icon: FaHome },
  { label: 'Applications', href: ROUTES.student.applications, icon: FaGraduationCap },
  { label: 'Documents', href: ROUTES.student.documents, icon: FaFileAlt },
  { label: 'Payments', href: ROUTES.student.payments, icon: FaMoneyBillWave },
  { label: 'Appointments', href: ROUTES.student.appointments, icon: FaCalendarAlt },
  { label: 'Messages', href: ROUTES.student.messages, icon: FaComments },
  { label: 'Profile', href: ROUTES.student.profile, icon: FaUser },
]

export function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.home)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo variant="navbar" />
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline">
              Student Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.home} className="hidden text-sm text-muted-foreground hover:text-primary sm:inline">
              Website
            </Link>
            <span className="text-sm font-medium text-primary">
              {user?.firstName} {user?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-3 shadow-sm lg:sticky lg:top-24">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Student navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-accent hover:text-primary',
                  )
                }
              >
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
