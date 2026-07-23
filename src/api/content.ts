import { apiClient } from '@/api/client'

export type ContentType = 'country' | 'university' | 'package' | 'blog' | 'testimonial'

export interface ContentItem {
  id: string
  contentType: ContentType
  slug: string
  title: string
  summary?: string
  body?: string
  data: Record<string, unknown>
  isPublished: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ContentPayload {
  contentType: ContentType
  slug: string
  title: string
  summary?: string
  body?: string
  data?: Record<string, unknown>
  isPublished?: boolean
  sortOrder?: number
}

interface ContentResponse {
  id: string
  content_type: ContentType
  slug: string
  title: string
  summary?: string
  body?: string
  data: Record<string, unknown>
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

function mapContent(data: ContentResponse): ContentItem {
  return {
    id: data.id,
    contentType: data.content_type,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    body: data.body,
    data: data.data ?? {},
    isPublished: data.is_published,
    sortOrder: data.sort_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export const contentApi = {
  listPublished: async (contentType?: ContentType) => {
    const { data } = await apiClient.get<ContentResponse[]>('/content', {
      params: contentType ? { content_type: contentType } : undefined,
    })
    return data.map(mapContent)
  },

  adminList: async (contentType?: ContentType) => {
    const { data } = await apiClient.get<ContentResponse[]>('/admin/content', {
      params: contentType ? { content_type: contentType } : undefined,
    })
    return data.map(mapContent)
  },

  create: async (payload: ContentPayload) => {
    const { data } = await apiClient.post<ContentResponse>('/admin/content', {
      content_type: payload.contentType,
      slug: payload.slug,
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      data: payload.data ?? {},
      is_published: payload.isPublished ?? true,
      sort_order: payload.sortOrder ?? 0,
    })
    return mapContent(data)
  },

  update: async (
    id: string,
    payload: Partial<Omit<ContentPayload, 'contentType'>> & { isPublished?: boolean },
  ) => {
    const { data } = await apiClient.patch<ContentResponse>(`/admin/content/${id}`, {
      slug: payload.slug,
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      data: payload.data,
      is_published: payload.isPublished,
      sort_order: payload.sortOrder,
    })
    return mapContent(data)
  },

  remove: async (id: string) => {
    await apiClient.delete(`/admin/content/${id}`)
  },
}
