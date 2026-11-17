import { apiClient } from '@/api/client'
import type { User, UserRole } from '@/types'
import type {
  AdminApplication,
  AdminAppointment,
  AdminDashboardStats,
  AdminDocument,
  AdminFollowUp,
  AdminLead,
  AdminMessage,
  AdminPayment,
  AdminStudent,
  ApplicationHistoryItem,
  ApplicationUpdatePayload,
  CrmOverview,
  EmployeeCreatePayload,
  FinanceEntry,
  FinanceEntryCreatePayload,
  FinanceEntryType,
  FinanceEntryUpdatePayload,
  FinanceSummary,
  FollowUpCreatePayload,
  FollowUpUpdatePayload,
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
  referral_source?: string
  referral_detail?: string
  created_at: string
  updated_at?: string
  applications_count?: number
}

interface ApplicationApiResponse {
  id: string
  student_id: string
  university_name: string
  country: string
  program_name: string
  degree_level: string
  intake: string
  status: ApplicationStatus
  notes?: string
  student_note?: string
  next_action?: string
  next_action_due?: string
  missing_documents?: string
  stage_completed_at?: string
  created_at: string
  updated_at: string
  student_email?: string
  student_name?: string
}

interface FollowUpApiResponse {
  id: string
  student_id: string
  application_id?: string
  staff_id?: string
  follow_up_date: string
  method: string
  summary: string
  next_action?: string
  next_follow_up_date?: string
  status: string
  visible_to_student: boolean
  student_message?: string
  related_status?: string
  created_at: string
  updated_at: string
  student_name?: string
  student_email?: string
  is_overdue?: boolean
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
    referralSource: data.referral_source,
    referralDetail: data.referral_detail,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapApplication(data: ApplicationApiResponse): AdminApplication {
  return {
    id: data.id,
    studentId: data.student_id,
    universityName: data.university_name,
    country: data.country,
    programName: data.program_name,
    degreeLevel: data.degree_level,
    intake: data.intake,
    status: data.status,
    notes: data.notes,
    studentNote: data.student_note,
    nextAction: data.next_action,
    nextActionDue: data.next_action_due,
    missingDocuments: data.missing_documents,
    stageCompletedAt: data.stage_completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    studentEmail: data.student_email ?? '',
    studentName: data.student_name ?? '',
  }
}

function mapFollowUp(data: FollowUpApiResponse): AdminFollowUp {
  const today = new Date().toISOString().slice(0, 10)
  const isOverdue =
    data.is_overdue ??
    (data.status === 'pending' && Boolean(data.follow_up_date) && data.follow_up_date < today)
  return {
    id: data.id,
    studentId: data.student_id,
    applicationId: data.application_id,
    staffId: data.staff_id,
    followUpDate: data.follow_up_date,
    method: data.method,
    summary: data.summary,
    nextAction: data.next_action,
    nextFollowUpDate: data.next_follow_up_date,
    status: data.status,
    visibleToStudent: data.visible_to_student,
    studentMessage: data.student_message,
    relatedStatus: data.related_status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    studentName: data.student_name,
    studentEmail: data.student_email,
    isOverdue,
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
      applications: ApplicationApiResponse[]
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
      applications: data.applications.map((item) => mapApplication(item)),
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

  deleteStudent: async (id: string) => {
    await apiClient.delete(`/admin/students/${id}`)
  },

  listApplications: async () => {
    const { data } = await apiClient.get<ApplicationApiResponse[]>('/admin/applications')
    return data.map((item) => mapApplication(item))
  },

  updateApplicationStatus: async (id: string, status: ApplicationStatus, notes?: string) => {
    await apiClient.patch(`/admin/applications/${id}`, { status, notes })
  },

  updateApplication: async (id: string, payload: ApplicationUpdatePayload) => {
    const { data } = await apiClient.patch<ApplicationApiResponse>(`/admin/applications/${id}`, {
      status: payload.status,
      notes: payload.notes,
      student_note: payload.studentNote,
      next_action: payload.nextAction,
      next_action_due: payload.nextActionDue || null,
      missing_documents: payload.missingDocuments,
    })
    return mapApplication(data)
  },

  getApplicationHistory: async (id: string) => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        application_id: string
        from_status?: string
        to_status: string
        student_safe_note?: string
        next_action?: string
        next_action_due?: string
        created_at: string
        changed_by_name?: string
      }>
    >(`/admin/applications/${id}/history`)
    return data.map(
      (item) =>
        ({
          id: item.id,
          applicationId: item.application_id,
          fromStatus: item.from_status,
          toStatus: item.to_status,
          studentSafeNote: item.student_safe_note,
          nextAction: item.next_action,
          nextActionDue: item.next_action_due,
          createdAt: item.created_at,
          changedByName: item.changed_by_name,
        }) satisfies ApplicationHistoryItem,
    )
  },

  listFollowUps: async (params?: { overdueOnly?: boolean }) => {
    const { data } = await apiClient.get<FollowUpApiResponse[]>('/admin/follow-ups', {
      params: params?.overdueOnly ? { overdue_only: true } : undefined,
    })
    return data.map(mapFollowUp)
  },

  createFollowUp: async (payload: FollowUpCreatePayload) => {
    const { data } = await apiClient.post<FollowUpApiResponse>('/admin/follow-ups', {
      student_id: payload.studentId,
      application_id: payload.applicationId || null,
      follow_up_date: payload.followUpDate,
      method: payload.method,
      summary: payload.summary,
      next_action: payload.nextAction,
      next_follow_up_date: payload.nextFollowUpDate || null,
      visible_to_student: payload.visibleToStudent ?? false,
      student_message: payload.studentMessage,
      related_status: payload.relatedStatus,
    })
    return mapFollowUp(data)
  },

