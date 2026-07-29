import { apiClient } from '@/api/client'
import type { User, UserRole } from '@/types'
import type {
  AdminApplication,
  AdminAppointment,
  AdminDashboardStats,
  AdminDocument,
  AdminLead,
  AdminMessage,
  AdminPayment,
  AdminStudent,
  CrmOverview,
  EmployeeCreatePayload,
  LeadConvertResult,
  LeadStatus,
  PaymentCreatePayload,
  ReportSummary,
} from '@/types/admin'
import type {
  ApplicationStatus,
  AppointmentStatus,
  DocumentStatus,
  PaymentStatus,
} from '@/types/student'

interface LeadResponse {
  id: string
  lead_type: AdminLead['leadType']
  status: LeadStatus
  full_name: string
  email: string
  phone?: string
  subject?: string
  message?: string
  preferred_country?: string
  preferred_degree?: string
  preferred_intake?: string
  eligibility_score?: number
  eligibility_tier?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface DashboardResponse {
  leads_new: number
  leads_total: number
  students_total: number
  applications_total: number
  applications_active: number
  documents_pending: number
  payments_pending: number
  appointments_requested: number
  messages_unread_from_students: number
}

interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: UserRole
  is_active: boolean
  avatar_url?: string
  created_at: string
  applications_count?: number
}

function mapUser(data: UserResponse): User {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    role: data.role,
    isActive: data.is_active,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
  }
}

