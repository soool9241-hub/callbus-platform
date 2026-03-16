'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { NotificationType } from '@/lib/notifications';
import {
  NOTIFICATION_ICON_MAP,
  type NotificationItem,
} from './NotificationCard';

/** 최근 알림 목 데이터 */
const MOCK_RECENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'bell-1',
    type: NotificationType.QUOTE_RECEIVED,
    title: '새 견적이 도착했습니다',
    body: '서울→속초 노선에 대한 견적 3건이 도착했습니다.',
    time: '5분 전',
    read: false,
    url: '/customer/quotes',
  },
  {
    id: 'bell-2',
    type: NotificationType.DRIVER_ASSIGNED,
    title: '기사님이 배정되었습니다',
    body: '박정훈 기사님이 배정되었습니다.',
    time: '30분 전',
    read: false,
    url: '/customer/reservations',
  },
  {
    id: 'bell-3',
    type: NotificationType.PAYMENT_COMPLETE,
    title: '결제가 완료되었습니다',
    body: '예약금 450,000원 결제가 완료되었습니다.',
    time: '1시간 전',
    read: false,
    url: '/customer/reservations',
  },
  {
    id: 'bell-4',
    type: NotificationType.TRIP_REMINDER,
    title: '내일 운행 예정입니다',
    body: '3월 18일 09:30 서울 마포 출발 운행이 있습니다.',
    time: '2시간 전',
    read: true,
    url: '/customer/reservations',
  },
  {
    id: 'bell-5',
    type: NotificationType.COUPON_ISSUED,
    title: '봄맞이 15% 할인 쿠폰',
    body: '가평/속초 노선 전 패키지 15% 할인 쿠폰이 발급되었습니다.',
    time: '5시간 전',
    read: true,
    url: '/customer/coupons',
  },
];

interface NotificationBellProps {
  /** 알림 목록 페이지 경로 (고객/기사 구분) */
  notificationsHref?: string;
}

export function NotificationBell({
  notificationsHref = '/customer/notifications',
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    MOCK_RECENT_NOTIFICATIONS
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label={`알림 ${unreadCount > 0 ? `${unreadCount}개 읽지 않음` : ''}`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">알림</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-[#1B6FF4] hover:text-[#0B4FCC] font-medium transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                모두 읽음
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">알림이 없습니다</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => {
                const config = NOTIFICATION_ICON_MAP[notification.type];
                const Icon = config.icon;

                return (
                  <div
                    key={notification.id}
                    className={`
                      flex items-start gap-3 px-4 py-3 cursor-pointer
                      hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0
                      ${!notification.read ? 'bg-blue-50/40' : ''}
                    `}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notification.id ? { ...n, read: true } : n
                        )
                      );
                      setIsOpen(false);
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          !notification.read
                            ? 'font-bold text-gray-900'
                            : 'font-medium text-gray-600'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {notification.body}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-[#1B6FF4] flex-shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <Link
              href={notificationsHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1 px-4 py-3 border-t border-gray-100 text-sm font-medium text-[#1B6FF4] hover:bg-blue-50 transition-colors"
            >
              전체 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
