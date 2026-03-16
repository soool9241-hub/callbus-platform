'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  CreditCard,
  Bus,
  Clock,
  MapPin,
  Star,
  Tag,
  MessageCircle,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { NotificationType } from '@/lib/notifications';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  url?: string;
}

/** 알림 유형별 아이콘 및 색상 매핑 */
const NOTIFICATION_ICON_MAP: Record<
  NotificationType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  [NotificationType.QUOTE_RECEIVED]: {
    icon: FileText,
    color: 'text-[#1B6FF4]',
    bg: 'bg-blue-100',
  },
  [NotificationType.QUOTE_ACCEPTED]: {
    icon: CheckCircle2,
    color: 'text-[#10B981]',
    bg: 'bg-green-100',
  },
  [NotificationType.PAYMENT_COMPLETE]: {
    icon: CreditCard,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  [NotificationType.DRIVER_ASSIGNED]: {
    icon: Bus,
    color: 'text-[#FF6B35]',
    bg: 'bg-orange-100',
  },
  [NotificationType.TRIP_REMINDER]: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  [NotificationType.SHUTTLE_DEPARTURE]: {
    icon: MapPin,
    color: 'text-teal-600',
    bg: 'bg-teal-100',
  },
  [NotificationType.REVIEW_REQUEST]: {
    icon: Star,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
  },
  [NotificationType.COUPON_ISSUED]: {
    icon: Tag,
    color: 'text-pink-600',
    bg: 'bg-pink-100',
  },
  [NotificationType.CHAT_MESSAGE]: {
    icon: MessageCircle,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
};

interface NotificationCardProps {
  notification: NotificationItem;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: NotificationItem) => void;
}

export function NotificationCard({
  notification,
  onRead,
  onDelete,
  onClick,
}: NotificationCardProps) {
  const config = NOTIFICATION_ICON_MAP[notification.type];
  const Icon = config.icon;

  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    // Only allow left swipe
    if (diff < 0) {
      setTranslateX(Math.max(diff, -80));
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (translateX < -50) {
      setTranslateX(-80);
    } else {
      setTranslateX(0);
    }
  };

  const handleClick = () => {
    if (Math.abs(translateX) > 10) return;
    if (!notification.read && onRead) {
      onRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete button (revealed on swipe) */}
      <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-red-500 text-white rounded-r-xl">
        <button
          onClick={() => onDelete?.(notification.id)}
          className="flex flex-col items-center gap-1 p-2"
          aria-label="삭제"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-xs">삭제</span>
        </button>
      </div>

      {/* Main card content */}
      <div
        className={`
          relative bg-white border border-gray-200 rounded-xl shadow-sm
          cursor-pointer transition-all duration-200
          ${!notification.read ? 'border-l-4 border-l-[#1B6FF4] bg-blue-50/30' : ''}
        `}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm ${
                  !notification.read
                    ? 'font-bold text-gray-900'
                    : 'font-medium text-gray-700'
                }`}
              >
                {notification.title}
              </p>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {notification.time}
              </span>
            </div>
            <p
              className={`text-sm mt-0.5 line-clamp-2 ${
                !notification.read ? 'text-gray-700' : 'text-gray-500'
              }`}
            >
              {notification.body}
            </p>
          </div>
          {!notification.read && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#1B6FF4] flex-shrink-0 mt-1.5" />
          )}
          {/* Desktop delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(notification.id);
            }}
            className="hidden sm:flex flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { NOTIFICATION_ICON_MAP };
