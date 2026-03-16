'use client';

import { useState } from 'react';
import {
  FileText,
  CalendarCheck,
  Clock,
  Wallet,
  Star,
  CheckCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type NotificationType = '새 견적 요청' | '예약 확정' | '운행 리마인드' | '정산 완료' | '리뷰 등록';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const typeIcon: Record<NotificationType, typeof FileText> = {
  '새 견적 요청': FileText,
  '예약 확정': CalendarCheck,
  '운행 리마인드': Clock,
  '정산 완료': Wallet,
  '리뷰 등록': Star,
};

const typeColor: Record<NotificationType, string> = {
  '새 견적 요청': 'bg-blue-100 text-[#1B6FF4]',
  '예약 확정': 'bg-green-100 text-[#10B981]',
  '운행 리마인드': 'bg-orange-100 text-[#FF6B35]',
  '정산 완료': 'bg-purple-100 text-purple-600',
  '리뷰 등록': 'bg-yellow-100 text-yellow-600',
};

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: '새 견적 요청',
    title: '새 견적 요청이 도착했습니다',
    body: '서울 → 강원 속초 / 3월 20일 / 45인승',
    time: '5분 전',
    read: false,
  },
  {
    id: 'n2',
    type: '예약 확정',
    title: '예약이 확정되었습니다',
    body: 'RES-2026-0301 김민수 고객님 예약이 확정되었습니다.',
    time: '30분 전',
    read: false,
  },
  {
    id: 'n3',
    type: '운행 리마인드',
    title: '내일 운행 예정입니다',
    body: '3월 18일 09:30 서울 마포 → 경기 가평 운행이 예정되어 있습니다.',
    time: '1시간 전',
    read: false,
  },
  {
    id: 'n4',
    type: '정산 완료',
    title: '3월 1주차 정산이 완료되었습니다',
    body: '정산 금액: 1,520,000원이 등록 계좌로 입금되었습니다.',
    time: '2시간 전',
    read: true,
  },
  {
    id: 'n5',
    type: '리뷰 등록',
    title: '새 리뷰가 등록되었습니다',
    body: '김민수 고객님이 ★★★★★ 5점 리뷰를 남겨주셨습니다.',
    time: '3시간 전',
    read: true,
  },
  {
    id: 'n6',
    type: '새 견적 요청',
    title: '새 견적 요청이 도착했습니다',
    body: '인천공항 → 서울 명동 / 3월 22일 / 25인승',
    time: '5시간 전',
    read: true,
  },
  {
    id: 'n7',
    type: '운행 리마인드',
    title: '운행 1시간 전입니다',
    body: '서울 잠실 → 전남 여수 운행이 1시간 후 시작됩니다. 차량 점검을 완료해주세요.',
    time: '어제',
    read: true,
  },
  {
    id: 'n8',
    type: '예약 확정',
    title: '예약이 확정되었습니다',
    body: 'RES-2026-0305 정다은 고객님 예약이 확정되었습니다.',
    time: '어제',
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm font-bold text-white bg-[#FF6B35] rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" />
            모두 읽음
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = typeIcon[notif.type];
          return (
            <Card
              key={notif.id}
              hover
              className={`cursor-pointer transition-colors ${!notif.read ? 'border-l-4 border-l-[#1B6FF4] bg-blue-50/30' : ''}`}
              onClick={() => toggleRead(notif.id)}
            >
              <div className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColor[notif.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm truncate ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{notif.body}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1B6FF4] shrink-0 mt-1.5" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
