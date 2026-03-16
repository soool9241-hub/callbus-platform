'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TabList, Tab } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationCard, type NotificationItem } from '@/components/notification/NotificationCard';
import { NotificationPermissionBanner } from '@/components/notification/NotificationPermissionBanner';
import { NotificationType } from '@/lib/notifications';

type TabValue = 'all' | 'quote_request' | 'dispatch' | 'settlement' | 'review';

const TAB_FILTERS: Record<TabValue, NotificationType[] | null> = {
  all: null,
  quote_request: [NotificationType.QUOTE_RECEIVED, NotificationType.QUOTE_ACCEPTED],
  dispatch: [
    NotificationType.DRIVER_ASSIGNED,
    NotificationType.TRIP_REMINDER,
    NotificationType.SHUTTLE_DEPARTURE,
  ],
  settlement: [NotificationType.PAYMENT_COMPLETE, NotificationType.COUPON_ISSUED],
  review: [NotificationType.REVIEW_REQUEST],
};

const MOCK_DRIVER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'dn-001',
    type: NotificationType.QUOTE_RECEIVED,
    title: '새 견적 요청이 도착했습니다',
    body: '서울 → 강원 속초 / 3월 20일 / 45인승 대형버스',
    time: '5분 전',
    read: false,
    url: '/driver/quotes',
  },
  {
    id: 'dn-002',
    type: NotificationType.QUOTE_ACCEPTED,
    title: '견적이 선택되었습니다',
    body: '김민수 고객님이 제출하신 견적을 선택하셨습니다.',
    time: '15분 전',
    read: false,
    url: '/driver/quotes',
  },
  {
    id: 'dn-003',
    type: NotificationType.DRIVER_ASSIGNED,
    title: '새 배차가 등록되었습니다',
    body: 'RES-2026-0301 예약에 배차되셨습니다. 상세 내용을 확인하세요.',
    time: '30분 전',
    read: false,
    url: '/driver/dispatch',
  },
  {
    id: 'dn-004',
    type: NotificationType.TRIP_REMINDER,
    title: '내일 운행 예정입니다',
    body: '3월 18일 09:30 서울 마포 → 경기 가평 운행이 예정되어 있습니다. 차량 점검을 완료해주세요.',
    time: '1시간 전',
    read: false,
    url: '/driver/dispatch',
  },
  {
    id: 'dn-005',
    type: NotificationType.REVIEW_REQUEST,
    title: '새 리뷰가 등록되었습니다',
    body: '김민수 고객님이 ★★★★★ 5점 리뷰를 남겨주셨습니다.',
    time: '2시간 전',
    read: false,
    url: '/driver/reviews',
  },
  {
    id: 'dn-006',
    type: NotificationType.PAYMENT_COMPLETE,
    title: '3월 1주차 정산이 완료되었습니다',
    body: '정산 금액: 1,520,000원이 등록 계좌로 입금되었습니다.',
    time: '3시간 전',
    read: true,
    url: '/driver/settlement',
  },
  {
    id: 'dn-007',
    type: NotificationType.QUOTE_RECEIVED,
    title: '새 견적 요청이 도착했습니다',
    body: '인천공항 → 서울 명동 / 3월 22일 / 25인승 중형버스',
    time: '5시간 전',
    read: true,
    url: '/driver/quotes',
  },
  {
    id: 'dn-008',
    type: NotificationType.SHUTTLE_DEPARTURE,
    title: '운행 1시간 전입니다',
    body: '서울 잠실 → 전남 여수 운행이 1시간 후 시작됩니다. 출발 준비를 해주세요.',
    time: '어제',
    read: true,
    url: '/driver/dispatch',
  },
  {
    id: 'dn-009',
    type: NotificationType.QUOTE_ACCEPTED,
    title: '견적이 선택되었습니다',
    body: '정다은 고객님이 제출하신 견적을 선택하셨습니다.',
    time: '어제',
    read: true,
    url: '/driver/quotes',
  },
  {
    id: 'dn-010',
    type: NotificationType.REVIEW_REQUEST,
    title: '새 리뷰가 등록되었습니다',
    body: '이준호 고객님이 ★★★★☆ 4점 리뷰를 남겨주셨습니다.',
    time: '2일 전',
    read: true,
    url: '/driver/reviews',
  },
  {
    id: 'dn-011',
    type: NotificationType.PAYMENT_COMPLETE,
    title: '2월 4주차 정산이 완료되었습니다',
    body: '정산 금액: 2,340,000원이 등록 계좌로 입금되었습니다.',
    time: '3일 전',
    read: true,
    url: '/driver/settlement',
  },
  {
    id: 'dn-012',
    type: NotificationType.DRIVER_ASSIGNED,
    title: '새 배차가 등록되었습니다',
    body: 'RES-2026-0298 예약에 배차되셨습니다.',
    time: '4일 전',
    read: true,
    url: '/driver/dispatch',
  },
];

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    MOCK_DRIVER_NOTIFICATIONS
  );
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
    <div className="px-4 sm:px-6">
      {/* 알림 권한 배너 */}
      <NotificationPermissionBanner />

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
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
          <Tab value="quote_request">견적요청</Tab>
          <Tab value="dispatch">배차</Tab>
          <Tab value="settlement">정산</Tab>
          <Tab value="review">리뷰</Tab>
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
