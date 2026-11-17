export type ApplicationStatus =
  | 'draft'
  | 'registration_received'
  | 'initial_assessment'
  | 'documents_pending'
  | 'documents_under_review'
  | 'university_selection'
  | 'application_preparation'
  | 'submitted'
  | 'under_review'
  | 'offer_received'
  | 'further_action_required'
  | 'campus_france'
  | 'visa_stage'
  | 'pre_departure'
  | 'completed'
  | 'on_hold'
  | 'rejected'
  | 'withdrawn'

export type DocumentType =
  | 'passport'
  | 'transcript'
  | 'degree'
  | 'cv'
  | 'sop'
  | 'recommendation'
  | 'english_test'
  | 'moi'
  | 'experience_letter'
  | 'bank_statement'
  | 'other'

export type DocumentStatus = 'pending' | 'uploaded' | 'under_review' | 'approved' | 'rejected'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled'

export type MessageStatus = 'unread' | 'read'

export interface StudentApplication {
  id: string
  studentId: string
  universityName: string
  country: string
  programName: string
  degreeLevel: string
  intake: string
  status: ApplicationStatus
  notes?: string
  studentNote?: string
  nextAction?: string
  nextActionDue?: string
  missingDocuments?: string
  stageCompletedAt?: string
  createdAt: string
  updatedAt: string
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

export interface StudentVisibleFollowUp {
  id: string
  followUpDate: string
  method: string
  studentMessage?: string
  nextAction?: string
  nextFollowUpDate?: string
  relatedStatus?: string
  createdAt: string
}

export interface ApplicationTracking {
  application: StudentApplication
  history: ApplicationHistoryItem[]
  visibleFollowUps: StudentVisibleFollowUp[]
}

export interface StudentDocument {
  id: string
  studentId: string
  applicationId?: string
  documentType: DocumentType
  title: string
  fileUrl?: string
  status: DocumentStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface StudentPayment {
  id: string
  studentId: string
  applicationId?: string
  title: string
  amount: number
  currency: string
  status: PaymentStatus
  dueDate?: string
  paidAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface StudentAppointment {
  id: string
  studentId: string
  topic: string
  preferredDate: string
  preferredTime: string
  meetingMode: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface StudentMessage {
  id: string
  studentId: string
  senderId: string
  subject: string
  body: string
  status: MessageStatus
  isFromStudent: boolean
  createdAt: string
}

export interface DashboardStats {
  applicationsTotal: number
  applicationsActive: number
  documentsTotal: number
  documentsPending: number
  paymentsPending: number
  appointmentsUpcoming: number
  messagesUnread: number
}

export interface ApplicationCreatePayload {
  universityName: string
  country: string
  programName: string
  degreeLevel: string
  intake: string
  notes?: string
}

export interface DocumentCreatePayload {
  documentType: DocumentType
  title: string
  fileUrl?: string
  applicationId?: string
  notes?: string
}

export interface AppointmentCreatePayload {
  topic: string
  preferredDate: string
  preferredTime: string
  meetingMode: string
  notes?: string
}

export interface MessageCreatePayload {
  subject: string
  body: string
}

export interface ProfileUpdatePayload {
  firstName?: string
  lastName?: string
  phone?: string
}
