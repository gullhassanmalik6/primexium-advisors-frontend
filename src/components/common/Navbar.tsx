import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { useAuth } from '@/context/AuthContext'
import { NAV_LINKS, ROUTES, USER_ROLES } from '@/constants'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const portalHref =
    user?.role === USER_ROLES.STUDENT ? ROUTES.student.dashboard : ROUTES.admin.dashboard

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate(ROUTES.home)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className="glass mx-4 mt-4 rounded-2xl px-4 sm:mx-6 lg:mx-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo variant="navbar" />

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-primary',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated && user ? (
              <>
                <Link to={portalHref}>
                  <Button variant="ghost" size="sm">
                    {user.firstName}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.login}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.register}>
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-primary lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <div className="flex flex-col gap-1 py-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2.5 text-sm font-medium',
                        isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                  {isAuthenticated && user ? (
                    <>
                      <Link to={portalHref} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {user.firstName}&apos;s portal
                        </Button>
                      </Link>
                      <Button className="w-full" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to={ROUTES.login} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link to={ROUTES.register} onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Register</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
