export const OFFICES = [
  {
    id: 'karachi',
    flag: '🇵🇰',
    label: 'Head Office',
    city: 'Karachi, Sindh, Pakistan',
    address: 'Karachi, Sindh, Pakistan',
    phone: '+92 329 2595900',
    email: 'info@primexiumadvisors.com',
    mapLabel: 'Karachi, Sindh, Pakistan',
    mapEmbedUrl:
      'https://www.google.com/maps?q=Karachi%2C%20Sindh%2C%20Pakistan&output=embed',
  },
  {
    id: 'paris',
    flag: '🇫🇷',
    label: 'Regional Office',
    city: 'Paris, France',
    address: 'Paris, France',
    phone: '+33 7 67 63 89 47',
    email: 'info@primexiumadvisors.com',
    mapLabel: 'Paris, France',
    mapEmbedUrl: 'https://www.google.com/maps?q=Paris%2C%20France&output=embed',
  },
] as const

export const BRAND = {
  name: 'Primexium Advisors',
  tagline: 'Connecting Dreams to Destinations',
  email: 'info@primexiumadvisors.com',
  phone: '+92 329 2595900',
  whatsapp: '+923292595900',
  address: 'Karachi, Pakistan · Paris, France',
  offices: OFFICES,
} as const

export const COLORS = {
  primary: '#102A66',
  secondary: '#D4AF37',
  background: '#FFFFFF',
  gray: '#F8FAFC',
  text: '#111827',
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export const ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  countries: '/countries',
  universities: '/universities',
  packages: '/packages',
  successStories: '/success-stories',
  blog: '/blog',
  faqs: '/faqs',
  contact: '/contact',
  bookConsultation: '/book-consultation',
  eligibilityChecker: '/eligibility-checker',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  student: {
    dashboard: '/student/dashboard',
    applications: '/student/applications',
    documents: '/student/documents',
    payments: '/student/payments',
    appointments: '/student/appointments',
    messages: '/student/messages',
    notifications: '/student/notifications',
    profile: '/student/profile',
  },
  admin: {
    dashboard: '/admin/dashboard',
    leads: '/admin/leads',
  students: '/admin/students',
  studentDetail: '/admin/students/:id',
  applications: '/admin/applications',
    employees: '/admin/employees',
    universities: '/admin/universities',
    countries: '/admin/countries',
    packages: '/admin/packages',
    payments: '/admin/payments',
    documents: '/admin/documents',
    appointments: '/admin/appointments',
    messages: '/admin/messages',
    blog: '/admin/blog',
    testimonials: '/admin/testimonials',
    reports: '/admin/reports',
    settings: '/admin/settings',
  },
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  COUNSELLOR: 'counsellor',
  DOCUMENTATION_OFFICER: 'documentation_officer',
  FINANCE: 'finance',
  MARKETING: 'marketing',
  STUDENT: 'student',
} as const

export const SERVICES = [
  {
    id: 'study-abroad',
    title: 'Study Abroad',
    description: 'Expert guidance to help you choose the right country, university, and program for your career goals.',
    icon: 'FaGraduationCap',
  },
  {
    id: 'student-visa',
    title: 'Student Visa',
    description: 'End-to-end visa application support with high success rates and meticulous documentation.',
    icon: 'FaPassport',
  },
  {
    id: 'visitor-visa',
    title: 'Visitor Visa',
    description: 'Hassle-free visitor visa processing for tourism, family visits, and short-term stays.',
    icon: 'FaPlane',
  },
  {
    id: 'admission-processing',
    title: 'Admission Processing',
    description: 'Complete university admission support from application to offer letter acceptance.',
    icon: 'FaUniversity',
  },
  {
    id: 'scholarship-guidance',
    title: 'Scholarship Guidance',
    description: 'Identify and apply for scholarships to reduce your study abroad costs significantly.',
    icon: 'FaAward',
  },
  {
    id: 'sop-writing',
    title: 'SOP Writing',
    description: 'Professionally crafted Statements of Purpose that make your application stand out.',
    icon: 'FaPenFancy',
  },
] as const

export const NAV_LINKS = [
  { label: 'Home', href: ROUTES.home },
  { label: 'About', href: ROUTES.about },
  { label: 'Services', href: ROUTES.services },
  { label: 'Countries', href: ROUTES.countries },
  { label: 'Universities', href: ROUTES.universities },
  { label: 'Packages', href: ROUTES.packages },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Contact', href: ROUTES.contact },
] as const
