'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  currentUser: any | null
  setCurrentUser: (user: any | null) => void
  currentRole: 'customer' | 'driver' | 'admin' | 'pension_owner'
  setCurrentRole: (role: 'customer' | 'driver' | 'admin' | 'pension_owner') => void
  notifications: any[]
  unreadCount: number
  setNotifications: (notifications: any[]) => void
  addNotification: (notification: any) => void
  markNotificationRead: (id: string) => void
  isAuthLoading: boolean
  setAuthLoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      currentRole: 'customer',
      setCurrentRole: (role) => set({ currentRole: role }),
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) => set({ notifications, unreadCount: notifications.filter((n: any) => !n.is_read).length }),
      addNotification: (notification) => {
        const notifications = [notification, ...get().notifications]
        set({ notifications, unreadCount: notifications.filter((n: any) => !n.is_read).length })
      },
      markNotificationRead: (id) => {
        const notifications = get().notifications.map((n: any) => n.id === id ? { ...n, is_read: true } : n)
        set({ notifications, unreadCount: notifications.filter((n: any) => !n.is_read).length })
      },
      isAuthLoading: true,
      setAuthLoading: (loading) => set({ isAuthLoading: loading }),
    }),
    {
      name: 'callbus-store',
      partialize: (state) => ({ currentRole: state.currentRole }),
    }
  )
)
