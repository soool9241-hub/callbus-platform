'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { requestPermission, registerServiceWorker } from '@/lib/notifications';

const DISMISS_KEY = 'busgo_notification_banner_dismissed';

export function NotificationPermissionBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 브라우저 환경 확인
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // 이미 허용된 경우 표시하지 않음
    if (Notification.permission === 'granted') return;

    // 이미 거부된 경우 표시하지 않음
    if (Notification.permission === 'denied') return;

    // 이전에 닫은 경우 확인
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    setVisible(true);
  }, []);

  const handleAllow = async () => {
    setLoading(true);
    try {
      await registerServiceWorker();
      const permission = await requestPermission();
      if (permission === 'granted') {
        setVisible(false);
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#1B6FF4] to-[#0B4FCC] text-white rounded-xl p-4 mb-4">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold mb-1">알림을 켜보세요</p>
          <p className="text-xs text-blue-100 leading-relaxed">
            알림을 켜면 견적 응답, 예약 확인 등을 실시간으로 받을 수 있습니다
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              loading={loading}
              onClick={handleAllow}
              className="bg-white text-[#1B6FF4] hover:bg-blue-50 active:bg-blue-100 text-xs font-bold"
            >
              알림 허용
            </Button>
            <button
              onClick={handleDismiss}
              className="text-xs text-blue-200 hover:text-white transition-colors px-2 py-1"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
