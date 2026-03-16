// ============================================================
// 버스고 - Push Notification Utility
// ============================================================

/** 알림 유형 열거형 */
export enum NotificationType {
  QUOTE_RECEIVED = 'QUOTE_RECEIVED',
  QUOTE_ACCEPTED = 'QUOTE_ACCEPTED',
  PAYMENT_COMPLETE = 'PAYMENT_COMPLETE',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  TRIP_REMINDER = 'TRIP_REMINDER',
  SHUTTLE_DEPARTURE = 'SHUTTLE_DEPARTURE',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
  COUPON_ISSUED = 'COUPON_ISSUED',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
}

/** 알림 데이터 인터페이스 */
export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  createdAt: string;
  read: boolean;
}

/** 알림 유형별 포맷 정보 */
interface NotificationFormat {
  title: string;
  body: string;
  icon: string;
  url: string;
}

/** 알림 유형별 한국어 제목 및 본문 포맷 */
const NOTIFICATION_FORMATS: Record<NotificationType, NotificationFormat> = {
  [NotificationType.QUOTE_RECEIVED]: {
    title: '새 견적이 도착했습니다',
    body: '요청하신 노선에 대한 견적이 도착했습니다. 지금 확인해보세요.',
    icon: '/favicon.ico',
    url: '/customer/quotes',
  },
  [NotificationType.QUOTE_ACCEPTED]: {
    title: '견적이 수락되었습니다',
    body: '제출하신 견적이 고객님에게 선택되었습니다.',
    icon: '/favicon.ico',
    url: '/driver/quotes',
  },
  [NotificationType.PAYMENT_COMPLETE]: {
    title: '결제가 완료되었습니다',
    body: '예약 결제가 정상적으로 처리되었습니다.',
    icon: '/favicon.ico',
    url: '/customer/reservations',
  },
  [NotificationType.DRIVER_ASSIGNED]: {
    title: '기사님이 배정되었습니다',
    body: '예약하신 운행에 기사님이 배정되었습니다. 상세 정보를 확인하세요.',
    icon: '/favicon.ico',
    url: '/customer/reservations',
  },
  [NotificationType.TRIP_REMINDER]: {
    title: '운행 일정 알림',
    body: '예약하신 운행이 곧 시작됩니다. 출발 준비를 해주세요.',
    icon: '/favicon.ico',
    url: '/customer/reservations',
  },
  [NotificationType.SHUTTLE_DEPARTURE]: {
    title: '셔틀 출발 알림',
    body: '탑승하실 셔틀이 곧 출발합니다.',
    icon: '/favicon.ico',
    url: '/customer/reservations',
  },
  [NotificationType.REVIEW_REQUEST]: {
    title: '리뷰를 남겨주세요',
    body: '이용하신 운행은 만족스러우셨나요? 리뷰를 남겨주시면 다른 고객에게 도움이 됩니다.',
    icon: '/favicon.ico',
    url: '/customer/reviews',
  },
  [NotificationType.COUPON_ISSUED]: {
    title: '쿠폰이 발급되었습니다',
    body: '새로운 할인 쿠폰이 발급되었습니다. 다음 예약에 사용해보세요.',
    icon: '/favicon.ico',
    url: '/customer/coupons',
  },
  [NotificationType.CHAT_MESSAGE]: {
    title: '새 메시지가 도착했습니다',
    body: '새로운 채팅 메시지가 있습니다.',
    icon: '/favicon.ico',
    url: '/customer/chat',
  },
};

/**
 * 알림 권한을 요청합니다.
 * @returns 권한 상태 ('granted' | 'denied' | 'default')
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('이 브라우저는 알림을 지원하지 않습니다.');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Service Worker를 등록합니다.
 * @returns ServiceWorkerRegistration 또는 null
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('이 브라우저는 Service Worker를 지원하지 않습니다.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Service Worker 메시지 수신 처리
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') {
        window.location.href = event.data.url;
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker 등록 실패:', error);
    return null;
  }
}

/**
 * 푸시 알림을 구독합니다.
 * @returns PushSubscription 또는 null
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  const registration = await registerServiceWorker();
  if (!registration) return null;

  const permission = await requestPermission();
  if (permission !== 'granted') return null;

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
  if (!vapidPublicKey) {
    console.warn('VAPID 공개키가 설정되지 않았습니다.');
    return null;
  }

  try {
    // VAPID key를 Uint8Array로 변환
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
    });

    return subscription;
  } catch (error) {
    console.error('푸시 구독 실패:', error);
    return null;
  }
}

/**
 * 즉시 브라우저 알림을 표시합니다 (Service Worker 경유).
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  options?: { url?: string; tag?: string }
): Promise<void> {
  const permission = await requestPermission();
  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker?.ready;
  if (registration) {
    await registration.showNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: options?.tag || 'busgo-local',
      data: { url: options?.url || '/' },
    });
  }
}

/**
 * 알림 유형에 따라 포맷된 알림 데이터를 반환합니다.
 * @param type 알림 유형
 * @param overrides 덮어쓸 필드
 */
export function formatNotification(
  type: NotificationType,
  overrides?: Partial<Pick<NotificationFormat, 'title' | 'body' | 'url'>>
): NotificationFormat {
  const format = NOTIFICATION_FORMATS[type];
  return {
    ...format,
    ...overrides,
  };
}

/**
 * 알림 권한 상태를 확인합니다.
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Base64 URL 문자열을 Uint8Array로 변환합니다 (VAPID key 변환용).
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
