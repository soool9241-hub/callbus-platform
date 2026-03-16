'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TabList, Tab } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationCard, type NotificationItem } from '@/components/notification/NotificationCard';
import { NotificationPermissionBanner } from '@/components/notification/NotificationPermissionBanner';
import { NotificationType } from '@/lib/notifications';

type TabValue = 'all' | 'quote' | 'reservation' | 'payment' | 'chat';

const TAB_FILTERS: Record<TabValue, NotificationType[] | null> = {
  all: null,
  quote: [NotificationType.QUOTE_RECEIVED, NotificationType.QUOTE_ACCEPTED],
  reservation: [
    NotificationType.DRIVER_ASSIGNED,
    NotificationType.TRIP_REMINDER,
    NotificationType.SHUTTLE_DEPARTURE,
  ],
  payment: [NotificationType.PAYMENT_COMPLETE, NotificationType.COUPON_ISSUED],
  chat: [NotificationType.CHAT_MESSAGE],
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'cn-001',
    type: NotificationType.QUOTE_RECEIVED,
    title: '새 견적이 도착했습니다',
    body: '서울→속초 노선에 대한 견적 3건이 도착했습니다. 확인해보세요!',
    time: '5분 전',
    read: false,
    url: '/customer/quotes',
  },
  {
    id: 'cn-002',
    type: NotificationType.DRIVER_ASSIGNED,
    title: '기사님이 배정되었습니다',
    body: 'RSV-2026-0001 예약에 박정훈 기사님이 배정되었습니다.',
    time: '15분 전',
    read: false,
    url: '/customer/reservations',
  },
  {
    id: 'cn-003',
    type: NotificationType.CHAT_MESSAGE,
    title: '새 메시지가 도착했습니다',
    body: '박정훈 기사님: 안녕하세요, 출발 장소 확인 부탁드립니다.',
    time: '30분 전',
    read: false,
    url: '/customer/chat',
  },
  {
    id: 'cn-004',
    type: NotificationType.PAYMENT_COMPLETE,
    title: '결제가 완료되었습니다',
    body: '예약금 450,000원이 정상 결제 처리되었습니다.',
    time: '1시간 전',
    read: false,
    url: '/customer/reservations',
  },
  {
    id: 'cn-005',
    type: NotificationType.TRIP_REMINDER,
    title: '내일 운행 예정입니다',
    body: '3월 18일 09:30 서울 마포 → 경기 가평 운행이 예정되어 있습니다.',
    time: '2시간 전',
    read: false,
    url: '/customer/reservations',
  },
  {
    id: 'cn-006',
    type: NotificationType.QUOTE_RECEIVED,
    title: '새 견적이 도착했습니다',
    body: '서울→경주 노선에 대한 견적 2건이 도착했습니다.',
    time: '3시간 전',
    read: true,
    url: '/customer/quotes',
  },
  {
    id: 'cn-007',
    type: NotificationType.COUPON_ISSUED,
    title: '봄맞이 15% 할인 쿠폰 발급',
    body: '가평/속초 노선 전 패키지 15% 할인 쿠폰이 발급되었습니다.',
    time: '5시간 전',
    read: true,
    url: '/customer/coupons',
  },
  {
    id: 'cn-008',
    type: NotificationType.SHUTTLE_DEPARTURE,
    title: '셔틀 출발 10분 전',
    body: '서울 잠실역 3번 출구 앞 셔틀이 10분 후 출발합니다.',
    time: '어제',
    read: true,
    url: '/customer/reservations',
  },
  {
    id: 'cn-009',
    type: NotificationType.REVIEW_REQUEST,
    title: '리뷰를 남겨주세요',
    body: '서울→가평 운행은 만족스러우셨나요? 리뷰를 남겨주세요.',
    time: '어제',
    read: true,
    url: '/customer/reviews',
  },
  {
    id: 'cn-010',
    type: NotificationType.PAYMENT_COMPLETE,
    title: '잔금 결제가 완료되었습니다',
    body: '잔금 614,000원이 정상 결제 처리되었습니다.',
    time: '2일 전',
    read: true,
    url: '/customer/reservations',
  },
  {
    id: 'cn-011',
    type: NotificationType.QUOTE_ACCEPTED,
    title: '견적이 수락되었습니다',
    body: '한진관광 견적을 선택하셨습니다. 예약을 진행해주세요.',
    time: '3일 전',
    read: true,
    url: '/customer/quotes',
  },
  {
    id: 'cn-012',
    type: NotificationType.CHAT_MESSAGE,
    title: '새 메시지가 도착했습니다',
    body: '한진관광: 견적 관련 문의 답변 드립니다.',
    time: '4일 전',
    read: true,
    url: '/customer/chat',
  },
];

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const filteredNotifications = notifications.filter((n) => {
    const filter = TAB_FILTERS[activeTab];
    if (!filter) return true;
    return filter.includes(n.type);
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="py-2 px-4 sm:px-6">
      {/* 알림 권한 배너 */}
      <NotificationPermissionBanner />

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
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
            모두 읽음 처리
          </Button>
        )}
      </div>

      {/* 탭 필터 */}
      <div className="mb-4 overflow-x-auto -mx-4 px-4">
        <TabList
          activeValue={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
          className="w-full"
        >
          <Tab value="all">전체</Tab>
          <Tab value="quote">견적</Tab>
          <Tab value="reservation">예약</Tab>
          <Tab value="payment">결제</Tab>
          <Tab value="chat">채팅</Tab>
        </TabList>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRead={markAsRead}
            onDelete={deleteNotification}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredNotifications.length === 0 && (
        <EmptyState
          icon={<Bell className="w-7 h-7" />}
          title="알림이 없습니다"
          description={
            activeTab === 'all'
              ? '새로운 알림이 도착하면 여기에 표시됩니다.'
              : '해당 카테고리의 알림이 없습니다.'
          }
        />
      )}
    </div>
  );
}
