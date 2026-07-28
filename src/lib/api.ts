import { supabase } from './supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const POST_IMAGES_BUCKET = 'post-images'
const MAX_POST_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_POST_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

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
  type: 'workout' | 'food' | 'rest'
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
  /** Đường dẫn object trong bucket private `post-images` (ảnh user upload) */
  image_paths?: string[]
  /** URL ảnh nguồn ngoài (vd ảnh mẫu Unsplash) */
  image_urls?: string[]
}

const IMAGE_EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/**
 * Upload ảnh vào bucket private `post-images` và trả về storage path bền vững.
 * Path luôn bắt đầu bằng user id để khớp Storage RLS.
 */
export async function uploadPostImage(file: File): Promise<string> {
  if (!ALLOWED_POST_IMAGE_TYPES.has(file.type)) {
    throw new Error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP')
  }
  if (file.size > MAX_POST_IMAGE_SIZE_BYTES) {
    throw new Error('Ảnh vượt quá dung lượng tối đa 10MB')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Bạn cần đăng nhập để tải ảnh lên')

  const extension = IMAGE_EXTENSION_BY_TYPE[file.type]
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) throw new Error(error.message)

  return path
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
    type: 'workout' | 'food' | 'rest'
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

export interface ApiLeaderboardProfile {
  id: string
  name: string
  avatar_text: string | null
  avatar_color: string | null
  streak: number
  longest_streak: number
  score: number
  rank: number
}

export async function fetchStreakLeaderboard(limit = 10): Promise<ApiLeaderboardProfile[]> {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 50)
  return request<ApiLeaderboardProfile[]>(`/profiles/leaderboard?type=streak&limit=${safeLimit}`)
}

export type PostFilter = 'all' | 'workout' | 'food'

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
