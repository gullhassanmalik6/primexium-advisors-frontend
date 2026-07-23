export type UserRole =
  | 'admin'
  | 'counsellor'
  | 'documentation_officer'
  | 'finance'
  | 'marketing'
  | 'student'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  avatarUrl?: string
  phone?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface ApiError {
  detail: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface Country {
  id: string
  name: string
  code: string
  flagUrl?: string
  description?: string
}

export interface University {
  id: string
  name: string
  country: string
  ranking?: number
  logoUrl?: string
}

export interface Package {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  isPopular?: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  publishedAt: string
  author: string
}

export interface Testimonial {
  id: string
  name: string
  university: string
  country: string
  content: string
  rating: number
  avatarUrl?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}
