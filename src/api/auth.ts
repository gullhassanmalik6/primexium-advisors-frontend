import { apiClient, tokenStorage } from '@/api/client'
import type { AuthTokens, LoginCredentials, RegisterData, User } from '@/types'

interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  role: User['role']
  is_active: boolean
  avatar_url?: string
  created_at: string
}

function mapUser(data: UserResponse): User {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    isActive: data.is_active,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
  }
}

function mapTokens(data: TokenResponse): AuthTokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
  }
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post<TokenResponse>('/auth/login', credentials)
    const tokens = mapTokens(data)
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken)
    return tokens
  },

  register: async (payload: RegisterData) => {
    const { data } = await apiClient.post<UserResponse>('/auth/register', {
      email: payload.email,
      password: payload.password,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
    })
    return mapUser(data)
  },

  getMe: async () => {
    const { data } = await apiClient.get<UserResponse>('/auth/me')
    return mapUser(data)
  },

  logout: () => {
    tokenStorage.clearTokens()
  },
}
