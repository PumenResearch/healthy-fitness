import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  name: string
  avatar_text: string
  avatar_color: string
  streak: number
  longest_streak: number
  last_activity_date: string | null
  score: number
  created_at: string
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  isNewUser: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile_stats')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

async function fetchProfileWithRetry(userId: string, maxRetries = 5): Promise<Profile | null> {
  for (let i = 0; i < maxRetries; i++) {
    const profile = await fetchProfile(userId)
    if (profile) return profile
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  return null
}

const mockDevProfile: Profile = {
  id: 'dev-local-user',
  name: 'Nguyễn Thành',
  avatar_text: 'NT',
  avatar_color: 'linear-gradient(135deg, #e53e3e, #ff6b35)',
  streak: 12,
  longest_streak: 21,
  last_activity_date: new Date().toISOString().slice(0, 10),
  score: 1250,
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileWithRetry(session.user.id).then(p => {
          setProfile(p || (import.meta.env.DEV ? mockDevProfile : null))
          if (p) {
            const createdAt = new Date(p.created_at).getTime()
            setIsNewUser(Date.now() - createdAt < 10000)
          }
          setLoading(false)
        })
      } else {
        if (import.meta.env.DEV) {
          setProfile(mockDevProfile)
        }
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          const p = await fetchProfileWithRetry(session.user.id)
          setProfile(p || (import.meta.env.DEV ? mockDevProfile : null))
          if (p) {
            const createdAt = new Date(p.created_at).getTime()
            setIsNewUser(Date.now() - createdAt < 10000)
          }
        } else {
          setProfile(import.meta.env.DEV ? mockDevProfile : null)
          setIsNewUser(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    const nextProfile = await fetchProfile(user.id)
    setProfile(nextProfile || (import.meta.env.DEV ? mockDevProfile : null))
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
    setIsNewUser(false)
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, isNewUser, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
