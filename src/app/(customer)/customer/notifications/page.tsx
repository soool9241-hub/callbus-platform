'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  CheckCircle2,
  Bus,
  CreditCard,
  Megaphone,
  Bell,
  Check,
} from 'lucide-react';

type NotificationType = 'quote' | 'confirmed' | 'in_progress' | 'settlement' | 'promo';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const iconMap: Record<NotificationType, { icon: typeof FileText; color: string; bg: string }> = {
  quote: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  confirmed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  in_progress: { icon: Bus, color: 'text-purple-600', bg: 'bg-purple-100' },
  settlement: { icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
  promo: { icon: Megaphone, color: 'text-pink-600', bg: 'bg-pink-100' },
};

const initialNotifications: Notification[] = [
  {
    id: 'noti-001',
    type: 'quote',
    title: '새 견적이 도착했습니다',
    body: '서울→속초 노선에 대한 견적 3건이 도착했습니다. 확인해보세요!',
    time: '10분 전',
    read: false,
  },
  {
    id: 'noti-002',
    type: 'confirmed',
    title: '예약이 확정되었습니다',
    body: 'RSV-2025-0001 예약이 확정되었습니다. 박정훈 기사님이 배정되었습니다.',
    time: '1시간 전',
    read: false,
  },
  {
    id: 'noti-003',
    type: 'in_progress',
    title: '운행이 시작되었습니다',
    body: '기사님이 출발지로 이동 중입니다. 실시간 위치를 확인하세요.',
    time: '3시간 전',
    read: false,
  },
  {
    id: 'noti-004',
    type: 'promo',
    title: '봄맞이 특별 할인 이벤트',
    body: '3월 한정! 가평/속초 노선 전 패키지 15% 할인 쿠폰을 받아보세요.',
    time: '5시간 전',
    read: true,
  },
  {
    id: 'noti-005',
    type: 'settlement',
    title: '정산이 완료되었습니다',
    body: '잔금 614,000원이 정상 결제 처리되었습니다.',
    time: '어제',
    read: true,
  },
  {
    id: 'noti-006',
    type: 'quote',
    title: '새 견적이 도착했습니다',
    body: '서울→경주 노선에 대한 견적 2건이 도착했습니다.',
    time: '어제',
    read: true,
  },
  {
    id: 'noti-007',
    type: 'confirmed',
    title: '예약이 확정되었습니다',
    body: 'RSV-2025-0002 예약이 확정되었습니다.',
    time: '3일 전',
    read: true,
  },
  {
    id: 'noti-008',
    type: 'promo',
    title: '첫 예약 10% 할인 쿠폰 지급',
    body: '콜버스를 처음 이용하시는 고객님께 10% 할인 쿠폰을 드립니다.',
    time: '1주일 전',
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="py-2 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <span className="w-6 h-6 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <Check className="w-4 h-4" />
            모두 읽음
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {notifications.map((noti) => {
          const config = iconMap[noti.type];
          const Icon = config.icon;
          return (
            <Card
              key={noti.id}
              hover
              padding="none"
              className={`cursor-pointer ${!noti.read ? 'border-l-4 border-l-[#1B6FF4]' : ''}`}
              onClick={() => toggleRead(noti.id)}
            >
              <div className="flex items-start gap-3 p-4">
                <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!noti.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {noti.title}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{noti.time}</span>
                  </div>
                  <p className={`text-sm mt-0.5 ${!noti.read ? 'text-gray-700' : 'text-gray-500'}`}>
                    {noti.body}
                  </p>
                </div>
                {!noti.read && (
                  <div className="w-2 h-2 rounded-full bg-[#1B6FF4] flex-shrink-0 mt-2" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>알림이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