function mapLead(data: LeadResponse): AdminLead {
  return {
    id: data.id,
    leadType: data.lead_type,
    status: data.status,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    preferredCountry: data.preferred_country,
    preferredDegree: data.preferred_degree,
    preferredIntake: data.preferred_intake,
    eligibilityScore: data.eligibility_score,
    eligibilityTier: data.eligibility_tier,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export const adminApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get<DashboardResponse>('/admin/dashboard')
    return {
      leadsNew: data.leads_new,
      leadsTotal: data.leads_total,
      studentsTotal: data.students_total,
      applicationsTotal: data.applications_total,
      applicationsActive: data.applications_active,
      documentsPending: data.documents_pending,
      paymentsPending: data.payments_pending,
      appointmentsRequested: data.appointments_requested,
      messagesUnreadFromStudents: data.messages_unread_from_students,
    } satisfies AdminDashboardStats
  },

  getCrmOverview: async () => {
    const { data } = await apiClient.get<{
      stats: DashboardResponse
      recent_leads: LeadResponse[]
      leads_by_status: Record<string, number>
    }>('/admin/crm/overview')
    return {
      stats: {
        leadsNew: data.stats.leads_new,
        leadsTotal: data.stats.leads_total,
        studentsTotal: data.stats.students_total,
        applicationsTotal: data.stats.applications_total,
        applicationsActive: data.stats.applications_active,
        documentsPending: data.stats.documents_pending,
        paymentsPending: data.stats.payments_pending,
        appointmentsRequested: data.stats.appointments_requested,
        messagesUnreadFromStudents: data.stats.messages_unread_from_students,
      },
      recentLeads: data.recent_leads.map(mapLead),
      leadsByStatus: data.leads_by_status,
    } satisfies CrmOverview
  },

  getReportSummary: async () => {
    const { data } = await apiClient.get<{
      generated_at: string
      leads_by_type: Record<string, number>
      leads_by_status: Record<string, number>
      applications_by_status: Record<string, number>
      payments_by_status: Record<string, number>
      students_active: number
      students_inactive: number
    }>('/admin/reports/summary')
    return {
      generatedAt: data.generated_at,
      leadsByType: data.leads_by_type,
      leadsByStatus: data.leads_by_status,
      applicationsByStatus: data.applications_by_status,
      paymentsByStatus: data.payments_by_status,
      studentsActive: data.students_active,
      studentsInactive: data.students_inactive,
    } satisfies ReportSummary
  },

  listLeads: async (params?: { status?: LeadStatus; leadType?: string }) => {
    const { data } = await apiClient.get<{ items: LeadResponse[]; total: number }>('/leads', {
      params: {
        status: params?.status,
        lead_type: params?.leadType,
      },
    })
    return { items: data.items.map(mapLead), total: data.total }
  },

  updateLeadStatus: async (id: string, status: LeadStatus, notes?: string) => {
    const { data } = await apiClient.patch<LeadResponse>(`/leads/${id}`, { status, notes })
    return mapLead(data)
  },

  convertLead: async (id: string) => {
    const { data } = await apiClient.post<{
      lead: LeadResponse
      student_id: string
      student_email: string
      temporary_password?: string
      created_new_student: boolean
      message: string
    }>(`/leads/${id}/convert`)
    return {
      lead: mapLead(data.lead),
      studentId: data.student_id,
      studentEmail: data.student_email,
      temporaryPassword: data.temporary_password,
      createdNewStudent: data.created_new_student,
      message: data.message,
    } satisfies LeadConvertResult
  },

  listStudents: async () => {
    const { data } = await apiClient.get<UserResponse[]>('/admin/students')
    return data.map(
      (item) =>
        ({
          ...mapUser(item),
          applicationsCount: item.applications_count ?? 0,
        }) satisfies AdminStudent,
    )
  },

  getStudentDetail: async (id: string) => {
    const { data } = await apiClient.get<{
      student: UserResponse
      applications: Array<{
        id: string
        student_id: string
        university_name: string
        country: string
        program_name: string
        degree_level: string
        intake: string
        status: ApplicationStatus
        notes?: string
        created_at: string
        updated_at: string
      }>
      documents: Array<{
        id: string
        student_id: string
        application_id?: string
        document_type: AdminDocument['documentType']
        title: string
        file_url?: string
        status: DocumentStatus
        notes?: string
        created_at: string
        updated_at: string
      }>
      payments: Array<{
        id: string
        student_id: string
        application_id?: string
        title: string
        amount: string | number
        currency: string
        status: PaymentStatus
        due_date?: string
        paid_at?: string
        notes?: string
        created_at: string
        updated_at: string
      }>
      appointments: Array<{
        id: string
        student_id: string
        topic: string
        preferred_date: string
        preferred_time: string
        meeting_mode: string
        status: AppointmentStatus
        notes?: string
        created_at: string
        updated_at: string
      }>
      messages: Array<{
        id: string
        student_id: string
        sender_id: string
        subject: string
        body: string
        status: AdminMessage['status']
        is_from_student: boolean
        created_at: string
      }>
    }>(`/admin/students/${id}`)

    return {
      student: {
        ...mapUser(data.student),
        applicationsCount: data.student.applications_count ?? data.applications.length,
      },
      applications: data.applications.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        universityName: item.university_name,
        country: item.country,
        programName: item.program_name,
        degreeLevel: item.degree_level,
        intake: item.intake,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      documents: data.documents.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        applicationId: item.application_id,
        documentType: item.document_type,
        title: item.title,
        fileUrl: item.file_url,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      payments: data.payments.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        applicationId: item.application_id,
        title: item.title,
        amount: Number(item.amount),
        currency: item.currency,
        status: item.status,
        dueDate: item.due_date,
        paidAt: item.paid_at,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      appointments: data.appointments.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        topic: item.topic,
        preferredDate: item.preferred_date,
        preferredTime: item.preferred_time,
        meetingMode: item.meeting_mode,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      messages: data.messages.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        senderId: item.sender_id,
        subject: item.subject,
        body: item.body,
        status: item.status,
        isFromStudent: item.is_from_student,
        createdAt: item.created_at,
      })),
    }
  },

  updateStudentStatus: async (id: string, isActive: boolean) => {
    const { data } = await apiClient.patch<UserResponse>(`/admin/students/${id}`, {
      is_active: isActive,
    })
    return mapUser(data)
  },

  listApplications: async () => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        student_id: string
        university_name: string
        country: string
        program_name: string
        degree_level: string
        intake: string
        status: ApplicationStatus
        notes?: string
        created_at: string
        updated_at: string
        student_email: string
        student_name: string
      }>
    >('/admin/applications')
    return data.map(
      (item) =>
        ({
          id: item.id,
          studentId: item.student_id,
          universityName: item.university_name,
          country: item.country,
          programName: item.program_name,
          degreeLevel: item.degree_level,
          intake: item.intake,
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          studentEmail: item.student_email,
          studentName: item.student_name,
        }) satisfies AdminApplication,
    )
  },

  updateApplicationStatus: async (id: string, status: ApplicationStatus, notes?: string) => {
    await apiClient.patch(`/admin/applications/${id}`, { status, notes })
  },

  listDocuments: async () => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        student_id: string
        application_id?: string
        document_type: AdminDocument['documentType']
        title: string
        file_url?: string
        status: DocumentStatus
        notes?: string
        created_at: string
        updated_at: string
        student_email: string
        student_name: string
      }>
    >('/admin/documents')
    return data.map(
      (item) =>
        ({
          id: item.id,
          studentId: item.student_id,
          applicationId: item.application_id,
          documentType: item.document_type,
          title: item.title,
          fileUrl: item.file_url,
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          studentEmail: item.student_email,
          studentName: item.student_name,
        }) satisfies AdminDocument,
    )
  },

  updateDocumentStatus: async (id: string, status: DocumentStatus, notes?: string) => {
    await apiClient.patch(`/admin/documents/${id}`, { status, notes })
  },

  listPayments: async () => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        student_id: string
        application_id?: string
        title: string
        amount: string | number
        currency: string
        status: PaymentStatus
        due_date?: string
        paid_at?: string
        notes?: string
        created_at: string
        updated_at: string
        student_email: string
        student_name: string
      }>
    >('/admin/payments')
    return data.map(
      (item) =>
        ({
          id: item.id,
          studentId: item.student_id,
          applicationId: item.application_id,
          title: item.title,
          amount: Number(item.amount),
          currency: item.currency,
          status: item.status,
          dueDate: item.due_date,
          paidAt: item.paid_at,
          notes: item.notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          studentEmail: item.student_email,
          studentName: item.student_name,
        }) satisfies AdminPayment,
    )
  },

  createPayment: async (payload: PaymentCreatePayload) => {
    await apiClient.post('/admin/payments', {
      student_id: payload.studentId,
      application_id: payload.applicationId,
      title: payload.title,
      amount: payload.amount,
      currency: payload.currency,
      due_date: payload.dueDate,
      notes: payload.notes,
    })
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus, notes?: string) => {
    await apiClient.patch(`/admin/payments/${id}`, { status, notes })
  },

  listAppointments: async () => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        student_id: string
        topic: string
        preferred_date: string
        preferred_time: string
        meeting_mode: string
        status: AppointmentStatus
        notes?: string
        created_at: string
        updated_at: string
        student_email: string
        student_name: string
      }>
    >('/admin/appointments')
    return data.map(
      (item) =>
        ({
          id: item.id,
          studentId: item.student_id,
          topic: item.topic,
          preferredDate: item.preferred_date,
          preferredTime: item.preferred_time,
          meetingMode: item.meeting_mode,
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          studentEmail: item.student_email,
          studentName: item.student_name,
        }) satisfies AdminAppointment,
    )
  },

  updateAppointmentStatus: async (id: string, status: AppointmentStatus, notes?: string) => {
    await apiClient.patch(`/admin/appointments/${id}`, { status, notes })
  },

  listMessages: async (studentId?: string) => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        student_id: string
        sender_id: string
        subject: string
        body: string
        status: AdminMessage['status']
        is_from_student: boolean
        created_at: string
        student_email: string
        student_name: string
      }>
    >('/admin/messages', { params: studentId ? { student_id: studentId } : undefined })
    return data.map(
      (item) =>
        ({
          id: item.id,
          studentId: item.student_id,
          senderId: item.sender_id,
          subject: item.subject,
          body: item.body,
          status: item.status,
          isFromStudent: item.is_from_student,
          createdAt: item.created_at,
          studentEmail: item.student_email,
          studentName: item.student_name,
        }) satisfies AdminMessage,
    )
  },

  sendMessage: async (studentId: string, subject: string, body: string) => {
    await apiClient.post('/admin/messages', {
      student_id: studentId,
      subject,
      body,
    })
  },

  markMessageRead: async (id: string) => {
    await apiClient.post(`/admin/messages/${id}/read`)
  },

  listEmployees: async () => {
    const { data } = await apiClient.get<UserResponse[]>('/admin/employees')
    return data.map(mapUser)
  },

  createEmployee: async (payload: EmployeeCreatePayload) => {
    const { data } = await apiClient.post<UserResponse>('/admin/employees', {
      email: payload.email,
      password: payload.password,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
      role: payload.role,
    })
    return mapUser(data)
  },

  updateEmployee: async (
    id: string,
    payload: { role?: UserRole; isActive?: boolean; firstName?: string; lastName?: string; phone?: string },
  ) => {
    const { data } = await apiClient.patch<UserResponse>(`/admin/employees/${id}`, {
      role: payload.role,
      is_active: payload.isActive,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
    })
    return mapUser(data)
  },
}
