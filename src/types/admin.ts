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

export interface ApplicationHistoryItem {
  id: string
  applicationId: string
  fromStatus?: string
  toStatus: string
  studentSafeNote?: string
  nextAction?: string
  nextActionDue?: string
  createdAt: string
  changedByName?: string
}

export interface ApplicationUpdatePayload {
  status: ApplicationStatus
  notes?: string
  studentNote?: string
  nextAction?: string
  nextActionDue?: string
  missingDocuments?: string
}

export interface AdminFollowUp {
  id: string
  studentId: string
  applicationId?: string
  staffId?: string
  followUpDate: string
  method: string
  summary: string
  nextAction?: string
  nextFollowUpDate?: string
  status: string
  visibleToStudent: boolean
  studentMessage?: string
  relatedStatus?: string
  createdAt: string
  updatedAt: string
  studentName?: string
  studentEmail?: string
  isOverdue?: boolean
}

export interface FollowUpCreatePayload {
  studentId: string
  applicationId?: string
  followUpDate: string
  method: string
  summary: string
  nextAction?: string
  nextFollowUpDate?: string
  visibleToStudent?: boolean
  studentMessage?: string
  relatedStatus?: string
}

export interface FollowUpUpdatePayload {
  status?: string
  summary?: string
  nextAction?: string
  nextFollowUpDate?: string
  visibleToStudent?: boolean
  studentMessage?: string
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

export type FinanceEntryType = 'income' | 'expense' | 'saving' | 'investment'

export type FinanceCategory =
  | 'client_fee'
  | 'partner_payout'
  | 'other_income'
  | 'transport'
  | 'subscription'
  | 'domain'
  | 'marketing'
  | 'office_rent'
  | 'office_supplies'
  | 'utilities'
  | 'salary'
  | 'software'
  | 'reserve'
  | 'equipment'
  | 'other'

export type FinancePaymentMethod =
  | 'cash'
  | 'bank'
  | 'jazzcash'
  | 'easypaisa'
  | 'card'
  | 'other'

export interface FinanceEntry {
  id: string
  entryDate: string
  type: FinanceEntryType
  category: FinanceCategory
  title: string
  amount: number
  currency: string
  paidByName?: string
  paidByUserId?: string
  paymentMethod: FinancePaymentMethod
  notes?: string
  attachmentUrl?: string
  isActive: boolean
  createdById?: string
  createdByName?: string
  createdAt: string
  updatedAt: string
}

export interface FinanceEntryCreatePayload {
  entryDate: string
  type: FinanceEntryType
  category: FinanceCategory
  title: string
  amount: number
  currency?: string
  paidByName?: string
  paidByUserId?: string
  paymentMethod?: FinancePaymentMethod
  notes?: string
}

export interface FinanceEntryUpdatePayload {
  entryDate?: string
  type?: FinanceEntryType
  category?: FinanceCategory
  title?: string
  amount?: number
  currency?: string
  paidByName?: string
  paidByUserId?: string
  paymentMethod?: FinancePaymentMethod
  notes?: string
  isActive?: boolean
}

export interface FinanceBreakdownItem {
  key: string
  label: string
  amount: number
  count: number
}

export interface FinanceSummary {
  currency: string
  dateFrom?: string
  dateTo?: string
  totalIncome: number
  totalExpense: number
  totalSaving: number
  totalInvestment: number
  netProfitLoss: number
  remainingAvailable: number
  studentFeesPaidReference: number
  byCategory: FinanceBreakdownItem[]
  byMember: FinanceBreakdownItem[]
  byMonth: FinanceBreakdownItem[]
  entryCount: number
}

export type {
  ApplicationStatus,
  AppointmentStatus,
  DocumentStatus,
  PaymentStatus,
}
