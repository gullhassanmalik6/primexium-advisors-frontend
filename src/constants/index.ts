const KARACHI_ADDRESS =
  'Office No. 201, 2nd Floor, Amber Estate, Shahrah-e-Faisal, Karachi, Pakistan'

const KARACHI_MAPS_QUERY = encodeURIComponent(KARACHI_ADDRESS)

export const OFFICES = [
  {
    id: 'karachi',
    flag: '🇵🇰',
    label: 'Head Office',
    city: 'Karachi, Sindh, Pakistan',
    address: KARACHI_ADDRESS,
    phone: '+92 329 2595900',
    email: 'info@primexiumadvisors.com',
    mapLabel: KARACHI_ADDRESS,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${KARACHI_MAPS_QUERY}`,
    mapEmbedUrl: `https://www.google.com/maps?q=${KARACHI_MAPS_QUERY}&output=embed`,
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
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Paris%2C%20France',
    mapEmbedUrl: 'https://www.google.com/maps?q=Paris%2C%20France&output=embed',
  },
] as const

export const OFFICE_HOURS = {
  label: 'Monday–Saturday: 10:00 AM–6:00 PM',
  timezone: 'Pakistan Standard Time (PKT, UTC+05:00)',
  note: 'Sunday closed. Holiday hours may vary.',
} as const

/**
 * Social links — set verified URLs here when available.
 * Null / empty values are not rendered as clickable icons.
 * Update this single source (or CMS later) — do not invent usernames.
 */
export const SOCIAL_LINKS = {
  facebook: null as string | null,
  instagram: null as string | null,
  linkedin: null as string | null,
  youtube: null as string | null,
  tiktok: null as string | null,
  whatsapp: 'https://wa.me/923292595900',
} as const

export const REFERRAL_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'google_search', label: 'Google Search' },
  { value: 'friend_or_family', label: 'Friend or Family' },
  { value: 'existing_student', label: 'Existing Student' },
  { value: 'educational_agent', label: 'Educational Agent / Partner' },
  { value: 'walk_in', label: 'Walk-in / Office Visit' },
  { value: 'other', label: 'Other' },
  { value: 'not_specified', label: 'Prefer not to say' },
] as const

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  registration_received: 'Registration Received',
  initial_assessment: 'Initial Assessment',
  documents_pending: 'Documents Pending',
  documents_under_review: 'Documents Under Review',
  university_selection: 'University Selection',
  application_preparation: 'Application Preparation',
  submitted: 'Application Submitted',
  under_review: 'University Decision Pending',
  offer_received: 'Offer Received',
  further_action_required: 'Further Action Required',
  campus_france: 'Campus France Preparation',
  visa_stage: 'Visa Documentation',
  pre_departure: 'Pre-Departure Guidance',
  completed: 'Completed',
  on_hold: 'On Hold',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const APPLICATION_PIPELINE = [
  'registration_received',
  'initial_assessment',
  'documents_pending',
  'documents_under_review',
  'university_selection',
  'application_preparation',
  'submitted',
  'under_review',
  'offer_received',
  'campus_france',
  'visa_stage',
  'pre_departure',
  'completed',
] as const

export const BRAND = {
  name: 'Primexium Advisors',
  legalName: 'PRIMEXIUM ADVISORS PRIVATE LIMITED',
  tagline: 'Connecting Dreams to Destinations',
  email: 'info@primexiumadvisors.com',
  phone: '+92 329 2595900',
  whatsapp: '+923292595900',
  address: KARACHI_ADDRESS,
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
    finance: '/admin/finance',
    documents: '/admin/documents',
    appointments: '/admin/appointments',
    messages: '/admin/messages',
    followUps: '/admin/follow-ups',
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
    description:
      'Expert guidance to help you choose the right country, university, and program for your career goals.',
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
