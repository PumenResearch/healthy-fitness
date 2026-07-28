import { supabase } from './supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

async function getAuthHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch {
    // No session available
  }
  return headers
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders()
  const url = `${FUNCTIONS_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  })

  if (!res.ok) {
    const text = await res.text()
    let message = `Request failed (${res.status})`
    try {
      const parsed = JSON.parse(text)
      if (parsed.error) message = parsed.error
    } catch {
      if (text) message = text
    }
    throw new Error(message)
  }

  return await res.json() as T
}

// --- Categories ---

export interface Category {
  id: string
  label: string
  color: string
  type: 'workout' | 'category'
}

export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>('/categories')
}

// --- Posts ---

export interface CreatePostPayload {
  title: string
  category_id: string
  body?: string
  distance?: number | null
  duration?: number | null
  calories?: number | null
  pace?: number | null
  images?: string[]
}

export interface ApiPost {
  id: string
  author_id: string
  title: string
  body: string
  category_id: string
  distance: number | null
  duration: number | null
  calories: number | null
  pace: number | null
  streak_snapshot: number
  score_snapshot: number | null
  created_at: string
  author: {
    id: string
    name: string
    avatar_text: string
    avatar_color: string
    streak: number
    score: number
  }
  category: {
    id: string
    label: string
    color: string
    type: 'workout' | 'category'
  }
  images?: { id: string; url: string; position: number }[]
  reactions: Record<string, number>
  topReaction: string | null
  commentCount: number
}

export async function createPost(payload: CreatePostPayload): Promise<ApiPost> {
  return request<ApiPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export type PostFilter = 'all' | 'workout' | 'category'

export interface FetchPostsResponse {
  posts: ApiPost[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export async function fetchPosts(params: {
  page?: number
  limit?: number
  filter?: PostFilter
} = {}): Promise<FetchPostsResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.filter && params.filter !== 'all') searchParams.set('filter', params.filter)

  const qs = searchParams.toString()
  return request(`/posts${qs ? `?${qs}` : ''}`)
}
