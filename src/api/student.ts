import { apiClient } from '@/api/client'
import type { User } from '@/types'
import type {
  ApplicationCreatePayload,
  AppointmentCreatePayload,
  DashboardStats,
  DocumentCreatePayload,
  MessageCreatePayload,
  ProfileUpdatePayload,
  StudentApplication,
  StudentAppointment,
  StudentDocument,
  StudentMessage,
  StudentPayment,
} from '@/types/student'

interface ApplicationResponse {
  id: string
  student_id: string
  university_name: string
  country: string
  program_name: string
  degree_level: string
  intake: string
  status: StudentApplication['status']
  notes?: string
  created_at: string
  updated_at: string
}

interface DocumentResponse {
  id: string
  student_id: string
  application_id?: string
  document_type: StudentDocument['documentType']
  title: string
  file_url?: string
  status: StudentDocument['status']
  notes?: string
  created_at: string
  updated_at: string
}

interface PaymentResponse {
  id: string
  student_id: string
  application_id?: string
  title: string
  amount: string | number
  currency: string
  status: StudentPayment['status']
  due_date?: string
  paid_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface AppointmentResponse {
  id: string
  student_id: string
  topic: string
  preferred_date: string
  preferred_time: string
  meeting_mode: string
  status: StudentAppointment['status']
  notes?: string
  created_at: string
  updated_at: string
}

interface MessageResponse {
  id: string
  student_id: string
  sender_id: string
  subject: string
  body: string
  status: StudentMessage['status']
  is_from_student: boolean
  created_at: string
}

interface DashboardResponse {
  applications_total: number
  applications_active: number
  documents_total: number
  documents_pending: number
  payments_pending: number
  appointments_upcoming: number
  messages_unread: number
}

interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: User['role']
  is_active: boolean
  avatar_url?: string
  created_at: string
}

function mapApplication(data: ApplicationResponse): StudentApplication {
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
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapDocument(data: DocumentResponse): StudentDocument {
  return {
    id: data.id,
    studentId: data.student_id,
    applicationId: data.application_id,
    documentType: data.document_type,
    title: data.title,
    fileUrl: data.file_url,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapPayment(data: PaymentResponse): StudentPayment {
  return {
    id: data.id,
    studentId: data.student_id,
    applicationId: data.application_id,
    title: data.title,
    amount: Number(data.amount),
    currency: data.currency,
    status: data.status,
    dueDate: data.due_date,
    paidAt: data.paid_at,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapAppointment(data: AppointmentResponse): StudentAppointment {
  return {
    id: data.id,
    studentId: data.student_id,
    topic: data.topic,
    preferredDate: data.preferred_date,
    preferredTime: data.preferred_time,
    meetingMode: data.meeting_mode,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapMessage(data: MessageResponse): StudentMessage {
  return {
    id: data.id,
    studentId: data.student_id,
    senderId: data.sender_id,
    subject: data.subject,
    body: data.body,
    status: data.status,
    isFromStudent: data.is_from_student,
    createdAt: data.created_at,
  }
}

function mapUser(data: UserResponse): User & { phone?: string } {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    isActive: data.is_active,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
    phone: data.phone,
  }
}

export const studentApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get<DashboardResponse>('/student/dashboard')
    return {
      applicationsTotal: data.applications_total,
      applicationsActive: data.applications_active,
      documentsTotal: data.documents_total,
      documentsPending: data.documents_pending,
      paymentsPending: data.payments_pending,
      appointmentsUpcoming: data.appointments_upcoming,
      messagesUnread: data.messages_unread,
    } satisfies DashboardStats
  },

  getProfile: async () => {
    const { data } = await apiClient.get<UserResponse>('/student/profile')
    return mapUser(data)
  },

  updateProfile: async (payload: ProfileUpdatePayload) => {
    const { data } = await apiClient.patch<UserResponse>('/student/profile', {
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
    })
    return mapUser(data)
  },

  listApplications: async () => {
    const { data } = await apiClient.get<ApplicationResponse[]>('/student/applications')
    return data.map(mapApplication)
  },

  createApplication: async (payload: ApplicationCreatePayload) => {
    const { data } = await apiClient.post<ApplicationResponse>('/student/applications', {
      university_name: payload.universityName,
      country: payload.country,
      program_name: payload.programName,
      degree_level: payload.degreeLevel,
      intake: payload.intake,
      notes: payload.notes,
    })
    return mapApplication(data)
  },

  listDocuments: async () => {
    const { data } = await apiClient.get<DocumentResponse[]>('/student/documents')
    return data.map(mapDocument)
  },

  createDocument: async (payload: DocumentCreatePayload) => {
    const { data } = await apiClient.post<DocumentResponse>('/student/documents', {
      document_type: payload.documentType,
      title: payload.title,
      file_url: payload.fileUrl,
      application_id: payload.applicationId,
      notes: payload.notes,
    })
    return mapDocument(data)
  },

  uploadDocument: async (payload: {
    documentType: DocumentCreatePayload['documentType']
    title: string
    file: File
    notes?: string
    applicationId?: string
  }) => {
    const formData = new FormData()
    formData.append('document_type', payload.documentType)
    formData.append('title', payload.title)
    formData.append('file', payload.file)
    if (payload.notes) formData.append('notes', payload.notes)
    if (payload.applicationId) formData.append('application_id', payload.applicationId)
    const { data } = await apiClient.post<DocumentResponse>('/student/documents/upload', formData)
    return mapDocument(data)
  },

  deleteDocument: async (id: string) => {
    await apiClient.delete(`/student/documents/${id}`)
  },

  listPayments: async () => {
    const { data } = await apiClient.get<PaymentResponse[]>('/student/payments')
    return data.map(mapPayment)
  },

  listAppointments: async () => {
    const { data } = await apiClient.get<AppointmentResponse[]>('/student/appointments')
    return data.map(mapAppointment)
  },

  createAppointment: async (payload: AppointmentCreatePayload) => {
    const { data } = await apiClient.post<AppointmentResponse>('/student/appointments', {
      topic: payload.topic,
      preferred_date: payload.preferredDate,
      preferred_time: payload.preferredTime,
      meeting_mode: payload.meetingMode,
      notes: payload.notes,
    })
    return mapAppointment(data)
  },

  cancelAppointment: async (id: string) => {
    const { data } = await apiClient.post<AppointmentResponse>(`/student/appointments/${id}/cancel`)
    return mapAppointment(data)
  },

  listMessages: async () => {
    const { data } = await apiClient.get<MessageResponse[]>('/student/messages')
    return data.map(mapMessage)
  },

  createMessage: async (payload: MessageCreatePayload) => {
    const { data } = await apiClient.post<MessageResponse>('/student/messages', payload)
    return mapMessage(data)
  },

  markMessageRead: async (id: string) => {
    const { data } = await apiClient.post<MessageResponse>(`/student/messages/${id}/read`)
    return mapMessage(data)
  },
}
