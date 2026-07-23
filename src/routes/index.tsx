import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageElements'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { StudentLayout } from '@/layouts/StudentLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { ROUTES, USER_ROLES } from '@/constants'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'))
const CountriesPage = lazy(() => import('@/pages/public/CountriesPage'))
const UniversitiesPage = lazy(() => import('@/pages/public/UniversitiesPage'))
const PackagesPage = lazy(() => import('@/pages/public/PackagesPage'))
const SuccessStoriesPage = lazy(() => import('@/pages/public/SuccessStoriesPage'))
const BlogPage = lazy(() => import('@/pages/public/BlogPage'))
const FAQsPage = lazy(() => import('@/pages/public/FAQsPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const BookConsultationPage = lazy(() => import('@/pages/public/BookConsultationPage'))
const EligibilityCheckerPage = lazy(() => import('@/pages/public/EligibilityCheckerPage'))
const LoginPage = lazy(() => import('@/pages/public/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/public/ResetPasswordPage'))

const StudentDashboardPage = lazy(() => import('@/pages/student/DashboardPage'))
const StudentApplicationsPage = lazy(() => import('@/pages/student/ApplicationsPage'))
const StudentDocumentsPage = lazy(() => import('@/pages/student/DocumentsPage'))
const StudentPaymentsPage = lazy(() => import('@/pages/student/PaymentsPage'))
const StudentAppointmentsPage = lazy(() => import('@/pages/student/AppointmentsPage'))
const StudentMessagesPage = lazy(() => import('@/pages/student/MessagesPage'))
const StudentProfilePage = lazy(() => import('@/pages/student/ProfilePage'))

const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminLeadsPage = lazy(() => import('@/pages/admin/LeadsPage'))
const AdminStudentsPage = lazy(() => import('@/pages/admin/StudentsPage'))
const AdminApplicationsPage = lazy(() => import('@/pages/admin/ApplicationsPage'))
const AdminDocumentsPage = lazy(() => import('@/pages/admin/DocumentsPage'))
const AdminPaymentsPage = lazy(() => import('@/pages/admin/PaymentsPage'))
const AdminAppointmentsPage = lazy(() => import('@/pages/admin/AppointmentsPage'))
const AdminMessagesPage = lazy(() => import('@/pages/admin/MessagesPage'))
const AdminEmployeesPage = lazy(() => import('@/pages/admin/EmployeesPage'))
const AdminReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const AdminContentPage = lazy(() => import('@/pages/admin/ContentPage'))

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

function ContentPage({
  kind,
}: {
  kind: 'country' | 'university' | 'package' | 'blog' | 'testimonial'
}) {
  return (
    <LazyPage>
      <AdminContentPage kind={kind} />
    </LazyPage>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LazyPage><HomePage /></LazyPage> },
      { path: ROUTES.about.slice(1), element: <LazyPage><AboutPage /></LazyPage> },
      { path: ROUTES.services.slice(1), element: <LazyPage><ServicesPage /></LazyPage> },
      { path: ROUTES.countries.slice(1), element: <LazyPage><CountriesPage /></LazyPage> },
      { path: ROUTES.universities.slice(1), element: <LazyPage><UniversitiesPage /></LazyPage> },
      { path: ROUTES.packages.slice(1), element: <LazyPage><PackagesPage /></LazyPage> },
      { path: ROUTES.successStories.slice(1), element: <LazyPage><SuccessStoriesPage /></LazyPage> },
      { path: ROUTES.blog.slice(1), element: <LazyPage><BlogPage /></LazyPage> },
      { path: ROUTES.faqs.slice(1), element: <LazyPage><FAQsPage /></LazyPage> },
      { path: ROUTES.contact.slice(1), element: <LazyPage><ContactPage /></LazyPage> },
      {
        path: ROUTES.bookConsultation.slice(1),
        element: <LazyPage><BookConsultationPage /></LazyPage>,
      },
      {
        path: ROUTES.eligibilityChecker.slice(1),
        element: <LazyPage><EligibilityCheckerPage /></LazyPage>,
      },
      { path: ROUTES.login.slice(1), element: <LazyPage><LoginPage /></LazyPage> },
      { path: ROUTES.register.slice(1), element: <LazyPage><RegisterPage /></LazyPage> },
      {
        path: ROUTES.forgotPassword.slice(1),
        element: <LazyPage><ForgotPasswordPage /></LazyPage>,
      },
      {
        path: ROUTES.resetPassword.slice(1),
        element: <LazyPage><ResetPasswordPage /></LazyPage>,
      },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.student.dashboard} replace /> },
      { path: 'dashboard', element: <LazyPage><StudentDashboardPage /></LazyPage> },
      { path: 'applications', element: <LazyPage><StudentApplicationsPage /></LazyPage> },
      { path: 'documents', element: <LazyPage><StudentDocumentsPage /></LazyPage> },
      { path: 'payments', element: <LazyPage><StudentPaymentsPage /></LazyPage> },
      { path: 'appointments', element: <LazyPage><StudentAppointmentsPage /></LazyPage> },
      { path: 'messages', element: <LazyPage><StudentMessagesPage /></LazyPage> },
      { path: 'profile', element: <LazyPage><StudentProfilePage /></LazyPage> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={ADMIN_ROLES}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.admin.dashboard} replace /> },
      { path: 'dashboard', element: <LazyPage><AdminDashboardPage /></LazyPage> },
      { path: 'leads', element: <LazyPage><AdminLeadsPage /></LazyPage> },
      { path: 'students', element: <LazyPage><AdminStudentsPage /></LazyPage> },
      { path: 'applications', element: <LazyPage><AdminApplicationsPage /></LazyPage> },
      { path: 'documents', element: <LazyPage><AdminDocumentsPage /></LazyPage> },
      { path: 'payments', element: <LazyPage><AdminPaymentsPage /></LazyPage> },
      { path: 'appointments', element: <LazyPage><AdminAppointmentsPage /></LazyPage> },
      { path: 'messages', element: <LazyPage><AdminMessagesPage /></LazyPage> },
      { path: 'employees', element: <LazyPage><AdminEmployeesPage /></LazyPage> },
      { path: 'reports', element: <LazyPage><AdminReportsPage /></LazyPage> },
      { path: 'settings', element: <LazyPage><AdminSettingsPage /></LazyPage> },
      { path: 'countries', element: <ContentPage kind="country" /> },
      { path: 'universities', element: <ContentPage kind="university" /> },
      { path: 'packages', element: <ContentPage kind="package" /> },
      { path: 'blog', element: <ContentPage kind="blog" /> },
      { path: 'testimonials', element: <ContentPage kind="testimonial" /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.home} replace />,
  },
])
