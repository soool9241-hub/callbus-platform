'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser, setCurrentRole, setAuthLoading } = useStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setAuthLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setCurrentUser(null)
        setCurrentRole('customer')
        setAuthLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        setCurrentUser(profile)
        setCurrentRole(profile.role as 'customer' | 'driver' | 'admin')
      }
    } catch (e) {
      console.error('Failed to load profile:', e)
    } finally {
      setAuthLoading(false)
    }
  }

  return <>{children}</>
}
