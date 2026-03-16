'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { setCurrentUser, setCurrentRole } = useStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setCurrentUser(null)
        setCurrentRole('customer')
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profile) {
      setCurrentUser({
        id: profile.id,
        role: profile.role,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        profile_image: profile.profile_image,
        is_active: profile.is_active,
        created_at: profile.created_at,
      })
      setCurrentRole(profile.role as 'customer' | 'driver' | 'admin')
    }
    setLoading(false)
  }

  return { user, loading, isLoggedIn: !!user }
}
