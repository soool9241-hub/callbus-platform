// ============================================================
// 콜버스 플랫폼 - Zustand 전역 상태 관리
// ============================================================

import { create } from 'zustand';
import type { User, Notification } from '@/types';

interface AppState {
  /** 현재 로그인한 사용자 */
  currentUser: User | null;
  /** 현재 사용자 설정 */
  setCurrentUser: (user: User | null) => void;

  /** 현재 역할 (고객/기사/관리자) */
  currentRole: 'customer' | 'driver' | 'admin';
  /** 역할 전환 */
  setCurrentRole: (role: 'customer' | 'driver' | 'admin') => void;

  /** 알림 목록 */
  notifications: Notification[];
  /** 알림 추가 */
  addNotification: (notification: Notification) => void;
  /** 알림 읽음 처리 */
  markNotificationRead: (notificationId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // 사용자
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // 역할
  currentRole: 'customer',
  setCurrentRole: (role) => set({ currentRole: role }),

  // 알림
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ),
    })),
}));
