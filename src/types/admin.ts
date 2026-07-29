import type { User, UserRole } from '@/types'
import type {
  ApplicationStatus,
  AppointmentStatus,
  DocumentStatus,
  PaymentStatus,
  StudentApplication,
  StudentAppointment,
  StudentDocument,
  StudentMessage,
  StudentPayment,
} from '@/types/student'

export type LeadType = 'contact' | 'consultation' | 'eligibility'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'

export interface AdminLead {
  id: string
  leadType: LeadType
  status: LeadStatus
  fullName: string
  email: string
  phone?: string
  subject?: string
  message?: string
  preferredCountry?: string
  preferredDegree?: string
  preferredIntake?: string
  eligibilityScore?: number
  eligibilityTier?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AdminDashboardStats {
  leadsNew: number
  leadsTotal: number
  studentsTotal: number
  applicationsTotal: number
  applicationsActive: number
  documentsPending: number
  paymentsPending: number
  appointmentsRequested: number
  messagesUnreadFromStudents: number
}

export interface AdminStudent extends User {
  applicationsCount: number
}

export interface AdminStudentDetail {
  student: AdminStudent
  applications: StudentApplication[]
  documents: StudentDocument[]
  payments: StudentPayment[]
  appointments: StudentAppointment[]
  messages: StudentMessage[]
}

export interface CrmOverview {
  stats: AdminDashboardStats
  recentLeads: AdminLead[]
  leadsByStatus: Record<string, number>
}

export interface LeadConvertResult {
  lead: AdminLead
  studentId: string
  studentEmail: string
  temporaryPassword?: string
  createdNewStudent: boolean
  message: string
}

export interface AdminApplication extends StudentApplication {
  studentEmail: string
  studentName: string
}

export interface AdminDocument extends StudentDocument {
  studentEmail: string
  studentName: string
}

export interface AdminPayment extends StudentPayment {
  studentEmail: string
  studentName: string
}

export interface AdminAppointment extends StudentAppointment {
  studentEmail: string
  studentName: string
}

export interface AdminMessage extends StudentMessage {
  studentEmail: string
  studentName: string
}

export interface ReportSummary {
  generatedAt: string
  leadsByType: Record<string, number>
  leadsByStatus: Record<string, number>
  applicationsByStatus: Record<string, number>
  paymentsByStatus: Record<string, number>
  studentsActive: number
  studentsInactive: number
}

export interface EmployeeCreatePayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: Exclude<UserRole, 'student'>
}

export interface PaymentCreatePayload {
  studentId: string
  applicationId?: string
  title: string
  amount: number
  currency: string
  dueDate?: string
  notes?: string
}

export type {
  ApplicationStatus,
  AppointmentStatus,
  DocumentStatus,
  PaymentStatus,
}
