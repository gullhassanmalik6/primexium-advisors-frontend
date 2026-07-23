import { apiClient } from '@/api/client'

export interface ContactLeadPayload {
  full_name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ConsultationLeadPayload {
  full_name: string
  email: string
  phone: string
  preferred_country?: string
  preferred_degree?: string
  preferred_intake?: string
  message?: string
}

export interface EligibilityLeadPayload {
  full_name: string
  email: string
  phone: string
  preferred_country?: string
  preferred_degree?: string
  preferred_intake?: string
  eligibility_score: number
  eligibility_tier: string
  payload: Record<string, unknown>
}

export interface LeadCreateResponse {
  id: string
  message: string
}

export const leadsApi = {
  submitContact: async (data: ContactLeadPayload) => {
    const response = await apiClient.post<LeadCreateResponse>('/leads/contact', data)
    return response.data
  },
  submitConsultation: async (data: ConsultationLeadPayload) => {
    const response = await apiClient.post<LeadCreateResponse>('/leads/consultation', data)
    return response.data
  },
  submitEligibility: async (data: EligibilityLeadPayload) => {
    const response = await apiClient.post<LeadCreateResponse>('/leads/eligibility', data)
    return response.data
  },
}
