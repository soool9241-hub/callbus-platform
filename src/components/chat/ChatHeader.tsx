'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MoreVertical,
  Calendar,
  AlertTriangle,
  LogOut,
} from 'lucide-react';

interface ChatHeaderProps {
  partnerName: string;
  partnerAvatar: string;
  isOnline?: boolean;
  reservationId?: string;
  backHref?: string;
}

export function ChatHeader({
  partnerName,
  partnerAvatar,
  isOnline = false,
  reservationId,
  backHref,
}: ChatHeaderProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState('');

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white relative">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        aria-label="뒤로 가기"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#1B6FF4] flex items-center justify-center text-white font-bold text-sm">
          {partnerAvatar}
        </div>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full" />
        )}
      </div>

      {/* Name and status */}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-gray-900 text-sm truncate">{partnerName}</h2>
        {isOnline && (
          <p className="text-xs text-[#10B981]">온라인</p>
        )}
      </div>

      {/* Reservation info button */}
      {reservationId && (
        <button
          onClick={() => router.push(`/reservations/${reservationId}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B6FF4] bg-blue-50 rounded-full hover:bg-blue-100 transition-colors flex-shrink-0"
        >
          <Calendar className="w-3.5 h-3.5" />
          예약 정보 보기
        </button>
      )}

      {/* Menu button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        aria-label="메뉴"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-4 top-14 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[160px]">
            <button
              onClick={() => {
                setShowMenu(false);
                setToast('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
                setTimeout(() => setToast(''), 2000);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <AlertTriangle className="w-4 h-4 text-gray-400" />
              신고하기
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                handleBack();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              채팅방 나가기
            </button>
          </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
