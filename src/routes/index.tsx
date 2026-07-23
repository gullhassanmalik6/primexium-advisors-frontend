import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageElements'
import { AppShellLayout } from '@/layouts/AppShellLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { ROUTES, USER_ROLES } from '@/constants'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const EligibilityCheckerPage = lazy(() => import('@/pages/public/EligibilityCheckerPage'))
const LoginPage = lazy(() => import('@/pages/public/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'))
const PlaceholderPageComponent = lazy(() => import('@/pages/public/PlaceholderPage'))

function LazyPlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PlaceholderPageComponent title={title} description={description} />
    </Suspense>
  )
}

function withTitle(title: string, description?: string) {
  return lazy(() =>
    import('@/pages/public/PlaceholderPage').then((m) => ({
      default: () => <m.default title={title} description={description} />,
    })),
  )
}

const AboutPage = withTitle('About Us', 'Learn about Primexium Consultants and our mission.')
const ServicesPage = withTitle('Our Services')
const CountriesPage = withTitle('Study Destinations')
const UniversitiesPage = withTitle('Universities')
const PackagesPage = withTitle('Packages & Pricing')
const SuccessStoriesPage = withTitle('Success Stories')
const BlogPage = withTitle('Blog')
const FAQsPage = withTitle('FAQs')
const ContactPage = withTitle('Contact Us')
const BookConsultationPage = withTitle('Book a Consultation')

const ADMIN_ROLES: Array<(typeof USER_ROLES)[keyof typeof USER_ROLES]> = [
  USER_ROLES.ADMIN,
  USER_ROLES.COUNSELLOR,
  USER_ROLES.DOCUMENTATION_OFFICER,
  USER_ROLES.FINANCE,
  USER_ROLES.MARKETING,
]

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <HomePage />
          </LazyPage>
        ),
      },
      { path: ROUTES.about.slice(1), element: <LazyPage><AboutPage /></LazyPage> },
      { path: ROUTES.services.slice(1), element: <LazyPage><ServicesPage /></LazyPage> },
      { path: ROUTES.countries.slice(1), element: <LazyPage><CountriesPage /></LazyPage> },
      { path: ROUTES.universities.slice(1), element: <LazyPage><UniversitiesPage /></LazyPage> },
      { path: ROUTES.packages.slice(1), element: <LazyPage><PackagesPage /></LazyPage> },
      { path: ROUTES.successStories.slice(1), element: <LazyPage><SuccessStoriesPage /></LazyPage> },
      { path: ROUTES.blog.slice(1), element: <LazyPage><BlogPage /></LazyPage> },
      { path: ROUTES.faqs.slice(1), element: <LazyPage><FAQsPage /></LazyPage> },
      { path: ROUTES.contact.slice(1), element: <LazyPage><ContactPage /></LazyPage> },
      { path: ROUTES.bookConsultation.slice(1), element: <LazyPage><BookConsultationPage /></LazyPage> },
      {
        path: ROUTES.eligibilityChecker.slice(1),
        element: (
          <LazyPage>
            <EligibilityCheckerPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.login.slice(1),
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: ROUTES.register.slice(1),
        element: (
          <LazyPage>
            <RegisterPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.student.dashboard} replace /> },
      {
        path: 'dashboard',
        element: (
          <LazyPlaceholder
            title="Student Portal"
            description="Student dashboard coming soon."
          />
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={ADMIN_ROLES}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.admin.dashboard} replace /> },
      {
        path: 'dashboard',
        element: (
          <LazyPlaceholder title="Admin Portal" description="Admin dashboard coming soon." />
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.home} replace />,
  },
])