  updateFollowUp: async (id: string, payload: FollowUpUpdatePayload) => {
    const { data } = await apiClient.patch<FollowUpApiResponse>(`/admin/follow-ups/${id}`, {
      status: payload.status,
      summary: payload.summary,
      next_action: payload.nextAction,
      next_follow_up_date: payload.nextFollowUpDate,
      visible_to_student: payload.visibleToStudent,
      student_message: payload.studentMessage,
    })
    return mapFollowUp(data)
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

  getFinanceSummary: async (params?: { from?: string; to?: string }) => {
    const { data } = await apiClient.get<{
      currency: string
      date_from?: string
      date_to?: string
      total_income: string | number
      total_expense: string | number
      total_saving: string | number
      total_investment: string | number
      net_profit_loss: string | number
      remaining_available: string | number
      student_fees_paid_reference: string | number
      by_category: Array<{ key: string; label: string; amount: string | number; count: number }>
      by_member: Array<{ key: string; label: string; amount: string | number; count: number }>
      by_month: Array<{ key: string; label: string; amount: string | number; count: number }>
      entry_count: number
    }>('/admin/finance/summary', { params: { from: params?.from, to: params?.to } })
    return {
      currency: data.currency,
      dateFrom: data.date_from,
      dateTo: data.date_to,
      totalIncome: Number(data.total_income),
      totalExpense: Number(data.total_expense),
      totalSaving: Number(data.total_saving),
      totalInvestment: Number(data.total_investment),
      netProfitLoss: Number(data.net_profit_loss),
      remainingAvailable: Number(data.remaining_available),
      studentFeesPaidReference: Number(data.student_fees_paid_reference),
      byCategory: data.by_category.map((item) => ({
        key: item.key,
        label: item.label,
        amount: Number(item.amount),
        count: item.count,
      })),
      byMember: data.by_member.map((item) => ({
        key: item.key,
        label: item.label,
        amount: Number(item.amount),
        count: item.count,
      })),
      byMonth: data.by_month.map((item) => ({
        key: item.key,
        label: item.label,
        amount: Number(item.amount),
        count: item.count,
      })),
      entryCount: data.entry_count,
    } satisfies FinanceSummary
  },

  listFinanceEntries: async (params?: {
    from?: string
    to?: string
    type?: FinanceEntryType
    category?: string
    paidBy?: string
  }) => {
    const { data } = await apiClient.get<
      Array<{
        id: string
        entry_date: string
        type: FinanceEntry['type']
        category: FinanceEntry['category']
        title: string
        amount: string | number
        currency: string
        paid_by_name?: string
        paid_by_user_id?: string
        payment_method: FinanceEntry['paymentMethod']
        notes?: string
        attachment_url?: string
        is_active: boolean
        created_by_id?: string
        created_by_name?: string
        created_at: string
        updated_at: string
      }>
    >('/admin/finance/entries', {
      params: {
        from: params?.from,
        to: params?.to,
        type: params?.type,
        category: params?.category,
        paid_by: params?.paidBy,
      },
    })
    return data.map(
      (item) =>
        ({
          id: item.id,
          entryDate: item.entry_date,
          type: item.type,
          category: item.category,
          title: item.title,
          amount: Number(item.amount),
          currency: item.currency,
          paidByName: item.paid_by_name,
          paidByUserId: item.paid_by_user_id,
          paymentMethod: item.payment_method,
          notes: item.notes,
          attachmentUrl: item.attachment_url,
          isActive: item.is_active,
          createdById: item.created_by_id,
          createdByName: item.created_by_name,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }) satisfies FinanceEntry,
    )
  },

  createFinanceEntry: async (payload: FinanceEntryCreatePayload) => {
    const { data } = await apiClient.post<{
      id: string
      entry_date: string
      type: FinanceEntry['type']
      category: FinanceEntry['category']
      title: string
      amount: string | number
      currency: string
      paid_by_name?: string
      paid_by_user_id?: string
      payment_method: FinanceEntry['paymentMethod']
      notes?: string
      attachment_url?: string
      is_active: boolean
      created_by_id?: string
      created_by_name?: string
      created_at: string
      updated_at: string
    }>('/admin/finance/entries', {
      entry_date: payload.entryDate,
      type: payload.type,
      category: payload.category,
      title: payload.title,
      amount: payload.amount,
      currency: payload.currency ?? 'PKR',
      paid_by_name: payload.paidByName,
      paid_by_user_id: payload.paidByUserId,
      payment_method: payload.paymentMethod ?? 'cash',
      notes: payload.notes,
    })
    return {
      id: data.id,
      entryDate: data.entry_date,
      type: data.type,
      category: data.category,
      title: data.title,
      amount: Number(data.amount),
      currency: data.currency,
      paidByName: data.paid_by_name,
      paidByUserId: data.paid_by_user_id,
      paymentMethod: data.payment_method,
      notes: data.notes,
      attachmentUrl: data.attachment_url,
      isActive: data.is_active,
      createdById: data.created_by_id,
      createdByName: data.created_by_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } satisfies FinanceEntry
  },

  updateFinanceEntry: async (id: string, payload: FinanceEntryUpdatePayload) => {
    await apiClient.patch(`/admin/finance/entries/${id}`, {
      entry_date: payload.entryDate,
      type: payload.type,
      category: payload.category,
      title: payload.title,
      amount: payload.amount,
      currency: payload.currency,
      paid_by_name: payload.paidByName,
      paid_by_user_id: payload.paidByUserId,
      payment_method: payload.paymentMethod,
      notes: payload.notes,
      is_active: payload.isActive,
    })
  },

  deleteFinanceEntry: async (id: string) => {
    await apiClient.delete(`/admin/finance/entries/${id}`)
  },
}
